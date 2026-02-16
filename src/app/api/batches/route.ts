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

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId');
    const isActive = searchParams.get('isActive');

    let query = `
      SELECT b.*, d.name as department_name
      FROM batches b
      LEFT JOIN departments d ON b.department_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (departmentId) {
      query += ' AND b.department_id = ?';
      params.push(departmentId);
    }

    if (isActive !== null) {
      query += ' AND b.is_active = ?';
      params.push(isActive === 'true' ? 1 : 0);
    }

    query += ' ORDER BY b.year DESC, b.semester, b.name';

    const batches = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: batches });
  } catch (error: any) {
    console.error('Get batches error:', error);
    return NextResponse.json({ error: 'Failed to get batches' }, { status: 500 });
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

    if (!hasPermission(payload.role, 'manage:batches')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, departmentId, semester, section, year } = await request.json();

    if (!name || !departmentId || !semester || !year) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const batchId = uuidv4();
    db.prepare(`
      INSERT INTO batches (id, name, department_id, semester, section, year)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(batchId, name, departmentId, semester, section || null, year);

    const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batchId);

    return NextResponse.json({ success: true, data: batch }, { status: 201 });
  } catch (error: any) {
    console.error('Create batch error:', error);
    return NextResponse.json({ error: 'Failed to create batch' }, { status: 500 });
  }
}
