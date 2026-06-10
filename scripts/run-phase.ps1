<#
.SYNOPSIS
  Run one benchmark phase N times, collect k6 + Prometheus metrics, append a CSV
  and print averages.

.DESCRIPTION
  For each run it:
    1. launches the on-demand k6 service against the running app container,
    2. parses the k6 summary JSON (P95 TTFB = http_req_waiting p95, P95 duration),
    3. queries Prometheus for this run's peak CPU and peak RAM of the app container,
    4. appends a row to monitoring/results/<phase>-runs.csv,
  then prints the averages across all runs.

  Requires the monitoring stack to be up first:
    docker compose -f monitoring/docker-compose.monitoring.yml up -d --build

.EXAMPLE
  ./scripts/run-phase.ps1 -Phase light -Runs 10 -Rps 50 -Duration 30s

.EXAMPLE
  ./scripts/run-phase.ps1 -Phase hard -Runs 10 -Mode rps -Rps 20 -Duration 30s
#>
[CmdletBinding()]
param(
  [Parameter(Mandatory = $true)]
  [ValidateSet('light', 'medium', 'hard')]
  [string]$Phase,

  [int]$Runs = 10,
  [ValidateSet('rps', 'smoke')]
  [string]$Mode = 'rps',
  [int]$Rps = 50,
  [string]$Duration = '30s',

  [string]$AppContainer = 'miwl-bench-web',
  [string]$PrometheusUrl = 'http://localhost:9090'
)

$ErrorActionPreference = 'Stop'
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$compose = Join-Path $repoRoot 'monitoring/docker-compose.monitoring.yml'
$resultsDir = Join-Path $repoRoot 'monitoring/results'
$summaryFile = Join-Path $resultsDir "$Phase-summary.json"
$csvFile = Join-Path $resultsDir "$Phase-runs.csv"

if (-not (Test-Path $resultsDir)) { New-Item -ItemType Directory -Path $resultsDir | Out-Null }

function Invoke-PromScalar([string]$query, [double]$at) {
  $uri = "$PrometheusUrl/api/v1/query?query=$([uri]::EscapeDataString($query))&time=$at"
  try {
    $resp = Invoke-RestMethod -Uri $uri -TimeoutSec 10
    if ($resp.status -eq 'success' -and $resp.data.result.Count -gt 0) {
      return [double]$resp.data.result[0].value[1]
    }
  } catch {
    Write-Warning "Prometheus query failed: $($_.Exception.Message)"
  }
  return [double]::NaN
}

$ttfbs = @(); $durs = @(); $cpus = @(); $rams = @()

Write-Host "== Phase '$Phase' x$Runs (mode=$Mode rps=$Rps duration=$Duration) ==" -ForegroundColor Cyan

for ($i = 1; $i -le $Runs; $i++) {
  $start = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() / 1000.0

  docker compose -f $compose run --rm `
    -e "MODE=$Mode" -e "RPS=$Rps" -e "DURATION=$Duration" `
    k6 run "/scripts/$Phase.js" | Out-Host

  $end = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() / 1000.0
  $window = [math]::Max(30, [int][math]::Ceiling($end - $start))

  if (-not (Test-Path $summaryFile)) {
    Write-Warning "Run ${i}: no summary at $summaryFile - skipping."
    continue
  }
  $summary = Get-Content $summaryFile -Raw | ConvertFrom-Json
  $ttfb = [double]$summary.metrics.http_req_waiting.values.'p(95)'
  $dur = [double]$summary.metrics.http_req_duration.values.'p(95)'
  $reqs = [double]$summary.metrics.http_reqs.values.count
  $failRate = 0.0
  if ($summary.metrics.http_req_failed) { $failRate = [double]$summary.metrics.http_req_failed.values.rate }

  $cpuQ = "max_over_time(rate(container_cpu_usage_seconds_total{name=`"$AppContainer`"}[30s])[${window}s:5s])"
  $ramQ = "max_over_time(container_memory_usage_bytes{name=`"$AppContainer`"}[${window}s])"
  $peakCpu = Invoke-PromScalar $cpuQ $end
  $peakRam = Invoke-PromScalar $ramQ $end

  if (-not (Test-Path $csvFile)) {
    'timestamp,run,phase,mode,rps,duration,reqs,ttfb_p95_ms,dur_p95_ms,fail_pct,peak_cpu_cores,peak_ram_bytes' |
      Out-File -FilePath $csvFile -Encoding utf8
  }
  $ts = (Get-Date).ToString('o')
  $row = "$ts,$i,$Phase,$Mode,$Rps,$Duration,$reqs,$([math]::Round($ttfb,2)),$([math]::Round($dur,2)),$([math]::Round($failRate*100,2)),$([math]::Round($peakCpu,4)),$([math]::Round($peakRam,0))"
  $row | Out-File -FilePath $csvFile -Append -Encoding utf8

  $ttfbs += $ttfb; $durs += $dur
  if (-not [double]::IsNaN($peakCpu)) { $cpus += $peakCpu }
  if (-not [double]::IsNaN($peakRam)) { $rams += $peakRam }

  Write-Host ("run {0}: ttfb_p95={1}ms dur_p95={2}ms peakCPU={3} peakRAM={4}MB" -f `
      $i, [math]::Round($ttfb, 1), [math]::Round($dur, 1), [math]::Round($peakCpu, 3), [math]::Round($peakRam / 1MB, 1)) -ForegroundColor DarkGray
}

function Avg($a) { if ($a.Count -eq 0) { return [double]::NaN } ($a | Measure-Object -Average).Average }

Write-Host "`n== Averages over $($ttfbs.Count) runs ==" -ForegroundColor Green
Write-Host ("P95 TTFB       : {0} ms" -f [math]::Round((Avg $ttfbs), 1))
Write-Host ("P95 duration   : {0} ms" -f [math]::Round((Avg $durs), 1))
Write-Host ("Peak CPU       : {0} cores" -f [math]::Round((Avg $cpus), 3))
Write-Host ("Peak RAM       : {0} MB" -f [math]::Round((Avg $rams) / 1MB, 1))
Write-Host "CSV: $csvFile"
