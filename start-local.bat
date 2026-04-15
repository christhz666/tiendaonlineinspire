@echo off
REM ==========================================
REM InspireNatural - Script para red local
REM ==========================================

echo.
echo ==========================================
echo   InspireNatural - Servidor Local
echo ==========================================
echo.

REM Obtener IP local
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "ipv4"') do (
    set localip=%%a
    goto :found
)

:found
set localip=%localip:~1%

echo ==========================================
echo.
echo Servidor started en modo red local
echo.
echo Dispositivos en tu RED:
echo   http://%localip%:3000
echo.
echo Desde esta PC:
echo   http://localhost:3000
echo.
echo Presiona Ctrl+C para detener
echo ==========================================
echo.

REM Iniciar Next.js con hostname 0.0.0.0
npm run dev -- --hostname 0.0.0.0
