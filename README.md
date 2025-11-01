# College Event Management System

## Overview
The College Event Management System is a Spring Boot-based application designed to streamline the management of college events. It provides features such as authentication, user management, event creation and registration, and roles-based access control for administrators, faculty, and students.

---

## Features
- **Authentication**: Secure login and registration using JWT tokens.
- **Event Management**: Create, update, delete, and manage events.
- **Role-based Access Control**:
    - Admins: Manage users and events.
    - Faculty: Approve/reject events, participate in events, and provide feedback.
    - Students: Register for events and provide feedback.
- **Event Participation**: Students and Faculty can register for events and provide feedback.
- **CSV Export**: Admins can export event participants as CSV files.
- **Image Upload**: Upload event images.

---

## Technologies Used
- **Backend**: Java, Spring Boot
- **Security**: Spring Security, JWT
- **Database**: MySQL
- **Build Tool**: Maven

---

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Java 17 or higher
- Maven
- MySQL

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AtharvaBelote/collegeeventmgmt.git
   cd collegeeventmgmt
   ```

2. Configure the database:
    - Create a MySQL database named `college_event_mgmt`.
    - Update the `application.properties` file with your database credentials:
      ```properties
      spring.datasource.url=jdbc:mysql://localhost:3306/college_event_mgmt
      spring.datasource.username=root
      spring.datasource.password=YOUR_PASSWORD
      ```

3. Build the project:
   ```bash
   mvn clean install
   ```

4. Run the application:
   ```bash
   mvn spring-boot:run
   ```

---

## Testing

### API Testing
You can test the APIs using Postman or cURL.

### Unit Tests
Run the unit tests using:
```bash
mvn test
```

---

## API Endpoints

### Public Endpoints
- **AuthController**
    - `POST /api/auth/register`: Register a new user.
    - `POST /api/auth/login`: Login and get a JWT token.

---

### Role-Based Access Control Endpoints

#### Admin Access
- **AdminController**
    - `GET /api/admin/users`: Get all users.
    - `GET /api/admin/users/{id}`: Get user by ID.
    - `PUT /api/admin/users/{id}`: Update user info.
    - `DELETE /api/admin/users/{id}`: Delete user.

- **AdminEventController**
    - `POST /api/admin/events`: Create a new event.
    - `GET /api/admin/events`: Get all events.
    - `GET /api/admin/events/{id}`: Get event by ID.
    - `PUT /api/admin/events/{id}`: Update an event.
    - `DELETE /api/admin/events/{id}`: Delete an event.
    - `GET /api/admin/events/{id}/registrations`: Get event registrations.
    - `GET /api/admin/events/{id}/participants/csv`: Download CSV of participants.

---

#### Faculty and Admin Access
- **EventController**
    - `PUT /api/events/{id}/approve`: Approve an event.
    - `PUT /api/events/{id}/reject`: Reject an event.

---

#### Faculty and Student Access
- **EventParticipationController**
    - `POST /api/participation/events/{eventId}/register`: Register for an event.
    - `POST /api/participation/events/{eventId}/feedback`: Submit feedback for an event.
    - `GET /api/participation/events/registered`: Get registered events.

---

#### Student, Faculty, and Admin Access
- **EventController**
    - `GET /api/events`: Get all events.
    - `GET /api/events/approved`: Get approved events.
    - `GET /api/events/{id}`: Get event by ID.

- **EventController - Image Upload**
    - `POST /api/events/{eventId}/image`: Upload an image for an event.
    - `GET /api/events/image/{filename:.+}`: Retrieve an event image.

---

#### User-Specific Access
- **UserController**
    - `GET /api/users/me`: Get the current logged-in user profile.
    - `PUT /api/users/me`: Update the current logged-in user profile (name only).
    - `PUT /api/users/me/email`: Update the email (requires password confirmation).
    - `PUT /api/users/me/password`: Update the password.

---

## Contributing
Contributions are welcome! Please fork the repository, make changes, and submit a pull request.
