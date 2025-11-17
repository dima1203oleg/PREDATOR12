# Kubernetes integration for GitHub Actions

This repository now ships a minimal Helm umbrella chart (`deploy/helm/umbrella`) to deploy the FastAPI backend and React frontend with readiness/liveness probes for self-healing. GitHub Actions validates the chart on every push/PR and can render it before triggering ArgoCD.

## CI coverage
- `.github/workflows/ci.yml` includes a `kubernetes` job that runs `helm lint` and `helm template` to catch syntax and rendering issues early.
- The deploy workflow reuses Helm linting before updating image tags and calling ArgoCD, preventing broken charts from reaching GitOps.
- The scheduled guard workflow `.github/workflows/ops-autoheal.yml` runs every 6 hours (and via `workflow_dispatch`) to lint, render, and kubeconform-validate manifests. When `ARGOCD_AUTOHEAL=true` and ArgoCD secrets are configured, it attempts an automated sync for hands-off recovery.

## Self-healing and redirection of failed tasks
- Pods expose readiness/liveness probes hitting `/health` on the backend and `/` on the frontend. Kubernetes restarts unhealthy pods automatically.
- Optional HorizontalPodAutoscaler (HPA) settings can be enabled in `values.yaml` to reschedule pods under load and replace unresponsive ones.
- ArgoCD `syncPolicy.automated.selfHeal` in `deploy/argocd/predator-app.yaml` keeps cluster state aligned with Git.

## How to deploy locally
1. Build/push images for frontend and backend to your registry.
2. Edit `deploy/helm/umbrella/values.yaml` to point to those images and configure ingress/replica/HPA parameters.
3. Install with `helm upgrade --install predator deploy/helm/umbrella -n predator --create-namespace`.
4. (Optional) Apply `deploy/argocd/predator-app.yaml` in an ArgoCD-managed cluster and let GitOps manage releases.

## Updating workflows
- Ensure `ARGOCD_SERVER`, `ARGOCD_AUTH_TOKEN`, and optional `ARGOCD_APP` secrets are configured to allow `.github/workflows/deploy.yml` to trigger syncs.
- To enable automatic syncs from the guard workflow, also set `ARGOCD_AUTOHEAL=true` and reuse the same ArgoCD secrets.
- Use GitHub Environments or OIDC to scope ArgoCD credentials; avoid committing tokens or kubeconfigs.
