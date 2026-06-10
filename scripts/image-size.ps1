<#
.SYNOPSIS
  Report the built app image size (deployment size) and, if present, the local
  .next build output size.

.EXAMPLE
  ./scripts/image-size.ps1
  ./scripts/image-size.ps1 -Image miwl-bench:latest
#>
[CmdletBinding()]
param(
  [string]$Image = 'miwl-bench:latest'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')

$bytes = docker image inspect $Image --format '{{.Size}}' 2>$null
if ($LASTEXITCODE -ne 0 -or -not $bytes) {
  Write-Error "Image '$Image' not found. Build it first: docker compose -f monitoring/docker-compose.monitoring.yml build web"
}
$mb = [math]::Round([double]$bytes / 1MB, 1)
Write-Host ("Docker image '{0}': {1} MB" -f $Image, $mb) -ForegroundColor Green

$nextDir = Join-Path $repoRoot '.next'
if (Test-Path $nextDir) {
  $size = (Get-ChildItem $nextDir -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
  Write-Host (".next build output : {0} MB" -f [math]::Round($size / 1MB, 1))
  $standalone = Join-Path $nextDir 'standalone'
  if (Test-Path $standalone) {
    $ssize = (Get-ChildItem $standalone -Recurse -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Write-Host (".next/standalone    : {0} MB" -f [math]::Round($ssize / 1MB, 1))
  }
}
