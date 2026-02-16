import { Task, TeamMember, Project, Committee } from '@/types';

// ============ BATCHES ============
export const BATCHES = [
  { id: 'batch-1', name: 'CSE AIML', fullName: 'CSE (AI & ML) 21SCSE1', shortName: 'CSE-AIML', year: 2021, students: 45 },
  { id: 'batch-2', name: 'CSE', fullName: 'Computer Science & Engineering 21SCSE2', shortName: 'CSE', year: 2021, students: 55 },
  { id: 'batch-3', name: 'IT', fullName: 'Information Technology 21SIT1', shortName: 'IT', year: 2021, students: 48 },
  { id: 'batch-4', name: 'CSE (Yoga)', fullName: 'CSE (Yoga Tech) 21SCSE3', shortName: 'CSE-Yoga', year: 2021, students: 30 },
];

// ============ SUBJECTS ============
export const MY_SUBJECTS = [
  {
    id: 'subj-1',
    name: 'Operating Systems',
    code: 'CS-301',
    description: 'Theory and practical concepts of operating systems',
    batches: ['batch-1', 'batch-2', 'batch-3'],
    color: '#3B82F6',
    lecturesPerWeek: 3,
    practicalsPerWeek: 2,
  },
  {
    id: 'subj-2',
    name: 'Computer Networks',
    code: 'CS-302',
    description: 'Network protocols, architecture and communication',
    batches: ['batch-1', 'batch-2'],
    color: '#10B981',
    lecturesPerWeek: 2,
    practicalsPerWeek: 2,
  },
  {
    id: 'subj-3',
    name: 'Computer Design',
    code: 'CS-303',
    description: 'Digital logic design and computer architecture',
    batches: ['batch-1', 'batch-4'],
    color: '#8B5CF6',
    lecturesPerWeek: 2,
    practicalsPerWeek: 1,
  },
];

// ============ TIMETABLE ============
export const TIMETABLE = {
  monday: [
    { id: 't1', time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Room 301', type: 'Lecture' },
    { id: 't2', time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Room 301', type: 'Lecture' },
    { id: 't3', time: '11:00-12:00', subject: 'Computer Networks', batch: 'CSE', room: 'Lab 2', type: 'Practical' },
    { id: 't4', time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE AIML', room: 'Room 205', type: 'Lecture' },
  ],
  tuesday: [
    { id: 't5', time: '09:00-10:00', subject: 'Computer Networks', batch: 'CSE AIML', room: 'Lab 3', type: 'Practical' },
    { id: 't6', time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', room: 'Room 302', type: 'Lecture' },
    { id: 't7', time: '11:00-12:00', subject: 'Computer Design', batch: 'CSE (Yoga)', room: 'Room 101', type: 'Lecture' },
  ],
  wednesday: [
    { id: 't8', time: '09:00-10:00', subject: 'Operating Systems', batch: 'IT', room: 'Room 301', type: 'Lecture' },
    { id: 't9', time: '10:00-11:00', subject: 'Computer Networks', batch: 'CSE', room: 'Room 205', type: 'Lecture' },
    { id: 't10', time: '14:00-16:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Lab 1', type: 'Practical' },
  ],
  thursday: [
    { id: 't11', time: '09:00-10:00', subject: 'Computer Design', batch: 'CSE', room: 'Lab 4', type: 'Practical' },
    { id: 't12', time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE (Yoga)', room: 'Room 302', type: 'Lecture' },
    { id: 't13', time: '11:00-12:00', subject: 'Computer Networks', batch: 'CSE AIML', room: 'Room 301', type: 'Lecture' },
  ],
  friday: [
    { id: 't14', time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE', room: 'Room 101', type: 'Lecture' },
    { id: 't15', time: '10:00-11:00', subject: 'Computer Networks', batch: 'IT', room: 'Lab 2', type: 'Practical' },
    { id: 't16', time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE AIML', room: 'Room 205', type: 'Lecture' },
  ],
  saturday: [
    { id: 't17', time: '09:00-11:00', subject: 'Operating Systems', batch: 'CSE', room: 'Lab 1', type: 'Practical' },
  ],
};

// ============ STUDENTS FOR ATTENDANCE ============
export const STUDENTS = {
  'batch-1': Array.from({ length: 45 }, (_, i) => ({
    id: `s${i + 1}`,
    name: `Student ${i + 1}`,
    rollNumber: `21SCSE1${String(i + 1).padStart(3, '0')}`,
    status: Math.random() > 0.2 ? 'present' : 'absent',
  })),
  'batch-2': Array.from({ length: 55 }, (_, i) => ({
    id: `s${i + 46}`,
    name: `Student ${i + 46}`,
    rollNumber: `21SCSE2${String(i + 1).padStart(3, '0')}`,
    status: Math.random() > 0.2 ? 'present' : 'absent',
  })),
  'batch-3': Array.from({ length: 48 }, (_, i) => ({
    id: `s${i + 101}`,
    name: `Student ${i + 101}`,
    rollNumber: `21SIT1${String(i + 1).padStart(3, '0')}`,
    status: Math.random() > 0.2 ? 'present' : 'absent',
  })),
  'batch-4': Array.from({ length: 30 }, (_, i) => ({
    id: `s${i + 149}`,
    name: `Student ${i + 149}`,
    rollNumber: `21SCSE3${String(i + 1).padStart(3, '0')}`,
    status: Math.random() > 0.2 ? 'present' : 'absent',
  })),
};

// ============ ASSIGNMENTS ============
export const ASSIGNMENTS = [
  {
    id: 'assn-1',
    title: 'Process Scheduling Algorithm Implementation',
    subject: 'Operating Systems',
    subjectId: 'subj-1',
    batch: 'CSE AIML',
    batchId: 'batch-1',
    description: 'Implement FCFS, SJF, and Round Robin scheduling algorithms in C',
    maxMarks: 20,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'active',
    submissions: 28,
    totalStudents: 45,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'assn-2',
    title: 'Socket Programming Lab',
    subject: 'Computer Networks',
    subjectId: 'subj-2',
    batch: 'CSE',
    batchId: 'batch-2',
    description: 'Create a client-server application using TCP sockets',
    maxMarks: 25,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    submissions: 35,
    totalStudents: 55,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'assn-3',
    title: 'Digital Circuit Design Project',
    subject: 'Computer Design',
    subjectId: 'subj-3',
    batch: 'CSE AIML',
    batchId: 'batch-1',
    description: 'Design a 4-bit ALU using combinational logic',
    maxMarks: 30,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: 'active',
    submissions: 12,
    totalStudents: 45,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'assn-4',
    title: 'Memory Management Simulation',
    subject: 'Operating Systems',
    subjectId: 'subj-1',
    batch: 'IT',
    batchId: 'batch-3',
    description: 'Simulate paging and segmentation techniques',
    maxMarks: 20,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'closed',
    submissions: 44,
    totalStudents: 48,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

// ============ FACULTY DIRECTORY (Based on GJUST CSE Dept) ============
export const FACULTY_DIRECTORY: TeamMember[] = [
  {
    id: 'fac-001',
    name: 'Dr. S. K. Singh',
    email: 'hod.cse@gjust.edu.in',
    avatar: 'SK',
    role: 'HOD & Chairperson',
    department: 'Computer Science & Engineering',
    specialization: 'Software Engineering',
    isOnline: true,
    tasksAssigned: 3,
    tasksCompleted: 45,
  },
  {
    id: 'fac-002',
    name: 'Dr. R. K. Sharma',
    email: 'rksharma@gjust.edu.in',
    avatar: 'RK',
    role: 'Professor',
    department: 'Computer Science & Engineering',
    specialization: 'Artificial Intelligence',
    isOnline: true,
    tasksAssigned: 5,
    tasksCompleted: 62,
  },
  {
    id: 'fac-003',
    name: 'Dr. Anita Singh',
    email: 'anita.singh@gjust.edu.in',
    avatar: 'AS',
    role: 'Associate Professor',
    department: 'Computer Science & Engineering',
    specialization: 'Machine Learning',
    isOnline: false,
    tasksAssigned: 4,
    tasksCompleted: 38,
  },
  {
    id: 'fac-004',
    name: 'Dr. P. K. Gupta',
    email: 'pkgupta@gjust.edu.in',
    avatar: 'PG',
    role: 'Associate Professor',
    department: 'Computer Science & Engineering',
    specialization: 'Database Systems',
    isOnline: true,
    tasksAssigned: 6,
    tasksCompleted: 51,
  },
  {
    id: 'fac-005',
    name: 'Dr. Vineet Jain',
    email: 'vineet.jain@gjust.edu.in',
    avatar: 'VJ',
    role: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    specialization: 'Computer Networks',
    isOnline: true,
    tasksAssigned: 4,
    tasksCompleted: 28,
  },
  {
    id: 'fac-006',
    name: 'Ms. Richa Sharma',
    email: 'richa.sharma@gjust.edu.in',
    avatar: 'RS',
    role: 'Assistant Professor',
    department: 'Computer Science & Engineering',
    specialization: 'Cyber Security',
    isOnline: false,
    tasksAssigned: 3,
    tasksCompleted: 22,
  },
  {
    id: 'fac-007',
    name: 'Mr. Sandeep Kumar',
    email: 'sandeep.kumar@gjust.edu.in',
    avatar: 'SK',
    role: 'Guest Faculty',
    department: 'Computer Science & Engineering',
    specialization: 'Web Development',
    isOnline: true,
    tasksAssigned: 2,
    tasksCompleted: 15,
  },
  {
    id: 'fac-008',
    name: 'Ms. Priyanka',
    email: 'priyanka@gjust.edu.in',
    avatar: 'PK',
    role: 'Guest Faculty',
    department: 'Computer Science & Engineering',
    specialization: 'Data Science',
    isOnline: false,
    tasksAssigned: 2,
    tasksCompleted: 12,
  },
];

// ============ COMMITTEES ============
export const COMMITTEES: Committee[] = [
  { id: 'comm-1', name: 'Academic Board', description: 'Curriculum and academic policies', memberCount: 8, activeTasks: 5 },
  { id: 'comm-2', name: 'Exam Committee', description: 'Examination planning and execution', memberCount: 6, activeTasks: 12 },
  { id: 'comm-3', name: 'Events Committee', description: 'Technical symposiums and events', memberCount: 5, activeTasks: 8 },
  { id: 'comm-4', name: 'Accreditation Team', description: 'NBA NAAC compliance', memberCount: 4, activeTasks: 15 },
  { id: 'comm-5', name: 'Research Committee', description: 'Research and publications', memberCount: 6, activeTasks: 3 },
];

// ============ TASKS ============
export const TASKS: Task[] = [
  {
    id: 'TASK-001',
    type: 'task',
    title: 'Submit Question Papers - End Sem',
    description: 'Prepare and submit OS and CN question papers for end semester exams',
    status: 'created',
    assignee: 'You',
    assigneeDetails: {
      id: 'fac-001',
      name: 'Dr. S. K. Singh',
      avatar: 'SK',
      role: 'HOD',
      assignedBy: 'Dr. S. K. Singh',
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    priority: 'high',
    committee: 'Exam Committee',
    category: 'exam',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'TASK-002',
    type: 'task',
    title: 'Review Curriculum for Next Sem',
    description: 'Review and update OS syllabus as per new AICTE guidelines',
    status: 'in_progress',
    assignee: 'You',
    assigneeDetails: {
      id: 'fac-002',
      name: 'Dr. R. K. Sharma',
      avatar: 'RK',
      role: 'Professor',
      assignedBy: 'Dr. S. K. Singh',
      assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    committee: 'Academic Board',
    category: 'teaching',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'TASK-003',
    type: 'task',
    title: 'Lab Equipment Maintenance Report',
    description: 'Submit report on lab equipment needing repair/replacement',
    status: 'under_review',
    assignee: 'You',
    assigneeDetails: {
      id: 'fac-005',
      name: 'Dr. Vineet Jain',
      avatar: 'VJ',
      role: 'Assistant Professor',
      assignedBy: 'Dr. S. K. Singh',
      assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    priority: 'low',
    committee: 'Administration',
    category: 'administrative',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
  {
    id: 'TASK-004',
    type: 'task',
    title: 'Coordinate Guest Lecture',
    description: 'Organize guest lecture on AI/ML trends for final year students',
    status: 'done',
    assignee: 'You',
    assigneeDetails: {
      id: 'fac-003',
      name: 'Dr. Anita Singh',
      avatar: 'AS',
      role: 'Associate Professor',
      assignedBy: 'Dr. P. K. Gupta',
      assignedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    },
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    committee: 'Events Committee',
    category: 'events',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'TASK-005',
    type: 'task',
    title: 'NBA Documentation',
    description: 'Complete course file documentation for NBA visit',
    status: 'created',
    assignee: 'You',
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    priority: 'critical',
    committee: 'Accreditation Team',
    category: 'accreditation',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'TASK-006',
    type: 'task',
    title: 'Evaluate Research Papers',
    description: 'Review 3 papers for International Conference on CS',
    status: 'in_progress',
    assignee: 'You',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    committee: 'Research Committee',
    category: 'research',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  },
];

// ============ ATTENDANCE SESSIONS ============
export const ATTENDANCE_SESSIONS = [
  { id: 'att-1', subject: 'Operating Systems', batch: 'CSE AIML', date: new Date(), total: 45, present: 38, absent: 7, status: 'completed' },
  { id: 'att-2', subject: 'Computer Networks', batch: 'CSE', date: new Date(Date.now() - 24 * 60 * 60 * 1000), total: 55, present: 48, absent: 7, status: 'completed' },
  { id: 'att-3', subject: 'Computer Design', batch: 'CSE AIML', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), total: 45, present: 42, absent: 3, status: 'completed' },
];

// ============ DASHBOARD STATS ============
export const DASHBOARD_STATS = {
  totalStudents: 178,
  classesToday: 4,
  pendingAssignments: 3,
  avgAttendance: 87.5,
  activeTasks: 6,
  completedTasks: 24,
};

// ============ KANBAN COLUMNS ============
export const KANBAN_COLUMNS = [
  { id: 'created', label: 'To Do', color: '#5E6C84' },
  { id: 'in_progress', label: 'In Progress', color: '#0052CC' },
  { id: 'under_review', label: 'In Review', color: '#FFAB00' },
  { id: 'done', label: 'Done', color: '#36B37E' },
];

// ============ LEAVE REQUESTS ============
export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  batch: string;
  subject?: string;
  leaveType: 'medical' | 'academic' | 'personal' | 'emergency' | 'official';
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'created' | 'under_review' | 'approved' | 'rejected';
  appliedDate: Date;
  reviewedBy?: string;
  reviewedDate?: Date;
  comments?: string;
}

export const LEAVE_REQUESTS: LeaveRequest[] = [
  {
    id: 'leave-1',
    studentId: 's001',
    studentName: 'Amit Kumar',
    rollNumber: '21SCSE1001',
    batch: 'CSE AIML',
    leaveType: 'medical',
    startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    reason: 'Medical leave for dental surgery - attached medical certificate',
    status: 'under_review',
    appliedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'leave-2',
    studentId: 's012',
    studentName: 'Priya Sharma',
    rollNumber: '21SCSE1012',
    batch: 'CSE AIML',
    leaveType: 'academic',
    startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    reason: 'Workshop on AI/ML at IIT Delhi - participation confirmed',
    status: 'created',
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'leave-3',
    studentId: 's023',
    studentName: 'Rahul Verma',
    rollNumber: '21SCSE1023',
    batch: 'CSE',
    leaveType: 'personal',
    startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    reason: 'Family function - wedding of elder sister',
    status: 'approved',
    appliedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    reviewedBy: 'Dr. Vineet Jain',
    reviewedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    comments: 'Approved with submission of invitation card',
  },
  {
    id: 'leave-4',
    studentId: 's034',
    studentName: 'Sneha Gupta',
    rollNumber: '21SIT1034',
    batch: 'IT',
    leaveType: 'medical',
    startDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now()),
    reason: 'Food poisoning - required rest',
    status: 'approved',
    appliedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    reviewedBy: 'Dr. P. K. Gupta',
    reviewedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'leave-5',
    studentId: 's045',
    studentName: 'Kunal Singh',
    rollNumber: '21SCSE1045',
    batch: 'CSE',
    leaveType: 'official',
    startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    reason: 'NCC camp - annual training',
    status: 'under_review',
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'leave-6',
    studentId: 's056',
    studentName: 'Anjali Patel',
    rollNumber: '21SCSE1056',
    batch: 'CSE AIML',
    leaveType: 'personal',
    startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
    reason: 'Personal work',
    status: 'rejected',
    appliedDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
    reviewedBy: 'Dr. Vineet Jain',
    reviewedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    comments: 'Cannot approve - prior intimation required',
  },
];

// ============ ANNOUNCEMENTS ============
export interface Announcement {
  id: string;
  title: string;
  message: string;
  priority: 'normal' | 'important' | 'urgent';
  batches: string[];
  subject?: string;
  createdBy: string;
  createdAt: Date;
  status: 'draft' | 'published';
}

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Mid-Term Examination Schedule',
    message: 'The Mid-Term examinations will be conducted from March 1-5, 2026. Detailed schedule will be uploaded soon. All students must carry their ID cards.',
    priority: 'important',
    batches: ['CSE AIML', 'CSE', 'IT', 'CSE-Yoga'],
    createdBy: 'Dr. S. K. Singh',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status: 'published',
  },
  {
    id: 'ann-2',
    title: 'OS Assignment Deadline Extended',
    message: 'The deadline for Operating Systems Assignment 3 has been extended to February 26, 2026 due to technical issues with the submission portal.',
    priority: 'normal',
    batches: ['CSE AIML', 'CSE', 'IT'],
    subject: 'Operating Systems',
    createdBy: 'Dr. Vineet Jain',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    status: 'published',
  },
  {
    id: 'ann-3',
    title: 'Guest Lecture on AI/ML',
    message: 'Industry expert from Google will deliver a guest lecture on February 18, 2026 at 2 PM in Seminar Hall. Attendance is compulsory for CSE-AIML students.',
    priority: 'important',
    batches: ['CSE AIML'],
    createdBy: 'Dr. R. K. Sharma',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    status: 'published',
  },
  {
    id: 'ann-4',
    title: 'Lab Maintenance Notice',
    message: 'Computer Lab 1 will be closed for maintenance on February 20, 2026. All practical classes stand cancelled for that day.',
    priority: 'urgent',
    batches: ['CSE AIML', 'CSE', 'IT'],
    createdBy: 'Dr. P. K. Gupta',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    status: 'published',
  },
];

// ============ MARKS DATA ============
export interface StudentMarks {
  rollNumber: string;
  name: string;
  minor1: number | null;
  minor2: number | null;
  assignment: number | null;
  total: number | null;
}

export interface MarksEntry {
  id: string;
  subject: string;
  subjectId: string;
  batch: string;
  examType: 'minor1' | 'minor2' | 'assignment';
  status: 'draft' | 'under_review' | 'finalized';
  createdAt: Date;
  updatedAt: Date;
  finalizedBy?: string;
  finalizedAt?: Date;
  students: StudentMarks[];
}

export const MARKS_ENTRIES: MarksEntry[] = [
  {
    id: 'marks-1',
    subject: 'Operating Systems',
    subjectId: 'subj-1',
    batch: 'CSE AIML',
    examType: 'minor1',
    status: 'finalized',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    finalizedBy: 'Dr. Vineet Jain',
    finalizedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    students: [
      { rollNumber: '21SCSE1001', name: 'Amit Kumar', minor1: 18, minor2: null, assignment: null, total: 18 },
      { rollNumber: '21SCSE1002', name: 'Anjali Patel', minor1: 16, minor2: null, assignment: null, total: 16 },
      { rollNumber: '21SCSE1003', name: 'Rahul Verma', minor1: 20, minor2: null, assignment: null, total: 20 },
      { rollNumber: '21SCSE1004', name: 'Sneha Gupta', minor1: 15, minor2: null, assignment: null, total: 15 },
      { rollNumber: '21SCSE1005', name: 'Kunal Singh', minor1: 19, minor2: null, assignment: null, total: 19 },
    ],
  },
  {
    id: 'marks-2',
    subject: 'Computer Networks',
    subjectId: 'subj-2',
    batch: 'CSE AIML',
    examType: 'minor1',
    status: 'under_review',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    students: [
      { rollNumber: '21SCSE1001', name: 'Amit Kumar', minor1: 17, minor2: null, assignment: null, total: 17 },
      { rollNumber: '21SCSE1002', name: 'Anjali Patel', minor1: 18, minor2: null, assignment: null, total: 18 },
      { rollNumber: '21SCSE1003', name: 'Rahul Verma', minor1: 16, minor2: null, assignment: null, total: 16 },
      { rollNumber: '21SCSE1004', name: 'Sneha Gupta', minor1: 14, minor2: null, assignment: null, total: 14 },
      { rollNumber: '21SCSE1005', name: 'Kunal Singh', minor1: 19, minor2: null, assignment: null, total: 19 },
    ],
  },
  {
    id: 'marks-3',
    subject: 'Operating Systems',
    subjectId: 'subj-1',
    batch: 'CSE AIML',
    examType: 'minor2',
    status: 'draft',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    students: [
      { rollNumber: '21SCSE1001', name: 'Amit Kumar', minor1: 18, minor2: 16, assignment: null, total: null },
      { rollNumber: '21SCSE1002', name: 'Anjali Patel', minor1: 16, minor2: 15, assignment: null, total: null },
      { rollNumber: '21SCSE1003', name: 'Rahul Verma', minor1: 20, minor2: 18, assignment: null, total: null },
      { rollNumber: '21SCSE1004', name: 'Sneha Gupta', minor1: 15, minor2: 14, assignment: null, total: null },
      { rollNumber: '21SCSE1005', name: 'Kunal Singh', minor1: 19, minor2: 17, assignment: null, total: null },
    ],
  },
];

// ============ STUDENT ANALYTICS ============
export interface StudentAnalytics {
  batch: string;
  subject: string;
  avgAttendance: number;
  atRiskStudents: number;
  totalStudents: number;
  topPerformers: number;
  avgMarks: number;
}

export const STUDENT_ANALYTICS: StudentAnalytics[] = [
  { batch: 'CSE AIML', subject: 'Operating Systems', avgAttendance: 88, atRiskStudents: 3, totalStudents: 45, topPerformers: 12, avgMarks: 72 },
  { batch: 'CSE AIML', subject: 'Computer Networks', avgAttendance: 85, atRiskStudents: 5, totalStudents: 45, topPerformers: 10, avgMarks: 68 },
  { batch: 'CSE AIML', subject: 'Computer Design', avgAttendance: 92, atRiskStudents: 1, totalStudents: 45, topPerformers: 15, avgMarks: 76 },
  { batch: 'CSE', subject: 'Operating Systems', avgAttendance: 82, atRiskStudents: 8, totalStudents: 55, topPerformers: 14, avgMarks: 65 },
  { batch: 'CSE', subject: 'Computer Networks', avgAttendance: 79, atRiskStudents: 10, totalStudents: 55, topPerformers: 11, avgMarks: 62 },
  { batch: 'IT', subject: 'Operating Systems', avgAttendance: 86, atRiskStudents: 4, totalStudents: 48, topPerformers: 13, avgMarks: 70 },
  { batch: 'CSE-Yoga', subject: 'Computer Design', avgAttendance: 90, atRiskStudents: 2, totalStudents: 30, topPerformers: 8, avgMarks: 74 },
];

// ============ COMMITTEE MEMBERS ============
export const COMMITTEE_MEMBERS: Record<string, string[]> = {
  'Academic Board': ['fac-001', 'fac-002', 'fac-003', 'fac-004', 'fac-005', 'fac-006', 'fac-007', 'fac-008'],
  'Exam Committee': ['fac-001', 'fac-002', 'fac-004', 'fac-005', 'fac-006', 'fac-007'],
  'Events Committee': ['fac-003', 'fac-005', 'fac-006', 'fac-007', 'fac-008'],
  'Accreditation Team': ['fac-001', 'fac-002', 'fac-003', 'fac-004'],
  'Research Committee': ['fac-002', 'fac-003', 'fac-004', 'fac-005', 'fac-006', 'fac-008'],
};
