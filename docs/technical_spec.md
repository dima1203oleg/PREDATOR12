# Predator Analytics v13 — Copilot-Friendly TechSpec

## Purpose
Autonomous MAS analytics platform for customs/tax/OSINT data. GitOps-only. Full automation. Umbrella Helm charts. 58 LLM, Ollama-first.

## 1. Core Stack Overview

### Infrastructure / DevOps
- Kubernetes: k3s (dev), RKE2 (prod)
- CI/CD: Tekton + GitHub Actions
- GitOps: ArgoCD + Argo Rollouts
- IaC: Terraform (Proxmox/libvirt)
- Backup: Velero + Restic
- Chaos: LitmusChaos
- Container: Docker, Docker Compose

### Security
- Zero Trust
- Keycloak (OIDC, RBAC, ABAC, MFA)
- Vault + ExternalSecrets
- Istio (mTLS)
- Kyverno/OPA
- Trivy, Falco, Cosign signing
- NGINX/WAF (Wallarm)

### Backend
- FastAPI
- Kafka/Redpanda
- Celery + Redis
- CDC: Debezium
- Observability: Prometheus, Grafana, Loki, Tempo
- AutoHeal + SelfImprovement agents

### Data
- PostgreSQL + TimescaleDB
- OpenSearch
- Qdrant
- Redis
- MinIO

### AI / LLM
- Ollama (Gemma/Mistral/LLaMA/OpenHermes/etc.)
- 58 models via router + arbiter
- Embeddings: nomic-embed-text, mxbai, bge-m3
- LoRA/PEFT fine-tuning
- MLflow

### MAS (Multi-Agent System)
- 30+ agents: Retriever, Miner, Forecast, CorruptionDetector, LobbyMap, QueryPlanner, Arbiter, AutoHeal, SelfImprovement, etc.
- Orchestration: LangGraph / CrewAI

### ETL / Parsing
- pandas, pdfplumber, Telethon, Playwright, Scrapy

### Frontend
- React Nexus Core
- OpenWebUI
- OpenSearch Dashboards

## 2. System Flow (E2E)
[UI/Voice] → [FastAPI/Kong] → [Keycloak Auth]
→ [Ingest/ETL: pandas/pdfplumber/Telethon/Playwright]
→ [PG/Timescale] → [CDC Debezium]
→ [Qdrant + Embeddings via Ollama]
→ [OpenSearch FT Search]
→ [MAS Agents] → [Model Arbiter / 58 models]
→ [Result: Insights/Graphs/Newspaper]
→ [Self-Learning: Feedback → LoRA → Canary → Promote]

## 3. GitHub Actions Integration Goals

### Required Workflows
1. **build.yml**
   - Build Docker images
   - Run tests
   - Run Trivy scan
   - Generate SBOM via Syft
   - Cosign-sign artifacts
   - Push to GHCR
2. **deploy.yml**
   - Commit Helm values → GitOps repo
   - Trigger ArgoCD sync
   - Canary rollout via Argo Rollouts CRD
   - Validate metrics (latency < SLO threshold)
3. **etl-test.yml**
   - Run ETL tests with pandas/pdfplumber
   - Spin up ephemeral PG/OS/Qdrant via docker-compose
   - Validate CDC → Qdrant sync
4. **llm-test.yml**
   - Run embedding tests (Ollama)
   - Run arbiter-comparison tests
   - Run LoRA training dry-run
5. **chaos-check.yml**
   - Trigger LitmusChaos experiment via Kubernetes CRD
   - Ensure AutoHeal restores cluster

## 4. Copilot-Friendly Module Map
```
/infra
  /terraform
  /helm
    /umbrella
    /fastapi
    /qdrant
    /opensearch
    /ollama
    /agents
  /argocd

/backend
  /api
  /cdc
  /etl
  /agents
  /llm_router
  /arbiter
  /self_heal

/ml
  /embeddings
  /lora
  /mlflow

/frontend
  /nexus
  /openwebui

/observability
  /prometheus
  /grafana
  /loki
  /tempo

/.github/workflows
  build.yml
  deploy.yml
  etl-test.yml
  llm-test.yml
  chaos-check.yml
```

## 5. Minimal GitHub Action Templates (Seeds)

### build.yml
```yaml
name: Build & Scan

on:
  push:
    branches: [ "main" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Build image
      run: docker build -t ghcr.io/${{ github.repository }}:${{ github.sha }} .

    - name: Run tests
      run: pytest -q

    - name: Scan image (Trivy)
      uses: aquasecurity/trivy-action@v0.12.0
      with:
        image-ref: ghcr.io/${{ github.repository }}:${{ github.sha }}

    - name: Generate SBOM
      uses: anchore/syft-action@v0.7.0

    - name: Sign image
      run: cosign sign --key env://COSIGN_KEY ghcr.io/${{ github.repository }}:${{ github.sha }}

    - name: Push image
      run: docker push ghcr.io/${{ github.repository }}:${{ github.sha }}
```

### deploy.yml
```yaml
name: GitOps Deploy

on:
  workflow_run:
    workflows: ["Build & Scan"]
    types: [ "completed" ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Update Helm values
      run: |
        yq eval ".image.tag = \"${{ github.sha }}\"" -i helm/umbrella/values.yaml

    - name: Commit & push
      run: |
        git config user.name "bot"
        git config user.email "bot@github"
        git add .
        git commit -m "deploy: ${{ github.sha }}"
        git push

    - name: Trigger ArgoCD sync
      run: argocd app sync predator --grpc-web
```

## 6. What Copilot Should Infer
- Generate Helm charts and Kubernetes YAML (Deploy/Service/Ingress/RBAC).
- Scaffold ETL code based on the module map.
- Model MAS agents as Python classes.
- Produce LoRA training pipelines.
- Build CI/CD and GitOps workflows.
- Update model router/arbiter logic.
- Understand E2E dataflow for RAG/CDC/ETL.
