# Validation runs

Use these commands to mirror the CI guardrails locally after refreshing dependencies or adjusting GitHub Actions workflows:

```bash
npm install
npm run build
python -m compileall app
```

They confirm the React Nexus Core SPA builds successfully and that the FastAPI backend compiles without syntax errors.
