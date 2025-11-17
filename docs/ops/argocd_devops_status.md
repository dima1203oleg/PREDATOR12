# ArgoCD and DevOps status check

This repository currently lacks the GitOps and Kubernetes assets required for an ArgoCD-driven deployment. The notes below summarize the gaps and the steps needed to validate ArgoCD and DevOps readiness.

## Current state
- **ArgoCD assets**: No ArgoCD `Application`/`AppProject` manifests or Helm chart references are present in the repo.
- **Helm/K8s**: No Kubernetes manifests or Helm charts exist for the FastAPI backend or React SPA.
- **GitHub Actions**: Only a basic CI build/compile workflow (`.github/workflows/ci.yml`) exists; there are no GitOps deploy pipelines, security scans, SBOM generation, or container signing.
- **Registry & images**: No image build/push steps or registry configuration (GHCR, Docker Hub) are defined.
- **Secrets/infra**: No Vault/ExternalSecrets templates or `kubeconfig`/cluster targets are defined for CD.

## Recommended next steps
1. **Add ArgoCD apps**
   - Create `infra/argocd/` with `AppProject` and `Application` manifests pointing to the Helm charts for the backend and frontend (or an umbrella chart).
   - Include sync policies (automated, self-heal), source repo/paths, and destination namespaces.
2. **Provide Helm charts/K8s manifests**
   - Add charts for FastAPI, SPA (as static assets served by a gateway), and shared ingress/TLS.
   - Configure image repository/tag values to be driven by CI (e.g., `values.image.tag`).
3. **Extend CI/CD workflows**
   - Add a build workflow that builds, scans (Trivy), generates SBOM (Syft), signs (Cosign), and pushes images to GHCR.
   - Add a deploy workflow that updates Helm values in the GitOps repo, commits, and triggers ArgoCD sync/rollouts.
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
