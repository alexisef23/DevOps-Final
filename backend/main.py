from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
import os

app = FastAPI(title="Servicios Gubernamentales API")

# Configuración de Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# Modelos de Datos
class PagoRequest(BaseModel):
    servicio: str
    monto: float
    usuario_id: str

@app.get("/servicios")
def listar_servicios():
    # Lógica extraída del notebook: Centralización de Servicios
    return {
        "gubernamentales": ["Agua", "CFE (Luz)", "Predial", "Tenencia"],
        "privados": ["Gas", "Cable", "Telefonía"]
    }

@app.post("/pagar")
async def procesar_pago(pago: PagoRequest):
    # Lógica de registro de historial detectada en el notebook
    try:
        response = supabase.table('historial_pagos').insert({
            "servicio": pago.servicio,
            "monto": pago.monto,
            "usuario_id": pago.usuario_id
        }).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/noticias")
def obtener_noticias():
    # Lógica de 'mostrar_noticias' del notebook
    return [
        "Inauguración de nuevo parque comunitario",
        "Talleres gratuitos en biblioteca local",
        "Nuevas rutas de transporte público"
    ]