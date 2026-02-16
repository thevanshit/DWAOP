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
  category?: TaskCategory;
  assigneeDetails?: AssigneeInfo;
  comments?: Comment[];
  subtasks?: SubTask[];
  estimatedHours?: number;
  loggedHours?: number;
}

export type TaskCategory = 'teaching' | 'administrative' | 'committee' | 'exam' | 'accreditation' | 'research' | 'events';

export interface AssigneeInfo {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  assignedBy: string;
  assignedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  attachments?: string[];
}

export interface SubTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  assignee?: string;
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  specialization?: string;
  isOnline?: boolean;
  tasksAssigned?: number;
  tasksCompleted?: number;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  color?: string;
  description?: string;
  taskCount: number;
}

export interface Committee {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  activeTasks: number;
}
