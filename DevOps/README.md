# Ciudadano Digital — Guía de Configuración

## Requisitos
- Docker + Docker Compose
- Cuenta en [Supabase](https://supabase.com)

---

## 1. Variables de Entorno

Crea el archivo `.env` en la raíz del proyecto (`DevOps/.env`):

```env
# Clave de servicio (para el backend — permisos totales)
SUPABASE_URL=https://TU_PROYECTO.supabase.co
SUPABASE_KEY=tu_service_role_key

# Clave anon pública (para el frontend — permisos de RLS)
SUPABASE_ANON_KEY=tu_anon_key
```

> Encuentra estas claves en: **Supabase → Settings → API**

---

## 2. Esquema SQL (ejecutar en Supabase SQL Editor)

```sql
-- Historial de Pagos
CREATE TABLE public.historial_pagos (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_email text NOT NULL,
  servicio      text NOT NULL,
  monto         numeric(10,2) NOT NULL,
  fecha_pago    timestamptz DEFAULT now()
);

-- Citas
CREATE TABLE public.citas (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tramite     text NOT NULL,
  dependencia text DEFAULT 'General',
  fecha       timestamptz NOT NULL,
  estado      text DEFAULT 'Pendiente',
  created_at  timestamptz DEFAULT now()
);

-- Documentos
CREATE TABLE public.documentos (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      text NOT NULL,
  tipo        text NOT NULL,  -- 'PDF' | 'JPG' | 'PNG'
  url         text NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- Noticias
CREATE TABLE public.noticias (
  id                 uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo             text NOT NULL,
  contenido          text,
  fecha_publicacion  timestamptz DEFAULT now()
);
```

---

## 3. Supabase Storage — Bucket "expedientes"

### 3.1 Crear el bucket

1. Ve a **Supabase → Storage → New Bucket**
2. Nombre: `expedientes`
3. Marca **Public bucket** ✅ (para que los archivos tengan URL pública)
4. Haz clic en **Save**

### 3.2 Políticas RLS del bucket

En **Storage → Policies → expedientes**, crea estas reglas:

**INSERT (subir archivos)** — solo usuarios autenticados:
```sql
CREATE POLICY "Usuarios autenticados pueden subir"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'expedientes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**SELECT (leer/descargar)** — solo el dueño:
```sql
CREATE POLICY "Usuarios ven sus propios archivos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'expedientes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**DELETE (borrar)** — solo el dueño:
```sql
CREATE POLICY "Usuarios borran sus propios archivos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'expedientes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 3.3 RLS en tablas (recomendado)

```sql
ALTER TABLE public.historial_pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;

-- Noticias: lectura pública
CREATE POLICY "Noticias públicas" ON public.noticias FOR SELECT USING (true);

-- Citas y documentos: solo el propietario
CREATE POLICY "Citas propias" ON public.citas FOR ALL USING (auth.uid() = usuario_id);
CREATE POLICY "Documentos propios" ON public.documentos FOR ALL USING (auth.uid() = usuario_id);
```

---

## 4. Levantar con Docker

```bash
cd DevOps
docker compose up --build
```

| Servicio  | URL                      |
|-----------|--------------------------|
| Frontend  | http://localhost:3000    |
| Backend   | http://localhost:8000    |
| API Docs  | http://localhost:8000/docs |

---

## 5. Estructura de Archivos Entregados

```
DevOps/
├── .env                          ← tú lo creas
├── docker-compose.yml            ← ✅ actualizado
├── backend/
│   ├── Dockerfile                (sin cambios)
│   ├── requirements.txt          ← ✅ actualizado
│   └── main.py                   ← ✅ CORS + todos los endpoints
└── frontend/
    ├── Dockerfile                ← ✅ inyección de env vars
    ├── package.json              ← ✅ corregido (JSON válido + react-scripts)
    └── src/
        ├── App.js                ← ✅ todos los módulos implementados
        └── lib/
            └── supabase.js       (sin cambios)
```

---

## 6. Historias de Usuario cubiertas

| HU | Descripción | Implementación |
|----|-------------|----------------|
| HU-1 | Login con Supabase Auth | Componente `<Login>` con `signInWithPassword` |
| HU-2 | Pago de servicios | Componente `<Pagos>` → `POST /pagar` |
| HU-3 | Agendar citas | Componente `<Citas>` → `POST /citas/agendar` |
| HU-4 | Historial de pagos | Componente `<Historial>` → `GET /historial/{email}` |
| HU-5 | Noticias comunitarias | Dashboard → `GET /noticias` |
| HU-6 | Bóveda de documentos | Componente `<Boveda>` → Supabase Storage + `POST /documentos/registrar` |
| HU-7 | Selección de dependencia en citas | Selector en `<Citas>` |
| HU-8 | Múltiples servicios de pago | 6 servicios en `<Pagos>` |
