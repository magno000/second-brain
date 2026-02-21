@echo off
:: ============================================================
:: start-dev.bat — arrancar Second Brain desde ruta corta
:: Solución al problema de MAX_PATH en Windows
:: ============================================================

:: Montar el proyecto en la unidad S:
subst S: "%~dp0"

echo ✓ Proyecto montado en S:\
echo ✓ Iniciando servidor de desarrollo en http://localhost:3000

:: Arrancar next dev desde la unidad corta
cd /d S:\
npm run dev

:: Al salir, desmontar la unidad
subst S: /D
