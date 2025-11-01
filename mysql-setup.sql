-- MySQL Database Setup Script for College Event Management System
-- Run this script in MySQL to create the database

-- Create the database
CREATE DATABASE IF NOT EXISTS college_event_mgmt;

-- Use the database
USE college_event_mgmt;

-- Create a user for the application (optional - you can use root)
-- CREATE USER 'college_user'@'localhost' IDENTIFIED BY 'your_password';
-- GRANT ALL PRIVILEGES ON college_event_mgmt.* TO 'college_user'@'localhost';
-- FLUSH PRIVILEGES;

-- The tables will be created automatically by Hibernate when you start the application
-- with spring.jpa.hibernate.ddl-auto=update

-- Verify database creation
SHOW DATABASES;
SELECT DATABASE();





