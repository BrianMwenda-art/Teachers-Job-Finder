-- Create database
CREATE DATABASE IF NOT EXISTS teacher_portal;
USE teacher_portal;

-- Schools table
CREATE TABLE schools (
    school_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    district VARCHAR(50),
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    website VARCHAR(100),
    description TEXT
);

-- Subjects table
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50)
);

-- Vacancies table
CREATE TABLE vacancies (
    vacancy_id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    subject_id INT NOT NULL,
    position_type ENUM('Full-time', 'Part-time', 'Temporary'),
    posted_date DATE,
    closing_date DATE,
    requirements TEXT,
    status ENUM('Open', 'Filled', 'Closed'),
    FOREIGN KEY (school_id) REFERENCES schools(school_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Sample data
INSERT INTO schools (name, district) VALUES 
('Greenwood High', 'North'),
('Riverside Academy', 'South');

INSERT INTO subjects (name) VALUES 
('Mathematics'),
('Science'),
('English');

INSERT INTO vacancies (school_id, subject_id, position_type, posted_date, requirements, status) VALUES
(1, 1, 'Full-time', '2023-10-15', 'Bachelor degree in Math required', 'Open'),
(2, 2, 'Part-time', '2023-10-10', '2+ years teaching experience', 'Open');