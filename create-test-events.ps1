# PowerShell script to create test events via API
Write-Host "Creating test events via API..." -ForegroundColor Green

# First, let's register a test admin user
$registerData = @{
    fullName = "Test Admin"
    email = "admin@test.com"
    password = "password123"
    role = "ADMIN"
} | ConvertTo-Json

try {
    Write-Host "Registering admin user..." -ForegroundColor Yellow
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method POST -Body $registerData -ContentType "application/json"
    $token = $registerResponse.token
    Write-Host "Admin registered successfully!" -ForegroundColor Green
    
    # Create authorization header
    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }
    
    # Create test events
    $events = @(
        @{
            name = "Tech Conference 2024"
            description = "Annual technology conference featuring latest innovations in AI and Machine Learning"
            startTime = "2024-12-15T09:00:00"
            endTime = "2024-12-15T17:00:00"
            venue = "Main Auditorium"
            capacity = 200
            organizer = "Computer Science Department"
        },
        @{
            name = "Cultural Fest"
            description = "Celebrate diversity with music, dance, and food from around the world"
            startTime = "2024-12-20T18:00:00"
            endTime = "2024-12-20T22:00:00"
            venue = "Campus Grounds"
            capacity = 500
            organizer = "Student Council"
        },
        @{
            name = "Career Fair"
            description = "Meet with top employers and explore internship and job opportunities"
            startTime = "2024-12-10T10:00:00"
            endTime = "2024-12-10T16:00:00"
            venue = "Sports Complex"
            capacity = 300
            organizer = "Career Services"
        },
        @{
            name = "Science Exhibition"
            description = "Student research projects and scientific demonstrations"
            startTime = "2024-12-25T14:00:00"
            endTime = "2024-12-25T18:00:00"
            venue = "Science Building"
            capacity = 150
            organizer = "Science Department"
        }
    )
    
    Write-Host "Creating events..." -ForegroundColor Yellow
    foreach ($event in $events) {
        $eventJson = $event | ConvertTo-Json
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:8080/api/admin/events" -Method POST -Body $eventJson -Headers $headers
            Write-Host "Created event: $($event.name)" -ForegroundColor Green
        } catch {
            Write-Host "Failed to create event: $($event.name) - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host "Test data creation completed!" -ForegroundColor Green
    Write-Host "You can now login with:" -ForegroundColor Cyan
    Write-Host "  Email: admin@test.com" -ForegroundColor Cyan
    Write-Host "  Password: password123" -ForegroundColor Cyan
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure the backend server is running on http://localhost:8080" -ForegroundColor Yellow
}