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
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status');
    const leaveType = searchParams.get('leaveType');

    let query = `
      SELECT l.*, u.first_name as student_name, u.email as student_email, u.avatar as student_avatar,
             a.first_name as approver_name
      FROM leave_requests l
      JOIN users u ON l.student_id = u.id
      LEFT JOIN users a ON l.approved_by = a.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (studentId) {
      query += ' AND l.student_id = ?';
      params.push(studentId);
    }

    if (status) {
      query += ' AND l.status = ?';
      params.push(status);
    }

    if (leaveType) {
      query += ' AND l.leave_type = ?';
      params.push(leaveType);
    }

    if (payload.role === 'student') {
      query += ' AND l.student_id = ?';
      params.push(payload.userId);
    }

    query += ' ORDER BY l.created_at DESC';

    const leaves = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: leaves });
  } catch (error: any) {
    console.error('Get leave requests error:', error);
    return NextResponse.json({ error: 'Failed to get leave requests' }, { status: 500 });
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

    if (payload.role !== 'student') {
      return NextResponse.json({ error: 'Only students can submit leave requests' }, { status: 403 });
    }

    const { leaveType, startDate, endDate, reason, documents } = await request.json();

    if (!leaveType || !startDate || !endDate || !reason) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const workflowId = uuidv4();
    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, created_by, assigned_to)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      'leave',
      `Leave Request - ${leaveType}`,
      reason,
      'created',
      payload.userId,
      null
    );

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), workflowId, null, 'created', payload.userId, 'Leave request submitted');

    const leaveId = uuidv4();
    db.prepare(`
      INSERT INTO leave_requests (id, workflow_id, student_id, leave_type, start_date, end_date, reason, documents, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      leaveId, workflowId, payload.userId, leaveType, startDate, endDate, reason, 
      documents ? JSON.stringify(documents) : null, 'created'
    );

    const leave = db.prepare(`
      SELECT l.*, u.first_name as student_name
      FROM leave_requests l
      JOIN users u ON l.student_id = u.id
      WHERE l.id = ?
    `).get(leaveId);

    return NextResponse.json({ success: true, data: leave }, { status: 201 });
  } catch (error: any) {
    console.error('Create leave request error:', error);
    return NextResponse.json({ error: 'Failed to create leave request' }, { status: 500 });
  }
}
