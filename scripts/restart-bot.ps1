# Tek bot instance baslat (once eskileri kapatir)
$botProcs = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
  Where-Object { $_.CommandLine -like '*my-node-app*' }

if ($botProcs) {
  Write-Host "Eski bot processleri kapatiliyor: $($botProcs.Count) adet"
  $botProcs | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
  Start-Sleep -Seconds 3
}

Set-Location $PSScriptRoot
Write-Host "Bot baslatiliyor..."
npm run dev
