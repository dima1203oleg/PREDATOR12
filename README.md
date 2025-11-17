# Predator Analytics Platform

This repository now bundles a minimal FastAPI backend alongside a React + TypeScript SPA ("React Nexus Core") that embeds the Predator Analytics experience: My Daily Feed, OpenWebUI chat, data sources, analytics, compliance, reports, and admin observability views.

## Backend (FastAPI)
- Health endpoints at `/` and `/health`.
- See `requirements.txt`, `Dockerfile`, and `deploy/docker-compose.yml` for containerized execution.

### Backend Local Development
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Backend Container Deployment
```bash
docker build -t predator12:latest .
docker run -p 8000:8000 predator12:latest
```

Or with Compose:
```bash
cd deploy
docker compose up --build
```

## Frontend (React Nexus Core)
SPA that wires role-aware navigation, i18n (UA/EN), light/dark themes, PWA manifest/service worker, and placeholder integrations for OpenWebUI, OpenSearch Dashboards, and Grafana.

### Frontend Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`. Use the mock login to switch roles (Client/Pro/Admin) and see conditional navigation.

### Frontend Build
```bash
npm run build
npm run preview
```

#### Troubleshooting frontend builds
- If TypeScript reports missing `vite` or plugin types, ensure dependencies are installed via `npm install`.

## Project Structure
```
├── app/                     # FastAPI application entry point
├── deploy/argocd/predator-app.yaml
├── deploy/docker-compose.yml
├── deploy/helm/umbrella/      # Minimal Helm chart for frontend/backend
├── docs/analysis/global_analysis.md
├── docs/readiness_assessment.md
├── public/                  # PWA assets (manifest, service worker)
├── src/                     # React Nexus Core SPA
├── Dockerfile
├── index.html
├── package.json / package-lock.json
├── requirements.txt
└── README.md
```

## Production readiness
This repository is not yet production-ready for local deployment. It ships a skeleton FastAPI service and placeholder React SPA without real integrations for auth, data stores, MAS agents, observability, or GitOps. A minimal Helm chart and ArgoCD `Application` scaffold are now included to validate Kubernetes/GitOps wiring but still require real images, secrets, and infrastructure. See `docs/readiness_assessment.md` for detailed gaps and steps to reach production parity.

## ArgoCD, Kubernetes, and DevOps status
- Minimal GitOps assets now exist: `deploy/helm/umbrella` Helm chart for frontend/backend and `deploy/argocd/predator-app.yaml` to register the release in ArgoCD.
- Self-healing probes and optional autoscaling are built into the chart to restart failed pods automatically.
- GitHub Actions workflows lint and render the chart to catch syntax issues before triggering ArgoCD. A scheduled guard (`.github/workflows/ops-autoheal.yml`) runs every 6 hours (or on demand) to lint, template, and kubeconform-validate the chart; when ArgoCD secrets are present and `ARGOCD_AUTOHEAL=true`, it will also attempt an automated sync.
For a concrete list of gaps and next actions to enable full ArgoCD-driven delivery (Apps, Helm charts, secrets, GitHub Actions enhancements, and validation steps), see `docs/ops/argocd_devops_status.md` and `docs/ops/kubernetes_actions.md`.

## GitHub Actions deploy workflow
The repository includes a GitOps-oriented workflow at `.github/workflows/deploy.yml` that can update Helm values (when `deploy/helm/umbrella/values.yaml` exists) and trigger an ArgoCD sync when the `ARGOCD_SERVER`, `ARGOCD_AUTH_TOKEN`, and optional `ARGOCD_APP` secrets are configured. Without these assets and secrets the workflow exits gracefully. The CI workflow also runs Helm lint/template checks to prevent broken Kubernetes manifests from merging.
