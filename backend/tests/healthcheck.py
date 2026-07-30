from fastapi import FastAPI, status

app = FastAPI()

@app.get("/health", status_code=status.HTTP_200_OK)
def perform_healthcheck():
    return {"status": "healthy"}