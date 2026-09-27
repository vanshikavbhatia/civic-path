$staging = "C:\Users\daksh\.gemini\antigravity-ide\scratch\civic-path-staging"
$zipPath = 'C:\Users\daksh\.gemini\antigravity-ide\scratch\civic-path.zip'
$src = 'C:\Users\daksh\.gemini\antigravity-ide\scratch\civic-path'

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging -Force | Out-Null

# Robocopy into staging excluding node_modules, git, and zip
& robocopy $src $staging /E /XD node_modules .git /XF civic-path.zip *.db-journal /NFL /NDL /NJH /NJS

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path "$staging\*" -DestinationPath $zipPath -Force
Copy-Item $zipPath 'C:\Users\daksh\Downloads\civic-path.zip' -Force
Copy-Item $zipPath 'C:\Users\daksh\OneDrive\Desktop\civic-path.zip' -Force

Remove-Item $staging -Recurse -Force
Write-Host "Updated ZIP successfully created at: $zipPath and copied to Downloads and Desktop."
