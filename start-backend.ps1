# Spring Boot Backend Startup Script
# This script sets up environment variables and starts the backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting College Event Management Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set MySQL password (CHANGE THIS to your actual MySQL root password)
$env:DB_PASSWORD = "Atharva123#"

# Generate JWT Secret (64 bytes, base64-encoded)
Write-Host "Generating JWT Secret..." -ForegroundColor Yellow
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$jwtBytes = New-Object byte[] 64
$rng.GetBytes($jwtBytes)
$env:JWT_SECRET = [Convert]::ToBase64String($jwtBytes)
$rng.Dispose()
Write-Host "JWT Secret generated successfully!" -ForegroundColor Green
Write-Host ""

# Display connection info
Write-Host "Environment Variables Set:" -ForegroundColor Cyan
Write-Host "  - DB_PASSWORD: ********" -ForegroundColor Gray
Write-Host "  - JWT_SECRET: $($env:JWT_SECRET.Substring(0,20))..." -ForegroundColor Gray
Write-Host ""

# Check if MySQL is accessible (optional check)
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
try {
    $mysqlCheck = mysql -u root -p"$env:DB_PASSWORD" -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "MySQL connection successful!" -ForegroundColor Green
    } else {
        Write-Host "Warning: Could not verify MySQL connection" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Warning: MySQL check skipped" -ForegroundColor Yellow
}
Write-Host ""

# Start Spring Boot application
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
Write-Host "Server will be available at: http://localhost:8080" -ForegroundColor Green
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

.\mvnw.cmd spring-boot:run

