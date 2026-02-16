import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

const MARK_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['finalised'],
  finalised: ['locked']
};

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

    const mark = db.prepare(`
      SELECT m.*, sub.name as subject_name, sub.code as subject_code, 
             b.name as batch_name, u.first_name as student_name, u.email as student_email,
             u.avatar as student_avatar
      FROM marks m
      LEFT JOIN subjects sub ON m.subject_id = sub.id
      LEFT JOIN batches b ON m.batch_id = b.id
      LEFT JOIN users u ON m.student_id = u.id
      WHERE m.id = ?
    `).get(params.id) as any;

    if (!mark) {
      return NextResponse.json({ error: 'Marks record not found' }, { status: 404 });
    }

    const components = db.prepare(`
      SELECT * FROM mark_components WHERE mark_id = ?
    `).all(params.id);

    const allowedTransitions = MARK_STATUS_TRANSITIONS[mark.status] || [];

    return NextResponse.json({
      success: true,
      data: { ...mark, components, allowedTransitions }
    });
  } catch (error: any) {
    console.error('Get marks error:', error);
    return NextResponse.json({ error: 'Failed to get marks' }, { status: 500 });
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

    const mark = db.prepare('SELECT * FROM marks WHERE id = ?').get(params.id) as any;
    if (!mark) {
      return NextResponse.json({ error: 'Marks record not found' }, { status: 404 });
    }

    if (mark.status === 'locked') {
      return NextResponse.json({ error: 'Marks are locked' }, { status: 400 });
    }

    const { status, components } = await request.json();

    if (status) {
      const allowedTransitions = MARK_STATUS_TRANSITIONS[mark.status] || [];
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json({ 
          error: `Cannot transition from ${mark.status} to ${status}` 
        }, { status: 400 });
      }

      if (status === 'locked' && !['hod', 'admin'].includes(payload.role)) {
        return NextResponse.json({ error: 'Only HOD or Admin can lock marks' }, { status: 403 });
      }

      db.prepare('UPDATE marks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, params.id);
      db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, mark.workflow_id);

      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), mark.workflow_id, mark.status, status, payload.userId, `Marks ${status}`);
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
          `).run(compId, params.id, comp.type, comp.name, comp.maxMarks, comp.obtainedMarks || 0, comp.weightage || 0, comp.isExam ? 1 : 0, payload.userId, new Date().toISOString(), comp.notes || null);
        }
      }

      const totalMarks = db.prepare(`
        SELECT COALESCE(SUM(obtained_marks * weightage / 100), 0) as total FROM mark_components WHERE mark_id = ?
      `).get(params.id) as { total: number };

      db.prepare('UPDATE marks SET total_marks = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(totalMarks.total || 0, params.id);
    }

    const updated = db.prepare(`
      SELECT m.*, sub.name as subject_name, b.name as batch_name, u.first_name as student_name
      FROM marks m
      LEFT JOIN subjects sub ON m.subject_id = sub.id
      LEFT JOIN batches b ON m.batch_id = b.id
      LEFT JOIN users u ON m.student_id = u.id
      WHERE m.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update marks error:', error);
    return NextResponse.json({ error: 'Failed to update marks' }, { status: 500 });
  }
}
