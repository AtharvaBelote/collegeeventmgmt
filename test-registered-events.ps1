# Test the registered events API with the new structure
Write-Host "Testing registered events API..." -ForegroundColor Green

# Login as student (who has registrations)
$loginData = @{
    email = "student@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Testing registered events endpoint..." -ForegroundColor Yellow
    $registeredResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/participation/events/registered" -Method GET -Headers $headers
    
    Write-Host "Registered events count: $($registeredResponse.Count)" -ForegroundColor Green
    if ($registeredResponse.Count -gt 0) {
        Write-Host "First registration structure:" -ForegroundColor Cyan
        $registeredResponse[0] | ConvertTo-Json -Depth 3
    }
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}