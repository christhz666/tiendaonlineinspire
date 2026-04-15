# InspireNatural - Script de inicio para red local
# Este script permite acceder a la tienda desde cualquier dispositivo en tu WiFi

$ErrorActionPreference = "Stop"

# Colores para la consola
function Write-Cyan($text) { Write-Host $text -ForegroundColor Cyan }
function Write-Green($text) { Write-Host $text -ForegroundColor Green }
function Write-Yellow($text) { Write-Host $text -ForegroundColor Yellow }

Write-Cyan "`n=========================================="
Write-Cyan "  InspireNatural - Servidor Local"
Write-Cyan "==========================================`n"

# Obtener la IP local de la red WiFi
$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.InterfaceAlias -notmatch "Loopback" -and $_.IPAddress -notmatch "^169\.254"
}).IPAddress | Select-Object -First 1

if (-not $localIP) {
    Write-Yellow "No se pudo detectar tu IP local. Usando 127.0.0.1"
    $localIP = "127.0.0.1"
}

Write-Green "✓ IP detectada: $localIP"
Write-Green "✓ Puerto: 3000"
Write-Green "`n==========================================`n"

Write-Cyan "📱 Dispositivos en tu RED pueden acceder a:"
Write-Cyan "   http://$localIP`:3000"
Write-Cyan "`n📋 Desde esta PC accede a:"
Write-Cyan "   http://localhost:3000"
Write-Cyan "   http://127.0.0.1:3000"
Write-Cyan "`n==========================================`n"

Write-Yellow "Para detener el servidor: Ctrl+C`n"

# Iniciar el servidor con hostname 0.0.0.0 para permitir acceso desde red
npm run dev -- --hostname 0.0.0.0
