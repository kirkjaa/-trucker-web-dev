# Download expired Figma assets
$ErrorActionPreference = "Stop"

# Ensure directories exist
$imagesDir = "public/assets/images"
$iconsDir = "public/assets/icons"

if (-not (Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null
}
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir -Force | Out-Null
}

# Asset mappings: URL -> Local Path
$assets = @(
    @{Url = "https://www.figma.com/api/mcp/asset/2cf2f60d-d00d-4152-adff-d7ac97ae5f33"; Path = "$imagesDir/city.png" },
    @{Url = "https://www.figma.com/api/mcp/asset/b5239a0d-16e2-4701-842f-fa559594c084"; Path = "$imagesDir/truck.png" },
    @{Url = "https://www.figma.com/api/mcp/asset/1fce35bc-df13-4cc4-8c50-2a190b6eaa21"; Path = "$imagesDir/map-pin.png" },
    @{Url = "https://www.figma.com/api/mcp/asset/82876103-f0f3-4dde-af45-198e0c168755"; Path = "$iconsDir/terms-close.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/29d08d13-882e-488b-b216-5403231439f3"; Path = "$iconsDir/terms-signal.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/79ec302e-79c2-4e70-b981-eba5ea655c9f"; Path = "$iconsDir/terms-wifi.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/dc32a603-ddb0-4921-9dfe-2ea71151f9d8"; Path = "$iconsDir/terms-battery.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/cbce3cd7-87ca-4c26-842e-50ec32936040"; Path = "$iconsDir/policy-signal.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/f0e7c079-01de-457f-ba21-c176c4918ffd"; Path = "$iconsDir/policy-wifi.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/40a43f59-61fc-4e78-8014-4136371d8161"; Path = "$iconsDir/policy-battery.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/7713e784-19c8-4e2b-a64f-65dbce0db966"; Path = "$iconsDir/policy-close.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/8b346984-2039-491c-a9f7-062556f14acd"; Path = "$iconsDir/current-jobs.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/0562a504-935f-48a2-be75-73df57c6b04a"; Path = "$iconsDir/bid.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/ccd02ee9-de64-4e63-ae1b-f465ea7a924e"; Path = "$iconsDir/revenue.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/0fb0bfc5-7fcd-4940-92f8-2848dc25712f"; Path = "$iconsDir/history.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/3ec529c7-bd38-418f-9631-14876af1286f"; Path = "$iconsDir/search.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/0a6b0846-f9c6-4499-a416-364395381992"; Path = "$iconsDir/clock.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/a1b71ec0-5eca-47ed-9e61-b2545fa999a4"; Path = "$iconsDir/route-start.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/7b36cda2-8cc5-4e7f-9e4f-e0a439ebb7ad"; Path = "$iconsDir/route-stops.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/c3bc2d9c-a88e-4d2f-91f6-0b44353267ab"; Path = "$iconsDir/route-dest.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/cbe49b46-8559-4750-b4c2-fbb6d3fb8d9d"; Path = "$iconsDir/price.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/25ac085f-fc0e-4a8a-99da-83bec1c9c5e8"; Path = "$iconsDir/nav-home.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/2940a263-2a86-42ba-a033-9524728aa3b0"; Path = "$iconsDir/nav-chat.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/62f3531c-d4c2-429a-b9d0-ac3daae777a9"; Path = "$iconsDir/nav-settings.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/131e47a4-8d53-445c-8092-0dd120ec4b44"; Path = "$iconsDir/back.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/6cd8f830-0a27-412a-912e-2cc92e82c18b"; Path = "$iconsDir/search-icon.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/4b681578-c474-489d-9bf6-cdd7811cfa84"; Path = "$iconsDir/filter.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/0cf562f0-624b-48f1-a416-e0dee7deb609"; Path = "$iconsDir/clock-icon.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/0eeb1871-d32f-4d72-96f5-98ba3d576954"; Path = "$iconsDir/price-icon.svg" },
    @{Url = "https://www.figma.com/api/mcp/asset/b91c04f5-f22a-4273-a34c-63bbed21b2a8"; Path = "$iconsDir/settings-status-wifi.svg" }
)

$successCount = 0
$failCount = 0

Write-Host "Downloading $($assets.Count) assets..." -ForegroundColor Cyan

foreach ($asset in $assets) {
    try {
        $fileName = Split-Path -Leaf $asset.Path
        Write-Host "Downloading: $fileName..." -NoNewline
        
        # Create parent directory if it doesn't exist
        $parentDir = Split-Path -Parent $asset.Path
        if (-not (Test-Path $parentDir)) {
            New-Item -ItemType Directory -Path $parentDir -Force | Out-Null
        }
        
        # Download the file
        Invoke-WebRequest -Uri $asset.Url -OutFile $asset.Path -UseBasicParsing -ErrorAction Stop
        
        Write-Host " ✓" -ForegroundColor Green
        $successCount++
    }
    catch {
        Write-Host " ✗ Failed: $($_.Exception.Message)" -ForegroundColor Red
        $failCount++
    }
}

Write-Host "`nDownload complete!" -ForegroundColor Cyan
Write-Host "Success: $successCount" -ForegroundColor Green
$failColor = if ($failCount -gt 0) { "Red" } else { "Green" }
Write-Host "Failed: $failCount" -ForegroundColor $failColor

