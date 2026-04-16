# One-shot script to run the affiliate_config migration via Supabase Management API.
# Intended to be run locally (contains no secrets when committed — token is passed as arg).
param(
  [Parameter(Mandatory=$true)][string]$Token,
  [string]$ProjectRef = "sijmwejqircywcosrmfl"
)

$sql = Get-Content -Raw -Path (Join-Path $PSScriptRoot "..\supabase\migrations\20260416_affiliate_config.sql")

$body = @{ query = $sql } | ConvertTo-Json -Depth 10

$headers = @{
  "Authorization" = "Bearer $Token"
  "Content-Type"  = "application/json"
}

try {
  $response = Invoke-RestMethod `
    -Uri "https://api.supabase.com/v1/projects/$ProjectRef/database/query" `
    -Method POST `
    -Headers $headers `
    -Body $body
  Write-Host "Migration executed successfully."
  $response | ConvertTo-Json -Depth 10
} catch {
  Write-Host "FAILED:" $_.Exception.Message
  if ($_.ErrorDetails) { Write-Host $_.ErrorDetails.Message }
  exit 1
}
