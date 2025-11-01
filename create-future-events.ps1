# PowerShell script to create events with future dates
Write-Host "Creating events with future dates..." -ForegroundColor Green

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
    
    # Create events with future dates (2025)
    $futureEvents = @(
        @{
            name = "Spring Tech Symposium 2025"
            description = "Explore emerging technologies and their impact on society"
            startTime = "2025-03-15T10:00:00"
            endTime = "2025-03-15T16:00:00"
            venue = "Engineering Building"
            capacity = 250
            organizer = "Tech Club"
        },
        @{
            name = "Annual Sports Day"
            description = "Inter-department sports competition and fun activities"
            startTime = "2025-02-20T08:00:00"
            endTime = "2025-02-20T18:00:00"
            venue = "Sports Complex"
            capacity = 1000
            organizer = "Sports Committee"
        },
        @{
            name = "Art & Design Exhibition"
            description = "Showcase of student artwork and design projects"
            startTime = "2025-04-10T12:00:00"
            endTime = "2025-04-10T20:00:00"
            venue = "Art Gallery"
            capacity = 200
            organizer = "Art Department"
        }
    )
    
    Write-Host "Creating future events..." -ForegroundColor Yellow
    $createdEvents = @()
    foreach ($event in $futureEvents) {
        $eventJson = $event | ConvertTo-Json
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/events" -Method POST -Body $eventJson -Headers $headers
            Write-Host "Created event: $($event.name) (ID: $($response.id))" -ForegroundColor Green
            $createdEvents += $response.id
        } catch {
            Write-Host "Failed to create event: $($event.name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    # Approve the newly created events
    Write-Host "Approving future events..." -ForegroundColor Yellow
    foreach ($eventId in $createdEvents) {
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/events/$eventId/approve" -Method PUT -Headers $headers
            Write-Host "Approved event ID: $eventId" -ForegroundColor Green
        } catch {
            Write-Host "Failed to approve event ID: $eventId - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "Future events creation completed!" -ForegroundColor Green
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}