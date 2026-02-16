import Database from '@/config/database';
import { logger } from '@/utils/logger';

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface StudentFilters {
  batchId?: string;
  departmentId?: string;
  search?: string;
  status?: 'active' | 'inactive';
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface FacultyFilters {
  departmentId?: string;
  search?: string;
  role?: string;
}

export interface WorkflowFilters {
  type?: string;
  status?: string;
  assigneeId?: string;
  departmentId?: string;
  priority?: string;
  batchId?: string;
}

class DatabaseService {
  private db: Database;

  constructor() {
    this.db = Database.getInstance();
  }

  // ==================== USER OPERATIONS ====================

  async getUsers(filters: { role?: string; departmentId?: string; search?: string } & PaginationParams) {
    const { role, departmentId, search, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (role) {
      conditions.push(`role = $${paramIndex++}`);
      params.push(role);
    }

    if (departmentId) {
      conditions.push(`department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (search) {
      conditions.push(`(first_name ILIKE $${paramIndex} OR last_name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Get total count
    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM users WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Get paginated results
    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT id, email, first_name, last_name, role, department_id, employee_id, student_id, phone, avatar_url, is_active, created_at 
       FROM users WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getUserById(id: string) {
    const result = await this.db.query(
      `SELECT id, email, first_name, last_name, role, department_id, employee_id, student_id, phone, avatar_url, is_active, created_at 
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async getUserByEmail(email: string) {
    const result = await this.db.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  async createUser(userData: {
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role: string;
    department_id?: string;
    employee_id?: string;
    student_id?: string;
    phone?: string;
  }) {
    const result = await this.db.query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, department_id, employee_id, student_id, phone)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, email, first_name, last_name, role, department_id, employee_id, student_id, phone, created_at`,
      [
        userData.email,
        userData.password_hash,
        userData.first_name,
        userData.last_name,
        userData.role,
        userData.department_id || null,
        userData.employee_id || null,
        userData.student_id || null,
        userData.phone || null
      ]
    );
    return result.rows[0];
  }

  async updateUser(id: string, userData: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    avatar_url: string;
    is_active: boolean;
  }>) {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (userData.first_name) {
      updates.push(`first_name = $${paramIndex++}`);
      params.push(userData.first_name);
    }
    if (userData.last_name) {
      updates.push(`last_name = $${paramIndex++}`);
      params.push(userData.last_name);
    }
    if (userData.phone) {
      updates.push(`phone = $${paramIndex++}`);
      params.push(userData.phone);
    }
    if (userData.avatar_url !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      params.push(userData.avatar_url);
    }
    if (userData.is_active !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      params.push(userData.is_active);
    }

    if (updates.length === 0) return this.getUserById(id);

    params.push(id);
    const result = await this.db.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    return result.rows[0];
  }

  // ==================== STUDENT OPERATIONS ====================

  async getStudents(filters: StudentFilters & PaginationParams) {
    const { batchId, departmentId, search, status, riskLevel, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['u.role = \'student\''];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`sap.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex} OR u.student_id ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (status) {
      conditions.push(`u.is_active = $${paramIndex++}`);
      params.push(status === 'active');
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM users u 
       LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone, u.avatar_url, u.is_active, u.created_at,
              sap.batch_id, sap.current_semester, sap.cgpa, sap.eligibility_status, sap.risk_indicators
       FROM users u
       LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE ${whereClause}
       ORDER BY u.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getStudentById(id: string) {
    const result = await this.db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone, u.avatar_url, u.is_active, u.created_at,
              sap.batch_id, sap.current_semester, sap.cgpa, sap.eligibility_status, sap.risk_indicators,
              sap.total_credits
       FROM users u
       LEFT JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async getAtRiskStudents(departmentId?: string) {
    const conditions: string[] = ["sap.eligibility_status IN ('at_risk', 'not_eligible')"];
    const params: any[] = [];
    let paramIndex = 1;

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    const result = await this.db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.student_id, u.phone, u.avatar_url,
              sap.batch_id, sap.current_semester, sap.cgpa, sap.eligibility_status, sap.risk_indicators
       FROM users u
       INNER JOIN student_academic_profiles sap ON u.id = sap.student_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY sap.eligibility_status, u.first_name`,
      params
    );
    return result.rows;
  }

  // ==================== FACULTY OPERATIONS ====================

  async getFaculty(filters: FacultyFilters & PaginationParams) {
    const { departmentId, search, role, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['u.role IN (\'teacher\', \'hod\', \'admin\', \'guest_faculty\')'];
    const params: any[] = [];
    let paramIndex = 1;

    if (departmentId) {
      conditions.push(`u.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (role) {
      conditions.push(`u.role = $${paramIndex++}`);
      params.push(role);
    }

    if (search) {
      conditions.push(`(u.first_name ILIKE $${paramIndex} OR u.last_name ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM users u WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.employee_id, u.phone, u.avatar_url, u.is_active, u.created_at,
              d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE ${whereClause}
       ORDER BY u.role, u.first_name
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getFacultyById(id: string) {
    const result = await this.db.query(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.employee_id, u.phone, u.avatar_url, u.is_active, u.created_at,
              d.id as department_id, d.name as department_name
       FROM users u
       LEFT JOIN departments d ON u.department_id = d.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async getFacultyWorkload(facultyId: string) {
    // Get assigned batches and subjects
    const batchesResult = await this.db.query(
      `SELECT DISTINCT b.id, b.name, b.program, b.semester
       FROM batches b
       INNER JOIN student_subjects ss ON b.id = ss.batch_id
       WHERE ss.teacher_id = $1 AND b.is_active = true`,
      [facultyId]
    );

    const subjectsResult = await this.db.query(
      `SELECT s.id, s.code, s.name, s.credits
       FROM subjects s
       INNER JOIN student_subjects ss ON s.id = ss.subject_id
       WHERE ss.teacher_id = $1 AND s.is_active = true`,
      [facultyId]
    );

    // Get pending tasks count
    const tasksResult = await this.db.query(
      `SELECT COUNT(*) as pending_count
       FROM workflows
       WHERE assignee_id = $1 AND status NOT IN ('done', 'locked')`,
      [facultyId]
    );

    // Get pending marks
    const marksResult = await this.db.query(
      `SELECT COUNT(*) as pending_marks
       FROM internal_marks
       WHERE teacher_id = $1 AND status IN ('draft', 'submitted')`,
      [facultyId]
    );

    return {
      batches: batchesResult.rows,
      subjects: subjectsResult.rows,
      pendingTasks: parseInt(tasksResult.rows[0].pending_count),
      pendingMarks: parseInt(marksResult.rows[0].pending_marks)
    };
  }

  // ==================== DEPARTMENT OPERATIONS ====================

  async getDepartments() {
    const result = await this.db.query(
      `SELECT d.*, 
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'teacher') as faculty_count,
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'student') as student_count
       FROM departments d
       WHERE d.is_active = true
       ORDER BY d.name`
    );
    return result.rows;
  }

  async getDepartmentById(id: string) {
    const result = await this.db.query(
      `SELECT d.*, 
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'teacher') as faculty_count,
              (SELECT COUNT(*) FROM users WHERE department_id = d.id AND role = 'student') as student_count
       FROM departments d
       WHERE d.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // ==================== BATCH OPERATIONS ====================

  async getBatches(departmentId?: string) {
    const params: any[] = [];
    let query = `SELECT b.*, d.name as department_name, 
                 (SELECT COUNT(*) FROM users u 
                  INNER JOIN student_subjects ss ON u.id = ss.student_id 
                  WHERE ss.batch_id = b.id) as student_count
                 FROM batches b
                 LEFT JOIN departments d ON b.department_id = d.id
                 WHERE b.is_active = true`;

    if (departmentId) {
      query += ` AND b.department_id = $1`;
      params.push(departmentId);
    }

    query += ` ORDER BY b.academic_year DESC, b.semester DESC, b.name`;

    const result = await this.db.query(query, params);
    return result.rows;
  }

  async getBatchById(id: string) {
    const result = await this.db.query(
      `SELECT b.*, d.name as department_name
       FROM batches b
       LEFT JOIN departments d ON b.department_id = d.id
       WHERE b.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // ==================== SUBJECT OPERATIONS ====================

  async getSubjects(filters: { departmentId?: string; batchId?: string } & PaginationParams) {
    const { departmentId, batchId, page = 1, limit = 50 } = filters;
    const conditions: string[] = ['s.is_active = true'];
    const params: any[] = [];
    let paramIndex = 1;

    if (departmentId) {
      conditions.push(`s.department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM subjects s WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT s.*, d.name as department_name
       FROM subjects s
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE ${whereClause}
       ORDER BY s.code
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getSubjectById(id: string) {
    const result = await this.db.query(
      `SELECT s.*, d.name as department_name
       FROM subjects s
       LEFT JOIN departments d ON s.department_id = d.id
       WHERE s.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  // ==================== WORKFLOW OPERATIONS ====================

  async getWorkflows(filters: WorkflowFilters & PaginationParams) {
    const { type, status, assigneeId, departmentId, priority, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (type) {
      conditions.push(`type = $${paramIndex++}`);
      params.push(type);
    }

    if (status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (assigneeId) {
      conditions.push(`assignee_id = $${paramIndex++}`);
      params.push(assigneeId);
    }

    if (departmentId) {
      conditions.push(`department_id = $${paramIndex++}`);
      params.push(departmentId);
    }

    if (priority) {
      conditions.push(`priority = $${paramIndex++}`);
      params.push(priority);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM workflows WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT w.*, 
              u.first_name || ' ' || u.last_name as assignee_name,
              creator.first_name || ' ' || creator.last_name as creator_name
       FROM workflows w
       LEFT JOIN users u ON w.assignee_id = u.id
       LEFT JOIN users creator ON w.creator_id = creator.id
       WHERE ${whereClause}
       ORDER BY 
         CASE w.priority 
           WHEN 'critical' THEN 1 
           WHEN 'high' THEN 2 
           WHEN 'medium' THEN 3 
           ELSE 4 
         END,
         w.due_date ASC NULLS LAST,
         w.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getWorkflowById(id: string) {
    const result = await this.db.query(
      `SELECT w.*, 
              u.first_name || ' ' || u.last_name as assignee_name,
              creator.first_name || ' ' || creator.last_name as creator_name
       FROM workflows w
       LEFT JOIN users u ON w.assignee_id = u.id
       LEFT JOIN users creator ON w.creator_id = creator.id
       WHERE w.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createWorkflow(workflowData: {
    type: string;
    title: string;
    description?: string;
    creator_id: string;
    assignee_id?: string;
    department_id: string;
    priority?: string;
    due_date?: Date;
    metadata?: any;
  }) {
    const result = await this.db.query(
      `INSERT INTO workflows (type, title, description, creator_id, assignee_id, department_id, priority, due_date, metadata, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'created')
       RETURNING *`,
      [
        workflowData.type,
        workflowData.title,
        workflowData.description || null,
        workflowData.creator_id,
        workflowData.assignee_id || null,
        workflowData.department_id,
        workflowData.priority || 'medium',
        workflowData.due_date || null,
        JSON.stringify(workflowData.metadata || {})
      ]
    );
    return result.rows[0];
  }

  async updateWorkflowStatus(id: string, status: string, userId: string, reason?: string) {
    const result = await this.db.query(
      `UPDATE workflows SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );

    // Log the transition
    await this.db.query(
      `INSERT INTO workflow_transitions (workflow_id, to_status, transitioned_by, reason)
       VALUES ($1, $2, $3, $4)`,
      [id, status, userId, reason || null]
    );

    return result.rows[0];
  }

  // ==================== ATTENDANCE OPERATIONS ====================

  async getAttendanceSessions(filters: {
    batchId?: string;
    subjectId?: string;
    teacherId?: string;
    date?: string;
    status?: string;
  } & PaginationParams) {
    const { batchId, subjectId, teacherId, date, status, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`as.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (subjectId) {
      conditions.push(`as.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }

    if (teacherId) {
      conditions.push(`as.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }

    if (date) {
      conditions.push(`DATE(as.scheduled_date) = $${paramIndex++}`);
      params.push(date);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM attendance_sessions as WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT as.*, s.code as subject_code, s.name as subject_name, b.name as batch_name
       FROM attendance_sessions as
       LEFT JOIN subjects s ON as.subject_id = s.id
       LEFT JOIN batches b ON as.batch_id = b.id
       WHERE ${whereClause}
       ORDER BY as.scheduled_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getAttendanceSessionById(id: string) {
    const result = await this.db.query(
      `SELECT as.*, s.code as subject_code, s.name as subject_name, b.name as batch_name,
              t.first_name || ' ' || t.last_name as teacher_name
       FROM attendance_sessions as
       LEFT JOIN subjects s ON as.subject_id = s.id
       LEFT JOIN batches b ON as.batch_id = b.id
       LEFT JOIN users t ON as.teacher_id = t.id
       WHERE as.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createAttendanceSession(sessionData: {
    subject_id: string;
    batch_id: string;
    teacher_id: string;
    scheduled_date: Date;
    start_time?: Date;
    end_time?: Date;
    grace_period_minutes?: number;
    location?: string;
  }) {
    const result = await this.db.query(
      `INSERT INTO attendance_sessions (subject_id, batch_id, teacher_id, scheduled_date, start_time, end_time, grace_period_minutes, location)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        sessionData.subject_id,
        sessionData.batch_id,
        sessionData.teacher_id,
        sessionData.scheduled_date,
        sessionData.start_time || null,
        sessionData.end_time || null,
        sessionData.grace_period_minutes || 10,
        sessionData.location || null
      ]
    );
    return result.rows[0];
  }

  async markAttendance(records: {
    session_id: string;
    student_id: string;
    status: string;
    marked_at?: Date;
    marked_by?: string;
  }[]) {
    for (const record of records) {
      await this.db.query(
        `INSERT INTO attendance_records (session_id, student_id, status, marked_at, marked_by)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (session_id, student_id) DO UPDATE SET status = $3, marked_at = $4, marked_by = $5`,
        [
          record.session_id,
          record.student_id,
          record.status,
          record.marked_at || new Date(),
          record.marked_by || null
        ]
      );
    }
    return { success: true };
  }

  async getStudentAttendance(studentId: string, filters: { batchId?: string; subjectId?: string; startDate?: string; endDate?: string }) {
    const conditions: string[] = ['ar.student_id = $1'];
    const params: any[] = [studentId];
    let paramIndex = 2;

    if (filters.batchId) {
      conditions.push(`as.batch_id = $${paramIndex++}`);
      params.push(filters.batchId);
    }

    if (filters.subjectId) {
      conditions.push(`as.subject_id = $${paramIndex++}`);
      params.push(filters.subjectId);
    }

    if (filters.startDate) {
      conditions.push(`DATE(as.scheduled_date) >= $${paramIndex++}`);
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      conditions.push(`DATE(as.scheduled_date) <= $${paramIndex++}`);
      params.push(filters.endDate);
    }

    const result = await this.db.query(
      `SELECT ar.*, as.scheduled_date, as.subject_id, s.code as subject_code, s.name as subject_name
       FROM attendance_records ar
       INNER JOIN attendance_sessions as ON ar.session_id = as.id
       LEFT JOIN subjects s ON as.subject_id = s.id
       WHERE ${conditions.join(' AND ')}
       ORDER BY as.scheduled_date DESC`,
      params
    );
    return result.rows;
  }

  // ==================== ASSIGNMENT OPERATIONS ====================

  async getAssignments(filters: {
    batchId?: string;
    subjectId?: string;
    teacherId?: string;
    status?: string;
  } & PaginationParams) {
    const { batchId, subjectId, teacherId, status, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`a.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (subjectId) {
      conditions.push(`a.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }

    if (teacherId) {
      conditions.push(`a.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM assignments a WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT a.*, s.code as subject_code, s.name as subject_name, b.name as batch_name,
              t.first_name || ' ' || t.last_name as teacher_name,
              (SELECT COUNT(*) FROM assignment_submissions WHERE assignment_id = a.id) as submission_count
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN batches b ON a.batch_id = b.id
       LEFT JOIN users t ON a.teacher_id = t.id
       WHERE ${whereClause}
       ORDER BY a.submission_deadline DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getAssignmentById(id: string) {
    const result = await this.db.query(
      `SELECT a.*, s.code as subject_code, s.name as subject_name, b.name as batch_name,
              t.first_name || ' ' || t.last_name as teacher_name
       FROM assignments a
       LEFT JOIN subjects s ON a.subject_id = s.id
       LEFT JOIN batches b ON a.batch_id = b.id
       LEFT JOIN users t ON a.teacher_id = t.id
       WHERE a.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createAssignment(assignmentData: {
    subject_id: string;
    batch_id: string;
    teacher_id: string;
    title: string;
    description?: string;
    instructions?: string;
    max_marks: number;
    submission_deadline: Date;
    late_submission_allowed?: boolean;
    late_penalty_percentage?: number;
    rubric?: any;
  }) {
    const result = await this.db.query(
      `INSERT INTO assignments (subject_id, batch_id, teacher_id, title, description, instructions, max_marks, submission_deadline, late_submission_allowed, late_penalty_percentage, rubric)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        assignmentData.subject_id,
        assignmentData.batch_id,
        assignmentData.teacher_id,
        assignmentData.title,
        assignmentData.description || null,
        assignmentData.instructions || null,
        assignmentData.max_marks,
        assignmentData.submission_deadline,
        assignmentData.late_submission_allowed !== false,
        assignmentData.late_penalty_percentage || 0,
        JSON.stringify(assignmentData.rubric || {})
      ]
    );
    return result.rows[0];
  }

  async submitAssignment(submissionData: {
    assignment_id: string;
    student_id: string;
    submitted_at?: Date;
    is_late?: boolean;
    status?: string;
  }) {
    const assignment = await this.getAssignmentById(submissionData.assignment_id);
    const isLate = submissionData.submitted_at 
      ? new Date(submissionData.submitted_at) > new Date(assignment.submission_deadline)
      : new Date() > new Date(assignment.submission_deadline);

    const result = await this.db.query(
      `INSERT INTO assignment_submissions (assignment_id, student_id, submitted_at, is_late, status)
       VALUES ($1, $2, $3, $4, 'submitted')
       ON CONFLICT (assignment_id, student_id) DO UPDATE SET submitted_at = $3, is_late = $4, status = 'submitted', updated_at = NOW()
       RETURNING *`,
      [
        submissionData.assignment_id,
        submissionData.student_id,
        submissionData.submitted_at || new Date(),
        isLate || submissionData.is_late || false
      ]
    );
    return result.rows[0];
  }

  async evaluateSubmission(submissionId: string, marks: number, feedback: string, evaluatorId: string) {
    const result = await this.db.query(
      `UPDATE assignment_submissions 
       SET marks_obtained = $1, feedback = $2, evaluated_by = $3, evaluated_at = NOW(), status = 'evaluated', updated_at = NOW()
       WHERE id = $4
       RETURNING *`,
      [marks, feedback, evaluatorId, submissionId]
    );
    return result.rows[0];
  }

  async getAssignmentSubmissions(assignmentId: string) {
    const result = await this.db.query(
      `SELECT ast.*, u.first_name || ' ' || u.last_name as student_name, u.student_id
       FROM assignment_submissions ast
       INNER JOIN users u ON ast.student_id = u.id
       WHERE ast.assignment_id = $1
       ORDER BY ast.submitted_at DESC`,
      [assignmentId]
    );
    return result.rows;
  }

  // ==================== MARKS OPERATIONS ====================

  async getMarks(filters: {
    batchId?: string;
    subjectId?: string;
    studentId?: string;
    teacherId?: string;
    status?: string;
  } & PaginationParams) {
    const { batchId, subjectId, studentId, teacherId, status, page = 1, limit = 50 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (batchId) {
      conditions.push(`im.batch_id = $${paramIndex++}`);
      params.push(batchId);
    }

    if (subjectId) {
      conditions.push(`im.subject_id = $${paramIndex++}`);
      params.push(subjectId);
    }

    if (studentId) {
      conditions.push(`im.student_id = $${paramIndex++}`);
      params.push(studentId);
    }

    if (teacherId) {
      conditions.push(`im.teacher_id = $${paramIndex++}`);
      params.push(teacherId);
    }

    if (status) {
      conditions.push(`im.status = $${paramIndex++}`);
      params.push(status);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM internal_marks im WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT im.*, s.code as subject_code, s.name as subject_name, 
              u.first_name || ' ' || u.last_name as student_name, u.student_id,
              b.name as batch_name
       FROM internal_marks im
       LEFT JOIN subjects s ON im.subject_id = s.id
       LEFT JOIN users u ON im.student_id = u.id
       LEFT JOIN batches b ON im.batch_id = b.id
       WHERE ${whereClause}
       ORDER BY u.first_name, s.code
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async enterMarks(marksData: {
    student_id: string;
    subject_id: string;
    batch_id: string;
    teacher_id: string;
    assignment_marks?: number;
    test_marks?: number;
    attendance_marks?: number;
  }) {
    const total = (marksData.assignment_marks || 0) + (marksData.test_marks || 0) + (marksData.attendance_marks || 0);

    const result = await this.db.query(
      `INSERT INTO internal_marks (student_id, subject_id, batch_id, teacher_id, assignment_marks, test_marks, attendance_marks, total_marks, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'draft')
       ON CONFLICT (student_id, subject_id, batch_id) 
       DO UPDATE SET assignment_marks = $5, test_marks = $6, attendance_marks = $7, total_marks = $8, teacher_id = $4, updated_at = NOW()
       RETURNING *`,
      [
        marksData.student_id,
        marksData.subject_id,
        marksData.batch_id,
        marksData.teacher_id,
        marksData.assignment_marks || 0,
        marksData.test_marks || 0,
        marksData.attendance_marks || 0,
        total
      ]
    );
    return result.rows[0];
  }

  async updateMarksStatus(marksId: string, status: string) {
    const updateField = status === 'submitted' ? 'submitted_at' : 
                        status === 'finalised' ? 'finalised_at' : 
                        status === 'locked' ? 'locked_at' : null;

    let query = `UPDATE internal_marks SET status = $1, updated_at = NOW()`;
    if (updateField) {
      query += `, ${updateField} = NOW()`;
    }
    query += ` WHERE id = $2 RETURNING *`;

    const result = await this.db.query(query, [status, marksId]);
    return result.rows[0];
  }

  // ==================== LEAVE OPERATIONS ====================

  async getLeaveRequests(filters: {
    studentId?: string;
    status?: string;
    leaveType?: string;
  } & PaginationParams) {
    const { studentId, status, leaveType, page = 1, limit = 20 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (studentId) {
      conditions.push(`lr.student_id = $${paramIndex++}`);
      params.push(studentId);
    }

    if (status) {
      conditions.push(`lr.status = $${paramIndex++}`);
      params.push(status);
    }

    if (leaveType) {
      conditions.push(`lr.leave_type = $${paramIndex++}`);
      params.push(leaveType);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM leave_requests lr WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT lr.*, u.first_name || ' ' || u.last_name as student_name, u.student_id
       FROM leave_requests lr
       INNER JOIN users u ON lr.student_id = u.id
       WHERE ${whereClause}
       ORDER BY lr.created_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }

  async getLeaveRequestById(id: string) {
    const result = await this.db.query(
      `SELECT lr.*, u.first_name || ' ' || u.last_name as student_name, u.student_id
       FROM leave_requests lr
       INNER JOIN users u ON lr.student_id = u.id
       WHERE lr.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async createLeaveRequest(requestData: {
    student_id: string;
    leave_type: string;
    start_date: Date;
    end_date: Date;
    total_days: number;
    reason: string;
    supporting_documents?: string[];
    is_emergency?: boolean;
  }) {
    const result = await this.db.query(
      `INSERT INTO leave_requests (student_id, leave_type, start_date, end_date, total_days, reason, supporting_documents, is_emergency, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
       RETURNING *`,
      [
        requestData.student_id,
        requestData.leave_type,
        requestData.start_date,
        requestData.end_date,
        requestData.total_days,
        requestData.reason,
        requestData.supporting_documents || [],
        requestData.is_emergency || false
      ]
    );
    return result.rows[0];
  }

  async updateLeaveStatus(requestId: string, status: string, approverId: string, reason?: string) {
    const updateField = status === 'approved' ? 'approved_at' : 'rejection_reason';
    const approverField = status === 'approved' ? 'approved_by' : null;

    let query = `UPDATE leave_requests SET status = $1, updated_at = NOW()`;
    if (updateField === 'approved_at') {
      query += `, approved_at = NOW(), approved_by = $2`;
    } else if (reason) {
      query += `, rejection_reason = $2`;
    }
    query += ` WHERE id = $3 RETURNING *`;

    const result = await this.db.query(query, status === 'approved' ? [status, approverId, requestId] : [status, reason || null, requestId]);
    return result.rows[0];
  }

  // ==================== ANALYTICS OPERATIONS ====================

  async getDepartmentAnalytics(departmentId: string) {
    // Get overall department stats
    const stats = await this.db.query(
      `SELECT 
        (SELECT COUNT(*) FROM users WHERE department_id = $1 AND role = 'student' AND is_active = true) as total_students,
        (SELECT COUNT(*) FROM users WHERE department_id = $1 AND role IN ('teacher', 'hod') AND is_active = true) as total_faculty,
        (SELECT COUNT(*) FROM workflows WHERE department_id = $1 AND status NOT IN ('done', 'locked')) as active_workflows,
        (SELECT COUNT(*) FROM leave_requests WHERE status = 'pending') as pending_leaves`,
      [departmentId]
    );

    // Get attendance stats
    const attendanceStats = await this.db.query(
      `SELECT 
        COUNT(DISTINCT ar.student_id) as total_records,
        COUNT(*) FILTER (WHERE ar.status = 'present') as present_count,
        COUNT(*) FILTER (WHERE ar.status = 'absent') as absent_count,
        COUNT(*) FILTER (WHERE ar.status = 'late') as late_count
       FROM attendance_records ar
       INNER JOIN attendance_sessions ass ON ar.session_id = ass.id
       WHERE ass.department_id = $1`,
      [departmentId]
    );

    // Get at-risk students
    const atRiskCount = await this.db.query(
      `SELECT COUNT(*) FROM student_academic_profiles sap
       INNER JOIN users u ON sap.student_id = u.id
       WHERE u.department_id = $1 AND sap.eligibility_status IN ('at_risk', 'not_eligible')`,
      [departmentId]
    );

    return {
      ...stats.rows[0],
      attendance: attendanceStats.rows[0],
      at_risk_count: parseInt(atRiskCount.rows[0].count)
    };
  }

  async getAttendanceTrends(departmentId: string, weeks: number = 6) {
    const result = await this.db.query(
      `SELECT 
        DATE_TRUNC('week', ass.scheduled_date) as week,
        b.name as batch_name,
        COUNT(*) FILTER (WHERE ar.status = 'present') * 100.0 / NULLIF(COUNT(*), 0) as attendance_percentage
       FROM attendance_records ar
       INNER JOIN attendance_sessions ass ON ar.session_id = ass.id
       INNER JOIN batches b ON ass.batch_id = b.id
       WHERE ass.department_id = $1 
         AND ass.scheduled_date >= NOW() - INTERVAL '${weeks} weeks'
       GROUP BY DATE_TRUNC('week', ass.scheduled_date), b.name
       ORDER BY week, b.name`,
      [departmentId]
    );
    return result.rows;
  }

  async getBatchComparison(departmentId: string) {
    const result = await this.db.query(
      `SELECT 
        b.id, b.name, b.program, b.semester,
        COUNT(DISTINCT ss.student_id) as student_count,
        COALESCE(AVG(
          SELECT COUNT(*) FILTER (WHERE ar.status = 'present') * 100.0 / NULLIF(COUNT(*), 0)
          FROM attendance_records ar
          INNER JOIN attendance_sessions ass ON ar.session_id = ass.id
          WHERE ass.batch_id = b.id
        ), 0) as avg_attendance,
        COALESCE(AVG(im.total_marks), 0) as avg_marks
       FROM batches b
       LEFT JOIN student_subjects ss ON b.id = ss.batch_id
       LEFT JOIN internal_marks im ON b.id = im.batch_id
       WHERE b.department_id = $1 AND b.is_active = true
       GROUP BY b.id, b.name, b.program, b.semester
       ORDER BY b.semester, b.name`,
      [departmentId]
    );
    return result.rows;
  }

  // ==================== AUDIT LOG OPERATIONS ====================

  async createAuditLog(logData: {
    table_name: string;
    record_id: string;
    action: string;
    old_values?: any;
    new_values?: any;
    changed_by?: string;
    ip_address?: string;
    user_agent?: string;
    metadata?: any;
  }) {
    const result = await this.db.query(
      `INSERT INTO audit_logs (table_name, record_id, action, old_values, new_values, changed_by, ip_address, user_agent, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        logData.table_name,
        logData.record_id,
        logData.action,
        JSON.stringify(logData.old_values || {}),
        JSON.stringify(logData.new_values || {}),
        logData.changed_by || null,
        logData.ip_address || null,
        logData.user_agent || null,
        JSON.stringify(logData.metadata || {})
      ]
    );
    return result.rows[0];
  }

  async getAuditLogs(filters: {
    tableName?: string;
    recordId?: string;
    userId?: string;
    action?: string;
    startDate?: string;
    endDate?: string;
  } & PaginationParams) {
    const { tableName, recordId, userId, action, startDate, endDate, page = 1, limit = 50 } = filters;
    const conditions: string[] = ['1=1'];
    const params: any[] = [];
    let paramIndex = 1;

    if (tableName) {
      conditions.push(`table_name = $${paramIndex++}`);
      params.push(tableName);
    }

    if (recordId) {
      conditions.push(`record_id = $${paramIndex++}`);
      params.push(recordId);
    }

    if (userId) {
      conditions.push(`changed_by = $${paramIndex++}`);
      params.push(userId);
    }

    if (action) {
      conditions.push(`action = $${paramIndex++}`);
      params.push(action);
    }

    if (startDate) {
      conditions.push(`changed_at >= $${paramIndex++}`);
      params.push(startDate);
    }

    if (endDate) {
      conditions.push(`changed_at <= $${paramIndex++}`);
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    const countResult = await this.db.query(
      `SELECT COUNT(*) FROM audit_logs WHERE ${whereClause}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    const offset = (page - 1) * limit;
    const result = await this.db.query(
      `SELECT al.*, u.first_name || ' ' || u.last_name as user_name
       FROM audit_logs al
       LEFT JOIN users u ON al.changed_by = u.id
       WHERE ${whereClause}
       ORDER BY al.changed_at DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
      [...params, limit, offset]
    );

    return {
      data: result.rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  }
}

export default new DatabaseService();
