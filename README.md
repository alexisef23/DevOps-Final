# Ciudadano Digital - Plataforma Gubernamental Centralizada

**Ciudadano Digital** es una solución integral diseñada para centralizar trámites ciudadanos, pagos de servicios y gestión de documentos en una interfaz moderna y eficiente. Este proyecto utiliza una arquitectura de microservicios contenerizados para garantizar escalabilidad y facilidad de despliegue.

---

## Tecnologías Usadas

* **Frontend:** React con Tailwind CSS.
* **Backend:** FastAPI (Python 3.11).
* **Base de Datos:** Supabase (PostgreSQL + Auth).
* **Contenerización:** Docker y Docker Compose.

---

## Requisitos Previos

Hay qeu tener instalado:
 [Docker Desktop]

---

## Configuración del Entorno

Para que el sistema funcione bien es necesario configurar las variables de acceso a la base de datos Crea un archivo `.env` en la raíz del proyecto con la siguiente estructura:

# Configuración del Backend
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_servicio_supabase

# Configuración del Frontend
REACT_APP_SUPABASE_URL=tu_url_de_supabase
REACT_APP_SUPABASE_ANON_KEY=tu_clave_anonima_supabase
(la url y api esta en tus notas claves.txt)

---

## Ejecución del Proyecto
docker-compose up --build

---

## Estructura del Proyecto
DevOps-Final/
├── .env                          # Variables de entorno críticas (Supabase URL/Keys)
├── .gitignore                    # Archivos y carpetas excluidos del control de versiones
├── docker-compose.yml            # Orquestación de contenedores (Frontend, Backend, Redes)
├── README.md                     # Documentación técnica y guía de despliegue
│
├── 📂 backend/                   # Microservicio de Lógica de Negocio (FastAPI)
│   ├── Dockerfile                # Configuración de la imagen Python 3.11-slim
│   ├── main.py                   # Endpoints de la API, CORS y cliente Supabase
│   ├── requirements.txt          # Dependencias de Python (FastAPI, Supabase, Uvicorn)
│   └── 📂 .pytest_cache/         # (Opcional) Caché de pruebas unitarias
│
└── 📂 frontend/                  # Microservicio de Interfaz de Usuario (React)
    ├── Dockerfile                # Construcción multi-etapa (Node.js + Nginx)
    ├── package.json              # Definición de scripts y dependencias (React, Lucide, Framer)
    ├── package-lock.json         # Registro exacto de versiones de dependencias
    │
    ├── 📂 public/                # Archivos estáticos accesibles directamente
    │   └── index.html            # Plantilla HTML base con inyección de Tailwind CDN
    │
    └── 📂 src/                   # Código fuente de la aplicación React
        ├── App.js                # Componente principal con lógica de módulos y navegación
        ├── index.js              # Punto de entrada de JavaScript para el renderizado
        │
        └── 📂 lib/               # Librerías y configuraciones compartidas
            └── supabase.js       # Inicialización del cliente de Supabase

## Avance del Proyecto
-- HU-1 Dashboard: Resumen rápido de estados del ciudadano.

-- HU-2 Finanzas: Módulo de pagos para servicios de Agua, Luz y Predial.

-- HU-6 Bóveda Digital: Visualización de documentos oficiales.

-- HU-5 Noticias: Feed informativo de la comunidad.

```env