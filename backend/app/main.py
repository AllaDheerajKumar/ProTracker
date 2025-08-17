from fastapi import FastAPI
app = FastAPI(title="Prodactive API")

@app.get("/healthz")
def health():
    return {"ok": True}
