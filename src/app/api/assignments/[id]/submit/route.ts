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

    const submission = db.prepare(`
      SELECT s.*, a.title as assignment_title, a.max_marks, a.deadline,
             u.first_name, u.last_name, u.email
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = ? AND s.student_id = ?
    `).get(params.id, payload.userId);

    return NextResponse.json({ success: true, data: submission || null });
  } catch (error: any) {
    console.error('Get submission error:', error);
    return NextResponse.json({ error: 'Failed to get submission' }, { status: 500 });
  }
}

export async function POST(
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

    if (payload.role !== 'student') {
      return NextResponse.json({ error: 'Only students can submit' }, { status: 403 });
    }

    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(params.id) as any;
    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    const isLate = new Date() > new Date(assignment.deadline);
    if (isLate && !assignment.allow_late_submission) {
      return NextResponse.json({ error: 'Late submissions not allowed' }, { status: 400 });
    }

    const existingSubmission = db.prepare('SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?').get(params.id, payload.userId);

    const submittedAt = new Date().toISOString();
    const status = isLate ? 'late' : 'submitted';

    if (existingSubmission) {
      db.prepare(`
        UPDATE submissions 
        SET status = ?, submitted_at = ?, file_url = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE assignment_id = ? AND student_id = ?
      `).run(status, submittedAt, null, null, params.id, payload.userId);
    } else {
      const submissionId = uuidv4();
      db.prepare(`
        INSERT INTO submissions (id, assignment_id, student_id, status, submitted_at, file_url, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(submissionId, params.id, payload.userId, status, submittedAt, null, null);
    }

    if (assignment.status === 'created') {
      db.prepare('UPDATE assignments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('in_progress', params.id);
    }

    const submission = db.prepare(`
      SELECT s.*, a.title as assignment_title
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE s.assignment_id = ? AND s.student_id = ?
    `).get(params.id, payload.userId);

    return NextResponse.json({ success: true, data: submission });
  } catch (error: any) {
    console.error('Submit assignment error:', error);
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 });
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

    const { studentId, status, marks, feedback } = await request.json();

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID required' }, { status: 400 });
    }

    const submission = db.prepare('SELECT * FROM submissions WHERE assignment_id = ? AND student_id = ?').get(params.id, studentId);
    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (status) {
      updates.push('status = ?');
      values.push(status);
    }
    if (marks !== undefined) {
      updates.push('marks = ?');
      values.push(marks);
    }
    if (feedback !== undefined) {
      updates.push('feedback = ?');
      values.push(feedback);
    }

    if (status === 'evaluated' || marks !== undefined) {
      updates.push('graded_by = ?');
      values.push(payload.userId);
      updates.push('graded_at = ?');
      values.push(new Date().toISOString());
    }

    if (updates.length > 0) {
      values.push(params.id, studentId);
      db.prepare(`UPDATE submissions SET ${updates.join(', ')} WHERE assignment_id = ? AND student_id = ?`).run(...values);
    }

    const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(params.id) as any;
    if (assignment.status !== 'under_review' && assignment.status !== 'done') {
      const gradedCount = db.prepare('SELECT COUNT(*) as count FROM submissions WHERE assignment_id = ? AND status = ?').get(params.id, 'evaluated') as { count: number };
      if (gradedCount.count > 0) {
        db.prepare('UPDATE assignments SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run('under_review', params.id);
      }
    }

    const updated = db.prepare(`
      SELECT s.*, u.first_name, u.last_name, u.email
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.assignment_id = ? AND s.student_id = ?
    `).get(params.id, studentId);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Grade submission error:', error);
    return NextResponse.json({ error: 'Failed to grade' }, { status: 500 });
  }
}
