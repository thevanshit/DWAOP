import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

export const dynamic = 'force-dynamic';

const SPORTS_FACILITIES = [
  { id: 'badminton', name: 'Badminton Court', icon: '🏸', count: 4, available: true, timing: '6:00 AM - 9:00 PM' },
  { id: 'basketball', name: 'Basketball Court', icon: '🏀', count: 2, available: true, timing: '6:00 AM - 9:00 PM' },
  { id: 'cricket', name: 'Cricket Ground', icon: '🏏', count: 1, available: true, timing: '6:00 AM - 6:00 PM' },
  { id: 'football', name: 'Football Ground', icon: '⚽', count: 1, available: true, timing: '6:00 AM - 6:00 PM' },
  { id: 'table-tennis', name: 'Table Tennis', icon: '🏓', count: 6, available: true, timing: '6:00 AM - 9:00 PM' },
  { id: 'chess', name: 'Chess Room', icon: '♟️', count: 10, available: true, timing: '6:00 AM - 10:00 PM' },
  { id: 'gym', name: 'Gymnasium', icon: '🏋️', count: 1, available: true, timing: '5:00 AM - 9:00 PM' },
  { id: 'swimming', name: 'Swimming Pool', icon: '🏊', count: 1, available: true, timing: '6:00 AM - 7:00 PM' },
];

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

    const events = db.prepare('SELECT * FROM sports_events ORDER BY event_date ASC').all();

    const achievements = db.prepare(`
      SELECT sa.*, u.first_name as student_name
      FROM sports_achievements sa
      JOIN users u ON sa.student_id = u.id
      ORDER BY sa.achievement_date DESC
    `).all();

    let registrations: any[] = [];
    if (payload.role === 'student') {
      registrations = db.prepare(
        'SELECT * FROM event_registrations WHERE student_id = ?'
      ).all(payload.userId);
    }

    return NextResponse.json({
      success: true,
      data: {
        facilities: SPORTS_FACILITIES,
        events,
        achievements,
        registrations,
      },
    });
  } catch (error: any) {
    console.error('Get sports data error:', error);
    return NextResponse.json({ error: 'Failed to get sports data' }, { status: 500 });
  }
}
