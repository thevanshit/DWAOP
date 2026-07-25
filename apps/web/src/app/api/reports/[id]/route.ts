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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const report = db.prepare(`
      SELECT tr.*, u.first_name as student_name, u.last_name as student_last_name, 
             u.email as student_email, u.avatar as student_avatar
      FROM track_reports tr
      JOIN users u ON tr.student_id = u.id
      WHERE tr.id = ?
    `).get(params.id) as any;

    if (!report) {
      return NextResponse.json({ error: 'Track report not found' }, { status: 404 });
    }

    const attendance = report.attendance_summary ? JSON.parse(report.attendance_summary) : [];
    const assignments = report.assignment_summary ? JSON.parse(report.assignment_summary) : [];
    const marks = report.marks_summary ? JSON.parse(report.marks_summary) : [];
    const riskIndicators = report.risk_indicators ? JSON.parse(report.risk_indicators) : [];
    const interventions = report.intervention_history ? JSON.parse(report.intervention_history) : [];

    const allowedTransitions = TRACK_REPORT_STATUS_TRANSITIONS[report.status] || [];

    return NextResponse.json({
      success: true,
      data: {
        ...report,
        attendance,
        assignments,
        marks,
        riskIndicators,
        interventions,
        allowedTransitions
      }
    });
  } catch (error: any) {
    console.error('Get track report error:', error);
    return NextResponse.json({ error: 'Failed to get track report' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const report = db.prepare('SELECT * FROM track_reports WHERE id = ?').get(params.id) as any;
    if (!report) {
      return NextResponse.json({ error: 'Track report not found' }, { status: 404 });
    }

    if (report.status === 'locked') {
      return NextResponse.json({ error: 'Track report is locked' }, { status: 400 });
    }

    const { status, eligibilityStatus, attendanceSummary, marksSummary, addRiskIndicator, addIntervention } = await request.json();

    if (status) {
      const allowedTransitions = TRACK_REPORT_STATUS_TRANSITIONS[report.status] || [];
      if (!allowedTransitions.includes(status)) {
        return NextResponse.json({ 
          error: `Cannot transition from ${report.status} to ${status}` 
        }, { status: 400 });
      }

      if (status === 'locked' && !['hod', 'admin'].includes(payload.role)) {
        return NextResponse.json({ error: 'Only HOD or Admin can lock track reports' }, { status: 403 });
      }

      db.prepare('UPDATE track_reports SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, params.id);
      db.prepare('UPDATE workflows SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, report.workflow_id);

      db.prepare(`
        INSERT INTO workflow_history (id, workflow_id, from_status, to_status, changed_by, comment)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(uuidv4(), report.workflow_id, report.status, status, payload.userId, `Track report ${status}`);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (eligibilityStatus !== undefined) {
      updates.push('eligibility_status = ?');
      values.push(eligibilityStatus);
    }

    if (attendanceSummary !== undefined) {
      updates.push('attendance_summary = ?');
      values.push(JSON.stringify(attendanceSummary));
    }

    if (marksSummary !== undefined) {
      updates.push('marks_summary = ?');
      values.push(JSON.stringify(marksSummary));
    }

    if (addRiskIndicator) {
      const existingIndicators = report.risk_indicators ? JSON.parse(report.risk_indicators) : [];
      existingIndicators.push(addRiskIndicator);
      updates.push('risk_indicators = ?');
      values.push(JSON.stringify(existingIndicators));
    }

    if (addIntervention) {
      const existingInterventions = report.intervention_history ? JSON.parse(report.intervention_history) : [];
      existingInterventions.push({
        ...addIntervention,
        addedBy: payload.userId,
        addedAt: new Date().toISOString()
      });
      updates.push('intervention_history = ?');
      values.push(JSON.stringify(existingInterventions));
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(params.id);
      db.prepare(`UPDATE track_reports SET ${updates.join(', ')} WHERE id = ?`).run(...values);
    }

    const updated = db.prepare(`
      SELECT tr.*, u.first_name as student_name, u.last_name as student_last_name
      FROM track_reports tr
      JOIN users u ON tr.student_id = u.id
      WHERE tr.id = ?
    `).get(params.id);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Update track report error:', error);
    return NextResponse.json({ error: 'Failed to update track report' }, { status: 500 });
  }
}
