-- Create Database
CREATE DATABASE IF NOT EXISTS kebele_resident_file;
USE kebele_resident_file;

-- 1. Hierarchy Tables
CREATE TABLE Regions (
    region_id INT PRIMARY KEY AUTO_INCREMENT,
    region_name VARCHAR(255) NOT NULL,
    region_code VARCHAR(50) UNIQUE,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE Zones (
    zone_id INT PRIMARY KEY AUTO_INCREMENT,
    zone_name VARCHAR(255) NOT NULL,
    zone_code VARCHAR(50) UNIQUE,
    region_id INT,
    description TEXT,
    FOREIGN KEY (region_id) REFERENCES Regions(region_id)
) ENGINE=InnoDB;

CREATE TABLE Woredas (
    woreda_id INT PRIMARY KEY AUTO_INCREMENT,
    woreda_name VARCHAR(255) NOT NULL,
    woreda_code VARCHAR(50) UNIQUE,
    zone_id INT,
    description TEXT,
    FOREIGN KEY (zone_id) REFERENCES Zones(zone_id)
) ENGINE=InnoDB;

CREATE TABLE Kebeles (
    kebele_id INT PRIMARY KEY AUTO_INCREMENT,
    kebele_name VARCHAR(255) NOT NULL,
    kebele_code VARCHAR(50) UNIQUE,
    woreda_id INT,
    description TEXT,
    FOREIGN KEY (woreda_id) REFERENCES Woredas(woreda_id)
) ENGINE=InnoDB;

-- 2. Addresses & Users
CREATE TABLE Addresses (
    address_id INT PRIMARY KEY AUTO_INCREMENT,
    kebele_id INT,
    house_number VARCHAR(50),
    street_name VARCHAR(255),
    subcity VARCHAR(255),
    city VARCHAR(255),
    region_id INT,
    woreda_id INT,
    zone_id INT,
    postal_code VARCHAR(20),
    FOREIGN KEY (kebele_id) REFERENCES Kebeles(kebele_id),
    FOREIGN KEY (region_id) REFERENCES Regions(region_id),
    FOREIGN KEY (woreda_id) REFERENCES Woredas(woreda_id),
    FOREIGN KEY (zone_id) REFERENCES Zones(zone_id)
) ENGINE=InnoDB;

CREATE TABLE Users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    role ENUM('admin', 'staff', 'data_clerk') DEFAULT 'staff',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    last_password_change DATETIME,
    password_reset_token VARCHAR(255),
    password_reset_expiry DATETIME
) ENGINE=InnoDB;

-- 3. Families & Residents (Circular Dependency Fix)
CREATE TABLE Families (
    family_id INT PRIMARY KEY AUTO_INCREMENT,
    family_head_id INT,  -- FK added later
    family_name VARCHAR(255),
    address_id INT,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id)
) ENGINE=InnoDB;

CREATE TABLE Residents (
    resident_id INT PRIMARY KEY AUTO_INCREMENT,
    kebele_id INT,
    national_id VARCHAR(50) UNIQUE,
    first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    last_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    date_of_birth DATE,
    place_of_birth VARCHAR(255),
    nationality VARCHAR(255),
    marital_status ENUM('Single', 'Married', 'Divorced', 'Widowed'),
    occupation VARCHAR(255),
    education_level VARCHAR(255),
    phone_number VARCHAR(20),
    email_address VARCHAR(255),
    address_id INT,
    family_id INT,
    photo_path VARCHAR(255),
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    deceased BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (kebele_id) REFERENCES Kebeles(kebele_id),
    FOREIGN KEY (address_id) REFERENCES Addresses(address_id),
    FOREIGN KEY (family_id) REFERENCES Families(family_id)
) ENGINE=InnoDB;

-- Add Family Head Foreign Key After Residents Exist
ALTER TABLE Families
ADD FOREIGN KEY (family_head_id) REFERENCES Residents(resident_id);

-- 4. Relationships & Documents
CREATE TABLE FamilyRelationships (
    relationship_id INT PRIMARY KEY AUTO_INCREMENT,
    family_id INT,
    resident_id INT,
    related_resident_id INT,
    relationship_type ENUM('Parent', 'Child', 'Spouse', 'Sibling', 'Other'),
    start_date DATE,
    end_date DATE,
    FOREIGN KEY (family_id) REFERENCES Families(family_id),
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (related_resident_id) REFERENCES Residents(resident_id)
) ENGINE=InnoDB;

CREATE TABLE DocumentCategories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(255) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

CREATE TABLE Documents (
    document_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    category_id INT,
    document_name VARCHAR(255),
    document_type VARCHAR(255) NOT NULL,
    document_number VARCHAR(255),
    issuing_authority VARCHAR(255),
    issue_date DATE,
    expiry_date DATE,
    file_path VARCHAR(255),
    upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by INT,
    status ENUM('pending', 'approved', 'rejected', 'processing') DEFAULT 'pending',
    size_in_bytes BIGINT,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (category_id) REFERENCES DocumentCategories(category_id),
    FOREIGN KEY (uploaded_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

-- 5. Services & Events
CREATE TABLE ServiceTypes (
    service_type_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    required_documents TEXT
) ENGINE=InnoDB;

CREATE TABLE ServiceRequests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    service_type_id INT,
    request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'approved', 'processing', 'rejected') DEFAULT 'pending',
    details TEXT,
    processed_by INT,
    processing_date DATETIME,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (service_type_id) REFERENCES ServiceTypes(service_type_id),
    FOREIGN KEY (processed_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

CREATE TABLE Certificates (
    certificate_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    certificate_type VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    certificate_number VARCHAR(255),
    file_path VARCHAR(255),
    issued_by INT,
    issue_date_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (issued_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

CREATE TABLE EventTypes (
    event_type_id INT PRIMARY KEY AUTO_INCREMENT,
    event_type_name VARCHAR(255) UNIQUE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE Events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    event_type_id INT,
    event_date DATE NOT NULL,
    details TEXT,
    recorded_by VARCHAR(255),
    record_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (event_type_id) REFERENCES EventTypes(event_type_id)
) ENGINE=InnoDB;

-- 6. Death Records & Security
CREATE TABLE DeathRecords (
    death_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT UNIQUE,
    date_of_death DATE,
    cause_of_death VARCHAR(255),
    place_of_death VARCHAR(255),
    reported_by INT,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (reported_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

CREATE TABLE User_Kebele_Access (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    kebele_id INT,
    access_level ENUM('read', 'write', 'admin') DEFAULT 'read',
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (kebele_id) REFERENCES Kebeles(kebele_id)
) ENGINE=InnoDB;

-- 7. Notifications & GIS
CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    resident_id INT,
    event_type VARCHAR(255),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id)
) ENGINE=InnoDB;

CREATE TABLE GISData (
    gis_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address_details TEXT,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id)
) ENGINE=InnoDB;

-- 8. Reports & History
CREATE TABLE Reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    report_name VARCHAR(255) NOT NULL,
    report_description TEXT,
    report_type VARCHAR(255),
    generation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    generated_by INT,
    file_path VARCHAR(255),
    FOREIGN KEY (generated_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

CREATE TABLE AddressHistory (
    address_history_id INT PRIMARY KEY AUTO_INCREMENT,
    resident_id INT,
    old_address_id INT,
    new_address_id INT,
    change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_by INT,
    FOREIGN KEY (resident_id) REFERENCES Residents(resident_id),
    FOREIGN KEY (old_address_id) REFERENCES Addresses(address_id),
    FOREIGN KEY (new_address_id) REFERENCES Addresses(address_id),
    FOREIGN KEY (changed_by) REFERENCES Users(user_id)
) ENGINE=InnoDB;

-- 9. Audit Logs
CREATE TABLE AuditLogs (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(255) NOT NULL,
    table_name VARCHAR(255) NOT NULL,
    record_id INT,
    old_values TEXT,
    new_values TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
) ENGINE=InnoDB;

-- Optional: Add Indexes
CREATE INDEX idx_residents_national_id ON Residents(national_id);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_documents_resident ON Documents(resident_id);