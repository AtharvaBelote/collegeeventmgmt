# PowerShell script to create student user and register for events
Write-Host "Creating student user and registrations..." -ForegroundColor Green

# Register a student user
$studentData = @{
    fullName = "John Student"
    email = "student@test.com"
    password = "password123"
    role = "STUDENT"
} | ConvertTo-Json

try {
    Write-Host "Registering student user..." -ForegroundColor Yellow
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $studentData -ContentType "application/json"
    $token = $registerResponse.token
    Write-Host "Student registered successfully!" -ForegroundColor Green
    
    # Create authorization header
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Register for approved events (1, 2, 4)
    $eventsToRegister = @(1, 2, 4)
    
    Write-Host "Registering student for events..." -ForegroundColor Yellow
    foreach ($eventId in $eventsToRegister) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/participation/events/$eventId/register" -Method POST -Headers $headers
            Write-Host "Registered for event ID: $eventId" -ForegroundColor Green
        } catch {
            Write-Host "Failed to register for event ID: $eventId - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "Student data creation completed!" -ForegroundColor Green
    Write-Host "You can now login as student with:" -ForegroundColor Cyan
    Write-Host "  Email: student@test.com" -ForegroundColor Cyan
    Write-Host "  Password: password123" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}