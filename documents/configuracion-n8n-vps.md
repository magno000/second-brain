---
title: 'Tarea: Configurar N8N en VPS con Docker'
status: pending
tags:
  - n8n
  - docker
  - vps
  - devops
date: '2026-02-20'
description: Configuración completa de N8N en servidor VPS usando Docker Compose.
---

# Tarea: Configurar N8N en VPS con Docker

## Estado: En Progreso 🔵

Esta tarea cubre la configuración completa del entorno N8N en el VPS de Contabo usando Docker y Docker Compose.

## Progreso Actual

- [x] Acceso SSH al VPS configurado
- [x] Docker y Docker Compose instalados
- [x] Dominio apuntando al servidor
- [ ] Configurar SSL con Certbot/Nginx
- [ ] Configurar variables de entorno de N8N
- [ ] Primer deploy de N8N exitoso
- [ ] Configurar backup automático

## Configuración Docker Compose

```yaml
version: '3.8'
services:
  n8n:
    image: docker.n8n.io/n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://${DOMAIN}/
      - GENERIC_TIMEZONE=Europe/Madrid
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

## Notas

El servidor tiene 4GB RAM y 2 vCPU. N8N debería funcionar perfectamente con esta configuración.

## Próximos pasos

Configurar Nginx como reverse proxy y obtener certificado SSL.
