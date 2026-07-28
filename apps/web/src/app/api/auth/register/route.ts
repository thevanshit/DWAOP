import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { hashPassword } from '@/lib/db/auth';

const VALID_ROLES = ['student', 'teacher', 'admin'];

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    // ── Validation ──────────────────────────────────────────────

    if (!email || !password || !firstName || !role) {
      return NextResponse.json(
        { error: 'Email, password, first name, and role are required' },
        { status: 400 }
      );
    }

    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be student, teacher, or admin' },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu\.in|edu)$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please use your institutional email (@campus.edu or @cse.edu.in)' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // ── Check for existing user ─────────────────────────────────

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email) as any;
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // ── Create user ─────────────────────────────────────────────

    const id = uuidv4();
    const passwordHash = hashPassword(password);
    const displayName = `${firstName}${lastName ? ' ' + lastName : ''}`;
    const avatar = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, first_name, last_name, role, avatar, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    `).run(id, email, passwordHash, firstName, lastName || '', role, avatar);

    console.log(`User registered: ${email} as ${role}`);

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id,
          email,
          firstName,
          lastName: lastName || '',
          name: displayName,
          role,
          avatar,
        },
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message || 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
