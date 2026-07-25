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
    const unreadOnly = searchParams.get('unreadOnly') === 'true';
    const category = searchParams.get('category');

    let query = 'SELECT * FROM notifications WHERE user_id = ?';
    const params: any[] = [payload.userId];

    if (unreadOnly) {
      query += ' AND is_read = 0';
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY created_at DESC LIMIT 50';

    const notifications = db.prepare(query).all(...params);

    const unreadCount = db.prepare(`
      SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0
    `).get(payload.userId) as { count: number };

    return NextResponse.json({ 
      success: true, 
      data: { 
        notifications,
        unreadCount: unreadCount.count
      }
    });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    return NextResponse.json({ error: 'Failed to get notifications' }, { status: 500 });
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

    if (!['hod', 'admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { userId, title, message, type, category, referenceType, referenceId } = await request.json();

    if (!userId || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notificationId = uuidv4();
    db.prepare(`
      INSERT INTO notifications (id, user_id, title, message, type, category, reference_type, reference_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      notificationId, userId, title, message, type || 'info', category || null, 
      referenceType || null, referenceId || null
    );

    const notification = db.prepare('SELECT * FROM notifications WHERE id = ?').get(notificationId);

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error: any) {
    console.error('Create notification error:', error);
    return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
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

    const { notificationId, markAllRead } = await request.json();

    if (markAllRead) {
      db.prepare(`
        UPDATE notifications SET is_read = 1 WHERE user_id = ?
      `).run(payload.userId);
    } else if (notificationId) {
      db.prepare(`
        UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?
      `).run(notificationId, payload.userId);
    }

    return NextResponse.json({ success: true, message: 'Notifications updated' });
  } catch (error: any) {
    console.error('Update notifications error:', error);
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 });
  }
}
