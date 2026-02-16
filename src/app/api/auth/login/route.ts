import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { 
  generateAccessToken, 
  generateRefreshToken, 
  verifyPassword, 
  saveRefreshToken, 
  deleteRefreshToken,
  deleteUserRefreshTokens,
  validateRefreshToken,
  getUserPermissions,
  JWTPayload
} from '@/lib/db/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = db.prepare(`
      SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.role, u.department_id, u.avatar, u.specialization
      FROM users u WHERE u.email = ? AND u.is_active = 1
    `).get(email) as any;

    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const { token: refreshToken, expiresAt } = generateRefreshToken();

    saveRefreshToken(user.id, refreshToken, expiresAt);

    const permissions = getUserPermissions(user.role);

    const response = NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: `${user.first_name} ${user.last_name}`,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          avatar: user.avatar,
          specialization: user.specialization,
          permissions
        },
        tokens: {
          accessToken,
          refreshToken
        }
      }
    });

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
