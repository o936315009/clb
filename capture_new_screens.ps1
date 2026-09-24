$edgePath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
if (-not (Test-Path $edgePath)) {
  $edgePath = "C:\Program Files\Microsoft\Edge\Application\msedge.exe"
}

Write-Host "Using Edge at: $edgePath"

$targets = @(
  @{
    Name = "Tournament-4Groups-Bracket"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#tournament"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Tournament-4Groups-Bracket.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Tournament-4Groups-Bracket.png"
    DelayMs = 1500
  },
  @{
    Name = "Tournament-Clubs-View"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#tournament-clubs"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Tournament-Clubs-View.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Tournament-Clubs-View.png"
    DelayMs = 1500
  },
  @{
    Name = "Tournament-Schedule-View"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#tournament-schedule"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Tournament-Schedule-View.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Tournament-Schedule-View.png"
    DelayMs = 1500
  },
  @{
    Name = "Tournament-Score-Modal"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#tournament-score-modal"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Tournament-Score-Modal.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Tournament-Score-Modal.png"
    DelayMs = 2000
  },
  @{
    Name = "Tournament-Add-Club-Modal"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#tournament-add-club-modal"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Tournament-Add-Club-Modal.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Tournament-Add-Club-Modal.png"
    DelayMs = 2000
  },
  @{
    Name = "Settings-User-Access"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#settings-access"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Settings-User-Access.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Settings-User-Access.png"
    DelayMs = 2000
  },
  @{
    Name = "User-Access-Modal"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#user-access-modal"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\User-Access-Modal.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\User-Access-Modal.png"
    DelayMs = 2000
  },
  @{
    Name = "Create-Club-Modal"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#create-club-modal"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Create-Club-Modal.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Create-Club-Modal.png"
    DelayMs = 2000
  },
  @{
    Name = "Settings-Multi-Club"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#multi-club-settings"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Settings-Multi-Club.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Settings-Multi-Club.png"
    DelayMs = 2000
  },
  @{
    Name = "Header-Club-Switcher"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#dashboard"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Header-Club-Switcher.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Header-Club-Switcher.png"
    DelayMs = 2000
  },
  @{
    Name = "Club-Switched-View"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#switch-lightning"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Club-Switched-View.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Club-Switched-View.png"
    DelayMs = 2500
  },
  @{
    Name = "Reset-To-Smash"
    Url = "file:///C:/Users/ADMIN/.gemini/antigravity/scratch/clb-cau-long/index.html#switch-smash"
    Output = "C:\Users\ADMIN\.gemini\antigravity\scratch\clb-cau-long\Reset-Smash.png"
    Artifact = "C:\Users\ADMIN\.gemini\antigravity\brain\b1b6a0dd-94d6-4ea2-a5dc-a68db78b1ec6\Reset-Smash.png"
    DelayMs = 1500
  }
)

foreach ($t in $targets) {
  Write-Host "Capturing $($t.Name)..."
  if (Test-Path $t.Output) { Remove-Item $t.Output -Force }
  
  $proc = Start-Process -FilePath $edgePath -ArgumentList "--headless=new", "--disable-gpu", "--window-size=1440,1280", "--screenshot=$($t.Output)", $t.Url -PassThru
  Start-Sleep -Milliseconds $t.DelayMs
  
  $proc.WaitForExit(8000)
  Start-Sleep -Milliseconds 500

  if (Test-Path $t.Output) {
    Copy-Item -Path $t.Output -Destination $t.Artifact -Force
    $len = (Get-Item $t.Output).Length
    Write-Host "  -> Successfully captured $($t.Name)! Size: $len bytes"
  } else {
    Write-Host "  -> FAILED: $($t.Output) not found."
  }
}

Write-Host "Done capturing all views."
