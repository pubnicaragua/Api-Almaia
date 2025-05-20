# Etapa 1: Build
FROM node:18-alpine AS build
WORKDIR /app

# Instala solo dependencias necesarias para build
COPY package*.json ./
RUN npm ci

# Copia el resto del código y construye
COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS production
WORKDIR /app

# Solo copia lo necesario para ejecutar
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
