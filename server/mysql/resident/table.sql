-- Select the database

CREATE database ginjo_kebele
USE ginjo_kebele;

-- 1. Create independent tables first
CREATE TABLE kebeles (
    code VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100),
    amharic_name VARCHAR(100),
    admin_officer_id INT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Create users without resident_id FK first
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'officer', 'resident') NOT NULL DEFAULT 'resident',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Create families without head_of_household_id FK
CREATE TABLE families (
    family_id INT AUTO_INCREMENT PRIMARY KEY,
    kebele_household_number VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Create residents with delayed FKs
CREATE TABLE residents (
    resident_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    last_name VARCHAR(50) NOT NULL,
    amharic_name VARCHAR(100),
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth VARCHAR(100),
    nationality VARCHAR(50) DEFAULT 'Ethiopian',
    occupation VARCHAR(100),
    photo_path VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_minor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Add foreign key constraints using ALTER TABLE
ALTER TABLE users 
ADD COLUMN resident_id INT UNIQUE,
ADD FOREIGN KEY (resident_id) REFERENCES residents(resident_id);

ALTER TABLE residents
ADD COLUMN family_id INT NOT NULL,
ADD COLUMN user_id INT UNIQUE,
ADD COLUMN created_by INT NOT NULL,
ADD FOREIGN KEY (family_id) REFERENCES families(family_id),
ADD FOREIGN KEY (user_id) REFERENCES users(id),
ADD FOREIGN KEY (created_by) REFERENCES users(id);

-- 6. Add remaining tables
CREATE TABLE addresses (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    resident_id INT NOT NULL,
    kebele_code VARCHAR(10) NOT NULL,
    sub_city VARCHAR(50),
    woreda VARCHAR(50),
    house_number VARCHAR(20),
    phone_number VARCHAR(20),
    email VARCHAR(100),
    is_current BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resident_id) REFERENCES residents(resident_id) ON DELETE CASCADE,
    FOREIGN KEY (kebele_code) REFERENCES kebeles(code),
    INDEX idx_resident_address (resident_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE families
ADD COLUMN head_of_household_id INT NOT NULL,
ADD COLUMN address_id INT,
ADD FOREIGN KEY (head_of_household_id) REFERENCES residents(resident_id),
ADD FOREIGN KEY (address_id) REFERENCES addresses(address_id);

-- Continue with other tables...
-- Removed redundant children table (use is_minor flag)
DROP TABLE IF EXISTS children;

-- Added kebele_code reference to kebeles table
ALTER TABLE addresses
ADD FOREIGN KEY (kebele_code) REFERENCES kebeles(code);

-- Proper indexing
CREATE INDEX idx_residents_family ON residents(family_id);
-- Ensure one family head per household
CREATE UNIQUE INDEX idx_unique_family_head 
ON families(head_of_household_id);Recommended Insertion Order:

kebeles

users (admin/officer accounts first)

families

residents

addresses

Update families with head_of_household_id

family_members

Other tables

This structure ensures:
✅ No circular dependencies
✅ Proper foreign key relationships
✅ Data integrity constraints
✅ Efficient query performance

-- Prevent duplicate household numbers
CREATE UNIQUE INDEX idx_unique_household_number
ON families(kebele_household_number);