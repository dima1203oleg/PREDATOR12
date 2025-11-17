from fastapi import FastAPI

app = FastAPI(title="Predator12 Service", version="0.1.0")


@app.get("/health", tags=["system"])
async def health_check() -> dict[str, str]:
    """Simple health endpoint for deploy readiness probes."""
    return {"status": "ok"}


@app.get("/")
async def root() -> dict[str, str]:
    """Default landing endpoint for smoke tests."""
    return {"message": "Predator12 backend is running"}
