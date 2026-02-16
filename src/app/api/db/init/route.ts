import { NextRequest, NextResponse } from 'next/server';
import db, { initializeDatabase, seedDatabase } from '@/lib/db';

let dbInitialized = false;

export async function GET(request: NextRequest) {
  try {
    if (!dbInitialized) {
      initializeDatabase();
      seedDatabase();
      dbInitialized = true;
    }

    const tables = db.prepare(`
      SELECT name FROM sqlite_master WHERE type='table'
    `).all();

    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized',
      tables: (tables as any[]).map(t => t.name)
    });
  } catch (error: any) {
    console.error('Database init error:', error);
    return NextResponse.json({ error: 'Database initialization failed' }, { status: 500 });
  }
}
