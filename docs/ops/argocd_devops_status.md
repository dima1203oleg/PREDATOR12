# ArgoCD and DevOps status check

This repository now contains starter GitOps assets and Kubernetes templates but still lacks production-grade delivery plumbing. The notes below summarize what exists and what remains to validate ArgoCD and DevOps readiness.

## Current state
- **ArgoCD assets**: A sample `Application` manifest lives in `deploy/argocd/predator-app.yaml` targeting the umbrella Helm chart.
- **Helm/K8s**: A minimal umbrella chart in `deploy/helm/umbrella` deploys the FastAPI backend and frontend with probes and optional HPA.
- **GitHub Actions**: CI builds/compiles and now lint/renders Helm charts. A deploy workflow can bump Helm values and trigger ArgoCD when secrets and charts are present, and a scheduled guard (`ops-autoheal`) validates Helm output and can optionally auto-sync via ArgoCD. Concurrency guards cancel overlapping runs so only the latest attempt proceeds. There are still no security scans, SBOM generation, or container signing.
- **Registry & images**: No image build/push steps or registry configuration (GHCR, Docker Hub) are defined.
- **Secrets/infra**: No Vault/ExternalSecrets templates or `kubeconfig`/cluster targets are defined for CD.

## Recommended next steps
1. **Harden ArgoCD apps**
   - Add `AppProject` definitions, destination restrictions, and per-environment `Application` manifests with clear namespaces.
   - Wire Argo Rollouts strategies and health checks aligned with SLOs.
2. **Complete CI/CD coverage**
   - Add a build workflow that builds, scans (Trivy), generates SBOM (Syft), signs (Cosign), and pushes images to GHCR.
   - Extend deploy to publish Helm values per environment and drive Argo Rollouts canaries.
   - Include linting for workflow YAML and (optionally) chart schema validation.
4. **Secrets and access**
   - Use GitHub OIDC with a secret manager (Vault) or GitHub Environments for ArgoCD tokens and registry credentials.
   - Provide ExternalSecrets manifests for runtime secrets (Keycloak, DB, MinIO, OpenSearch, Qdrant).
5. **Verification steps (once assets exist)**
   - Validate ArgoCD connectivity: `argocd version`, `argocd app list`.
   - Dry-run sync: `argocd app diff <app> --revision <sha>` and `argocd app sync <app> --dry-run`.
   - Observe rollout health: `argocd app wait <app>` and Argo Rollouts `kubectl argo rollouts get rollout <name>`.
   - Confirm GitHub Actions: manual `workflow_dispatch` for build/deploy, ensure required secrets are present, and review run logs for image tags and ArgoCD sync results.

## Outcome
Implementing the steps above will establish a repeatable GitOps flow, enable ArgoCD validation, and provide the DevOps coverage (build, security, signing, deploy) expected for production readiness.
