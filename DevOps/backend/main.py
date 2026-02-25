from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from supabase import create_client, Client
from typing import List, Optional
import os

app = FastAPI(title="Ciudadano Digital API - Sistema Centralizado")

# Configuración de Supabase
# Asegúrate de que estas variables estén en tu .env o docker-compose.yml
URL: str = os.environ.get("SUPABASE_URL", "")
KEY: str = os.environ.get("SUPABASE_KEY", "")

if not URL or not KEY:
    print("ADVERTENCIA: SUPABASE_URL o SUPABASE_KEY no configuradas.")

supabase: Client = create_client(URL, KEY)

# --- Modelos de Datos (Pydantic) ---
class PagoRequest(BaseModel):
    servicio: str
    monto: float
    usuario_email: str  

class CitaRequest(BaseModel):
    usuario_id: str     # UUID de auth.users
    tramite: str
    fecha: str          # Formato ISO 8601

# --- Endpoints de Servicios ---

@app.get("/servicios")
def listar_servicios():
    """Lista los servicios disponibles para pago (HU-2)"""
    return {
        "gubernamentales": ["Agua", "Luz (CFE)", "Predial", "Tenencia"],
        "privados": ["Gas Natural", "Internet/Cable", "Telefonía Móvil"]
    }

@app.post("/pagar")
async def procesar_pago(pago: PagoRequest):
    """Registra un pago en la base de datos (HU-2, HU-4)"""
    try:
        data = {
            "servicio": pago.servicio,
            "monto": pago.monto,
            "usuario_email": pago.usuario_email,
            "fecha_pago": "now()" # Opcional, la DB tiene default now()
        }
        response = supabase.table('historial_pagos').insert(data).execute()
        return {"status": "success", "message": "Pago registrado correctamente", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar pago: {str(e)}")

@app.post("/citas/agendar")
async def agendar_cita(cita: CitaRequest):
    """Registra una nueva cita ciudadana (HU-3, HU-7)"""
    try:
        data = {
            "usuario_id": cita.usuario_id,
            "tramite": cita.tramite,
            "fecha": cita.fecha,
            "estado": "Pendiente"
        }
        response = supabase.table('citas').insert(data).execute()
        return {"status": "success", "message": "Cita agendada", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al agendar cita: {str(e)}")

@app.get("/noticias")
async def obtener_noticias():
    """Obtiene las noticias desde la base de datos (HU-5)"""
    try:
        response = supabase.table('noticias').select("*").order('fecha_publicacion', desc=True).limit(5).execute()
        if not response.data:
            return [{"titulo": "Sin noticias", "contenido": "No hay avisos recientes en tu comunidad."}]
        return response.data
    except Exception as e:
        # Fallback en caso de error de conexión
        return [{"titulo": "Aviso", "contenido": "Error al cargar noticias en tiempo real."}]

@app.get("/historial/{email}")
async def obtener_historial(email: str):
    """Consulta el historial de pagos de un ciudadano (HU-4)"""
    try:
        response = supabase.table('historial_pagos').select("*").eq('usuario_email', email).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)