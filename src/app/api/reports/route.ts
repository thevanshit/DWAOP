import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import db from '@/lib/db';
import { verifyAccessToken } from '@/lib/db/auth';

const TRACK_REPORT_STATUS_TRANSITIONS: Record<string, string[]> = {
  draft: ['submitted'],
  submitted: ['under_review'],
  under_review: ['finalised'],
  finalised: ['locked']
};

function calculateEligibility(attendancePercentages: number[], marksData: any[]): 'eligible' | 'at_risk' | 'not_eligible' {
  const minAttendance = 75;
  const avgAttendance = attendancePercentages.length > 0 
    ? attendancePercentages.reduce((a, b) => a + b, 0) / attendancePercentages.length 
    : 0;

  if (avgAttendance < minAttendance) {
    return 'not_eligible';
  }

  if (avgAttendance < minAttendance + 10) {
    return 'at_risk';
  }

  return 'eligible';
}

function generateRiskIndicators(attendancePercentages: number[], marksData: any[]): string[] {
  const indicators: string[] = [];
  const minAttendance = 75;

  attendancePercentages.forEach((att, idx) => {
    if (att < minAttendance) {
      indicators.push(`Low attendance in subject ${idx + 1}: ${att.toFixed(1)}%`);
    }
  });

  return indicators;
}

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
    const studentId = searchParams.get('studentId');
    const semester = searchParams.get('semester');
    const academicYear = searchParams.get('academicYear');
    const status = searchParams.get('status');

    let query = `
      SELECT tr.*, u.first_name as student_name, u.last_name as student_last_name, 
             u.email as student_email, u.avatar as student_avatar
      FROM track_reports tr
      JOIN users u ON tr.student_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (studentId) {
      query += ' AND tr.student_id = ?';
      params.push(studentId);
    }

    if (semester) {
      query += ' AND tr.semester = ?';
      params.push(semester);
    }

    if (academicYear) {
      query += ' AND tr.academic_year = ?';
      params.push(academicYear);
    }

    if (status) {
      query += ' AND tr.status = ?';
      params.push(status);
    }

    if (payload.role === 'student') {
      query += ' AND tr.student_id = ?';
      params.push(payload.userId);
    }

    query += ' ORDER BY tr.semester DESC, tr.academic_year DESC';

    const reports = db.prepare(query).all(...params);

    for (const report of reports as any[]) {
      if (report.attendance_summary) {
        (report as any).attendance = JSON.parse(report.attendance_summary);
      }
      if (report.assignment_summary) {
        (report as any).assignments = JSON.parse(report.assignment_summary);
      }
      if (report.marks_summary) {
        (report as any).marks = JSON.parse(report.marks_summary);
      }
      if (report.risk_indicators) {
        (report as any).riskIndicators = JSON.parse(report.risk_indicators);
      }
      if (report.intervention_history) {
        (report as any).interventions = JSON.parse(report.intervention_history);
      }
    }

    return NextResponse.json({ success: true, data: reports });
  } catch (error: any) {
    console.error('Get track reports error:', error);
    return NextResponse.json({ error: 'Failed to get track reports' }, { status: 500 });
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

    if (!['teacher', 'hod', 'admin'].includes(payload.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { studentId, semester, academicYear } = await request.json();

    if (!studentId || !semester || !academicYear) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingReport = db.prepare(`
      SELECT id FROM track_reports WHERE student_id = ? AND semester = ? AND academic_year = ?
    `).get(studentId, semester, academicYear);

    if (existingReport) {
      return NextResponse.json({ error: 'Track report already exists for this student, semester, and year' }, { status: 400 });
    }

    const batchStudents = db.prepare(`
      SELECT bs.batch_id FROM batch_students bs WHERE bs.student_id = ?
    `).get(studentId) as { batch_id: string } | undefined;

    if (!batchStudents) {
      return NextResponse.json({ error: 'Student not enrolled in any batch' }, { status: 400 });
    }

    const attendanceData = db.prepare(`
      SELECT sub.name, sub.id,
        (SELECT COUNT(*) FROM attendance_records ar 
         JOIN attendance_sessions ass ON ar.session_id = ass.id 
         WHERE ass.subject_id = sub.id AND ar.student_id = ? AND ar.status = 'present') as present,
        (SELECT COUNT(*) FROM attendance_records ar 
         JOIN attendance_sessions ass ON ar.session_id = ass.id 
         WHERE ass.subject_id = sub.id AND ar.student_id = ?) as total
      FROM subjects sub
      WHERE sub.semester = ? AND sub.department_id = (SELECT department_id FROM users WHERE id = ?)
    `).all(studentId, studentId, semester, studentId) as any[];

    const attendanceSummary = attendanceData.map(ad => ({
      subject: ad.name,
      subjectId: ad.id,
      percentage: ad.total > 0 ? (ad.present / ad.total) * 100 : 0,
      attended: ad.present,
      total: ad.total
    }));

    const assignmentData = db.prepare(`
      SELECT a.title, a.max_marks, s.status, s.marks
      FROM submissions s
      JOIN assignments a ON s.assignment_id = a.id
      WHERE s.student_id = ?
    `).all(studentId) as any[];

    const marksData = db.prepare(`
      SELECT sub.name, m.total_marks
      FROM marks m
      JOIN subjects sub ON m.subject_id = sub.id
      WHERE m.student_id = ? AND m.semester = ? AND m.academic_year = ?
    `).all(studentId, semester, academicYear) as any[];

    const attendancePercentages = attendanceSummary.map(a => a.percentage);
    const eligibility = calculateEligibility(attendancePercentages, marksData);
    const riskIndicators = generateRiskIndicators(attendancePercentages, marksData);

    const workflowId = uuidv4();
    db.prepare(`
      INSERT INTO workflows (id, type, title, description, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      workflowId,
      'track_report',
      `Track Report - ${semester} ${academicYear}`,
      `Student track report for semester ${semester}`,
      'draft',
      payload.userId
    );

    const reportId = uuidv4();
    db.prepare(`
      INSERT INTO track_reports (id, workflow_id, student_id, semester, academic_year, status, 
                                  attendance_summary, assignment_summary, marks_summary, 
                                  eligibility_status, risk_indicators, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      reportId, workflowId, studentId, semester, academicYear, 'draft',
      JSON.stringify(attendanceSummary), JSON.stringify(assignmentData), JSON.stringify(marksData),
      eligibility, JSON.stringify(riskIndicators), payload.userId
    );

    const report = db.prepare(`
      SELECT tr.*, u.first_name as student_name, u.last_name as student_last_name
      FROM track_reports tr
      JOIN users u ON tr.student_id = u.id
      WHERE tr.id = ?
    `).get(reportId);

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    console.error('Create track report error:', error);
    return NextResponse.json({ error: 'Failed to create track report' }, { status: 500 });
  }
}
