# PowerShell script to create faculty user
Write-Host "Creating faculty user..." -ForegroundColor Green

# Register a faculty user
$facultyData = @{
    fullName = "Dr. Jane Faculty"
    email = "faculty@test.com"
    password = "password123"
    role = "FACULTY"
} | ConvertTo-Json

try {
    Write-Host "Registering faculty user..." -ForegroundColor Yellow
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $facultyData -ContentType "application/json"
    Write-Host "Faculty registered successfully!" -ForegroundColor Green
    
    Write-Host "You can now login as faculty with:" -ForegroundColor Cyan
    Write-Host "  Email: faculty@test.com" -ForegroundColor Cyan
    Write-Host "  Password: password123" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}