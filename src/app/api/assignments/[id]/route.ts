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

    const assignment = db.prepare(`
      SELECT a.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as creator_name
      FROM assignments a
      LEFT JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN batches b ON a.batch_id = b.id
      LEFT JOIN users u ON a.created_by = u.id
      WHERE a.id = ?
    `).get(params.id) as any;

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const submissions = db.prepare(`
      SELECT s.*, u.first_name, u.last_name, u.email, u.avatar
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = ?
      ORDER BY s.submitted_at DESC
    `).all(params.id);

    return NextResponse.json({
      success: true,
      data: { ...assignment, submissions }
    });
  } catch (error: any) {
    console.error('Get assignment error:', error);
    return NextResponse.json({ error: 'Failed to get assignment' }, { status: 500 });
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

    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(params.id) as any;
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const { status, title, description, maxMarks, weightage, deadline } = await request.json();

    if (status) {
      const allowedStatuses = ['created', 'in_progress', 'under_review', 'done', 'delayed'];
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }

      if (assignment.status === 'done' && status !== 'delayed') {
        return NextResponse.json({ error: 'Cannot change status from done' }, { status: 400 });
      }

      db.prepare('UPDATE assignments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, params.id);
      db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, assignment.workflow_id);

      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), assignment.workflow_id, assignment.status, status, payload.userId, `Status changed to ${status}`);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (maxMarks !== undefined) { updates.push('max_marks = ?'); values.push(maxMarks); }
    if (weightage !== undefined) { updates.push('weightage = ?'); values.push(weightage); }
    if (deadline !== undefined) { updates.push('deadline = ?'); values.push(deadline); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(params.id);
      db.prepare(`UPDATE assignments SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare(`
      SELECT a.*, sub.name as subject_name, b.name as batch_name
      FROM assignments a
      LEFT JOIN subjects sub ON a.subject_id = sub.id
      LEFT JOIN batches b ON a.batch_id = b.id
      WHERE a.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update assignment error:', error);
    return NextResponse.json({ error: 'Failed to update assignment' }, { status: 500 });
  }
}
