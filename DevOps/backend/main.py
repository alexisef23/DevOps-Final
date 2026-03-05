from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from typing import List, Optional
import os

app = FastAPI(title="Ciudadano Digital API - Sistema Centralizado")

# ─── CORS ───────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://frontend:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase ────────────────────────────────────────────────────────────────
URL: str = os.environ.get("SUPABASE_URL", "")
KEY: str = os.environ.get("SUPABASE_KEY", "")

if not URL or not KEY:
    print("ADVERTENCIA: SUPABASE_URL o SUPABASE_KEY no configuradas.")

supabase: Client = create_client(URL, KEY)

# ─── Modelos Pydantic ────────────────────────────────────────────────────────
class PagoRequest(BaseModel):
    servicio: str
    monto: float
    usuario_email: str

class CitaRequest(BaseModel):
    usuario_id: str       # UUID de auth.users
    tramite: str
    fecha: str            # ISO 8601  e.g. "2025-09-15T10:00:00"
    dependencia: Optional[str] = None

class DocumentoRequest(BaseModel):
    usuario_id: str
    nombre: str
    tipo: str             # "PDF" | "JPG"
    url: str

# ─── Endpoints ───────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Ciudadano Digital API funcionando ✓"}


# HU-2 / HU-8 ─ Servicios y Pagos
@app.get("/servicios")
def listar_servicios():
    """Lista los servicios disponibles para pago (HU-2)"""
    return {
        "gubernamentales": ["Agua", "Luz (CFE)", "Predial", "Tenencia"],
        "privados": ["Gas Natural", "Internet/Cable", "Telefonía Móvil"],
    }


@app.post("/pagar")
async def procesar_pago(pago: PagoRequest):
    """Registra un pago en historial_pagos (HU-2, HU-4, HU-8)"""
    try:
        data = {
            "servicio": pago.servicio,
            "monto": pago.monto,
            "usuario_email": pago.usuario_email,
        }
        response = supabase.table("historial_pagos").insert(data).execute()
        return {
            "status": "success",
            "message": "Pago registrado correctamente",
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al registrar pago: {str(e)}")


# HU-4 ─ Historial de Pagos
@app.get("/historial/{email}")
async def obtener_historial(email: str):
    """Consulta historial de pagos por email (HU-4)"""
    try:
        response = (
            supabase.table("historial_pagos")
            .select("*")
            .eq("usuario_email", email)
            .order("fecha_pago", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# HU-3 / HU-7 ─ Citas
@app.post("/citas/agendar")
async def agendar_cita(cita: CitaRequest):
    """Registra una nueva cita ciudadana (HU-3, HU-7)"""
    try:
        data = {
            "usuario_id": cita.usuario_id,
            "tramite": cita.tramite,
            "fecha": cita.fecha,
            "dependencia": cita.dependencia or "General",
            "estado": "Pendiente",
        }
        response = supabase.table("citas").insert(data).execute()
        return {"status": "success", "message": "Cita agendada", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error al agendar cita: {str(e)}")


@app.get("/citas/{usuario_id}")
async def listar_citas(usuario_id: str):
    """Lista las citas de un usuario (HU-3)"""
    try:
        response = (
            supabase.table("citas")
            .select("*")
            .eq("usuario_id", usuario_id)
            .order("fecha", desc=False)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# HU-5 ─ Noticias
@app.get("/noticias")
async def obtener_noticias():
    """Obtiene las últimas noticias comunitarias (HU-5)"""
    try:
        response = (
            supabase.table("noticias")
            .select("*")
            .order("fecha_publicacion", desc=True)
            .limit(6)
            .execute()
        )
        if not response.data:
            return [
                {
                    "titulo": "Bienvenido a Ciudadano Digital",
                    "contenido": "No hay avisos recientes en tu comunidad.",
                    "fecha_publicacion": None,
                }
            ]
        return response.data
    except Exception as e:
        return [
            {
                "titulo": "Aviso del sistema",
                "contenido": "Error al cargar noticias en tiempo real.",
                "fecha_publicacion": None,
            }
        ]


# HU-6 ─ Bóveda de Documentos
@app.post("/documentos/registrar")
async def registrar_documento(doc: DocumentoRequest):
    """Guarda la referencia de un documento subido al Storage (HU-6)"""
    try:
        data = {
            "usuario_id": doc.usuario_id,
            "nombre": doc.nombre,
            "tipo": doc.tipo,
            "url": doc.url,
        }
        response = supabase.table("documentos").insert(data).execute()
        return {
            "status": "success",
            "message": "Documento registrado",
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Error al registrar documento: {str(e)}"
        )


@app.get("/documentos/{usuario_id}")
async def listar_documentos(usuario_id: str):
    """Lista los documentos de un usuario (HU-6)"""
    try:
        response = (
            supabase.table("documentos")
            .select("*")
            .eq("usuario_id", usuario_id)
            .order("created_at", desc=True)
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
