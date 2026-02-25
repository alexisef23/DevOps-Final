from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os

app = FastAPI(title="Ciudadano Digital API")

# Configuracion de middelware para Docker
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

@app.get("/servicios")
def listar_servicios():
    return {
        "gubernamentales": ["Agua", "Luz", "Predial", "Tenencia"],
        "privados": ["Gas", "Internet", "Seguro Auto"]
    }
