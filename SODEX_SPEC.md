# SODEX (Predator Assistant) — Технічне завдання

## 0) Executive Summary
- **Що це:** окремий Custom GPT «SODEX» усередині ChatGPT із підключеними Actions (OpenAPI) та MCP-сервером, які викликають бекенд Predator (FastAPI/Kong) і сервісні шари (ETL/Celery/KEDA, OpenSearch, Qdrant, Neo4j, MinIO, MLflow).
- **Що вміє:**
  1. Приймати файли (Excel/CSV/PDF) → створювати dataset → запускати ETL → індексувати в PG/OpenSearch/Qdrant/Neo4j/Redis.
  2. Робити RAG-пошук: PG-фільтри + OpenSearch full-text + Qdrant semantic.
  3. Викликати MAS-пайплайни (Anomaly/Forecast/Corruption/LobbyMap/Report).
  4. Голос: приймати аудіо → STT; відповідати текстом + TTS-лінк.
  5. Моніторинг: етапи ETL/індексації з прогресом по кожній БД; SLO-гейти/алерти.
  6. Самонавчання: збирати фідбек, готувати LoRA-датасети, тригерити retrain.
- **Безпека:** Keycloak OIDC + JWT-forwarding, Vault secrets, RBAC/ABAC; PII-маскінг; аудит кожної дії.
- **SLA:** 99.99%, MTTR < 1 хв; p95 пошуку < 800 мс, lag CDC < 100.

## 1) Персони та ролі
- **Owner/Admin (Pro+SRE):** повний доступ, розкриття PII, технічні дії (канарії, reindex, DR-drill).
- **Analyst (Pro):** аналітика/звіти, RAG, часткове керування ETL, може розкривати PII з аудитом.
- **Client (Std):** завантаження власних даних, базовий пошук/інсайти; PII — замасковано.
- **Guest:** демо/огляд, без доступу до приватних даних.

## 2) Архітектура інтеграції (ChatGPT ↔ Predator)

Узагальнена схема дій:

ChatGPT (SODEX, Custom GPT)
→ Actions (OpenAPI): predator_api
→ Kong/API-GW → FastAPI (Auth via Keycloak JWT)
→ Celery/KEDA (ETL/Index)
→ PG/Timescale (canonical) ⇄ Debezium/Kafka (CDC)
→ OpenSearch (full-text/ILM) → Qdrant (vectors via Ollama embeds)
→ Neo4j (граф) → Redis (cache/queues)
→ MinIO (raw/uploads/reports) → MLflow (LoRA)
→ Observability (Prom/Graf/Loki/Tempo) → ArgoCD/Rollouts (ops)

Додатково:
- MCP-сервер «predator-mcp»: високочастотні/довгі таски (ETL-курсор, батч-статуси, консолідація прогресу), та безпечні операції з секретами через Vault proxy.
- Джерела (OSINT): Telegram (Telethon), сайти (Playwright/Scrapy) — керуються через /osint/* ендпоінти.

## 3) Дизайн відповідей у ChatGPT (UX)
- Кіберпанк форматування: моно-шрифт у блоках, короткі «панелі статусу», емодзі-пікто (🟢🟡🔴) для станів; короткі списки, код-блоки для JSON/команд.
- PII-маскінг за замовчуванням (навіть у чаті). Коли користувач (Pro) запитує «розкрити» → SODEX робить POST /pii/reveal і відмічає це в аудиторському логу.
- Голос: при наявності аудіо → POST /voice/stt; при потребі звукової відповіді → POST /voice/tts та дати лінк (MinIO signed URL).
- Прогрес ETL/індексації: компактна таблиця з відсотками по PG / OpenSearch / Qdrant / Neo4j, ETA, лаг CDC.

## 4) Actions (OpenAPI) — контракт для ChatGPT

Базовий відкритий інтерфейс «predator_api». (Назви/шляхи узгоджені з бекендом v13.)

```yaml
openapi: 3.0.3
info:
  title: Predator API for SODEX
  version: "1.0"
servers:
  - url: https://api.predator.local/v1
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
security:
  - bearerAuth: []

paths:
  /datasets/upload:
    post:
      summary: Upload file (Excel/CSV/PDF) to MinIO and register dataset
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                file: { type: string, format: binary }
                domain: { type: string, enum: [customs, taxes, osint] }
                source: { type: string, example: "excel" }
      responses:
        "200":
          description: Created
          content:
            application/json:
              schema:
                type: object
                properties:
                  dataset_id: { type: string }
                  job_id: { type: string }

  /etl/start:
    post:
      summary: Start ETL for dataset
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                dataset_id: { type: string }
      responses:
        "200":
          description: Started
          content:
            application/json:
              schema:
                type: object
                properties:
                  etl_job_id: { type: string }

  /etl/status/{job_id}:
    get:
      summary: ETL progress with per-DB gauges
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  stage: { type: string, enum: [upload, parsing, validation, postgres, opensearch, qdrant, neo4j, redis, done] }
                  percent_overall: { type: number }
                  gauges:
                    type: object
                    properties:
                      postgres: { type: number }
                      opensearch: { type: number }
                      qdrant: { type: number }
                      neo4j: { type: number }
                  cdc_lag: { type: integer }

  /index/reindex:
    post:
      summary: Reindex selection into OpenSearch/Qdrant/Neo4j
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                dataset_id: { type: string }
                target: { type: array, items: { type: string, enum: [opensearch,qdrant,neo4j] } }

  /search/query:
    post:
      summary: Hybrid search (PG filter + OpenSearch FT + Qdrant semantic)
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                text: { type: string }
                filters:
                  type: object
                  properties:
                    hs_code: { type: string }
                    year: { type: integer }
                    amount_min: { type: number }
        # returns hits + highlights + vectors meta
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  hits: { type: array, items: { type: object } }

  /reports/build:
    post:
      summary: Generate report and store to MinIO
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                template: { type: string, enum: [anomaly, forecast, corruption, lobby_map, newspaper] }
                params: { type: object }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  report_url: { type: string }

  /pii/reveal:
    post:
      summary: Audit-gated PII reveal
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                reason: { type: string }
      responses: { "204": { description: ok } }

  /voice/stt:
    post:
      summary: Whisper STT (uk-UA)
      requestBody:
        content:
          multipart/form-data:
            schema:
              type: object
              properties:
                audio: { type: string, format: binary }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  text: { type: string }

  /voice/tts:
    post:
      summary: TTS (ukrainian), returns MinIO signed URL
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                text: { type: string }
      responses:
        "200":
          content:
            application/json:
              schema:
                type: object
                properties:
                  audio_url: { type: string }
```

## 5) MCP-сервер «predator-mcp» (необхідно)

Навіщо: стабільно тягнути довгі/стрімові стани (ETL/CDC), робити безпечні «операторські» дії (канарії, реплеї) та агрегацію прогресу в один payload для ChatGPT.

MCP команди (приклад):
- `etl.get_status(job_id)` → {stage, percent, per_db_gauges, cdc_lag}.
- `etl.tail(job_id, from_offset)` → stream logs.
- `ops.rollout(app, percent)` → тригерити канарій через бекенд-bridge (ArgoCD webhook).
- `consistency.check(dataset_id)` → хеш-перевірки PG vs OS/Qdrant.
- `reindex.batch(dataset_id, target)` → батч із курсором.

Auth: service-to-service (JWT exchange), secrets через Vault injector.

## 6) Політика відповідей / Промпт інструкцій (для Custom GPT)
- Мова: українська за замовчуванням, англійська на запит.
- Стиль: короткі кроки, чіткі стани, таблички прогресу, код-блоки JSON лише для результатів/тіл запитів.
- PII: показувати замасковано; розкриття — лише після виклику /pii/reveal з «reason».
- Вибір інструменту:
  - Файли/ETL/індексація/звіти → predator_api (Actions).
  - Довгі стани/стрім/канарії/DR/консистентність → predator-mcp.
  - Пошук/аналітика → спершу search/query, далі — MAS шаблони через /reports/build.
- Обмеження: не виконувати фонові дії без відповіді; кожна довга дія — із зворотним повідомленням статусу зараз, а не «чекайте».

## 7) Ключові робочі флоу (E2E)

### 7.1 Завантаження Excel → ETL → Індексація (всі БД)
1. Користувач «кидає» файл в ChatGPT → SODEX викликає POST /datasets/upload (multipart).
2. Відповідь: {dataset_id, job_id}.
3. SODEX одразу запускає POST /etl/start із dataset_id (якщо бекенд не стартує сам при upload).
4. SODEX показує прогрес через GET /etl/status/{job_id} та/або mcp.etl.tail.
5. Після PG → CDC шле дані в OpenSearch/Qdrant/Neo4j: у прогрес-панелі окремі відсотки для PG/OS/Qdrant/Neo4j + cdc_lag.
6. Після done — короткий підсумок: рядків, дублі/скипи, помилки, індексовані в кожну БД.

### 7.2 OSINT (Telegram/веб) → фільтр шуму → індексація
1. Користувач: «Додай канал X до домену customs».
2. SODEX → /osint/sources/add (type, handle, domain).
3. Запуск парсингу /osint/ingest/start → прогрес як у ETL.
4. Збагачення → ContentRelevance > 0.7 → канонізація в PG → CDC → OS/Qdrant/Neo4j.

### 7.3 Аналітичний запит (RAG)
1. Користувач: «Аномалії імпорту холодильників 2023 на $20M + лобізм».
2. SODEX → /search/query (filters + text).
3. SODEX → /reports/build (template="anomaly" або corruption|lobby_map|forecast|newspaper", параметри).
4. Повертає report_url (MinIO signed). Додає quick-summary в чат.

### 7.4 Самонавчання (LoRA)
1. Збираємо лайк/діслайк (/feedback).
2. SODEX — cron запити до MCP: consistency.check, reindex.batch, lora.prepare_dataset (через API/MLflow), ops.rollout канарій після тренування.

## 8) Безпека / Аудит
- Auth: Keycloak OIDC; SODEX пересилає Bearer JWT у кожний Action/MCP call.
- PII: маскінг; /pii/reveal з reason + аудит (хто/коли/чому).
- RBAC/ABAC: ролі/атрибути (domain=customs|banking тощо).
- Вразливості: WAF, CSP, XSS-sanitize у відповідях, Zero-trust (non-root, read-only FS на бекенді), Cosign підписи образів.
- Логування: усі виклики SODEX → API позначати заголовком X-Sodex-Session (trace).

## 9) Спостережуваність (що показує SODEX у чаті)
- Основні SLI/SLO: p95 API latency, ETL queue depth, CDC lag, OS heap, Qdrant QPS/lat.
- Алерти (витяги): HighError/Latency, QueueGrowing, LagHigh, DriftHigh, CDCReplayDelay.
- Команди: mcp.ops.rollout, mcp.consistency.check, швидкі дії «replay last 5min».

## 10) Конфіг/Деплой (коротко)
- Custom GPT «SODEX»:
  - Додати Action із вищим OpenAPI (production URL).
  - Додати MCP endpoint (ws/http) predator-mcp.
  - Заповнити System Prompt (див. §6).
  - Secrets: через Keycloak/Vault; у ChatGPT сховищі — лише публічні базові ключі (за потреби), основні токени — через short-lived exchange з бекендом.
- Envs на бекенді: KEYCLOAK_*, KONG_*, MINIO_*, OPENSEARCH_*, QDRANT_*, NEO4J_*, REDIS_*, MLflow_* — вже в v13.
- GitOps: будь-яка зміна OpenAPI/MCP — через PR у predator-gitops; ArgoCD sync + Rollouts канарій.

## 11) Приклади викликів (які формуватиме SODEX)

**Upload Excel → dataset + job**

POST /v1/datasets/upload  (multipart)
file=@Березень_2024.xlsx
domain=customs
source=excel
→ { "dataset_id": "ds_123", "job_id": "etl_456" }

**Статус ETL з приладами БД**

GET /v1/etl/status/etl_456
→ {
  "stage":"opensearch",
  "percent_overall": 72.5,
  "gauges": {"postgres":100,"opensearch":45,"qdrant":20,"neo4j":10},
  "cdc_lag": 43
}

**Гібридний пошук**

POST /v1/search/query
{ "text":"лобізм генератори 2023", "filters":{"hs_code":"8502","year":2023,"amount_min":20000000} }
→ { "hits":[ ... ], "facets":{...} }

**PII-розкриття (Pro)**

POST /v1/pii/reveal
{ "reason":"audit on client request #INC-772" }
→ 204 No Content   # усі наступні відповіді — без маскінгу, подія в аудиті

## 12) Acceptance Criteria (продукшн)
- SODEX успішно проходить 5 базових сценаріїв: Upload→ETL→Index, OSINT-інжест, Hybrid Search, Report Build, PII-reveal+Audit.
- Прогрес-панель завжди містить 4 прилади (PG/OS/Qdrant/Neo4j) + CDC lag.
- PII-маскінг за замовчуванням; розкриття — тільки після /pii/reveal з логом.
- Голос (UA): STT та TTS повертають валідні результати (p95 < 2.5s TTS).
- SLO-гейти відображаються коректно; алерти коротко узагальнюються.
- Жодних локальних деплоїв; усі зміни через GitOps.
- Тести: e2e (5 сценаріїв), perf (1M рядків → відповіді в межах SLO).

## 13) Ризики та мітм
- Шум OSINT → фільтр ContentRelevance > 0.7 перед канонізацією.
- Дрейф моделей → щомісячний LoRA-канарій; автоматичні PSI/SHAP репорти в MLflow.
- Lag CDC → автоскейл KEDA + реплей батчів через MCP.
- Безпека токенів → короткоживучі JWT, Vault, мінімізація секретів у ChatGPT.

## 14) Шаблон відповіді SODEX для критичних дій (приклад)

```
🟢 Етап: OpenSearch | Загальний прогрес: 72.5%
PG: 100% | OS: 45% | Qdrant: 20% | Neo4j: 10% | CDC lag: 43
Наступний крок: дочекатися векторної індексації (Qdrant), потім побудувати звіт “anomaly”.
Команда: /reports/build template=anomaly params={dataset_id:"ds_123", year:2023, hs:"8502"}
```

## 15) Що треба зробити прямо зараз (чекліст)
1. Бекенд: переконатися, що ендпоінти з §4 доступні у проді, з OIDC; додати /osint/* якщо ще не.
2. MCP-сервер: підняти predator-mcp з командами з §5.
3. Custom GPT у ChatGPT:
   - Ім’я: SODEX — Predator Assistant.
   - System Prompt з §6.
   - Додати Action із OpenAPI (прод URL).
   - Підключити MCP endpoint.
4. Валідація Acceptance: прогнати 5 сценаріїв з §12.
5. Документація для команди: короткий runbook (PII-гейт, алерти, канарії, DR-drill).
