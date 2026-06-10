<#
.SYNOPSIS
  Measure cold start: recreate the app container and time to first HTTP 200.

.EXAMPLE
  ./scripts/cold-start.ps1
  ./scripts/cold-start.ps1 -Url http://localhost:3000/privacy -TimeoutSec 120
#>
[CmdletBinding()]
param(
  [string]$Service = 'web',
  [string]$Url = 'http://localhost:3000/privacy',
  [int]$TimeoutSec = 120
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$compose = Join-Path $repoRoot 'monitoring/docker-compose.monitoring.yml'

Write-Host "Recreating '$Service' and timing first HTTP 200 at $Url ..." -ForegroundColor Cyan

# --no-deps: recreate only the app, leave db/seed alone.
docker compose -f $compose up -d --force-recreate --no-deps $Service | Out-Host

$start = Get-Date
$deadline = $start.AddSeconds($TimeoutSec)
$ready = $false
while ((Get-Date) -lt $deadline) {
  try {
    $r = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 3
    if ($r.StatusCode -eq 200) { $ready = $true; break }
  } catch {}
  Start-Sleep -Milliseconds 250
}
$elapsed = ((Get-Date) - $start).TotalSeconds

if ($ready) {
  Write-Host ("Cold start: {0} s" -f [math]::Round($elapsed, 2)) -ForegroundColor Green
} else {
  Write-Error "Did not reach HTTP 200 within $TimeoutSec s"
}
