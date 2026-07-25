import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const session = db.prepare(`
      SELECT s.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as teacher_name
      FROM attendance_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN users u ON s.teacher_id = u.id
      WHERE s.id = ?
    `).get(params.id) as any;

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const students = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.avatar, bs.roll_number,
             ar.status as attendance_status, ar.id as record_id, ar.marked_at
      FROM batch_students bs
      JOIN users u ON bs.student_id = u.id
      LEFT JOIN attendance_records ar ON ar.session_id = ? AND ar.student_id = u.id
      WHERE bs.batch_id = ?
      ORDER BY bs.roll_number
    `).all(params.id, session.batch_id);

    return NextResponse.json({
      success: true,
      data: { ...session, students }
    });
  } catch (error: any) {
    console.error('Get attendance session error:', error);
    return NextResponse.json({ error: 'Failed to get session' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const session = db.prepare('SELECT * FROM attendance_sessions WHERE id = ?').get(params.id) as any;
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    const { status, records } = await request.json();

    if (status) {
      if (!['created', 'in_progress', 'finalised', 'locked'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      if (session.status === 'locked') {
        return NextResponse.json({ error: 'Session is locked' }, { status: 400 });
      }

      const statusOrder = ['created', 'in_progress', 'finalised', 'locked'];
      const currentIndex = statusOrder.indexOf(session.status);
      const newIndex = statusOrder.indexOf(status);

      if (newIndex <= currentIndex && session.status !== status) {
        return NextResponse.json({ error: 'Cannot revert status' }, { status: 400 });
      }

      db.prepare('UPDATE attendance_sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, params.id);
      db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, session.workflow_id);

      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), session.workflow_id, session.status, status, payload.userId, `Status changed to ${status}`);
    }

    if (records && Array.isArray(records)) {
      if (session.status === 'locked') {
        return NextResponse.json({ error: 'Session is locked, cannot modify records' }, { status: 400 });
      }

      if (session.status === 'created') {
        db.prepare('UPDATE attendance_sessions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('in_progress', params.id);
        db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('in_progress', session.workflow_id);
      }

      const markedAt = new Date().toISOString();

      for (const record of records) {
        const existing = db.prepare('SELECT id FROM attendance_records WHERE session_id = ? AND student_id = ?').get(params.id, record.studentId);

        if (existing) {
          db.prepare(`
            UPDATE attendance_records 
            SET status = ?, marked_by = ?, marked_at = ?, is_late = ?, notes = ?
            WHERE session_id = ? AND student_id = ?
          `).run(record.status, payload.userId, markedAt, record.isLate ? 1 : 0, record.notes || null, params.id, record.studentId);
        } else {
          db.prepare(`
            INSERT INTO attendance_records (id, session_id, student_id, status, marked_by, marked_at, is_late, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `).run(uuidv4(), params.id, record.studentId, record.status, payload.userId, markedAt, record.isLate ? 1 : 0, record.notes || null);
        }
      }

      const stats = db.prepare(`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present,
          SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent,
          SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late,
          SUM(CASE WHEN status = 'excused' THEN 1 ELSE 0 END) as excused
        FROM attendance_records WHERE session_id = ?
      `).get(params.id) as any;

      db.prepare(`
        UPDATE attendance_sessions 
        SET present_count = ?, absent_count = ?, total_students = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(stats.present || 0, stats.absent || 0, stats.total, params.id);
    }

    const updatedSession = db.prepare(`
      SELECT s.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as teacher_name
      FROM attendance_sessions s
      LEFT JOIN subjects sub ON s.subject_id = sub.id
      LEFT JOIN batches b ON s.batch_id = b.id
      LEFT JOIN users u ON s.teacher_id = u.id
      WHERE s.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updatedSession });
  } catch (error: any) {
    console.error('Update attendance session error:', error);
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 });
  }
}
