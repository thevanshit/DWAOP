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
    const semester = searchParams.get('semester');

    let query = `
      SELECT s.*, d.name as department_name
      FROM subjects s
      LEFT JOIN departments d ON s.department_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (departmentId) {
      query += ' AND s.department_id = ?';
      params.push(departmentId);
    }

    if (semester) {
      query += ' AND s.semester = ?';
      params.push(semester);
    }

    query += ' ORDER BY s.semester, s.name';

    const subjects = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: subjects });
  } catch (error: any) {
    console.error('Get subjects error:', error);
    return NextResponse.json({ error: 'Failed to get subjects' }, { status: 500 });
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

    if (!hasPermission(payload.role, 'manage:subjects')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { code, name, departmentId, credits, semester } = await request.json();

    if (!code || !name || !departmentId || !semester) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const subjectId = uuidv4();
    db.prepare(`
      INSERT INTO subjects (id, code, name, department_id, credits, semester)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(subjectId, code, name, departmentId, credits || 3, semester);

    const subject = db.prepare('SELECT * FROM subjects WHERE id = ?').get(subjectId);

    return NextResponse.json({ success: true, data: subject }, { status: 201 });
  } catch (error: any) {
    console.error('Create subject error:', error);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
