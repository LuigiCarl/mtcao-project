# MTCAO Full Stack Quick Start Script
# Run this from the frontend directory

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "MTCAO Full Stack Application Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Laravel setup
Write-Host "Step 1: Setting up Laravel Backend..." -ForegroundColor Yellow
Set-Location MTCAO-LARAVEL

# Check if vendor exists
if (-Not (Test-Path "vendor")) {
    Write-Host "Installing PHP dependencies..." -ForegroundColor Green
    composer install
}

# Check database
Write-Host "Checking database setup..." -ForegroundColor Green
$dbExists = $false
try {
    php artisan migrate:status 2>&1 | Out-Null
    $dbExists = $true
    Write-Host "✓ Database tables exist" -ForegroundColor Green
} catch {
    Write-Host "! Database needs migration" -ForegroundColor Yellow
}

if (-Not $dbExists) {
    Write-Host "Running migrations..." -ForegroundColor Green
    php artisan migrate --force
    
    $seed = Read-Host "Do you want to seed the database with sample data? (y/n)"
    if ($seed -eq "y") {
        Write-Host "Seeding database..." -ForegroundColor Green
        php artisan db:seed
    }
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 (Laravel Backend):" -ForegroundColor Cyan
Write-Host "  cd MTCAO-LARAVEL" -ForegroundColor White
Write-Host "  php artisan serve" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 (Next.js Frontend):" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open: http://localhost:3000" -ForegroundColor Green
Write-Host ""
