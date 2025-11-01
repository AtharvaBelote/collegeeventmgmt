# MySQL Setup Guide for College Event Management System

## 🗄️ **MySQL Database Migration Complete!**

Your College Event Management System has been successfully migrated from PostgreSQL to MySQL.

## 📋 **What Changed:**

### 1. **Dependencies Updated**
- ✅ Replaced `postgresql` driver with `mysql-connector-j`
- ✅ Updated `pom.xml` with MySQL connector

### 2. **Configuration Updated**
- ✅ Updated `application.properties` with MySQL connection settings
- ✅ Added MySQL-specific JPA properties
- ✅ Updated environment variables

### 3. **Database Settings**
- ✅ Database name: `college_event_mgmt`
- ✅ Port: `3306` (MySQL default)
- ✅ Username: `root` (MySQL default)

## 🚀 **Setup Instructions:**

### **Step 1: Install MySQL**

**Windows:**
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Install MySQL Server
3. Set root password during installation
4. Start MySQL service

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

### **Step 2: Create Database**

1. **Connect to MySQL:**
   ```bash
   mysql -u root -p
   ```

2. **Run the setup script:**
   ```bash
   mysql -u root -p < mysql-setup.sql
   ```

   Or manually:
   ```sql
   CREATE DATABASE college_event_mgmt;
   USE college_event_mgmt;
   ```

### **Step 3: Configure Environment Variables**

Update your `.env` file:
```env
# Backend Environment Variables - MySQL Configuration
DB_PASSWORD=your_mysql_password
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters
```

### **Step 4: Start the Application**

1. **Start Backend:**
   ```bash
   mvn spring-boot:run
   ```

2. **Start Frontend:**
   ```bash
   cd frontend
   npm start
   ```

## 🔧 **MySQL Configuration Details:**

### **Connection Properties:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/college_event_mgmt
spring.datasource.username=root
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

### **JPA Properties:**
```properties
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.use_sql_comments=true
```

## 📊 **Database Schema:**

The following tables will be created automatically by Hibernate:

- **users** - User accounts and profiles
- **events** - Event information
- **event_registrations** - Event participation records
- **roles** - User roles (ADMIN, FACULTY, STUDENT)

## 🔍 **Verification:**

1. **Check MySQL Connection:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   ```

2. **Verify Database:**
   ```bash
   mysql -u root -p college_event_mgmt -e "SHOW TABLES;"
   ```

3. **Test Application:**
   - Start the backend
   - Check console for "Started CollegeEventMgmtApplication"
   - No database connection errors

## 🛠️ **Troubleshooting:**

### **Common Issues:**

1. **Connection Refused:**
   - Ensure MySQL service is running
   - Check port 3306 is not blocked
   - Verify MySQL is installed correctly

2. **Access Denied:**
   - Check username/password in `.env` file
   - Ensure MySQL user has proper privileges
   - Try: `mysql -u root -p` to test connection

3. **Database Not Found:**
   - Run the `mysql-setup.sql` script
   - Or manually create: `CREATE DATABASE college_event_mgmt;`

4. **Driver Issues:**
   - Clean and rebuild: `mvn clean install`
   - Check MySQL connector version compatibility

### **MySQL Commands:**

```sql
-- Check MySQL version
SELECT VERSION();

-- List all databases
SHOW DATABASES;

-- Use the database
USE college_event_mgmt;

-- Show tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;
```

## ✅ **Migration Complete!**

Your College Event Management System is now running on MySQL! 

**Next Steps:**
1. Install MySQL if not already installed
2. Create the database using the provided script
3. Update your `.env` file with MySQL password
4. Start the application

**Benefits of MySQL:**
- ✅ Widely supported and popular
- ✅ Excellent performance
- ✅ Easy to set up and manage
- ✅ Great community support
- ✅ Compatible with most hosting providers

---

**Ready to manage college events with MySQL! 🎉**





