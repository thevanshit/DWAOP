export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Workflow {
  id: string;
  type: 'attendance' | 'assignment' | 'marks' | 'leave' | 'task';
  title: string;
  status: 'created' | 'in_progress' | 'under_review' | 'finalised' | 'locked' | 'done' | 'delayed';
  assignee?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

export interface Assignment extends Workflow {
  type: 'assignment';
  subject: string;
  maxMarks: number;
  marks?: number;
  submissionDate?: Date;
  deadline: Date;
  submitted: boolean;
  late: boolean;
}

export interface AttendanceSession extends Workflow {
  type: 'attendance';
  subject: string;
  date: Date;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
}

export interface LeaveRequest extends Workflow {
  type: 'leave';
  leaveType: 'medical' | 'academic' | 'personal' | 'emergency' | 'official';
  startDate: Date;
  endDate: Date;
  reason: string;
  documents?: string[];
}

export interface Task extends Workflow {
  type: 'task';
  description: string;
  committee?: string;
  attachments?: string[];
}

export interface StudentTrackReport {
  studentId: string;
  semester: string;
  status: 'draft' | 'submitted' | 'under_review' | 'finalised' | 'locked';
  attendance: {
    subject: string;
    percentage: number;
    totalClasses: number;
    attendedClasses: number;
  }[];
  assignments: Assignment[];
  internalMarks: {
    subject: string;
    marks: number;
    components: {
      assignments: number;
      tests: number;
      attendance: number;
    };
  }[];
  eligibility: 'eligible' | 'at_risk' | 'not_eligible';
  riskIndicators: string[];
}

export interface DashboardStats {
  pendingWorkflows: number;
  upcomingDeadlines: number;
  atRiskStudents?: number;
  delayedTasks?: number;
  attendancePercentage?: number;
}
