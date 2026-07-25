// ==================== Teacher Dashboard Demo Data ====================

import { AlertTriangle, TrendingUp, CalendarDays, Clock3 } from 'lucide-react';

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const TODAY_CLASSES = [
  { time: '09:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 2', room: '301', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '12:00', subject: 'Computer Networks', batch: 'IT', group: '', room: 'Lab 3', type: 'Lab', faculty: 'Dr. Vineet Jain' },
  { time: '14:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '15:00', subject: 'Computer Networks', batch: 'CSE', group: '', room: 'Lab 2', type: 'Lab', faculty: 'Dr. Vineet Jain' },
]

export const SMART_STATUS = [
  { type: 'urgent' as const, text: '3 tasks urgent', icon: AlertTriangle },
  { type: 'success' as const, text: 'Attendance +3% this week', icon: TrendingUp },
  { type: 'info' as const, text: 'Admin meeting today at 2PM', icon: CalendarDays },
  { type: 'warning' as const, text: 'Next class in 20 minutes', icon: Clock3 },
]

export const BATCHES = [
  { id: 'cse-aiml', name: 'CSE-AIML', students: 80, subjects: ['Operating Systems', 'Computer Networks', 'Computer Design'], attendance: 92, pendingAssignments: 3, lastLecture: 'Feb 15, 2026', lecturesTaken: { 'Operating Systems': 15, 'Computer Networks': 12, 'Computer Design': 8 }, labsTaken: { 'Operating Systems': 8, 'Computer Networks': 6, 'Computer Design': 4 }, avgMarks: 85 },
  { id: 'cse', name: 'CSE', students: 80, subjects: ['Operating Systems', 'Computer Networks'], attendance: 88, pendingAssignments: 2, lastLecture: 'Feb 15, 2026', lecturesTaken: { 'Operating Systems': 12, 'Computer Networks': 10 }, labsTaken: { 'Operating Systems': 6, 'Computer Networks': 5 }, avgMarks: 82 },
  { id: 'it', name: 'IT', students: 80, subjects: ['Operating Systems', 'Computer Networks'], attendance: 85, pendingAssignments: 2, lastLecture: 'Feb 14, 2026', lecturesTaken: { 'Operating Systems': 10, 'Computer Networks': 8 }, labsTaken: { 'Operating Systems': 5, 'Computer Networks': 4 }, avgMarks: 80 },
]

export const STUDENTS: Record<string, any[]> = {
  'cse-aiml': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `CS-AIML-${String(i + 1).padStart(3, '0')}` })),
  'cse': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `CS-${String(i + 1).padStart(3, '0')}` })),
  'it': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `IT-${String(i + 1).padStart(3, '0')}` })),
}

export const TIMETABLE: Record<string, any[]> = {
  monday: [{ time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture' }, { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 2', room: '301', type: 'Lecture' }, { time: '11:00-12:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' }, { time: '13:00-14:00', subject: 'Computer Networks', batch: 'CSE', group: '', room: 'Lab 2', type: 'Lab' }, { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture' }],
  tuesday: [{ time: '09:00-10:00', subject: 'Computer Networks', batch: 'CSE-AIML', group: '', room: 'Lab 3', type: 'Lab' }, { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' }, { time: '11:00-12:00', subject: 'Operating Systems', batch: 'IT', group: '', room: '301', type: 'Lecture' }],
  wednesday: [{ time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture' }, { time: '10:00-11:00', subject: 'Computer Networks', batch: 'CSE-AIML', group: '', room: 'Lab 2', type: 'Lab' }, { time: '14:00-16:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: '', room: 'Lab 1', type: 'Lab' }],
  thursday: [{ time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' }, { time: '11:00-12:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture' }],
  friday: [{ time: '09:00-10:00', subject: 'Operating Systems', batch: 'IT', group: '', room: 'Room 101', type: 'Lecture' }, { time: '10:00-11:00', subject: 'Computer Networks', batch: 'IT', group: '', room: 'Lab 3', type: 'Lab' }, { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: 'Room 205', type: 'Lecture' }],
}

export const ACADEMIC_TASKS = {
  overdue: [{ id: 'a0', title: 'Submit Mid-Term Marks', subject: 'Operating Systems', batch: 'CSE-AIML', priority: 'CRITICAL', deadline: 'Feb 10', isOverdue: true }],
  todo: [
    { id: 'a1', title: 'Prepare Mid-Term Exam Paper - OS', subject: 'Operating Systems', batch: 'CSE-AIML', priority: 'HIGH', deadline: 'Feb 20', isOverdue: false },
    { id: 'a2', title: 'Upload Lecture Notes - CN Unit 4', subject: 'Computer Networks', batch: 'CSE', priority: 'MEDIUM', deadline: 'Feb 22', isOverdue: false },
    { id: 'a3', title: 'Create Lab Manual Experiment 7', subject: 'Computer Networks', batch: 'CSE-AIML', priority: 'LOW', deadline: 'Feb 25', isOverdue: false },
    { id: 'a4', title: 'OS Quiz - Memory Management', subject: 'Operating Systems', batch: 'CSE-AIML', priority: 'MEDIUM', deadline: 'Feb 24', isOverdue: false },
    { id: 'a5', title: 'Prepare Lab Assessment Questions', subject: 'Computer Networks', batch: 'IT', priority: 'HIGH', deadline: 'Feb 23', isOverdue: false },
  ],
  inProgress: [
    { id: 'a6', title: 'Grade Assignment 3 Submissions', subject: 'Operating Systems', batch: 'CSE-AIML', priority: 'MEDIUM', deadline: 'Feb 18', isOverdue: false },
    { id: 'a7', title: 'Review Exam Paper - CN', subject: 'Computer Networks', batch: 'CSE', priority: 'HIGH', deadline: 'Feb 19', isOverdue: false },
  ],
  done: [
    { id: 'a8', title: 'Upload Lecture Notes - OS Unit 3', subject: 'Operating Systems', batch: 'All', priority: 'LOW', deadline: 'Feb 12', isOverdue: false },
    { id: 'a9', title: 'Prepare Quiz Questions - OS', subject: 'Operating Systems', batch: 'CSE', priority: 'MEDIUM', deadline: 'Feb 10', isOverdue: false },
    { id: 'a10', title: 'Submit Lab Attendance', subject: 'Computer Networks', batch: 'All', priority: 'HIGH', deadline: 'Feb 8', isOverdue: false },
  ],
}

export const ADMIN_TASKS = {
  overdue: [{ id: 'ad0', title: 'Submit Jan Attendance Register', type: 'Documentation', priority: 'HIGH', deadline: 'Jan 31', from: 'Exam Cell', isOverdue: true }],
  todo: [
    { id: 'ad1', title: 'CO-PO Mapping Update', type: 'Accreditation', priority: 'CRITICAL', deadline: 'Feb 20', from: 'NBA Coordinator', isOverdue: false },
    { id: 'ad2', title: 'Faculty Meeting Minutes', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 22', from: 'HOD', isOverdue: false },
    { id: 'ad3', title: 'Submit Course File - OS', type: 'Accreditation', priority: 'HIGH', deadline: 'Feb 25', from: 'NBA Coordinator', isOverdue: false },
    { id: 'ad4', title: 'Prepare Department Budget', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 28', from: 'Principal', isOverdue: false },
    { id: 'ad5', title: 'Update Syllabus - OS', type: 'Academic', priority: 'HIGH', deadline: 'Feb 24', from: 'HOD', isOverdue: false },
  ],
  inProgress: [{ id: 'ad6', title: 'Prepare Department Report', type: 'Administrative', priority: 'HIGH', deadline: 'Feb 25', from: 'Principal', isOverdue: false }],
  done: [
    { id: 'ad7', title: 'Complete Invigilation Duty', type: 'Exam', priority: 'HIGH', deadline: 'Feb 8', from: 'Exam Cell', isOverdue: false },
    { id: 'ad8', title: 'Submit Faculty Profile', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 5', from: 'HR', isOverdue: false },
  ],
}

export const ASSIGNMENTS_DATA = [
  { id: 1, title: 'OS Assignment 4 - Deadlock Prevention', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: 'Feb 20', maxMarks: 20, submitted: 45, total: 80, isLate: false },
  { id: 2, title: 'CN Lab Report - Routing Protocol', batch: 'CSE', subject: 'Computer Networks', dueDate: 'Feb 22', maxMarks: 30, submitted: 55, total: 80, isLate: false },
  { id: 3, title: 'CD Mini Project Phase 2', batch: 'CSE-AIML', subject: 'Computer Design', dueDate: 'Feb 18', maxMarks: 50, submitted: 72, total: 80, isLate: true },
  { id: 4, title: 'OS Quiz - Scheduling Algorithms', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: 'Feb 24', maxMarks: 10, submitted: 0, total: 80, isLate: false },
  { id: 5, title: 'CN Lab Exercise - Socket Programming', batch: 'IT', subject: 'Computer Networks', dueDate: 'Feb 15', maxMarks: 25, submitted: 68, total: 80, isLate: true },
  { id: 6, title: 'OS Assignment 5 - Memory Management', batch: 'CSE', subject: 'Operating Systems', dueDate: 'Feb 28', maxMarks: 20, submitted: 12, total: 80, isLate: false },
  { id: 7, title: 'CD Circuit Design Project', batch: 'CSE-AIML', subject: 'Computer Design', dueDate: 'Mar 01', maxMarks: 40, submitted: 25, total: 80, isLate: false },
]

export const MARKS_DATA = Array.from({ length: 20 }, (_, i) => ({
  studentId: i + 1, studentName: `Student ${i + 1}`, roll: `CS-AIML-${String(i + 1).padStart(3, '0')}`,
  marks: i < 10 ? Math.floor(Math.random() * 15) + 10 : null,
  status: i < 10 ? 'Graded' : 'Pending',
  grade: i < 10 ? (['A', 'B', 'C', 'B', 'A', 'C', 'B', 'A', 'A', 'B'] as const)[i] : null,
}))

export const ANALYTICS_DATA = {
  teacherStats: { totalLectures: 32, totalLabs: 18, avgAttendance: 88, assignmentsGiven: 12, hoursThisMonth: 78, studentInteraction: 240 },
  batchPerformance: [
    { name: 'CSE-AIML', attendance: 92, avgMarks: 85, trend: 2 },
    { name: 'CSE', attendance: 88, avgMarks: 82, trend: -1 },
    { name: 'IT', attendance: 85, avgMarks: 80, trend: -4 },
  ],
  riskAlerts: [
    { type: 'warning', message: 'CSE attendance dropped 4% this week', batch: 'CSE' },
    { type: 'danger', message: 'IT batch has 3 assignments overdue', batch: 'IT' },
  ],
}

export const ANNOUNCEMENTS = {
  toStudents: [
    { id: 1, title: 'Mid-Term Exam Schedule', date: 'Feb 15, 2026', content: 'Mid-term exams from March 1-15. Syllabus covers Units 1-5.', from: 'Dr. Vineet Jain', pinned: true, read: false, status: 'active' },
    { id: 2, title: 'Lab Assessment Notice', date: 'Feb 14, 2026', content: 'Practical exams include lab performance and viva voce.', from: 'Dr. Vineet Jain', pinned: false, read: true, status: 'active' },
    { id: 3, title: 'Class Suspension Notice', date: 'Feb 20, 2026', content: 'Classes suspended on Feb 20 due to faculty meeting.', from: 'Dr. Vineet Jain', pinned: false, read: false, status: 'expiring' },
    { id: 4, title: 'Guest Lecture Announcement', date: 'Feb 18, 2026', content: 'Guest lecture on AI/ML by industry expert on Feb 25.', from: 'Dr. Vineet Jain', pinned: false, read: false, status: 'active' },
  ],
  fromAdmin: [
    { id: 1, title: 'Faculty Meeting - Feb 20', date: 'Feb 12, 2026', content: 'Monthly faculty meeting on Feb 20 at 2 PM. Attendance mandatory.', from: 'HOD Office', pinned: true, read: false, status: 'active' },
    { id: 2, title: 'NBA Visit Preparation', date: 'Feb 10, 2026', content: 'All faculty must submit course files by Feb 25.', from: 'NBA Coordinator', pinned: false, read: false, status: 'active' },
    { id: 3, title: 'Semester Results Submission', date: 'Feb 8, 2026', content: 'Submit internal assessment marks by Feb 28.', from: 'Exam Cell', pinned: false, read: true, status: 'expiring' },
  ],
}

export const FACULTY_DIRECTORY = [
  { name: 'Dr. Amit Kumar', role: 'HOD, CSE Department', email: 'hod.cse@campus.edu', phone: '+91 98765 43210', avatar: 'AK', specialization: 'Machine Learning' },
  { name: 'Dr. Suresh Kumar', role: 'Professor', email: 'suresh@campus.edu', phone: '+91 98765 43211', avatar: 'SK', specialization: 'Data Structures' },
  { name: 'Dr. Rameshwar Rao', role: 'Associate Professor', email: 'rameshwar@campus.edu', phone: '+91 98765 43212', avatar: 'RR', specialization: 'Computer Networks' },
  { name: 'Dr. Vineet Jain', role: 'Assistant Professor', email: 'vineet.jain@campus.edu', phone: '+91 98765 43213', avatar: 'VJ', specialization: 'Operating Systems' },
  { name: 'Dr. Priya Sharma', role: 'Assistant Professor', email: 'priya@campus.edu', phone: '+91 98765 43214', avatar: 'PS', specialization: 'Database Systems' },
  { name: 'Dr. Rahul Gupta', role: 'Assistant Professor', email: 'rahul@campus.edu', phone: '+91 98765 43215', avatar: 'RG', specialization: 'Web Technologies' },
]
