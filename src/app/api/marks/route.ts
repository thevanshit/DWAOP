import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const batchId = searchParams.get('batchId');
    const studentId = searchParams.get('studentId');
    const academicYear = searchParams.get('academicYear');
    const semester = searchParams.get('semester');
    const status = searchParams.get('status');

    let query = `
      SELECT m.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as student_name, u.email as student_email
      FROM marks m
      LEFT JOIN subjects sub ON m.subject_id = sub.id
      LEFT JOIN batches b ON m.batch_id = b.id
      LEFT JOIN users u ON m.student_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (subjectId) {
      query += ' AND m.subject_id = ?';
      params.push(subjectId);
    }

    if (batchId) {
      query += ' AND m.batch_id = ?';
      params.push(batchId);
    }

    if (studentId) {
      query += ' AND m.student_id = ?';
      params.push(studentId);
    }

    if (academicYear) {
      query += ' AND m.academic_year = ?';
      params.push(academicYear);
    }

    if (semester) {
      query += ' AND m.semester = ?';
      params.push(semester);
    }

    if (status) {
      query += ' AND m.status = ?';
      params.push(status);
    }

    if (payload.role === 'student') {
      query += ' AND m.student_id = ?';
      params.push(payload.userId);
    }

    query += ' ORDER BY m.semester DESC, sub.name';

    const marks = db.prepare(query).all(...params);

    for (const mark of marks as any[]) {
      const components = db.prepare(`
        SELECT * FROM mark_components WHERE mark_id = ?
      `).all(mark.id);
      (mark as any).components = components;
    }

    return NextResponse.json({ success: true, data: marks });
  } catch (error: any) {
    console.error('Get marks error:', error);
    return NextResponse.json({ error: 'Failed to get marks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    if (!['teacher', 'hod', 'admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { subjectId, batchId, studentId, academicYear, semester, components } = await request.json();

    if (!subjectId || !batchId || !studentId || !academicYear || !semester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingMark = db.prepare(`
      SELECT id FROM marks WHERE subject_id = ? AND student_id = ? AND academic_year = ? AND semester = ?
    `).get(subjectId, studentId, academicYear, semester);

    let markId;
    if (existingMark) {
      markId = (existingMark as any).id;
    } else {
      const workflowId = uuidv4();
      db.prepare(`
        INSERT INTO workflows (id, type, title, description, status, created_by, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        workflowId,
        'marks',
        `Internal Marks - ${academicYear} Sem ${semester}`,
        `Internal marks for semester ${semester}`,
        'draft',
        payload.userId,
        null
      );

      markId = uuidv4();
      db.prepare(`
        INSERT INTO marks (id, workflow_id, subject_id, batch_id, student_id, academic_year, semester, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(markId, workflowId, subjectId, batchId, studentId, academicYear, semester, 'draft', payload.userId);
    }

    if (components && Array.isArray(components)) {
      for (const comp of components) {
        if (comp.id) {
          db.prepare(`
            UPDATE mark_components 
            SET obtained_marks = ?, weightage = ?, is_exam = ?, evaluated_by = ?, evaluated_at = ?, notes = ?
            WHERE id = ?
          `).run(comp.obtainedMarks, comp.weightage, comp.isExam ? 1 : 0, payload.userId, new Date().toISOString(), comp.notes || null, comp.id);
        } else {
          const compId = uuidv4();
          db.prepare(`
            INSERT INTO mark_components (id, mark_id, component_type, component_name, max_marks, obtained_marks, weightage, is_exam, evaluated_by, evaluated_at, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).run(compId, markId, comp.type, comp.name, comp.maxMarks, comp.obtainedMarks || 0, comp.weightage || 0, comp.isExam ? 1 : 0, payload.userId, new Date().toISOString(), comp.notes || null);
        }
      }
    }

    const totalMarks = db.prepare(`
      SELECT SUM(obtained_marks * weightage / 100) as total FROM mark_components WHERE mark_id = ?
    `).get(markId) as { total: number };

    db.prepare('UPDATE marks SET total_marks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(totalMarks.total || 0, markId);

    const mark = db.prepare(`
      SELECT m.*, sub.name as subject_name, b.name as batch_name, u.first_name as student_name
      FROM marks m
      LEFT JOIN subjects sub ON m.subject_id = sub.id
      LEFT JOIN batches b ON m.batch_id = b.id
      LEFT JOIN users u ON m.student_id = u.id
      WHERE m.id = ?
    `).get(markId);

    return NextResponse.json({ success: true, data: mark });
  } catch (error: any) {
    console.error('Create marks error:', error);
    return NextResponse.json({ error: 'Failed to create marks' }, { status: 500 });
  }
}
