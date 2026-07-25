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

    const subtasks = db.prepare('SELECT * FROM subtasks WHERE task_id = ? ORDER BY created_at').all(params.id);

    return NextResponse.json({ success: true, data: subtasks });
  } catch (error: any) {
    console.error('Get subtasks error:', error);
    return NextResponse.json({ error: 'Failed to get subtasks' }, { status: 500 });
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

    const { title, status, assigneeId } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const subtaskId = uuidv4();
    db.prepare(`
      INSERT INTO subtasks (id, task_id, title, status, assignee_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(subtaskId, params.id, title, status || 'pending', assigneeId || null);

    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(subtaskId);

    return NextResponse.json({ success: true, data: subtask }, { status: 201 });
  } catch (error: any) {
    console.error('Create subtask error:', error);
    return NextResponse.json({ error: 'Failed to create subtask' }, { status: 500 });
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

    const { subtaskId, status, title, assigneeId } = await request.json();

    if (!subtaskId) {
      return NextResponse.json({ error: 'subtaskId is required' }, { status: 400 });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) { updates.push('title = ?'); values.push(title); }
    if (status !== undefined) { 
      updates.push('status = ?'); 
      values.push(status);
      if (status === 'done') {
        updates.push('completed_at = ?');
        values.push(new Date().toISOString());
      }
    }
    if (assigneeId !== undefined) { updates.push('assignee_id = ?'); values.push(assigneeId); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    values.push(subtaskId);
    db.prepare(`UPDATE subtasks SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    const subtask = db.prepare('SELECT * FROM subtasks WHERE id = ?').get(subtaskId);

    return NextResponse.json({ success: true, data: subtask });
  } catch (error: any) {
    console.error('Update subtask error:', error);
    return NextResponse.json({ error: 'Failed to update subtask' }, { status: 500 });
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

    const { subtaskId } = await request.json();
    if (!subtaskId) {
      return NextResponse.json({ error: 'subtaskId is required' }, { status: 400 });
    }

    db.prepare('DELETE FROM subtasks WHERE id = ?').run(subtaskId);

    return NextResponse.json({ success: true, message: 'Subtask deleted' });
  } catch (error: any) {
    console.error('Delete subtask error:', error);
    return NextResponse.json({ error: 'Failed to delete subtask' }, { status: 500 });
  }
}
