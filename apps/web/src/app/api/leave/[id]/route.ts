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

    const leave = db.prepare(`
      SELECT l.*, u.first_name as student_name, u.last_name as student_last_name, 
             u.email as student_email, u.avatar as student_avatar,
             a.first_name as approver_name
      FROM leave_requests l
      JOIN users u ON l.student_id = u.id
      LEFT JOIN users a ON l.approved_by = a.id
      WHERE l.id = ?
    `).get(params.id);

    if (!leave) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: leave });
  } catch (error: any) {
    console.error('Get leave request error:', error);
    return NextResponse.json({ error: 'Failed to get leave request' }, { status: 500 });
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

    if (!['teacher', 'hod', 'admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const leave = db.prepare('SELECT * FROM leave_requests WHERE id = ?').get(params.id) as any;
    if (!leave) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    if (leave.status !== 'created' && leave.status !== 'under_review') {
      return NextResponse.json({ error: 'Leave request already processed' }, { status: 400 });
    }

    const { status, remarks } = await request.json();

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Status must be approved or rejected' }, { status: 400 });
    }

    const approvedAt = new Date().toISOString();

    db.prepare(`
      UPDATE leave_requests 
      SET status = ?, approved_by = ?, approved_at = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(status, payload.userId, approvedAt, remarks || null, params.id);

    db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, leave.workflow_id);

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), leave.workflow_id, leave.status, status, payload.userId, `Leave ${status}`);

    if (status === 'approved') {
      const sessions = db.prepare(`
        SELECT id FROM attendance_sessions 
        WHERE session_date BETWEEN ? AND ?
      `).all(leave.start_date, leave.end_date);

      for (const session of sessions as any[]) {
        const existingRecord = db.prepare(`
          SELECT id FROM attendance_records 
          WHERE session_id = ? AND student_id = ?
        `).get(session.id, leave.student_id);

        if (!existingRecord) {
          db.prepare(`
            INSERT INTO attendance_records (id, session_id, student_id, status, marked_by, marked_at, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(uuidv4(), session.id, leave.student_id, 'excused', payload.userId, approvedAt, `Leave approved: ${remarks || 'Auto-excused'}`);
        } else {
          db.prepare(`
            UPDATE attendance_records 
            SET status = 'excused', marked_by = ?, marked_at = ?, notes = ?
            WHERE session_id = ? AND student_id = ?
          `).run(payload.userId, approvedAt, `Leave approved: ${remarks || 'Auto-excused'}`, session.id, leave.student_id);
        }
      }
    }

    const updated = db.prepare(`
      SELECT l.*, u.first_name as student_name, a.first_name as approver_name
      FROM leave_requests l
      JOIN users u ON l.student_id = u.id
      LEFT JOIN users a ON l.approved_by = a.id
      WHERE l.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update leave request error:', error);
    return NextResponse.json({ error: 'Failed to update leave request' }, { status: 500 });
  }
}
