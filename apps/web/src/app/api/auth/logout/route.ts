import { NextRequest, NextResponse } from 'next/server';
import { deleteRefreshToken, deleteUserRefreshTokens, verifyAccessToken } from '@/lib/db/auth';

export async function POST(request: NextRequest) {
  try {
    const { refreshToken } = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (authHeader) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);
      if (payload) {
        deleteUserRefreshTokens(payload.userId);
      }
    }

    if (refreshToken) {
      deleteRefreshToken(refreshToken);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set('accessToken', '', { expires: new Date(0) });
    
    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}
