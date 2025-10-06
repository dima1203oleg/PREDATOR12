# Predator12 Service

This repository now contains a minimal FastAPI service prepared for container-based deployment. It includes:

- Global deployment analysis and remediation plan.
- Production-ready application skeleton with health checks.
- Docker-based workflow for local development and deployment.

## Getting Started

### Prerequisites
- Python 3.11+
- Docker (optional but recommended for parity with deployment)

### Local Development
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API will be accessible at `http://localhost:8000` with a health check endpoint at `/health`.

### Container Deployment
```bash
docker build -t predator12:latest .
docker run -p 8000:8000 predator12:latest
```

Alternatively, use Docker Compose for a reproducible environment:
```bash
cd deploy
docker compose up --build
```

### Health Checks
- `GET /health`: Returns `{ "status": "ok" }` for readiness/liveness probes.
- `GET /`: Returns a message confirming the service is running.

## Project Structure
```
├── app
│   └── main.py            # FastAPI application entry point
├── deploy
│   └── docker-compose.yml # Local/remote orchestration example
├── docs
│   └── analysis
│       └── global_analysis.md
├── Dockerfile             # Container build definition
├── requirements.txt       # Python dependencies
└── README.md              # This documentation
```

## Next Steps
- Add unit/integration tests and wire them into CI.
- Extend the API with business logic as required.
- Configure infrastructure-specific deployment (Kubernetes, cloud services, etc.).
