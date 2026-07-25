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

    const departments = db.prepare(`
      SELECT d.*, u.first_name as hod_name
      FROM departments d
      LEFT JOIN users u ON d.hod_id = u.id
      ORDER BY d.name
    `).all();

    return NextResponse.json({ success: true, data: departments });
  } catch (error: any) {
    console.error('Get departments error:', error);
    return NextResponse.json({ error: 'Failed to get departments' }, { status: 500 });
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

    if (!hasPermission(payload.role, 'manage:departments')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, code, description, hodId } = await request.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const deptId = uuidv4();
    db.prepare(`
      INSERT INTO departments (id, name, code, description, hod_id)
      VALUES (?, ?, ?, ?, ?)
    `).run(deptId, name, code, description || null, hodId || null);

    const department = db.prepare('SELECT * FROM departments WHERE id = ?').get(deptId);

    return NextResponse.json({ success: true, data: department }, { status: 201 });
  } catch (error: any) {
    console.error('Create department error:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
