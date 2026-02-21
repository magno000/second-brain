---
title: Bienvenido al Segundo Cerebro
status: completed
tags:
  - intro
  - setup
date: '2026-02-20'
description: Documento de bienvenida y guía de uso del Segundo Cerebro.
---

# Bienvenido al Segundo Cerebro 🧠

Este es tu espacio centralizado donde **OpenClaw** publica automáticamente tareas, investigaciones y resultados mientras trabajan juntos.

## ¿Cómo funciona?

1. **OpenClaw** crea documentos `.md` en la carpeta `documents/` del repositorio vía GitHub API
2. Esta app los muestra automáticamente en tiempo real
3. Puedes filtrar por estado, buscar por título o etiqueta, y exportar con un clic

## Estados de documentos

| Estado | Descripción |
|--------|-------------|
| 🟡 **Pendiente** | Tarea registrada pero no iniciada |
| 🔵 **En Progreso** | OpenClaw está trabajando en ello |
| 🟢 **Completado** | Tarea o investigación finalizada |

## Estructura de un documento

Cada documento usa frontmatter YAML para metadatos:

```yaml
---
title: "Título del documento"
status: "pending | in-progress | completed"
tags: ["tag1", "tag2"]
date: "2026-02-20"
description: "Descripción breve"
---
```

¡Listo para trabajar contigo! 🚀
