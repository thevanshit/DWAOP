import Database from 'better-sqlite3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';

const DB_PATH = path.join(process.cwd(), 'data', 'dwaop.db');
const db = new Database(DB_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initializeDatabase() {
  db.exec(`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('student', 'teacher', 'admin', 'hod', 'auditor')),
      department_id TEXT,
      specialization TEXT,
      avatar TEXT,
      phone TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Departments table
    CREATE TABLE IF NOT EXISTS departments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      hod_id TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Subjects table
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      code TEXT NOT NULL,
      name TEXT NOT NULL,
      department_id TEXT REFERENCES departments(id),
      credits INTEGER DEFAULT 3,
      semester INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Batches table
    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      department_id TEXT REFERENCES departments(id),
      semester INTEGER NOT NULL,
      section TEXT,
      year INTEGER NOT NULL,
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Batch Students table
    CREATE TABLE IF NOT EXISTS batch_students (
      id TEXT PRIMARY KEY,
      batch_id TEXT REFERENCES batches(id),
      student_id TEXT REFERENCES users(id),
      roll_number TEXT,
      enrolled_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(batch_id, student_id)
    );

    -- Subject Teachers table
    CREATE TABLE IF NOT EXISTS subject_teachers (
      id TEXT PRIMARY KEY,
      subject_id TEXT REFERENCES subjects(id),
      teacher_id TEXT REFERENCES users(id),
      batch_id TEXT REFERENCES batches(id),
      academic_year TEXT NOT NULL,
      semester INTEGER NOT NULL,
      is_primary INTEGER DEFAULT 1,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(subject_id, teacher_id, batch_id, academic_year)
    );

    -- Workflows table (generic)
    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL CHECK(type IN ('attendance', 'assignment', 'marks', 'leave', 'task', 'track_report')),
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('created', 'in_progress', 'under_review', 'finalised', 'locked', 'done', 'delayed')),
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
      created_by TEXT REFERENCES users(id),
      assigned_to TEXT REFERENCES users(id),
      due_date TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Workflow History table
    CREATE TABLE IF NOT EXISTS workflow_history (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      from_status TEXT,
      to_status TEXT NOT NULL,
      changed_by TEXT REFERENCES users(id),
      comment TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Attendance Sessions table
    CREATE TABLE IF NOT EXISTS attendance_sessions (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      subject_id TEXT REFERENCES subjects(id),
      batch_id TEXT REFERENCES batches(id),
      teacher_id TEXT REFERENCES users(id),
      session_date TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('created', 'in_progress', 'finalised', 'locked')),
      total_students INTEGER DEFAULT 0,
      present_count INTEGER DEFAULT 0,
      absent_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Attendance Records table
    CREATE TABLE IF NOT EXISTS attendance_records (
      id TEXT PRIMARY KEY,
      session_id TEXT REFERENCES attendance_sessions(id) ON DELETE CASCADE,
      student_id TEXT REFERENCES users(id),
      status TEXT NOT NULL CHECK(status IN ('present', 'absent', 'late', 'excused')),
      marked_by TEXT REFERENCES users(id),
      marked_at TEXT,
      is_late INTEGER DEFAULT 0,
      notes TEXT,
      UNIQUE(session_id, student_id)
    );

    -- Assignments table
    CREATE TABLE IF NOT EXISTS assignments (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      subject_id TEXT REFERENCES subjects(id),
      batch_id TEXT REFERENCES batches(id),
      title TEXT NOT NULL,
      description TEXT,
      max_marks REAL NOT NULL,
      weightage REAL DEFAULT 10,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('created', 'in_progress', 'under_review', 'done', 'delayed')),
      allow_late_submission INTEGER DEFAULT 1,
      late_penalty_percent REAL DEFAULT 10,
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Submissions table
    CREATE TABLE IF NOT EXISTS submissions (
      id TEXT PRIMARY KEY,
      assignment_id TEXT REFERENCES assignments(id) ON DELETE CASCADE,
      student_id TEXT REFERENCES users(id),
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'submitted', 'late', 'evaluated', 'returned')),
      submitted_at TEXT,
      marks REAL,
      feedback TEXT,
      graded_by TEXT REFERENCES users(id),
      graded_at TEXT,
      file_url TEXT,
      notes TEXT,
      UNIQUE(assignment_id, student_id)
    );

    -- Marks table
    CREATE TABLE IF NOT EXISTS marks (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      subject_id TEXT REFERENCES subjects(id),
      batch_id TEXT REFERENCES batches(id),
      student_id TEXT REFERENCES users(id),
      academic_year TEXT NOT NULL,
      semester INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'under_review', 'finalised', 'locked')),
      total_marks REAL DEFAULT 0,
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(subject_id, student_id, academic_year, semester)
    );

    -- Mark Components table
    CREATE TABLE IF NOT EXISTS mark_components (
      id TEXT PRIMARY KEY,
      mark_id TEXT REFERENCES marks(id) ON DELETE CASCADE,
      component_type TEXT NOT NULL CHECK(component_type IN ('assignment', 'test', 'quiz', 'lab', 'attendance', 'project', 'other')),
      component_name TEXT NOT NULL,
      max_marks REAL NOT NULL,
      obtained_marks REAL DEFAULT 0,
      weightage REAL DEFAULT 0,
      is_exam INTEGER DEFAULT 0,
      evaluated_by TEXT REFERENCES users(id),
      evaluated_at TEXT,
      notes TEXT
    );

    -- Leave Requests table
    CREATE TABLE IF NOT EXISTS leave_requests (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      student_id TEXT REFERENCES users(id),
      leave_type TEXT NOT NULL CHECK(leave_type IN ('medical', 'academic', 'personal', 'emergency', 'official')),
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      reason TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('created', 'under_review', 'approved', 'rejected')),
      approved_by TEXT REFERENCES users(id),
      approved_at TEXT,
      documents TEXT,
      remarks TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Tasks table
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'created' CHECK(status IN ('created', 'in_progress', 'under_review', 'done', 'delayed')),
      priority TEXT DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high', 'critical')),
      category TEXT CHECK(category IN ('teaching', 'administrative', 'committee', 'exam', 'accreditation', 'research', 'events')),
      committee_name TEXT,
      assignee_id TEXT REFERENCES users(id),
      assigned_by TEXT REFERENCES users(id),
      due_date TEXT,
      estimated_hours REAL,
      logged_hours REAL DEFAULT 0,
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Subtasks table
    CREATE TABLE IF NOT EXISTS subtasks (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'in_progress', 'done')),
      assignee_id TEXT REFERENCES users(id),
      completed_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Task Comments table
    CREATE TABLE IF NOT EXISTS task_comments (
      id TEXT PRIMARY KEY,
      task_id TEXT REFERENCES tasks(id) ON DELETE CASCADE,
      user_id TEXT REFERENCES users(id),
      content TEXT NOT NULL,
      attachments TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Student Track Reports table
    CREATE TABLE IF NOT EXISTS track_reports (
      id TEXT PRIMARY KEY,
      workflow_id TEXT REFERENCES workflows(id) ON DELETE CASCADE,
      student_id TEXT REFERENCES users(id),
      semester INTEGER NOT NULL,
      academic_year TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'submitted', 'under_review', 'finalised', 'locked')),
      attendance_summary TEXT,
      assignment_summary TEXT,
      marks_summary TEXT,
      eligibility_status TEXT DEFAULT 'eligible' CHECK(eligibility_status IN ('eligible', 'at_risk', 'not_eligible')),
      risk_indicators TEXT,
      intervention_history TEXT,
      created_by TEXT REFERENCES users(id),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(student_id, semester, academic_year)
    );

    -- Notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info', 'success', 'warning', 'error', 'workflow')),
      category TEXT,
      reference_type TEXT,
      reference_id TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Audit Logs table
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id TEXT,
      old_value TEXT,
      new_value TEXT,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Refresh Tokens table
    CREATE TABLE IF NOT EXISTS refresh_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id),
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Database schema initialized');
}

export function seedDatabase() {
  const adminExists = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@dwaop.com');
  
  if (adminExists) {
    console.log('Database already seeded');
    return;
  }

  const passwordHash = bcrypt.hashSync('admin123', 10);

  const deptId = uuidv4();
  db.prepare(`INSERT INTO departments (id, name, code, description) VALUES (?, ?, ?, ?)`).run(
    deptId, 'Computer Science & Engineering', 'CSE', 'Department of Computer Science and Engineering'
  );

  const adminId = uuidv4();
  db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
    adminId, 'admin@dwaop.com', passwordHash, 'System', 'Administrator', 'admin', deptId, 'SA'
  );

  const hodId = uuidv4();
  db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, specialization, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    hodId, 'hod@cse.edu.in', passwordHash, 'Sarah', 'Chen', 'hod', deptId, 'Artificial Intelligence', 'SC'
  );

  const teacher1Id = uuidv4();
  db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, specialization, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    teacher1Id, 'teacher@cse.edu.in', passwordHash, 'Rahul', 'Kumar', 'teacher', deptId, 'Database Systems', 'RK'
  );

  const teacher2Id = uuidv4();
  db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, specialization, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    teacher2Id, 'emily@cse.edu.in', passwordHash, 'Emily', 'Watson', 'teacher', deptId, 'Machine Learning', 'EW'
  );

  const batchId = uuidv4();
  db.prepare(`INSERT INTO batches (id, name, department_id, semester, section, year) VALUES (?, ?, ?, ?, ?, ?)`).run(
    batchId, 'BTech CSE 2026', deptId, 4, 'A', 2026
  );

  const subjects = [
    { code: 'CS401', name: 'Operating Systems', credits: 4, semester: 4 },
    { code: 'CS402', name: 'Database Management Systems', credits: 4, semester: 4 },
    { code: 'CS403', name: 'Machine Learning', credits: 3, semester: 4 },
    { code: 'CS404', name: 'Computer Networks', credits: 3, semester: 4 },
    { code: 'CS405', name: 'Web Technologies', credits: 3, semester: 4 },
  ];

  const subjectIds: string[] = [];
  subjects.forEach(subj => {
    const subjectId = uuidv4();
    db.prepare(`INSERT INTO subjects (id, code, name, department_id, credits, semester) VALUES (?, ?, ?, ?, ?, ?)`).run(
      subjectId, subj.code, subj.name, deptId, subj.credits, subj.semester
    );
    subjectIds.push(subjectId);

    db.prepare(`INSERT INTO subject_teachers (id, subject_id, teacher_id, batch_id, academic_year, semester, is_primary) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(
      uuidv4(), subjectId, teacher1Id, batchId, '2025-26', 4, 1
    );
  });

  const studentIds: string[] = [];
  for (let i = 1; i <= 15; i++) {
    const studentId = uuidv4();
    const studentPasswordHash = bcrypt.hashSync('student123', 10);
    db.prepare(`INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      studentId, `student${i}@cse.edu.in`, studentPasswordHash, `Student`, `${i}`, 'student', deptId, `S${i}`
    );
    studentIds.push(studentId);

    db.prepare(`INSERT INTO batch_students (id, batch_id, student_id, roll_number) VALUES (?, ?, ?, ?)`).run(
      uuidv4(), batchId, studentId, `CSE26${String(i).padStart(2, '0')}`
    );
  }

  db.prepare(`UPDATE departments SET hod_id = ? WHERE id = ?`).run(hodId, deptId);

  console.log('Database seeded with sample data');
}

export default db;
