import { NextRequest, NextResponse } from 'next/server';
import { generateAccessToken, validateRefreshToken, generateRefreshToken, saveRefreshToken, deleteRefreshToken, getUserPermissions, JWTPayload } from '@/lib/db/auth';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    const userId = validateRefreshToken(refreshToken);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const user = db.prepare(`
      SELECT u.id, u.email, u.role, u.first_name, u.last_name, u.avatar, u.specialization
      FROM users u WHERE u.id = ? AND u.is_active = 1
    `).get(userId) as any;

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    deleteRefreshToken(refreshToken);
    const { token: newRefreshToken, expiresAt } = generateRefreshToken();
    saveRefreshToken(user.id, newRefreshToken, expiresAt);

    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    const accessToken = generateAccessToken(payload);
    const permissions = getUserPermissions(user.role);

    return NextResponse.json({
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
          refreshToken: newRefreshToken
        }
      }
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}
