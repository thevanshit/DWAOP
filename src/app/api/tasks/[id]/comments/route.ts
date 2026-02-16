import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

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

    const { content, attachments } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    const commentId = uuidv4();
    db.prepare(`
      INSERT INTO task_comments (id, task_id, user_id, content, attachments)
      VALUES (?, ?, ?, ?, ?)
    `).run(commentId, params.id, payload.userId, content, attachments ? JSON.stringify(attachments) : null);

    const comment = db.prepare(`
      SELECT tc.*, u.first_name, u.last_name, u.avatar
      FROM task_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.id = ?
    `).get(commentId);

    return NextResponse.json({ success: true, data: comment }, { status: 201 });
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}
