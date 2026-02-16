import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

const TASK_STATUS_TRANSITIONS: Record<string, string[]> = {
  created: ['in_progress'],
  in_progress: ['done', 'delayed', 'under_review'],
  under_review: ['done', 'in_progress'],
  done: ['delayed']
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

    const task = db.prepare(`
      SELECT t.*, u1.first_name as assignee_name, u1.avatar as assignee_avatar,
             u2.first_name as creator_name, u2.avatar as creator_avatar,
             u3.first_name as assigned_by_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      LEFT JOIN users u3 ON t.assigned_by = u3.id
      WHERE t.id = ?
    `).get(params.id) as any;

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const subtasks = db.prepare('SELECT * FROM subtasks WHERE task_id = ?').all(params.id);
    const comments = db.prepare(`
      SELECT tc.*, u.first_name, u.last_name, u.avatar
      FROM task_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.task_id = ?
      ORDER BY tc.created_at DESC
    `).all(params.id);

    const allowedTransitions = TASK_STATUS_TRANSITIONS[task.status] || [];

    return NextResponse.json({
      success: true,
      data: { ...task, subtasks, comments, allowedTransitions }
    });
  } catch (error: any) {
    console.error('Get task error:', error);
    return NextResponse.json({ error: 'Failed to get task' }, { status: 500 });
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

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(params.id) as any;
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    const { status, title, description, priority, category, committeeName, assigneeId, dueDate, estimatedHours, loggedHours } = await request.json();

    if (status) {
      const allowedTransitions = TASK_STATUS_TRANSITIONS[task.status] || [];
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json({ 
          error: `Cannot transition from ${task.status} to ${status}` 
        }, { status: 400 });
      }

      db.prepare('UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, params.id);
      db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, task.workflow_id);

      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), task.workflow_id, task.status, status, payload.userId, `Task ${status}`);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (priority !== undefined) { updates.push('priority = ?'); values.push(priority); }
    if (category !== undefined) { updates.push('category = ?'); values.push(category); }
    if (committeeName !== undefined) { updates.push('committee_name = ?'); values.push(committeeName); }
    if (assigneeId !== undefined) { updates.push('assignee_id = ?'); values.push(assigneeId); }
    if (dueDate !== undefined) { updates.push('due_date = ?'); values.push(dueDate); }
    if (estimatedHours !== undefined) { updates.push('estimated_hours = ?'); values.push(estimatedHours); }
    if (loggedHours !== undefined) { updates.push('logged_hours = ?'); values.push(loggedHours); }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(params.id);
      db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare(`
      SELECT t.*, u1.first_name as assignee_name, u2.first_name as creator_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE t.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update task error:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}

export async function DELETE(
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

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(params.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(params.id);

    return NextResponse.json({ success: true, message: 'Task deleted' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
