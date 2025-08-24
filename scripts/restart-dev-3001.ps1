# stop Next dev instances and restart dev server on PORT=3001
Write-Output "Looking for running Next dev processes..."
$procs = Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -ne $null -and ($_.CommandLine -match 'next' -and $_.CommandLine -match 'dev') }
if ($procs) {
  foreach ($p in $procs) {
    Write-Output "Stopping PID $($p.ProcessId): $($p.CommandLine -replace "\r|\n", ' ')"
    Stop-Process -Id $p.ProcessId -Force -ErrorAction SilentlyContinue
  }
} else {
  Write-Output "No existing Next dev processes found."
}
Start-Sleep -Milliseconds 500
# start dev server on PORT=3001
Write-Output "Starting Next dev on PORT=3001..."
$env:PORT = '3001'
# Run npm dev and keep it attached to this terminal
npm run dev
