import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, JWTPayload } from '@/lib/db/auth';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export function authMiddleware(request: NextRequest): JWTPayload | null {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  return verifyAccessToken(token);
}

export function requireAuth(request: AuthenticatedRequest): JWTPayload {
  const user = authMiddleware(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  request.user = user;
  return user;
}

export function requireRole(request: AuthenticatedRequest, allowedRoles: string[]): JWTPayload {
  const user = requireAuth(request);
  
  if (!allowedRoles.includes(user.role)) {
    throw new Error('Forbidden');
  }
  
  return user;
}

export function requirePermission(request: AuthenticatedAction, permission: string): JWTPayload {
  const user = requireAuth(request);
  const { hasPermission } = require('@/lib/db/auth');
  
  if (!hasPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }
  
  return user;
}

export function withErrorHandling(handler: (request: AuthenticatedRequest, params?: Record<string, string>) => Promise<NextResponse>) {
  return async (request: NextRequest, params?: Record<string, string>) => {
    try {
      return await handler(request as AuthenticatedRequest, params);
    } catch (error: any) {
      console.error('API Error:', error);
      
      if (error.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      if (error.message === 'Forbidden') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      
      return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
  };
}

export interface AuthenticatedAction extends NextRequest {
  user?: JWTPayload;
}
