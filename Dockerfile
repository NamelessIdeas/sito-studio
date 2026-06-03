# syntax=docker/dockerfile:1

# --- Stage 1: build del sito statico --------------------------------------
FROM python:3.12-slim AS build

WORKDIR /app

# Installa le dipendenze (pinnate) sfruttando la cache dei layer.
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia il progetto e genera il sito. --strict fa fallire la build su
# link interni rotti o warning di navigazione.
COPY mkdocs.yml ./
COPY docs ./docs
RUN mkdocs build --strict

# --- Stage 2: immagine finale, solo nginx + sito statico ------------------
FROM nginx:alpine AS serve

# Il sito generato viene servito come contenuto statico.
COPY --from=build /app/site /usr/share/nginx/html

EXPOSE 80
