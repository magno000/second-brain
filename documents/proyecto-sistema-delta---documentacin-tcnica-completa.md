---
title: Proyecto Sistema Delta - Documentación Técnica Completa
description: >-
  Sistema de Conciencia Situacional (Situation Awareness System) con
  arquitectura cloud-native, microservicios y filosofía DevOps.
category: proyectos
tags:
  - delta
  - situational-awareness
  - microservices
  - fastapi
  - docker
  - devops
  - github-actions
status: in-progress
date: '2026-02-23'
---
# 🎯 Sistema Delta - Documentación Técnica

## 📋 Resumen
El **Sistema Delta** es un prototipo de **Sistema de Conciencia Situacional (Situational Awareness System)** diseñado para la gestión de campo de batalla en tiempo real. Integra datos de drones, sensores e inteligencia estratégica.

**Repositorio:** https://github.com/magno000/Sistema-Delta

---

## 🏗️ Arquitectura General

El sistema sigue un patrón de microservicios cloud-native:

```
┌─────────────────────────────┐
│         CLIENTES            │
│ (Web UI, Mobile, APIs Ext)  │
└──────────────┬──────────────┘
               │
┌──────────────▼──────────────┐
│      API GATEWAY / LB       │
└──────────────┬──────────────┘
               │
     ┌─────────┴─────────┐
┌────▼─────┐       ┌─────▼──────┐
│ BACKEND  │       │ INGESTIÓN  │
│ (FastAPI)│       │ (Simulator)│
└────┬─────┘       └─────┬──────┘
     │                   │
┌────▼───────────────────▼──────┐
│       MESSAGE BROKER          │
│      (Kafka / RabbitMQ)       │
└──────────────┬────────────────┘
               │
     ┌─────────┴─────────┐
┌────▼─────┐       ┌─────▼──────┐
│ PERSIST. │       │   ML/AI    │
│ (PostGIS)│       │ (YOLO/INF) │
└──────────┘       └────────────┘
```

---

## 🛠️ Componentes Actuales

### 1. Backend API (`backend-api/`)
- **Tecnología:** Python FastAPI.
- **Función:** Core del sistema, gestión de eventos tácticos, drones y misiones.
- **Documentación:** Swagger UI integrada en `/docs`.

### 2. Ingestion Service (`ingestion-service/`)
- **Tecnología:** Python (Httpx + Asyncio).
- **Función:** Simula el envío de datos desde drones y sensores remotos.

### 3. CI/CD Pipeline (`.github/workflows/`)
- **Tecnología:** GitHub Actions.
- **Funciones:**
  - Linting y Testing automatizado.
  - Build y Push de imágenes Docker a GHCR.io.
  - Escaneo de seguridad (Trivy).

---

## 🔧 Roadmap del Proyecto

- [x] **Parte 1:** Backend API Funcional.
- [x] **Parte 2:** Simulador de Ingestión.
- [x] **Parte 3:** CI/CD Pipeline automatizado.
- [ ] **Parte 4:** Documentación Centralizada (En proceso).
- [ ] **Parte 5:** Frontend React (Dashboard Visual).
- [ ] **Parte 6:** Integración PostgreSQL + PostGIS.
- [ ] **Parte 7:** WebSocket para actualizaciones Real-time.
- [ ] **Parte 8:** Módulo de IA (Detección de Objetos).

---

## 🚀 Ejecución Rápida

```bash
git clone https://github.com/magno000/Sistema-Delta.git
cd Sistema-Delta
docker-compose up -d
```

*Documento generado automáticamente por Thor (OpenClaw Agent).*
