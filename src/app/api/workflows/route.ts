import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken, hasPermission } from '@/lib/db/auth';

const WORKFLOW_TRANSITIONS: Record<string, Record<string, string[]>> = {
  attendance: {
    created: ['in_progress'],
    in_progress: ['finalised'],
    finalised: ['locked']
  },
  assignment: {
    created: ['in_progress'],
    in_progress: ['under_review', 'delayed'],
    under_review: ['done'],
    done: ['delayed']
  },
  marks: {
    draft: ['submitted'],
    submitted: ['under_review'],
    under_review: ['finalised'],
    finalised: ['locked']
  },
  leave: {
    created: ['under_review'],
    under_review: ['approved', 'rejected']
  },
  task: {
    created: ['in_progress'],
    in_progress: ['done', 'delayed'],
    under_review: ['done'],
    done: ['delayed']
  },
  track_report: {
    draft: ['submitted'],
    submitted: ['under_review'],
    under_review: ['finalised'],
    finalised: ['locked']
  }
};

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
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const assignedTo = searchParams.get('assignedTo');
    const createdBy = searchParams.get('createdBy');

    let query = `
      SELECT w.*, u1.first_name as creator_name, u2.first_name as assignee_name
      FROM workflows w
      LEFT JOIN users u1 ON w.created_by = u1.id
      LEFT JOIN users u2 ON w.assigned_to = u2.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (type) {
      query += ' AND w.type = ?';
      params.push(type);
    }

    if (status) {
      query += ' AND w.status = ?';
      params.push(status);
    }

    if (assignedTo) {
      query += ' AND w.assigned_to = ?';
      params.push(assignedTo);
    }

    if (createdBy) {
      query += ' AND w.created_by = ?';
      params.push(createdBy);
    }

    if (payload.role === 'student') {
      query += ' AND (w.created_by = ? OR w.assigned_to = ?)';
      params.push(payload.userId, payload.userId);
    } else if (payload.role === 'teacher') {
      query += ' AND (w.created_by = ? OR w.assigned_to = ?)';
      params.push(payload.userId, payload.userId);
    }

    query += ' ORDER BY w.created_at DESC';

    const workflows = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: workflows });
  } catch (error: any) {
    console.error('Get workflows error:', error);
    return NextResponse.json({ error: 'Failed to get workflows' }, { status: 500 });
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

    const { type, title, description, priority, assignedTo, dueDate, metadata } = await request.json();

    if (!type || !title) {
      return NextResponse.json({ error: 'Type and title are required' }, { status: 400 });
    }

    const workflowId = uuidv4();
    const initialStatus = 'created';

    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, priority, created_by, assigned_to, due_date, metadata)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(workflowId, type, title, description || null, initialStatus, priority || 'medium', payload.userId, assignedTo || null, dueDate || null, metadata ? JSON.stringify(metadata) : null);

    db.prepare(`
      INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(uuidv4(), workflowId, null, initialStatus, payload.userId, 'Workflow created');

    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(workflowId);

    return NextResponse.json({ success: true, data: workflow }, { status: 201 });
  } catch (error: any) {
    console.error('Create workflow error:', error);
    return NextResponse.json({ error: 'Failed to create workflow' }, { status: 500 });
  }
}
