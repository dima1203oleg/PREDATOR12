# Piter Face Remote Controller

Цей репозиторій містить модель логіки та адаптивний вебпульт **Piter Face**.
Він дозволяє вмикати й вимикати пристрій, перемикати канали та керувати
гучністю з урахуванням усіх обмежень і можливих помилок.

## Структура

- `piterface/settings.py` – описує доступні налаштування та їхню валідацію.
- `piterface/remote.py` – головна логіка пульта, яка працює з налаштуваннями.
- `piterface/web.py` – HTTP API та вебзастосунок.
- `piterface/templates`, `piterface/static` – доступний адаптивний інтерфейс.
- `tests/test_remote.py` – автоматизовані модульні тести для перевірки
  функціональності та граничних випадків.

## Локальний запуск

```bash
python -m pip install -e '.[dev]'
python -m piterface.web
```

Відкрийте <http://127.0.0.1:8000>. Для production-використання задайте
довгий випадковий `PITERFACE_SECRET_KEY`, увімкніть secure-cookie за HTTPS і
запустіть застосунок через Gunicorn:

```bash
python -m pip install -e '.[prod]'
PITERFACE_SECRET_KEY='replace-with-a-random-secret' \
PITERFACE_ENV=production \
PITERFACE_COOKIE_SECURE=1 \
gunicorn --bind 0.0.0.0:8000 'piterface.web:create_app()'
```

## Як перевірити

```bash
python -m pytest
```

Тести покривають доменну логіку, HTTP API, користувацький сценарій,
валідацію помилок і security-заголовки.
