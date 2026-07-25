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
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const assigneeId = searchParams.get('assigneeId');
    const committeeName = searchParams.get('committeeName');
    const priority = searchParams.get('priority');

    let query = `
      SELECT t.*, u1.first_name as assignee_name, u2.first_name as creator_name,
             u2.avatar as creator_avatar
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND t.category = ?';
      params.push(category);
    }

    if (assigneeId) {
      query += ' AND t.assignee_id = ?';
      params.push(assigneeId);
    }

    if (committeeName) {
      query += ' AND t.committee_name = ?';
      params.push(committeeName);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (payload.role === 'student') {
      query += ' AND t.created_by = ?';
      params.push(payload.userId);
    } else if (payload.role === 'teacher') {
      query += ' AND (t.assignee_id = ? OR t.created_by = ?)';
      params.push(payload.userId, payload.userId);
    }

    query += ' ORDER BY t.priority DESC, t.due_date ASC, t.created_at DESC';

    const tasks = db.prepare(query).all(...params);

    for (const task of tasks as any[]) {
      const subtasks = db.prepare('SELECT * FROM subtasks WHERE task_id = ?').all(task.id);
      const comments = db.prepare(`
        SELECT tc.*, u.first_name, u.avatar
        FROM task_comments tc
        JOIN users u ON tc.user_id = u.id
        WHERE tc.task_id = ?
        ORDER BY tc.created_at DESC
      `).all(task.id);
      (task as any).subtasks = subtasks;
      (task as any).comments = comments;
    }

    return NextResponse.json({ success: true, data: tasks });
  } catch (error: any) {
    console.error('Get tasks error:', error);
    return NextResponse.json({ error: 'Failed to get tasks' }, { status: 500 });
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

    const { title, description, category, committeeName, priority, assigneeId, dueDate, estimatedHours, subtasks } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const workflowId = uuidv4();
    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, priority, created_by, assigned_to, due_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      'task',
      title,
      description || null,
      'created',
      priority || 'medium',
      payload.userId,
      assigneeId || payload.userId,
      dueDate || null
    );

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), workflowId, null, 'created', payload.userId, 'Task created');

    const taskId = uuidv4();
    db.prepare(`
      INSERT INTO tasks (id, workflow_id, title, description, status, priority, category, committee_name, assignee_id, assigned_by, due_date, estimated_hours, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId, workflowId, title, description || null, 'created', priority || 'medium', 
      category || null, committeeName || null, assigneeId || payload.userId, 
      payload.userId, dueDate || null, estimatedHours || null, payload.userId
    );

    if (subtasks && Array.isArray(subtasks)) {
      for (const subtask of subtasks) {
        db.prepare(`
          INSERT INTO subtasks (id, task_id, title, status, assignee_id)
          VALUES (?, ?, ?, ?, ?)
        `).run(uuidv4(), taskId, subtask.title, 'pending', subtask.assigneeId || null);
      }
    }

    const task = db.prepare(`
      SELECT t.*, u1.first_name as assignee_name, u2.first_name as creator_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE t.id = ?
    `).get(taskId);

    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error: any) {
    console.error('Create task error:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
