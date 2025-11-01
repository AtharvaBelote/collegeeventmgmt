# PowerShell script to approve some test events
Write-Host "Approving test events..." -ForegroundColor Green

# Login as admin to get token
$loginData = @{
    email = "admin@test.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method POST -Body $loginData -ContentType "application/json"
    $token = $loginResponse.token
    
    # Create authorization header
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Approve events 1, 2, and 4 (leave 3 as pending for testing)
    $eventsToApprove = @(1, 2, 4)
    
    foreach ($eventId in $eventsToApprove) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/events/$eventId/approve" -Method PUT -Headers $headers
            Write-Host "Approved event ID: $eventId - $($response.name)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to approve event ID: $eventId - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "Event approval completed!" -ForegroundColor Green
    Write-Host "Events 1, 2, and 4 are now approved. Event 3 remains pending for testing." -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}