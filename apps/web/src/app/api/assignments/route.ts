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
    const status = searchParams.get('status');

    let query = `
      SELECT a.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as creator_name
      FROM assignments a
      LEFT JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN batches b ON a.batch_id = b.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (subjectId) {
      query += ' AND a.subject_id = ?';
      params.push(subjectId);
    }

    if (batchId) {
      query += ' AND a.batch_id = ?';
      params.push(batchId);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (payload.role === 'teacher') {
      query += ' AND a.created_by = ?';
      params.push(payload.userId);
    }

    query += ' ORDER BY a.deadline DESC';

    const assignments = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: assignments });
  } catch (error: any) {
    console.error('Get assignments error:', error);
    return NextResponse.json({ error: 'Failed to get assignments' }, { status: 500 });
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

    const { subjectId, batchId, title, description, maxMarks, weightage, deadline, allowLateSubmission, latePenaltyPercent } = await request.json();

    if (!subjectId || !batchId || !title || !maxMarks || !deadline) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const workflowId = uuidv4();
    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, created_by, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      'assignment',
      title,
      description || null,
      'created',
      payload.userId,
      deadline
    );

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), workflowId, null, 'created', payload.userId, 'Assignment created');

    const assignmentId = uuidv4();
    db.prepare(`
      INSERT INTO assignments (id, workflow_id, subject_id, batch_id, title, description, max_marks, weightage, deadline, status, allow_late_submission, late_penalty_percent, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      assignmentId, workflowId, subjectId, batchId, title, description || null, 
      maxMarks, weightage || 10, deadline, 'created', 
      allowLateSubmission !== false ? 1 : 0, latePenaltyPercent || 10, payload.userId
    );

    const assignment = db.prepare(`
      SELECT a.*, sub.name as subject_name, b.name as batch_name
      FROM assignments a
      LEFT JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN batches b ON a.batch_id = b.id
      WHERE a.id = ?
    `).get(assignmentId);

    return NextResponse.json({ success: true, data: assignment }, { status: 201 });
  } catch (error: any) {
    console.error('Create assignment error:', error);
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 });
  }
}
