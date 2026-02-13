# Etapa 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar solo archivos de dependencias
COPY package*.json ./

# Instalación limpia
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Variables para Supabase
ARG REACT_APP_SUPABASE_URL
ARG REACT_APP_SUPABASE_ANON_KEY
ENV REACT_APP_SUPABASE_URL=$REACT_APP_SUPABASE_URL
ENV REACT_APP_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_ANON_KEY

# Generar el build de producción
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]