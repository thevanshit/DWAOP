import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

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

    const studentId = payload.role === 'student' ? payload.userId : null;

    let feeRecordsQuery: string;
    let feeRecordsParams: any[];
    let transactionsQuery: string;
    let transactionsParams: any[];

    if (studentId) {
      feeRecordsQuery = 'SELECT * FROM fee_records WHERE student_id = ? ORDER BY created_at DESC';
      feeRecordsParams = [studentId];
      transactionsQuery = 'SELECT * FROM transactions WHERE student_id = ? ORDER BY transaction_date DESC';
      transactionsParams = [studentId];
    } else {
      feeRecordsQuery = 'SELECT * FROM fee_records ORDER BY created_at DESC';
      feeRecordsParams = [];
      transactionsQuery = 'SELECT * FROM transactions ORDER BY transaction_date DESC';
      transactionsParams = [];
    }

    const feeRecords = db.prepare(feeRecordsQuery).all(...feeRecordsParams);
    const transactions = db.prepare(transactionsQuery).all(...transactionsParams);

    return NextResponse.json({ success: true, data: { feeRecords, transactions } });
  } catch (error: any) {
    console.error('Get fee records error:', error);
    return NextResponse.json({ error: 'Failed to get fee records' }, { status: 500 });
  }
}
