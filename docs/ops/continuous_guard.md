# Continuous Guard workflow

The `continuous-guard.yml` workflow provides hands-free, recurring validation and optional remediation:

- **Schedule:** runs every 30 minutes (and on manual dispatch) to keep parity with CI between pushes.
- **Checks:**
  - `npm ci` + `npm run build` for the React Nexus Core SPA
  - `python -m compileall app` after installing backend deps
  - `helm lint` + `helm template` for `deploy/helm/umbrella`
  - `kubeconform` validation of the rendered manifest bundle
- **Auto-heal:** if `ARGOCD_SERVER`, `ARGOCD_AUTH_TOKEN`, `ARGOCD_APP`, and `ARGOCD_AUTOHEAL=true` are provided as secrets, ArgoCD sync is triggered after successful checks to converge Kubernetes state automatically.
- **Missing secrets reporting:** when ArgoCD secrets are absent, the workflow completes the verification steps and emits guidance instead of failing.

Use this workflow to keep Kubernetes manifests, frontend, and backend syntax continuously validated and—when authorized—self-remediated without manual intervention.
