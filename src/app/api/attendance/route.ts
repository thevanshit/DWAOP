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
    const date = searchParams.get('date');
    const status = searchParams.get('status');

    let query = `
      SELECT s.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as teacher_name
      FROM attendance_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN users u ON s.teacher_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (subjectId) {
      query += ' AND s.subject_id = ?';
      params.push(subjectId);
    }

    if (batchId) {
      query += ' AND s.batch_id = ?';
      params.push(batchId);
    }

    if (date) {
      query += ' AND s.session_date = ?';
      params.push(date);
    }

    if (status) {
      query += ' AND s.status = ?';
      params.push(status);
    }

    if (payload.role === 'teacher') {
      query += ' AND s.teacher_id = ?';
      params.push(payload.userId);
    }

    query += ' ORDER BY s.session_date DESC, s.start_time DESC';

    const sessions = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: sessions });
  } catch (error: any) {
    console.error('Get attendance sessions error:', error);
    return NextResponse.json({ error: 'Failed to get sessions' }, { status: 500 });
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

    const { subjectId, batchId, sessionDate, startTime, endTime } = await request.json();

    if (!subjectId || !batchId || !sessionDate || !startTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const workflowId = uuidv4();
    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, created_by, assigned_to, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      'attendance',
      `Attendance: ${sessionDate}`,
      `Attendance session for ${sessionDate}`,
      'created',
      payload.userId,
      payload.userId,
      sessionDate
    );

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), workflowId, null, 'created', payload.userId, 'Attendance session created');

    const studentCount = db.prepare(`
      SELECT COUNT(*) as count FROM batch_students WHERE batch_id = ?
    `).get(batchId) as { count: number };

    const sessionId = uuidv4();
    db.prepare(`
      INSERT INTO attendance_sessions (id, workflow_id, subject_id, batch_id, teacher_id, session_date, start_time, end_time, status, total_students)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sessionId, workflowId, subjectId, batchId, payload.userId, sessionDate, startTime, endTime || null, 'created', studentCount.count);

    const session = db.prepare(`
      SELECT s.*, sub.name as subject_name, b.name as batch_name
      FROM attendance_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN batches b ON s.batch_id = b.id
      WHERE s.id = ?
    `).get(sessionId);

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error: any) {
    console.error('Create attendance session error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
  }
}
