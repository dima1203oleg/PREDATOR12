# Production readiness assessment (local deployment)

## Answer
The repository is **not production-ready** for local deployment yet. It only contains a skeleton FastAPI backend and a placeholder React Nexus Core SPA without real integrations for Keycloak, MAS agents, ETL, OpenSearch, Qdrant, or observability. Critical security and CI/CD pieces are also absent.

## Gaps to address before production-like use
- **Identity and access**: Keycloak/OIDC wiring is missing in both backend and frontend; there is no RBAC/ABAC enforcement or secure token handling.
- **APIs and data plane**: Backend exposes only health/root endpoints; no ETL, MAS, chat, analytics, or feedback APIs exist. Frontend calls are placeholders with no real data contracts.
- **Secrets and config**: No Vault/ExternalSecrets integration; sensitive values would be hard-coded or missing. Environment variable validation is absent.
- **Data stores and pipelines**: Compose and Helm references are stubs; PostgreSQL/Timescale, OpenSearch, Qdrant, Redis, and MinIO services are not provisioned or wired to the app.
- **Observability and security**: Prometheus/Grafana/Loki/Tempo, mTLS via Istio, Kyverno/OPA policies, image signing, and vulnerability scanning are not configured.
- **Testing and QA**: There are no unit/e2e tests beyond placeholder npm test. ETL/LLM/chaos workflows defined in the spec are not implemented as GitHub Actions.
- **Deployment automation**: GitOps/ArgoCD pipelines and Helm charts referenced in the TechSpec are not present in this repo. Docker images are not versioned or published.

## Minimal steps to reach local production parity
1. Implement Keycloak-backed auth (backend OIDC middleware + frontend OAuth/OIDC client) and enforce role-based access on all routes.
2. Build real API surfaces for chat, ETL status, analytics, compliance, reports, and feedback; connect them to data stores (PostgreSQL/Timescale, OpenSearch, Qdrant, MinIO).
3. Add infrastructure manifests (Compose for local, Helm for clusters) that provision dependencies and wire services with secure defaults.
4. Introduce secrets management (Vault/ExternalSecrets) and environment validation; remove placeholder values from code.
5. Enable observability (metrics/logs/traces) and security controls (mTLS, admission policies, vulnerability scans, SBOM, signing).
6. Implement CI/CD and GitOps workflows (build, scan, deploy, ETL tests, LLM tests, chaos checks) matching the v13 TechSpec.
7. Expand automated tests (unit, integration, e2e) for backend and frontend; add contract tests for APIs and WebSocket flows.

## Current local smoke test
- Backend: `uvicorn app.main:app --reload` then hit `/health`.
- Frontend: `npm install && npm run dev` (renders placeholder UI; no real data).
- Containers: `docker compose up --build` (backend only; no dependencies provisioned).
