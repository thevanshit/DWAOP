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

    const stats: any = {};

    if (payload.role === 'student') {
      const attendanceStats = db.prepare(`
        SELECT 
          (SELECT COUNT(*) FROM attendance_records ar 
           JOIN attendance_sessions ass ON ar.session_id = ass.id 
           WHERE ar.student_id = ? AND ar.status = 'present') as present,
          (SELECT COUNT(*) FROM attendance_records ar 
           JOIN attendance_sessions ass ON ar.session_id = ass.id 
           WHERE ar.student_id = ?) as total
      `).get(payload.userId, payload.userId) as any;

      stats.attendancePercentage = attendanceStats.total > 0 
        ? Math.round((attendanceStats.present / attendanceStats.total) * 100) 
        : 0;

      const pendingAssignments = db.prepare(`
        SELECT COUNT(*) as count FROM submissions s
        JOIN assignments a ON s.assignment_id = a.id
        WHERE s.student_id = ? AND s.status IN ('pending', 'submitted', 'late')
      `).get(payload.userId) as { count: number };

      stats.pendingAssignments = pendingAssignments.count;

      const pendingLeaves = db.prepare(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE student_id = ? AND status IN ('created', 'under_review')
      `).get(payload.userId) as { count: number };

      stats.pendingLeaveRequests = pendingLeaves.count;

      const atRisk = db.prepare(`
        SELECT eligibility_status FROM track_reports 
        WHERE student_id = ? ORDER BY created_at DESC LIMIT 1
      `).get(payload.userId) as { eligibility_status: string } | undefined;

      stats.eligibilityStatus = atRisk?.eligibility_status || 'eligible';
    } 
    else if (payload.role === 'teacher') {
      const totalTasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks 
        WHERE assignee_id = ? OR created_by = ?
      `).get(payload.userId, payload.userId) as { count: number };

      stats.totalTasks = totalTasks.count;

      const inProgressTasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks 
        WHERE status = 'in_progress' AND (assignee_id = ? OR created_by = ?)
      `).get(payload.userId, payload.userId) as { count: number };

      stats.inProgressTasks = inProgressTasks.count;

      const pendingAttendance = db.prepare(`
        SELECT COUNT(*) as count FROM attendance_sessions 
        WHERE teacher_id = ? AND status != 'locked'
      `).get(payload.userId) as { count: number };

      stats.pendingAttendanceSessions = pendingAttendance.count;

      const pendingMarks = db.prepare(`
        SELECT COUNT(*) as count FROM marks 
        WHERE status IN ('draft', 'submitted')
      `).get() as { count: number };

      stats.pendingMarks = pendingMarks.count;
    } 
    else if (['hod', 'admin'].includes(payload.role)) {
      const totalStudents = db.prepare(`
        SELECT COUNT(*) as count FROM users WHERE role = 'student' AND is_active = 1
      `).get() as { count: number };

      stats.totalStudents = totalStudents.count;

      const totalTeachers = db.prepare(`
        SELECT COUNT(*) as count FROM users WHERE role = 'teacher' AND is_active = 1
      `).get() as { count: number };

      stats.totalTeachers = totalTeachers.count;

      const atRiskStudents = db.prepare(`
        SELECT COUNT(DISTINCT student_id) as count FROM track_reports 
        WHERE eligibility_status = 'at_risk'
      `).get() as { count: number };

      stats.atRiskStudents = atRiskStudents.count;

      const notEligibleStudents = db.prepare(`
        SELECT COUNT(DISTINCT student_id) as count FROM track_reports 
        WHERE eligibility_status = 'not_eligible'
      `).get() as { count: number };

      stats.notEligibleStudents = notEligibleStudents.count;

      const delayedTasks = db.prepare(`
        SELECT COUNT(*) as count FROM tasks WHERE status = 'delayed'
      `).get() as { count: number };

      stats.delayedTasks = delayedTasks.count;

      const pendingApprovals = db.prepare(`
        SELECT COUNT(*) as count FROM leave_requests 
        WHERE status IN ('created', 'under_review')
      `).get() as { count: number };

      stats.pendingApprovals = pendingApprovals.count;

      const lockedMarks = db.prepare(`
        SELECT COUNT(*) as count FROM marks WHERE status = 'locked'
      `).get() as { count: number };

      const totalMarks = db.prepare(`
        SELECT COUNT(*) as count FROM marks
      `).get() as { count: number };

      stats.marksStatus = {
        locked: lockedMarks.count,
        total: totalMarks.count
      };

      const attendanceBySubject = db.prepare(`
        SELECT sub.name,
          CAST(SUM(CASE WHEN ar.status = 'present' THEN 1 ELSE 0 END) AS REAL) / 
          CAST(COUNT(ar.id) AS REAL) * 100 as percentage
        FROM attendance_records ar
        JOIN attendance_sessions ass ON ar.session_id = ass.id
        JOIN subjects sub ON ass.subject_id = sub.id
        GROUP BY sub.id, sub.name
        ORDER BY percentage
      `).all();

      stats.attendanceBySubject = attendanceBySubject;

      const workflowStats = db.prepare(`
        SELECT type, status, COUNT(*) as count
        FROM workflows
        GROUP BY type, status
      `).all();

      stats.workflowStats = workflowStats;

      const taskCategoryStats = db.prepare(`
        SELECT category, status, COUNT(*) as count
        FROM tasks
        GROUP BY category, status
      `).all();

      stats.taskCategoryStats = taskCategoryStats;
    }

    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to get dashboard stats' }, { status: 500 });
  }
}
