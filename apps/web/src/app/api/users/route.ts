import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken, hashPassword, getUserPermissions } from '@/lib/db/auth';

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
    const role = searchParams.get('role');
    const departmentId = searchParams.get('departmentId');
    const search = searchParams.get('search');

    let query = `
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.avatar, 
             u.specialization, u.is_active, u.created_at, d.name as department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (role) {
      query += ' AND u.role = ?';
      params.push(role);
    }

    if (departmentId) {
      query += ' AND u.department_id = ?';
      params.push(departmentId);
    }

    if (search) {
      query += ' AND (u.first_name LIKE ? OR u.last_name LIKE ? OR u.email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY u.created_at DESC';

    const users = db.prepare(query).all(...params);

    return NextResponse.json({ success: true, data: users });
  } catch (error: any) {
    console.error('Get users error:', error);
    return NextResponse.json({ error: 'Failed to get users' }, { status: 500 });
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

    const permissions = getUserPermissions(payload.role);
    if (!permissions.includes('manage:users')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { email, password, firstName, lastName, role, departmentId, specialization } = await request.json();

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const userId = uuidv4();
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, specialization)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, email, passwordHash, firstName, lastName, role, departmentId || null, specialization || null);

    const user = db.prepare(`
      SELECT u.id, u.email, u.first_name, u.last_name, u.role, u.avatar, u.specialization
      FROM users u WHERE u.id = ?
    `).get(userId);

    return NextResponse.json({ success: true, data: user }, { status: 201 });
  } catch (error: any) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
