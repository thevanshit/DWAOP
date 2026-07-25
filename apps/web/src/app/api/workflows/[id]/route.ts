import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

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

    const workflow = db.prepare(`
      SELECT w.*, u1.first_name as creator_name, u2.first_name as assignee_name
      FROM workflows w
      LEFT JOIN users u1 ON w.created_by = u1.id
      LEFT JOIN users u2 ON w.assigned_to = u2.id
      WHERE w.id = ?
    `).get(params.id) as any;

    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    const history = db.prepare(`
      SELECT wh.*, u.first_name as changed_by_name
      FROM workflow_history wh
      LEFT JOIN users u ON wh.changed_by = u.id
      WHERE wh.workflow_id = ?
      ORDER BY wh.created_at ASC
    `).all(params.id);

    const allowedTransitions = WORKFLOW_TRANSITIONS[workflow.type]?.[workflow.status] || [];

    return NextResponse.json({
      success: true,
      data: {
        ...workflow,
        metadata: workflow.metadata ? JSON.parse(workflow.metadata) : null,
        history,
        allowedTransitions
      }
    });
  } catch (error: any) {
    console.error('Get workflow error:', error);
    return NextResponse.json({ error: 'Failed to get workflow' }, { status: 500 });
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

    const { title, description, priority, assignedTo, dueDate, status, metadata } = await request.json();

    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(params.id) as any;
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    let newStatus = workflow.status;
    let comment = 'Workflow updated';

    if (status && status !== workflow.status) {
      const allowedTransitions = WORKFLOW_TRANSITIONS[workflow.type]?.[workflow.status] || [];
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json({ 
          error: `Invalid transition from ${workflow.status} to ${status}` 
        }, { status: 400 });
      }
      newStatus = status;
      comment = `Status changed from ${workflow.status} to ${status}`;
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (priority !== undefined) {
      updates.push('priority = ?');
      values.push(priority);
    }
    if (assignedTo !== undefined) {
      updates.push('assigned_to = ?');
      values.push(assignedTo);
    }
    if (dueDate !== undefined) {
      updates.push('due_date = ?');
      values.push(dueDate);
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    if (metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(typeof metadata === 'string' ? metadata : JSON.stringify(metadata));
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(params.id);

    db.prepare(`UPDATE workflows SET ${updates.join(', ')} WHERE id = ?`).run(...values);

    if (status && status !== workflow.status) {
      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), params.id, workflow.status, newStatus, payload.userId, comment);
    }

    const updatedWorkflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(params.id);

    return NextResponse.json({ success: true, data: updatedWorkflow });
  } catch (error: any) {
    console.error('Update workflow error:', error);
    return NextResponse.json({ error: 'Failed to update workflow' }, { status: 500 });
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

    const workflow = db.prepare('SELECT * FROM workflows WHERE id = ?').get(params.id);
    if (!workflow) {
      return NextResponse.json({ error: 'Workflow not found' }, { status: 404 });
    }

    db.prepare('DELETE FROM workflows WHERE id = ?').run(params.id);

    return NextResponse.json({ success: true, message: 'Workflow deleted' });
  } catch (error: any) {
    console.error('Delete workflow error:', error);
    return NextResponse.json({ error: 'Failed to delete workflow' }, { status: 500 });
  }
}
