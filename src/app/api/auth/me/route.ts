import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAccessToken, getUserPermissions } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

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

    const user = db.prepare(`
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.avatar, 
             u.specialization, u.department_id, d.name as department_name
      FROM users u
      LEFT JOIN departments d ON u.department_id = d.id
      WHERE u.id = ? AND u.is_active = 1
    `).get(payload.userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const permissions = getUserPermissions(user.role);

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        avatar: user.avatar,
        specialization: user.specialization,
        departmentId: user.department_id,
        departmentName: user.department_name,
        permissions
      }
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json({ error: 'Failed to get user' }, { status: 500 });
  }
}
