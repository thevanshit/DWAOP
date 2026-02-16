import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken, hasPermission } from '@/lib/db/auth';

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

    const permissions = hasPermission(payload.role, 'view:audit_logs') || ['admin', 'hod'].includes(payload.role);
    if (!permissions) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const entityType = searchParams.get('entityType');
    const action = searchParams.get('action');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = `
      SELECT al.*, u.first_name as user_name, u.email as user_email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (userId) {
      query += ' AND al.user_id = ?';
      params.push(userId);
    }

    if (entityType) {
      query += ' AND al.entity_type = ?';
      params.push(entityType);
    }

    if (action) {
      query += ' AND al.action = ?';
      params.push(action);
    }

    if (startDate) {
      query += ' AND al.created_at >= ?';
      params.push(startDate);
    }

    if (endDate) {
      query += ' AND al.created_at <= ?';
      params.push(endDate);
    }

    query += ' ORDER BY al.created_at DESC LIMIT 500';

    const logs = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    console.error('Get audit logs error:', error);
    return NextResponse.json({ error: 'Failed to get audit logs' }, { status: 500 });
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

    const { action, entityType, entityId, oldValue, newValue } = await request.json();

    if (!action || !entityType) {
      return NextResponse.json({ error: 'Action and entity type are required' }, { status: 400 });
    }

    const logId = uuidv4();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, old_value, new_value)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      logId, payload.userId, action, entityType, entityId || null,
      oldValue ? JSON.stringify(oldValue) : null,
      newValue ? JSON.stringify(newValue) : null
    );

    return NextResponse.json({ success: true, message: 'Audit log created' }, { status: 201 });
  } catch (error: any) {
    console.error('Create audit log error:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
