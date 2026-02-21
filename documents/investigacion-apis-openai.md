---
title: "Investigación: APIs de OpenAI"
status: "completed"
tags: ["investigación", "openai", "api"]
date: "2026-02-19"
description: "Análisis de las APIs disponibles de OpenAI para integración con agentes."
---

# Investigación: APIs de OpenAI

## Resumen Ejecutivo

OpenAI ofrece varias APIs clave para la construcción de agentes inteligentes. Esta investigación cubre los endpoints más relevantes para el stack de OpenClaw.

## APIs Principales

### 1. Chat Completions API

El endpoint más usado. Soporta modelos `gpt-4o`, `gpt-4-turbo`, y `gpt-3.5-turbo`.

```bash
POST https://api.openai.com/v1/chat/completions
```

**Parámetros clave:**
- `model` — Modelo a usar
- `messages` — Array de mensajes (system, user, assistant)
- `temperature` — Control de creatividad (0-2)
- `max_tokens` — Límite de tokens en respuesta

### 2. Assistants API

Permite crear agentes persistentes con memoria y herramientas.

**Características:**
- Hilos de conversación persistentes
- Ejecución de código (Code Interpreter)
- Búsqueda en archivos (File Search)
- Llamada a funciones personalizadas

### 3. Embeddings API

Para búsqueda semántica y memoria vectorial.

```python
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="texto a vectorizar"
)
```

## Costos Estimados (por 1M tokens)

| Modelo | Input | Output |
|--------|-------|--------|
| gpt-4o | $2.50 | $10.00 |
| gpt-4o-mini | $0.15 | $0.60 |
| gpt-3.5-turbo | $0.50 | $1.50 |

## Conclusión

Para el stack de OpenClaw se recomienda **gpt-4o-mini** para tareas rutinarias y **gpt-4o** para análisis complejos.
