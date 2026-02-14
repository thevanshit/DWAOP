-- Seed Default Data
-- Run this SQL in your PostgreSQL database

-- 1. Seed Departments first (required for users)
INSERT INTO departments (id, name, code, description, is_active) VALUES
('d1000000-0000-0000-0000-000000000001', 'Computer Science', 'CS', 'Department of Computer Science & Engineering', true),
('d2000000-0000-0000-0000-000000000002', 'Electronics', 'ECE', 'Department of Electronics & Communication', true),
('d3000000-0000-0000-0000-000000000003', 'Mechanical', 'ME', 'Department of Mechanical Engineering', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Default Roles (if not exists)
INSERT INTO roles (name, display_name, description) VALUES
('admin', 'Administrator', 'System Administrator with full access'),
('teacher', 'Faculty', 'Academic staff with course management access'),
('student', 'Student', 'Enrolled student with limited access'),
('hod', 'Head of Department', 'Department head with oversight capabilities')
ON CONFLICT (name) DO NOTHING;

-- 3. Seed Users
-- Admin User
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  department_id, 
  is_active, 
  email_verified, 
  created_at, 
  updated_at
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'admin@dwaop.com',
  '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ', -- password: password123 (mock hash)
  'System',
  'Administrator',
  'admin',
  'd1000000-0000-0000-0000-000000000001',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Teacher User
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  department_id, 
  is_active, 
  email_verified, 
  created_at, 
  updated_at
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'teacher@dwaop.com',
  '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ',
  'John',
  'Smith',
  'teacher',
  'd2000000-0000-0000-0000-000000000002',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Student User
INSERT INTO users (
  id, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  department_id, 
  is_active, 
  email_verified, 
  created_at, 
  updated_at
) VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'student@dwaop.com',
  '$2b$10$rOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQjQjQjQjOzJqQjQjQjQjQ',
  'Alice',
  'Johnson',
  'student',
  'd3000000-0000-0000-0000-000000000003',
  true,
  true,
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;