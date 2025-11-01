# Test authentication with the faculty user
Write-Host "Testing faculty authentication..." -ForegroundColor Green

# Login as faculty
$loginData = @{
    email = "faculty@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    Write-Host "Logging in as faculty..." -ForegroundColor Yellow
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "Login successful! Token: $($token.Substring(0,20))..." -ForegroundColor Green
    
    # Test /api/users/me endpoint
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    Write-Host "Testing /api/users/me endpoint..." -ForegroundColor Yellow
    $userResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/users/me" -Method GET -Headers $headers
    Write-Host "User data retrieved successfully:" -ForegroundColor Green
    Write-Host "Name: $($userResponse.fullName)" -ForegroundColor Cyan
    Write-Host "Email: $($userResponse.email)" -ForegroundColor Cyan
    Write-Host "Role: $($userResponse.role)" -ForegroundColor Cyan
    
    # Test events API with auth
    Write-Host "Testing events API with authentication..." -ForegroundColor Yellow
    $eventsResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/events" -Method GET -Headers $headers
    Write-Host "Events retrieved: $($eventsResponse.Count)" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}