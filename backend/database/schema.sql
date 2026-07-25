-- Department Workflow Platform Database Schema
-- Department Workflow & Academic Operations Platform

-- Drop all tables in the correct order (for development)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS workflow_comments CASCADE;
DROP TABLE IF EXISTS workflow_attachments CASCADE;
DROP TABLE IF EXISTS workflow_transitions CASCADE;
DROP TABLE IF EXISTS student_track_reports CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS attendance_sessions CASCADE;
DROP TABLE IF EXISTS workflows CASCADE;
DROP TABLE IF EXISTS leave_requests CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS internal_marks CASCADE;
DROP TABLE IF EXISTS student_subjects CASCADE;
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS batches CASCADE;
DROP TABLE IF EXISTS student_academic_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS role_permissions CASCADE;

-- Drop Enums
DROP TYPE IF EXISTS workflow_type CASCADE;
DROP TYPE IF EXISTS workflow_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS leave_type CASCADE;
DROP TYPE IF EXISTS eligibility_status CASCADE;

-- Enums for workflow states and types
CREATE TYPE workflow_type AS ENUM (
    'attendance_session',
    'assignment',
    'internal_marks',
    'leave_request',
    'student_track_report'
);

CREATE TYPE workflow_status AS ENUM (
    'created',
    'under_review',
    'approved',
    'rejected',
    'locked'
);

CREATE TYPE user_role AS ENUM (
    'student',
    'teacher', 
    'admin',
    'guest_faculty',
    'hod',
    'dept_admin',
    'registrar',
    'auditor'
);

CREATE TYPE leave_type AS ENUM (
    'medical',
    'academic',
    'personal', 
    'emergency',
    'official'
);

CREATE TYPE eligibility_status AS ENUM (
    'eligible',
    'at_risk',
    'not_eligible'
);

-- Core Tables

-- Permissions Table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    resource VARCHAR(100) NOT NULL,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Roles Table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name user_role UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Role Permissions Junction Table
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- Departments Table
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    hod_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
DROP TABLE IF EXISTS refresh_tokens CASCADE;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    department_id UUID REFERENCES departments(id),
    employee_id VARCHAR(50),
    student_id VARCHAR(50),
    phone VARCHAR(20),
    avatar_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);

-- Batches Table
CREATE TABLE batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    program VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    section VARCHAR(50),
    academic_year VARCHAR(20) NOT NULL,
    department_id UUID REFERENCES departments(id),
    strength INTEGER DEFAULT 0,
    cr_boy_id UUID REFERENCES users(id),
    cr_girl_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subjects Table
CREATE TABLE subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    department_id UUID REFERENCES departments(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Academic Profiles Table
CREATE TABLE student_academic_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id),
    current_semester INTEGER NOT NULL,
    cgpa DECIMAL(3,2),
    total_credits INTEGER DEFAULT 0,
    eligibility_status eligibility_status DEFAULT 'eligible',
    risk_indicators TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, batch_id)
);

-- Student Subjects Junction Table
CREATE TABLE student_subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id),
    teacher_id UUID REFERENCES users(id),
    is_active BOOLEAN DEFAULT true,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, batch_id)
);

-- Workflow Engine Core Tables

-- Workflows Table
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type workflow_type NOT NULL,
    status workflow_status DEFAULT 'created',
    title VARCHAR(500) NOT NULL,
    description TEXT,
    creator_id UUID REFERENCES users(id) NOT NULL,
    assignee_id UUID REFERENCES users(id),
    department_id UUID REFERENCES departments(id) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    finalized_at TIMESTAMP WITH TIME ZONE,
    locked_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_workflows_type ON workflows(type);
CREATE INDEX idx_workflows_status ON workflows(status);
CREATE INDEX idx_workflows_assignee ON workflows(assignee_id);
CREATE INDEX idx_workflows_department ON workflows(department_id);
CREATE INDEX idx_workflows_due_date ON workflows(due_date);

-- Workflow Transitions Table (Audit Trail)
CREATE TABLE workflow_transitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    from_status workflow_status,
    to_status workflow_status NOT NULL,
    transitioned_by UUID REFERENCES users(id) NOT NULL,
    reason TEXT,
    transitioned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_transitions_workflow ON workflow_transitions(workflow_id);
CREATE INDEX idx_transitions_user ON workflow_transitions(transitioned_by);

-- Workflow Comments Table
CREATE TABLE workflow_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    commenter_id UUID REFERENCES users(id) NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_workflow ON workflow_comments(workflow_id);
CREATE INDEX idx_comments_commenter ON workflow_comments(commenter_id);

-- Workflow Attachments Table
CREATE TABLE workflow_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    uploader_id UUID REFERENCES users(id) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_workflow ON workflow_attachments(workflow_id);
CREATE INDEX idx_attachments_uploader ON workflow_attachments(uploader_id);

-- Specific Workflow Type Tables

-- Attendance Sessions Table
CREATE TABLE attendance_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    batch_id UUID REFERENCES batches(id),
    teacher_id UUID REFERENCES users(id),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE,
    end_time TIMESTAMP WITH TIME ZONE,
    total_students INTEGER DEFAULT 0,
    present_students INTEGER DEFAULT 0,
    absent_students INTEGER DEFAULT 0,
    grace_period_minutes INTEGER DEFAULT 10,
    location VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Attendance Records Table (Student-wise attendance)
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES attendance_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL, -- 'present', 'absent', 'late', 'excused'
    marked_at TIMESTAMP WITH TIME ZONE,
    marked_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    unique(session_id, student_id)
);

CREATE INDEX idx_attendance_session ON attendance_records(session_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id);

-- Assignments Table
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    batch_id UUID REFERENCES batches(id),
    teacher_id UUID REFERENCES users(id),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    instructions TEXT,
    max_marks INTEGER NOT NULL,
    submission_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    late_submission_allowed BOOLEAN DEFAULT true,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0,
    rubric JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assignment Submissions Table
CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES workflows(id),
    submitted_at TIMESTAMP WITH TIME ZONE,
    is_late BOOLEAN DEFAULT false,
    late_duration_minutes INTEGER DEFAULT 0,
    marks_obtained INTEGER,
    max_marks INTEGER,
    feedback TEXT,
    evaluated_by UUID REFERENCES users(id),
    evaluated_at TIMESTAMP WITH TIME ZONE,
    plagiarism_score DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'not_submitted', -- 'not_submitted', 'submitted', 'evaluated', 'returned'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);

-- Internal Marks Table
CREATE TABLE internal_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id),
    batch_id UUID REFERENCES batches(id),
    teacher_id UUID REFERENCES users(id),
    assignment_marks INTEGER DEFAULT 0,
    test_marks INTEGER DEFAULT 0,
    attendance_marks INTEGER DEFAULT 0,
    total_marks INTEGER DEFAULT 0,
    max_assignment_marks INTEGER DEFAULT 40,
    max_test_marks INTEGER DEFAULT 40,
    max_attendance_marks INTEGER DEFAULT 20,
    max_total_marks INTEGER DEFAULT 100,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'finalised', 'locked'
    submitted_at TIMESTAMP WITH TIME ZONE,
    finalised_at TIMESTAMP WITH TIME ZONE,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, batch_id)
);

CREATE INDEX idx_internal_marks_student ON internal_marks(student_id);
CREATE INDEX idx_internal_marks_subject ON internal_marks(subject_id);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leave_type leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    supporting_documents TEXT[],
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'emergency'
    is_emergency BOOLEAN DEFAULT false,
    emergency_contacted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Student Track Reports Table
CREATE TABLE student_track_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES users(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES batches(id),
    semester VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'under_review', 'finalised', 'locked'
    overall_attendance_percentage DECIMAL(5,2) DEFAULT 0,
    assignments_completed INTEGER DEFAULT 0,
    total_assignments INTEGER DEFAULT 0,
    internal_marks_average DECIMAL(5,2) DEFAULT 0,
    eligibility_status eligibility_status DEFAULT 'eligible',
    risk_indicators TEXT[],
    attendance_data JSONB DEFAULT '{}', -- subject-wise attendance
    assignment_data JSONB DEFAULT '{}', -- assignment records
    marks_data JSONB DEFAULT '{}', -- internal marks data
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    finalised_at TIMESTAMP WITH TIME ZONE,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, batch_id, semester)
);

CREATE INDEX idx_track_reports_student ON student_track_reports(student_id);
CREATE INDEX idx_track_reports_status ON student_track_reports(status);

-- Audit Logs Table (Immutable History)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    old_values JSONB,
    new_values JSONB,
    changed_by UUID REFERENCES users(id),
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

CREATE INDEX idx_audit_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_user ON audit_logs(changed_by);
CREATE INDEX idx_audit_changed_at ON audit_logs(changed_at);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_workflows_creator ON workflows(creator_id);
CREATE INDEX idx_workflows_type_status ON workflows(type, status);
CREATE INDEX idx_audit_logs_table_record_action ON audit_logs(table_name, record_id, action);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_batches_updated_at BEFORE UPDATE ON batches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subjects_updated_at BEFORE UPDATE ON subjects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_academic_profiles_updated_at BEFORE UPDATE ON student_academic_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflows_updated_at BEFORE UPDATE ON workflows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workflow_comments_updated_at BEFORE UPDATE ON workflow_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_assignment_submissions_updated_at BEFORE UPDATE ON assignment_submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_internal_marks_updated_at BEFORE UPDATE ON internal_marks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_student_track_reports_updated_at BEFORE UPDATE ON student_track_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), OLD.updated_by);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NEW.updated_by);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW), NEW.created_by);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to critical tables
-- CREATE TRIGGER audit_users_trigger AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_workflows_trigger AFTER INSERT OR UPDATE OR DELETE ON workflows FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_attendance_sessions_trigger AFTER INSERT OR UPDATE OR DELETE ON attendance_sessions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_assignments_trigger AFTER INSERT OR UPDATE OR DELETE ON assignments FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_internal_marks_trigger AFTER INSERT OR UPDATE OR DELETE ON internal_marks FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_leave_requests_trigger AFTER INSERT OR UPDATE OR DELETE ON leave_requests FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
-- CREATE TRIGGER audit_student_track_reports_trigger AFTER INSERT OR UPDATE OR DELETE ON student_track_reports FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create Row Level Security (RLS) for multi-tenant data isolation
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE internal_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_track_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples - these should be refined based on actual business rules)
CREATE POLICY workflows_isolation ON workflows FOR ALL TO public USING (department_id = current_setting('app.current_department_id', true)::UUID);
CREATE POLICY workflow_comments_isolation ON workflow_comments FOR ALL TO public USING (workflow_id IN (SELECT id FROM workflows WHERE department_id = current_setting('app.current_department_id', true)::UUID));

-- Add comments for documentation
COMMENT ON TABLE workflows IS 'Core workflow table for all departmental processes';
COMMENT ON TABLE workflow_transitions IS 'Immutable audit trail of all workflow state changes';
COMMENT ON TABLE audit_logs IS 'System-wide immutable audit log for compliance and governance';
COMMENT ON TABLE student_track_reports IS 'Comprehensive student academic progress tracking workflow';