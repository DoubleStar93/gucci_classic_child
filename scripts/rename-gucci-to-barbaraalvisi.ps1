# Rename public-facing gucci → barbaraalvisi (theme + FO modules + deploy config)
$ErrorActionPreference = "Stop"
$repo = if ($PSScriptRoot) { Split-Path -Parent $PSScriptRoot } else { Get-Location }
Set-Location $repo

# Ordered pairs: longest / most specific first
$replacementPairs = @(
  @{ From = "classic-gucci"; To = "barbaraalvisi" },
  @{ From = "gucci_homecategories"; To = "barbaraalvisi_homecategories" },
  @{ From = "Gucci_Homecategories"; To = "Barbaraalvisi_Homecategories" },
  @{ From = "GucciCartShipping"; To = "BarbaraalvisiCartShipping" },
  @{ From = "GucciHomeBestsellers"; To = "BarbaraalvisiHomeBestsellers" },
  @{ From = "GucciHomeCategories"; To = "BarbaraalvisiHomeCategories" },
  @{ From = "GucciMenuCategories"; To = "BarbaraalvisiMenuCategories" },
  @{ From = "Classic Gucci Style"; To = "Barbara Alvisi" },
  @{ From = "Classic Gucci"; To = "Barbara Alvisi" },
  @{ From = "gucci-theme"; To = "barbaraalvisi-theme" },
  @{ From = "js-gucci"; To = "js-barbaraalvisi" },
  @{ From = "data-gucci"; To = "data-barbaraalvisi" },
  @{ From = "__gucci"; To = "__barbaraalvisi" },
  @{ From = "--gucci"; To = "--barbaraalvisi" },
  @{ From = "gucciPopup"; To = "barbaraalvisiPopup" },
  @{ From = "hideGucci"; To = "hideBarbaraalvisi" },
  @{ From = "syncGucci"; To = "syncBarbaraalvisi" },
  @{ From = "getGucci"; To = "getBarbaraalvisi" },
  @{ From = "appendGucci"; To = "appendBarbaraalvisi" },
  @{ From = "guardGucci"; To = "guardBarbaraalvisi" },
  @{ From = "setupGucci"; To = "setupBarbaraalvisi" },
  @{ From = "bootGucci"; To = "bootBarbaraalvisi" },
  @{ From = "initGucci"; To = "initBarbaraalvisi" },
  @{ From = "runGucci"; To = "runBarbaraalvisi" },
  @{ From = "ensureGucci"; To = "ensureBarbaraalvisi" },
  @{ From = "gucci.com"; To = "luxury reference" },
  @{ From = "Gucci Sans"; To = "luxury sans" },
  @{ From = "Gucci Serif"; To = "luxury serif" },
  @{ From = "stile gucci"; To = "stile luxury" },
  @{ From = "scale Gucci"; To = "scale tipografica" },
  @{ From = "Gucci"; To = "Barbaraalvisi" },
  @{ From = "gucci"; To = "barbaraalvisi" },
  @{ From = "GUCCI"; To = "BARBARAALVISI" }
)

function Apply-Replacements([string]$text) {
  foreach ($pair in $replacementPairs) {
    $text = $text.Replace($pair.From, $pair.To)
  }
  return $text
}

function Replace-InFile([string]$path) {
  $bytes = [System.IO.File]::ReadAllBytes($path)
  $utf8NoBom = New-Object System.Text.UTF8Encoding $false
  $offset = 0
  if ($bytes.Length -ge 3 -and $bytes[0] -eq 0xEF -and $bytes[1] -eq 0xBB -and $bytes[2] -eq 0xBF) {
    $offset = 3
  }
  $text = $utf8NoBom.GetString($bytes, $offset, $bytes.Length - $offset)
  $newText = Apply-Replacements $text
  if ($newText -ne $text) {
    [System.IO.File]::WriteAllText($path, $newText, $utf8NoBom)
    return $true
  }
  return $false
}

Write-Host "== 1) Rename theme folder =="
if (Test-Path "classic-gucci") {
  if (Test-Path "barbaraalvisi") { throw "barbaraalvisi/ already exists" }
  Rename-Item "classic-gucci" "barbaraalvisi"
  Write-Host "classic-gucci -> barbaraalvisi"
} elseif (Test-Path "barbaraalvisi") {
  Write-Host "theme already barbaraalvisi"
} else {
  throw "theme folder not found"
}

Write-Host "== 2) Rename module folder =="
if (Test-Path "modules\gucci_homecategories") {
  if (Test-Path "modules\barbaraalvisi_homecategories") { throw "barbaraalvisi_homecategories already exists" }
  Rename-Item "modules\gucci_homecategories" "barbaraalvisi_homecategories"
  Write-Host "module folder renamed"
}
$modPhp = "modules\barbaraalvisi_homecategories\gucci_homecategories.php"
if (Test-Path $modPhp) {
  Rename-Item $modPhp "barbaraalvisi_homecategories.php"
  Write-Host "module php renamed"
}

Write-Host "== 3) Rename files with gucci in name =="
$renamed = 0
$targets = @()
if (Test-Path "barbaraalvisi") {
  $targets += Get-ChildItem "barbaraalvisi" -Recurse -File | Where-Object { $_.Name -match '(?i)gucci' }
}
if (Test-Path "modules\everpspopup") {
  $targets += Get-ChildItem "modules\everpspopup" -Recurse -File | Where-Object { $_.Name -match '(?i)gucci' }
}
if (Test-Path "scripts") {
  $targets += Get-ChildItem "scripts" -File | Where-Object { $_.Name -match '(?i)gucci' -and $_.Name -ne "rename-gucci-to-barbaraalvisi.ps1" }
}
$targets | Sort-Object { $_.FullName.Length } -Descending | ForEach-Object {
  $newName = Apply-Replacements $_.Name
  $newName = [regex]::Replace($newName, '(?i)gucci', 'barbaraalvisi')
  if ($newName -ne $_.Name) {
    Rename-Item -LiteralPath $_.FullName -NewName $newName
    $renamed++
    Write-Host ("  " + $_.Name + " -> " + $newName)
  }
}
Write-Host "Renamed $renamed files"

Write-Host "== 4) Content replace (public + deploy) =="
$roots = @(
  "barbaraalvisi",
  "modules\barbaraalvisi_homecategories",
  "modules\everpspopup",
  "scripts\deploy.js",
  ".env.example",
  "package.json"
)
if (Test-Path ".env") { $roots += ".env" }
# also renamed install scripts
Get-ChildItem "scripts" -File | Where-Object { $_.Name -match 'barbaraalvisi' } | ForEach-Object {
  $roots += ("scripts\" + $_.Name)
}

$extOk = @(".tpl", ".css", ".js", ".yml", ".yaml", ".php", ".xml", ".json", ".md", ".txt", ".mjs", ".example")
$changed = 0
$filesScanned = 0

foreach ($root in $roots) {
  $path = Join-Path $repo $root
  if (-not (Test-Path $path)) { continue }
  $files = @()
  if (Test-Path $path -PathType Leaf) {
    $files = @(Get-Item -LiteralPath $path)
  } else {
    $files = Get-ChildItem -LiteralPath $path -Recurse -File
  }
  foreach ($f in $files) {
    $ok = $false
    if ($f.Name -eq ".env" -or $f.Name -eq ".env.example") { $ok = $true }
    elseif ($extOk -contains $f.Extension.ToLowerInvariant()) { $ok = $true }
    if (-not $ok) { continue }
    if ($f.Length -gt 5MB) { continue }
    if ($f.Extension -match '\.(png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|pdf)$') { continue }
    $filesScanned++
    try {
      if (Replace-InFile $f.FullName) { $changed++ }
    } catch {
      Write-Warning ("Skip " + $f.FullName + ": " + $_.Exception.Message)
    }
  }
}

Write-Host "Scanned $filesScanned files, modified $changed"

Write-Host "== 5) Residual gucci check (public FO) =="
$residual = @()
$checkRoots = @("barbaraalvisi", "modules\barbaraalvisi_homecategories", "modules\everpspopup\views")
foreach ($r in $checkRoots) {
  if (-not (Test-Path $r)) { continue }
  Get-ChildItem $r -Recurse -File | Where-Object {
    $_.Extension -match '\.(tpl|css|js|yml|php|xml)$' -and $_.Length -lt 5MB
  } | ForEach-Object {
    $c = [System.IO.File]::ReadAllText($_.FullName)
    if ($c -match '(?i)gucci') {
      $residual += $_.FullName.Substring($repo.Length).TrimStart("\")
    }
  }
}
Get-ChildItem "barbaraalvisi","modules\barbaraalvisi_homecategories" -Recurse -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match '(?i)gucci' } | ForEach-Object {
    $residual += ("FILENAME: " + $_.FullName.Substring($repo.Length).TrimStart("\"))
  }

if ($residual.Count -gt 0) {
  Write-Host "RESIDUAL ($($residual.Count)):"
  $residual | Select-Object -First 50 | ForEach-Object { Write-Host "  $_" }
} else {
  Write-Host "No residual gucci in public theme/modules views."
}

Write-Host "DONE"
