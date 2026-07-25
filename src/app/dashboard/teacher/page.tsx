'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, FileText, Users, Kanban, Settings, 
  Bell, Plus, X, ChevronLeft, ChevronRight, ClipboardCheck, Award, MessageSquare, 
  CheckCircle2, Clock, AlertTriangle, TrendingUp, Users2, CalendarDays, 
  Clipboard, BarChart3, Send, Layers, UserCheck, FileUp,
  BookMarked, ClipboardList, BarChart, Megaphone, Search, Filter, Upload,
  Download, Eye, Edit, Trash2, Save, UserMinus, UserPlus, Clock3, Check,
  AlertCircle, Pin, Archive, PanelLeftClose, PanelLeft, ArrowUpRight, ArrowDownRight,
  BookOpen, GraduationCap, Target, Activity, Sparkles, Mail, Phone, User
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'batches' | 'timetable' | 'attendance' | 'assignments' | 'tasks' | 'marks' | 'analytics' | 'announcements' | 'directory' | 'settings';

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// ==================== DEMO DATA ====================

const TODAY_CLASSES = [
  { time: '09:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 2', room: '301', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '12:00', subject: 'Computer Networks', batch: 'IT', group: '', room: 'Lab 3', type: 'Lab', faculty: 'Dr. Vineet Jain' },
  { time: '14:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture', faculty: 'Dr. Vineet Jain' },
  { time: '15:00', subject: 'Computer Networks', batch: 'CSE', group: '', room: 'Lab 2', type: 'Lab', faculty: 'Dr. Vineet Jain' },
];

const SMART_STATUS = [
  { type: 'urgent', text: '3 tasks urgent', icon: AlertTriangle },
  { type: 'success', text: 'Attendance +3% this week', icon: TrendingUp },
  { type: 'info', text: 'Admin meeting today at 2PM', icon: CalendarDays },
  { type: 'warning', text: 'Next class in 20 minutes', icon: Clock3 },
];

const BATCHES = [
  { 
    id: 'cse-aiml', 
    name: 'CSE-AIML', 
    students: 80,
    subjects: ['Operating Systems', 'Computer Networks', 'Computer Design'],
    attendance: 92,
    pendingAssignments: 3,
    lastLecture: 'Feb 15, 2026',
    lecturesTaken: { 'Operating Systems': 15, 'Computer Networks': 12, 'Computer Design': 8 },
    labsTaken: { 'Operating Systems': 8, 'Computer Networks': 6, 'Computer Design': 4 },
    avgMarks: 85,
  },
  { 
    id: 'cse', 
    name: 'CSE', 
    students: 80,
    subjects: ['Operating Systems', 'Computer Networks'],
    attendance: 88,
    pendingAssignments: 2,
    lastLecture: 'Feb 15, 2026',
    lecturesTaken: { 'Operating Systems': 12, 'Computer Networks': 10 },
    labsTaken: { 'Operating Systems': 6, 'Computer Networks': 5 },
    avgMarks: 82,
  },
  { 
    id: 'it', 
    name: 'IT', 
    students: 80,
    subjects: ['Operating Systems', 'Computer Networks'],
    attendance: 85,
    pendingAssignments: 2,
    lastLecture: 'Feb 14, 2026',
    lecturesTaken: { 'Operating Systems': 10, 'Computer Networks': 8 },
    labsTaken: { 'Operating Systems': 5, 'Computer Networks': 4 },
    avgMarks: 80,
  },
];

const STUDENTS = {
  'cse-aiml': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `CS-AIML-${String(i + 1).padStart(3, '0')}` })),
  'cse': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `CS-${String(i + 1).padStart(3, '0')}` })),
  'it': Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Student ${i + 1}`, roll: `IT-${String(i + 1).padStart(3, '0')}` })),
};

const TIMETABLE = {
  monday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture' },
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 2', room: '301', type: 'Lecture' },
    { time: '11:00-12:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' },
    { time: '13:00-14:00', subject: 'Computer Networks', batch: 'CSE', group: '', room: 'Lab 2', type: 'Lab' },
    { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture' },
  ],
  tuesday: [
    { time: '09:00-10:00', subject: 'Computer Networks', batch: 'CSE-AIML', group: '', room: 'Lab 3', type: 'Lab' },
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' },
    { time: '11:00-12:00', subject: 'Operating Systems', batch: 'IT', group: '', room: '301', type: 'Lecture' },
  ],
  wednesday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: 'Batch 1', room: '301', type: 'Lecture' },
    { time: '10:00-11:00', subject: 'Computer Networks', batch: 'CSE-AIML', group: '', room: 'Lab 2', type: 'Lab' },
    { time: '14:00-16:00', subject: 'Operating Systems', batch: 'CSE-AIML', group: '', room: 'Lab 1', type: 'Lab' },
  ],
  thursday: [
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', group: '', room: '302', type: 'Lecture' },
    { time: '11:00-12:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: '205', type: 'Lecture' },
  ],
  friday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'IT', group: '', room: 'Room 101', type: 'Lecture' },
    { time: '10:00-11:00', subject: 'Computer Networks', batch: 'IT', group: '', room: 'Lab 3', type: 'Lab' },
    { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE-AIML', group: '', room: 'Room 205', type: 'Lecture' },
  ],
};

const ACADEMIC_TASKS = {
  overdue: [
    { id: 'a0', title: 'Submit Mid-Term Marks', subject: 'Operating Systems', batch: 'CSE-AIML', priority: 'CRITICAL', deadline: 'Feb 10', isOverdue: true },
  ],
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
};

const ADMIN_TASKS = {
  overdue: [
    { id: 'ad0', title: 'Submit Jan Attendance Register', type: 'Documentation', priority: 'HIGH', deadline: 'Jan 31', from: 'Exam Cell', isOverdue: true },
  ],
  todo: [
    { id: 'ad1', title: 'CO-PO Mapping Update', type: 'Accreditation', priority: 'CRITICAL', deadline: 'Feb 20', from: 'NBA Coordinator', isOverdue: false },
    { id: 'ad2', title: 'Faculty Meeting Minutes', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 22', from: 'HOD', isOverdue: false },
    { id: 'ad3', title: 'Submit Course File - OS', type: 'Accreditation', priority: 'HIGH', deadline: 'Feb 25', from: 'NBA Coordinator', isOverdue: false },
    { id: 'ad4', title: 'Prepare Department Budget', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 28', from: 'Principal', isOverdue: false },
    { id: 'ad5', title: 'Update Syllabus - OS', type: 'Academic', priority: 'HIGH', deadline: 'Feb 24', from: 'HOD', isOverdue: false },
  ],
  inProgress: [
    { id: 'ad6', title: 'Prepare Department Report', type: 'Administrative', priority: 'HIGH', deadline: 'Feb 25', from: 'Principal', isOverdue: false },
  ],
  done: [
    { id: 'ad7', title: 'Complete Invigilation Duty', type: 'Exam', priority: 'HIGH', deadline: 'Feb 8', from: 'Exam Cell', isOverdue: false },
    { id: 'ad8', title: 'Submit Faculty Profile', type: 'Administrative', priority: 'MEDIUM', deadline: 'Feb 5', from: 'HR', isOverdue: false },
  ],
};

const ASSIGNMENTS = [
  { id: 1, title: 'OS Assignment 4 - Deadlock Prevention', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: 'Feb 20', maxMarks: 20, submitted: 45, total: 80, isLate: false },
  { id: 2, title: 'CN Lab Report - Routing Protocol', batch: 'CSE', subject: 'Computer Networks', dueDate: 'Feb 22', maxMarks: 30, submitted: 55, total: 80, isLate: false },
  { id: 3, title: 'CD Mini Project Phase 2', batch: 'CSE-AIML', subject: 'Computer Design', dueDate: 'Feb 18', maxMarks: 50, submitted: 72, total: 80, isLate: true },
  { id: 4, title: 'OS Quiz - Scheduling Algorithms', batch: 'CSE-AIML', subject: 'Operating Systems', dueDate: 'Feb 24', maxMarks: 10, submitted: 0, total: 80, isLate: false },
  { id: 5, title: 'CN Lab Exercise - Socket Programming', batch: 'IT', subject: 'Computer Networks', dueDate: 'Feb 15', maxMarks: 25, submitted: 68, total: 80, isLate: true },
  { id: 6, title: 'OS Assignment 5 - Memory Management', batch: 'CSE', subject: 'Operating Systems', dueDate: 'Feb 28', maxMarks: 20, submitted: 12, total: 80, isLate: false },
  { id: 7, title: 'CD Circuit Design Project', batch: 'CSE-AIML', subject: 'Computer Design', dueDate: 'Mar 01', maxMarks: 40, submitted: 25, total: 80, isLate: false },
];

const MARKS_DATA = Array.from({ length: 20 }, (_, i) => ({
  studentId: i + 1,
  studentName: `Student ${i + 1}`,
  roll: `CS-AIML-${String(i + 1).padStart(3, '0')}`,
  marks: i < 10 ? Math.floor(Math.random() * 15) + 10 : null,
  status: i < 10 ? 'Graded' : 'Pending',
  grade: i < 10 ? ['A', 'B', 'C', 'B', 'A', 'C', 'B', 'A', 'A', 'B'][i] : null,
}));

const ANALYTICS_DATA = {
  teacherStats: {
    totalLectures: 32,
    totalLabs: 18,
    avgAttendance: 88,
    assignmentsGiven: 12,
    hoursThisMonth: 78,
    studentInteraction: 240,
  },
  batchPerformance: [
    { name: 'CSE-AIML', attendance: 92, avgMarks: 85, trend: +2 },
    { name: 'CSE', attendance: 88, avgMarks: 82, trend: -1 },
    { name: 'IT', attendance: 85, avgMarks: 80, trend: -4 },
  ],
  riskAlerts: [
    { type: 'warning', message: 'CSE attendance dropped 4% this week', batch: 'CSE' },
    { type: 'danger', message: 'IT batch has 3 assignments overdue', batch: 'IT' },
  ]
};

const ANNOUNCEMENTS = {
  toStudents: [
    { id: 1, title: 'Mid-Term Exam Schedule', date: 'Feb 15, 2026', content: 'Mid-term exams will be conducted from March 1-15. Syllabus covers Units 1-5.', from: 'Dr. Vineet Jain', pinned: true, read: false, status: 'active' },
    { id: 2, title: 'Lab Assessment Notice', date: 'Feb 14, 2026', content: 'Practical exams will include lab performance and viva voce. Prepare your lab records.', from: 'Dr. Vineet Jain', pinned: false, read: true, status: 'active' },
    { id: 3, title: 'Class Suspension Notice', date: 'Feb 20, 2026', content: 'Classes suspended on Feb 20 due to faculty meeting.', from: 'Dr. Vineet Jain', pinned: false, read: false, status: 'expiring' },
    { id: 4, title: 'Guest Lecture Announcement', date: 'Feb 18, 2026', content: 'Guest lecture on AI/ML by industry expert on Feb 25.', from: 'Dr. Vineet Jain', pinned: false, read: false, status: 'active' },
  ],
  fromAdmin: [
    { id: 1, title: 'Faculty Meeting - Feb 20', date: 'Feb 12, 2026', content: 'Monthly faculty meeting on Feb 20 at 2 PM in Conference Room. Attendance mandatory.', from: 'HOD Office', pinned: true, read: false, status: 'active' },
    { id: 2, title: 'NBA Visit Preparation', date: 'Feb 10, 2026', content: 'All faculty must submit course files by Feb 25 for NBA accreditation.', from: 'NBA Coordinator', pinned: false, read: false, status: 'active' },
    { id: 3, title: 'Semester Results Submission', date: 'Feb 8, 2026', content: 'Submit internal assessment marks by Feb 28 without fail.', from: 'Exam Cell', pinned: false, read: true, status: 'expiring' },
  ]
};

const FACULTY_DIRECTORY = [
  { name: 'Dr. Amit Kumar', role: 'HOD, CSE Department', email: 'hod.cse@gjust.edu.in', phone: '+91 98765 43210', avatar: 'AK', specialization: 'Machine Learning' },
  { name: 'Dr. Suresh Kumar', role: 'Professor', email: 'suresh@gjust.edu.in', phone: '+91 98765 43211', avatar: 'SK', specialization: 'Data Structures' },
  { name: 'Dr. Rameshwar Rao', role: 'Associate Professor', email: 'rameshwar@gjust.edu.in', phone: '+91 98765 43212', avatar: 'RR', specialization: 'Computer Networks' },
  { name: 'Dr. Vineet Jain', role: 'Assistant Professor', email: 'vineet.jain@gjust.edu.in', phone: '+91 98765 43213', avatar: 'VJ', specialization: 'Operating Systems' },
  { name: 'Dr. Priya Sharma', role: 'Assistant Professor', email: 'priya@gjust.edu.in', phone: '+91 98765 43214', avatar: 'PS', specialization: 'Database Systems' },
  { name: 'Dr. Rahul Gupta', role: 'Assistant Professor', email: 'rahul@gjust.edu.in', phone: '+91 98765 43215', avatar: 'RG', specialization: 'Web Technologies' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function FacultyDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'urgent' | 'thisweek'>('all');
  const [selectedBatch, setSelectedBatch] = useState(BATCHES[0].id);
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [announcementType, setAnnouncementType] = useState<'toStudents' | 'fromAdmin'>('toStudents');
  const [attendance, setAttendance] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const currentUser = { name: 'Dr. Vineet Jain', role: 'Assistant Professor', avatar: 'VJ' };

  const todayClasses = TODAY_CLASSES;
  const analytics = {
    classesToday: todayClasses.length,
    totalBatches: BATCHES.length,
    pendingTasks: ACADEMIC_TASKS.todo.length + ACADEMIC_TASKS.overdue.length + ADMIN_TASKS.todo.length + ADMIN_TASKS.overdue.length,
    lecturesThisWeek: 18,
    urgentTasks: ACADEMIC_TASKS.overdue.length + ACADEMIC_TASKS.todo.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length,
  };

  const currentBatch = BATCHES.find(b => b.id === selectedBatch);
  const currentStudents = STUDENTS[selectedBatch as keyof typeof STUDENTS] || [];

  const handleAttendanceMark = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    currentStudents.forEach((s: any) => {
      setAttendance(prev => ({ ...prev, [s.id]: 'present' }));
    });
  };

  const handleMarkAllAbsent = () => {
    currentStudents.forEach((s: any) => {
      setAttendance(prev => ({ ...prev, [s.id]: 'absent' }));
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-4 right-4 h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-slate-200/50 z-50 flex items-center px-5"
      >
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/25">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">DeptWP</span>
            <span className="text-[9px] text-slate-400 -mt-0.5">Digital Operations</span>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button className="relative p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-50/50">
              {currentUser.avatar}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar */}
      <motion.aside 
        initial={{ opacity: 0 }}
        animate={{ width: sidebarCollapsed ? 80 : 260, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-4 top-20 bottom-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/50 flex flex-col"
      >
        {/* Sidebar Header with Toggle */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-slate-100">
          {!sidebarCollapsed && <span className="text-xs font-bold text-slate-400 uppercase">Menu</span>}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-slate-500" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 py-4 px-2.5 overflow-y-auto">
          <div className="space-y-1">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Main</p>}
            <NavButton icon={LayoutDashboard} label="Overview" isActive={activeTab === 'dashboard'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('dashboard')} />
            <NavButton icon={Calendar} label="Timetable" isActive={activeTab === 'timetable'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('timetable')} />
            <NavButton icon={Kanban} label="Taskboard" isActive={activeTab === 'tasks'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('tasks')} />
          </div>

          <div className="space-y-1 mt-4">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Teaching</p>}
            <NavButton icon={Users2} label="Batches" isActive={activeTab === 'batches'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('batches')} />
            <NavButton icon={ClipboardCheck} label="Attendance" isActive={activeTab === 'attendance'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('attendance')} />
            <NavButton icon={FileText} label="Assignments" isActive={activeTab === 'assignments'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('assignments')} />
            <NavButton icon={Award} label="Marks Entry" isActive={activeTab === 'marks'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('marks')} />
          </div>

          <div className="space-y-1 mt-4">
            {!sidebarCollapsed && <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1.5">Management</p>}
            <NavButton icon={BarChart3} label="Analytics" isActive={activeTab === 'analytics'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('analytics')} />
            <NavButton icon={Megaphone} label="Announce" isActive={activeTab === 'announcements'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('announcements')} />
          </div>
        </div>

        <div className="px-2.5 pb-4 pt-2 border-t border-slate-100">
          <NavButton icon={Users} label="Directory" isActive={activeTab === 'directory'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('directory')} />
          <NavButton icon={Settings} label="Settings" isActive={activeTab === 'settings'} collapsed={sidebarCollapsed} onClick={() => setActiveTab('settings')} />
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className={cn("pt-20 px-6 pb-6 min-h-screen transition-all duration-300", sidebarCollapsed ? "ml-[104px]" : "ml-[288px]")}
      >
        <div className="max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
          >
            {activeTab === 'dashboard' && <DashboardView todayClasses={todayClasses} analytics={analytics} smartStatus={SMART_STATUS} onNavigate={setActiveTab} />}
            {activeTab === 'batches' && <BatchesView batches={BATCHES} selectedBatch={selectedBatch} onSelectBatch={setSelectedBatch} />}
            {activeTab === 'timetable' && <TimetableView />}
            {activeTab === 'tasks' && <TaskboardView filter={taskFilter} setFilter={setTaskFilter} onAddTask={() => setShowAddTask(true)} />}
            {activeTab === 'marks' && <MarksEntryView batches={BATCHES} selectedBatch={selectedBatch} onSelectBatch={setSelectedBatch} assignments={ASSIGNMENTS} selectedAssignment={selectedAssignment} onSelectAssignment={setSelectedAssignment} marksData={MARKS_DATA} />}
            {activeTab === 'analytics' && <AnalyticsView batches={BATCHES} analytics={ANALYTICS_DATA} onNewAssignment={() => setShowNewAssignment(true)} />}
            {activeTab === 'announcements' && <AnnouncementsView type={announcementType} setType={setAnnouncementType} announcements={ANNOUNCEMENTS} />}
            {activeTab === 'directory' && <DirectoryView faculty={FACULTY_DIRECTORY} />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Modals */}
        <NewAssignmentModal isOpen={showNewAssignment} onClose={() => setShowNewAssignment(false)} batches={BATCHES} />
        <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
      </main>
    </div>
  );
}

function NavButton({ icon: Icon, label, isActive, collapsed, onClick }: { icon: any; label: string; isActive?: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "relative w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
        collapsed ? "justify-center" : "justify-start",
        isActive ? "text-blue-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      {isActive && (
        <motion.div layoutId="navIndicator" className="absolute inset-0 bg-blue-50 rounded-xl -z-10 shadow-sm shadow-blue-500/20" />
      )}
      <Icon className={cn("w-[18px] h-[18px] flex-shrink-0", isActive && "text-blue-600")} />
      {!collapsed && <span>{label}</span>}
    </motion.button>
  );
}

// ==================== DASHBOARD VIEW ====================
function DashboardView({ todayClasses, analytics, smartStatus, onNavigate }: { todayClasses: any[]; analytics: any; smartStatus: any[]; onNavigate: (tab: TabType) => void }) {
  const router = useRouter();
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  const quickStats = [
    { label: 'Classes Today', value: analytics.classesToday, icon: CalendarDays, color: 'blue', trend: 'up' },
    { label: 'Total Batches', value: analytics.totalBatches, icon: Users2, color: 'green', trend: 'up' },
    { label: 'Pending Tasks', value: analytics.pendingTasks, icon: Clipboard, color: 'amber', trend: 'down' },
    { label: 'This Week', value: analytics.lecturesThisWeek, icon: BookMarked, color: 'purple', trend: 'up', suffix: 'Lectures' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Card - White with subtle gradient */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-br from-white via-slate-50 to-white rounded-2xl border border-slate-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)] p-6 md:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {greeting}, <span className="text-blue-600">Dr. Vineet</span>!
              </h1>
              <div className="text-slate-500 mt-2 space-y-0.5">
                <p className="text-sm">You have {analytics.classesToday} classes today • {analytics.totalBatches} batches</p>
                <p className="text-sm">{analytics.pendingTasks} pending tasks • {analytics.urgentTasks} urgent</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Smart Status Row */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-2.5">
        {smartStatus.map((status, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium border backdrop-blur-sm shadow-sm",
              status.type === 'urgent' ? "bg-red-50/80 text-red-700 border-red-200" :
              status.type === 'success' ? "bg-green-50/80 text-green-700 border-green-200" :
              status.type === 'warning' ? "bg-amber-50/80 text-amber-700 border-amber-200" :
              "bg-blue-50/80 text-blue-700 border-blue-200"
            )}
          >
            <status.icon className="w-4 h-4" />
            {status.text}
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Cards - Improved Card Style */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, i) => (
          <motion.div 
            key={i}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-500">{stat.label}</span>
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                stat.color === 'blue' ? "bg-gradient-to-br from-blue-50 to-blue-100" :
                stat.color === 'green' ? "bg-gradient-to-br from-green-50 to-green-100" :
                stat.color === 'amber' ? "bg-gradient-to-br from-amber-50 to-amber-100" :
                "bg-gradient-to-br from-purple-50 to-purple-100"
              )}>
                <stat.icon className={cn("w-5 h-5", 
                  stat.color === 'blue' ? "text-blue-600" :
                  stat.color === 'green' ? "text-green-600" :
                  stat.color === 'amber' ? "text-amber-600" :
                  "text-purple-600"
                )} />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
              {stat.suffix && <p className="text-xs text-slate-500">{stat.suffix}</p>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-900">Today&apos;s Schedule</h3>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">Today</span>
          </div>
          <div className="space-y-2">
            {todayClasses.map((cls, i) => (
              <motion.div 
                key={i} 
                whileHover={{ x: 4 }}
                className="flex items-center gap-3 p-3 bg-slate-50/80 rounded-xl hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
                <div className={cn("w-1 h-12 rounded-full", i === 0 ? "bg-blue-600" : cls.type === 'Lab' ? "bg-slate-400" : "bg-slate-300")} />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{cls.subject}</p>
                  <p className="text-xs text-slate-500">{cls.batch} {cls.group && `(${cls.group})`} • {cls.room}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-slate-600">{cls.time}</p>
                  <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded", cls.type === 'Lecture' ? "bg-blue-100 text-blue-700" : "bg-slate-200 text-slate-600")}>
                    {cls.type}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickActionButton label="Take Attendance" icon={ClipboardCheck} onClick={() => onNavigate('attendance')} />
            <QuickActionButton label="Create Assignment" icon={FileText} onClick={() => onNavigate('assignments')} />
            <QuickActionButton label="Add Task" icon={Plus} onClick={() => onNavigate('tasks')} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function QuickStatCard({ label, value, icon: Icon, color, trend, suffix }: any) {
  const colorMap: Record<string, string> = {
    blue: 'from-blue-50 to-blue-100 text-blue-700',
    green: 'from-green-50 to-green-100 text-green-700',
    amber: 'from-amber-50 to-amber-100 text-amber-700',
    purple: 'from-purple-50 to-purple-100 text-purple-700',
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", colorMap[color])}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <p className="text-3xl font-bold text-slate-900">{value}</p>
        {suffix && <p className="text-xs text-slate-500">{suffix}</p>}
      </div>
    </motion.div>
  );
}

function QuickActionButton({ label, icon: Icon, onClick }: { label: string; icon: any; onClick: () => void }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
    >
      <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-700 transition-colors">{label}</span>
      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:text-blue-600 transition-colors" />
    </motion.button>
  );
}

// ==================== BATCHES VIEW ====================
function BatchesView({ batches, selectedBatch, onSelectBatch }: { batches: any[]; selectedBatch: string; onSelectBatch: (id: string) => void }) {
  const batch = batches.find(b => b.id === selectedBatch);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Batches & Students</h2>

      {/* Batch Tabs */}
      <div className="flex gap-2">
        {batches.map(b => (
          <button
            key={b.id}
            onClick={() => onSelectBatch(b.id)}
            className={cn(
              "px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              selectedBatch === b.id 
                ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

{batch && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Batch Stats */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Total Students</span>
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900">{batch.students}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Avg Attendance</span>
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">{batch.attendance}%</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Given Assignments</span>
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">{ASSIGNMENTS.filter(a => a.batch === batch.name).length}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Avg Marks</span>
                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <p className="text-3xl font-bold text-purple-600">{batch.avgMarks}%</p>
            </motion.div>
          </div>

          {/* Subjects */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-4">Subjects & Classes</h3>
            <div className="space-y-3">
              {batch.subjects.map((subject: string) => (
                <div key={subject} className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{subject}</span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                      {batch.lecturesTaken[subject] || 0} Lectures • {batch.labsTaken[subject] || 0} Labs
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(((batch.lecturesTaken[subject] || 0) / 15) * 100, 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2">15 lectures total per semester</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== TIMETABLE VIEW ====================
function TimetableView() {
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
  const currentDay = DAY_NAMES[new Date().getDay() - 1] || 'Mon';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Weekly Timetable</h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Today: {currentDay}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-5 gap-4">
        {DAY_NAMES.slice(0, 5).map((day, idx) => (
          <motion.div 
            key={day} 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={cn(
              "py-3.5 text-center text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2",
              day.toLowerCase() === currentDay.toLowerCase() 
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/25" 
                : "bg-slate-50 text-slate-700"
            )}>
              {day.toLowerCase() === currentDay.toLowerCase() && <CalendarDays className="w-3.5 h-3.5" />}
              {day}
            </div>
            <div className="p-3 space-y-2 min-h-[280px]">
              {TIMETABLE[days[idx] as keyof typeof TIMETABLE]?.length === 0 ? (
                <div className="flex items-center justify-center h-24 text-xs text-slate-400">
                  No classes
                </div>
              ) : (
                TIMETABLE[days[idx] as keyof typeof TIMETABLE]?.map((cls, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer group relative overflow-hidden",
                      cls.type === 'Lecture' 
                        ? "bg-gradient-to-r from-blue-50 to-blue-100/50 border-blue-100 hover:border-blue-300" 
                        : "bg-gradient-to-r from-slate-50 to-slate-100/50 border-slate-200 hover:border-slate-300"
                    )}
                  >
                    <div className={cn(
                      "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
                      cls.type === 'Lecture' ? "bg-blue-600" : "bg-slate-400"
                    )} />
                    <div className="pl-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={cn(
                          "text-[9px] font-bold px-1.5 py-0.5 rounded",
                          cls.type === 'Lecture' ? "bg-blue-600 text-white" : "bg-slate-400 text-white"
                        )}>
                          {cls.type}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{cls.subject}</p>
                      <p className="text-[10px] text-blue-600 font-medium mt-1">{cls.time}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <span className="text-[10px] text-slate-500">{cls.batch}</span>
                        {cls.group && <span className="text-[10px] text-slate-400">({cls.group})</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{cls.room}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ==================== TASKBOARD VIEW ====================
function TaskboardView({ filter, setFilter, onAddTask }: { filter: 'all' | 'urgent' | 'thisweek'; setFilter: (filter: 'all' | 'urgent' | 'thisweek') => void; onAddTask?: () => void }) {
  const allTasks = ACADEMIC_TASKS;
  
  const getFilteredTasks = (tasks: any[]) => {
    if (filter === 'urgent') return tasks.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL');
    if (filter === 'thisweek') return tasks.filter(t => new Date(t.deadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    return tasks;
  };

  const overdueTasks = getFilteredTasks(allTasks.overdue);
  const todoTasks = getFilteredTasks(allTasks.todo);
  const inProgressTasks = getFilteredTasks(allTasks.inProgress);
  const doneTasks = getFilteredTasks(allTasks.done);

  const columns = [
    { id: 'overdue', label: 'Overdue', color: '#EF4444', tasks: overdueTasks },
    { id: 'todo', label: 'To Do', color: '#2563EB', tasks: todoTasks },
    { id: 'inProgress', label: 'In Progress', color: '#F59E0B', tasks: inProgressTasks },
    { id: 'done', label: 'Completed', color: '#10B981', tasks: doneTasks },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Taskboard</h2>
        <div className="flex gap-2">
          {onAddTask && (
            <button 
              onClick={onAddTask}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button onClick={() => setFilter('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'all' ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        <button onClick={() => setFilter('urgent')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'urgent' ? "bg-red-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>Urgent</button>
        <button onClick={() => setFilter('thisweek')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", filter === 'thisweek' ? "bg-amber-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>This Week</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className={cn("bg-slate-100/50 rounded-xl p-3", column.id === 'overdue' && "bg-red-50/50")}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-xs font-semibold text-slate-700">{column.label}</span>
              </div>
              <span className="text-[10px] font-medium text-slate-500 bg-white px-1.5 py-0.5 rounded">{column.tasks.length}</span>
            </div>
            <div className="space-y-2">
              {column.tasks.map((task: any) => (
                <div key={task.id} className={cn("p-3 bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow", 
                  task.isOverdue ? "border-red-300 bg-red-50/50" : "border-slate-200")}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded uppercase", 
                      task.priority === 'CRITICAL' ? "bg-red-100 text-red-700" :
                      task.priority === 'HIGH' ? "bg-amber-100 text-amber-700" :
                      "bg-slate-100 text-slate-600")}>
                      {task.priority}
                    </span>
                    <span className={cn("text-[10px]", task.isOverdue ? "text-red-600 font-medium" : "text-slate-400")}>{task.deadline}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 mb-1.5">{task.title}</h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">{task.subject}</span>
                    <span>{task.batch}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== ATTENDANCE VIEW ====================
function AttendanceView({ batches, selectedBatch, onSelectBatch, students, attendance, onMarkAttendance, onMarkAllPresent, onMarkAllAbsent }: any) {
  const markedCount = Object.keys(attendance).length;
  const totalStudents = students.length || 80;
  const allMarked = markedCount === totalStudents && totalStudents > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Attendance</h2>
        <select 
          value={selectedBatch}
          onChange={(e) => onSelectBatch(e.target.value)}
          className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          {batches.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name} ({b.students} students)</option>
          ))}
        </select>
      </div>

      {totalStudents > 0 && (
        <>
          {/* Sticky Action Bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-slate-500">Marked</p>
                  <p className="text-xl font-bold text-slate-900">{markedCount} / {totalStudents}</p>
                </div>
                <div className="w-32 bg-slate-100 rounded-full h-2">
                  <div className={cn("h-2 rounded-full transition-all", allMarked ? "bg-green-500" : "bg-blue-600")} style={{ width: `${(markedCount / totalStudents) * 100}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={onMarkAllPresent} className="flex items-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                  <Check className="w-3.5 h-3.5" /> All Present
                </button>
                <button onClick={onMarkAllAbsent} className="flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700">
                  <X className="w-3.5 h-3.5" /> All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Roll No</th>
                  <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Student Name</th>
                  <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                  <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.slice(0, 20).map((student: any) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm font-medium text-slate-900">{student.roll}</td>
                    <td className="px-4 py-3 text-sm text-slate-700">{student.name}</td>
                    <td className="px-4 py-3 text-center">
                      {attendance[student.id] ? (
                        <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                          attendance[student.id] === 'present' ? "bg-green-100 text-green-700" :
                          attendance[student.id] === 'absent' ? "bg-red-100 text-red-700" :
                          "bg-amber-100 text-amber-700"
                        )}>
                          {attendance[student.id] === 'present' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {attendance[student.id].charAt(0).toUpperCase() + attendance[student.id].slice(1)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center w-2 h-2 rounded-full bg-slate-300" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onMarkAttendance(student.id, 'present')} className={cn("p-1.5 rounded transition-colors", attendance[student.id] === 'present' ? "bg-green-100 text-green-700" : "hover:bg-green-50 text-slate-400")}><Check className="w-4 h-4" /></button>
                        <button onClick={() => onMarkAttendance(student.id, 'absent')} className={cn("p-1.5 rounded transition-colors", attendance[student.id] === 'absent' ? "bg-red-100 text-red-700" : "hover:bg-red-50 text-slate-400")}><X className="w-4 h-4" /></button>
                        <button onClick={() => onMarkAttendance(student.id, 'late')} className={cn("p-1.5 rounded transition-colors", attendance[student.id] === 'late' ? "bg-amber-100 text-amber-700" : "hover:bg-amber-50 text-slate-400")}><Clock3 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ==================== ASSIGNMENTS VIEW ====================
function AssignmentsView({ batches, assignments, onNewAssignment }: { batches: any[]; assignments: any[]; onNewAssignment?: () => void }) {
  const [selectedBatch, setSelectedBatch] = useState(batches[0]?.id || '');

  const filteredAssignments = assignments.filter(a => 
    selectedBatch === 'all' || a.batch === batches.find(b => b.id === selectedBatch)?.name
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Assignments</h2>
        <button 
          onClick={onNewAssignment}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> New Assignment
        </button>
      </div>

      <div className="flex gap-2">
        <button onClick={() => setSelectedBatch('all')} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedBatch === 'all' ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>All</button>
        {batches.map((b: any) => (
          <button key={b.id} onClick={() => setSelectedBatch(b.id)} className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors", selectedBatch === b.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 border border-slate-200")}>{b.name}</button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredAssignments.map((a) => (
          <div key={a.id} className={cn("bg-white rounded-2xl border p-4 shadow-sm", a.isLate ? "border-amber-300 bg-amber-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{a.title}</h3>
                  {a.isLate && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">LATE</span>}
                </div>
                <p className="text-xs text-slate-500">{a.subject} • {a.batch}</p>
              </div>
              <span className={cn("text-xs font-medium px-2.5 py-1.5 rounded-lg", a.isLate ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600")}>Due: {a.dueDate}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Submissions</span>
                  <span className="font-medium text-slate-700">{a.submitted}/{a.total}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(a.submitted / a.total) * 100}%` }} />
                </div>
              </div>
              <span className="text-sm font-semibold text-slate-600">{a.maxMarks} marks</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== MARKS ENTRY VIEW ====================
function MarksEntryView({ batches, selectedBatch, onSelectBatch, assignments, selectedAssignment, onSelectAssignment, marksData }: any) {
  const assignment = assignments.find((a: any) => a.id === selectedAssignment);
  const quickGrades = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Marks Entry</h2>
      </div>

      <div className="flex gap-3">
        <select 
          value={selectedBatch}
          onChange={(e) => onSelectBatch(e.target.value)}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          {batches.map((b: any) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
        <select 
          value={selectedAssignment || ''}
          onChange={(e) => onSelectAssignment(Number(e.target.value))}
          className="flex-1 h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600/20 shadow-sm"
        >
          <option value="">Select Assignment</option>
          {assignments.filter((a: any) => a.batch === batches.find((b: any) => b.id === selectedBatch)?.name).map((a: any) => (
            <option key={a.id} value={a.id}>{a.title}</option>
          ))}
        </select>
      </div>

      {assignment && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{assignment.title}</h3>
                <p className="text-xs text-slate-500">{assignment.batch} • Max Marks: {assignment.maxMarks}</p>
              </div>
              <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700">
                <Save className="w-3.5 h-3.5" /> Save All
              </button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Roll No</th>
                <th className="text-left text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Student Name</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Grade</th>
                <th className="text-center text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Marks / {assignment.maxMarks}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {marksData.map((student: any) => (
                <tr key={student.studentId} className="hover:bg-slate-50">
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{student.roll}</td>
                  <td className="px-4 py-3 text-sm text-slate-700">{student.studentName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium",
                      student.status === 'Graded' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {student.grade ? (
                      <span className={cn("inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                        student.grade === 'A' ? "bg-green-100 text-green-700" :
                        student.grade === 'B' ? "bg-blue-100 text-blue-700" :
                        student.grade === 'C' ? "bg-amber-100 text-amber-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {student.grade}
                      </span>
                    ) : (
                      <div className="flex items-center justify-center gap-0.5">
                        {quickGrades.map(g => (
                          <button key={g} className="w-6 h-6 text-[10px] font-medium text-slate-500 hover:bg-slate-100 rounded">{g}</button>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="number" 
                      defaultValue={student.marks || ''}
                      max={assignment.maxMarks}
                      placeholder="--"
                      className="w-16 mx-auto text-center px-2 py-1.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ==================== ANALYTICS VIEW ====================
function AnalyticsView({ batches, analytics, onNewAssignment }: { batches: any[]; analytics: any; onNewAssignment?: () => void }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Analytics</h2>
        {onNewAssignment && (
          <button 
            onClick={onNewAssignment}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-4 h-4" /> New Assignment
          </button>
        )}
      </div>

      {/* Risk Alerts */}
      {analytics.riskAlerts.length > 0 && (
        <div className="space-y-2">
          {analytics.riskAlerts.map((alert: any, i: number) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium border",
                alert.type === 'warning' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-red-50 text-red-700 border-red-200")}
            >
              <AlertCircle className="w-4 h-4" />
              {alert.message}
            </motion.div>
          ))}
        </div>
      )}

      {/* Teacher Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Total Lectures</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.totalLectures}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <Clipboard className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Total Labs</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.totalLabs}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Avg Attendance</p>
          <p className="text-2xl font-bold text-green-600">{analytics.teacherStats.avgAttendance}%</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Assignments</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.assignmentsGiven}</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Hours/Month</p>
          <p className="text-2xl font-bold text-slate-900">{analytics.teacherStats.hoursThisMonth}h</p>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center">
              <Users2 className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1">Student Interaction</p>
          <p className="text-2xl font-bold text-blue-600">{analytics.teacherStats.studentInteraction}</p>
        </motion.div>
      </div>

      {/* Batch Performance */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
        <h3 className="text-base font-semibold text-slate-900 mb-4">Batch-wise Performance</h3>
        <div className="space-y-3">
          {analytics.batchPerformance.map((batch: any) => (
            <motion.div 
              key={batch.name} 
              variants={itemVariants}
              className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                    {batch.name.split('-')[0].slice(0,2)}{batch.name.split('-')[1]?.slice(0,2) || ''}
                  </div>
                  <span className="font-medium text-slate-900">{batch.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs font-medium flex items-center gap-0.5", batch.trend > 0 ? "text-green-600" : "text-red-600")}>
                    {batch.trend > 0 ? <TrendingUp className="w-3 h-3" /> : null}{batch.trend > 0 ? '+' : ''}{batch.trend}%
                  </span>
                  <span className="text-sm font-bold text-green-600">{batch.attendance}%</span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full" style={{ width: `${batch.attendance}%` }} />
              </div>
              <div className="flex gap-2 mt-3">
                <span className="text-[10px] bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">Attendance: {batch.attendance}%</span>
                <span className="text-[10px] bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">Avg Marks: {batch.avgMarks}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ==================== ANNOUNCEMENTS VIEW ====================
function AnnouncementsView({ type, setType, announcements }: { type: 'toStudents' | 'fromAdmin'; setType: (type: 'toStudents' | 'fromAdmin') => void; announcements: any }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
        {type === 'toStudents' && (
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => setType('toStudents')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", type === 'toStudents' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 border border-slate-200")}>
          To Students
        </button>
        <button onClick={() => setType('fromAdmin')} className={cn("px-4 py-2.5 rounded-xl text-sm font-medium transition-colors", type === 'fromAdmin' ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-white text-slate-600 border border-slate-200")}>
          From Admin
        </button>
      </div>

      <div className="space-y-3">
        {announcements[type].map((announcement: any) => (
          <div key={announcement.id} className={cn("bg-white rounded-2xl border p-5 shadow-sm", 
            announcement.pinned ? "border-blue-200 bg-blue-50/30" : "border-slate-200")}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {announcement.pinned && <Pin className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />}
                <h3 className="font-medium text-slate-900">{announcement.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] px-2 py-1 rounded-lg font-medium",
                  announcement.status === 'active' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                  {announcement.status === 'active' ? 'Active' : 'Expiring'}
                </span>
                {!announcement.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">{announcement.content}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-500">From: {announcement.from}</p>
              <p className="text-xs text-slate-400">{announcement.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== DIRECTORY VIEW ====================
function DirectoryView({ faculty }: { faculty: any[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Faculty Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {faculty.map((f, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-lg">{f.avatar}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{f.name}</h3>
                <p className="text-xs text-slate-500 mb-1">{f.role}</p>
                <p className="text-[10px] text-blue-600 font-medium">{f.specialization}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Mail className="w-3.5 h-3.5" />
                <span className="truncate">{f.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1.5">
                <Phone className="w-3.5 h-3.5" />
                <span>{f.phone}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 inline mr-1" /> Message
              </button>
              <button className="flex-1 py-2 text-xs font-medium text-slate-600 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <User className="w-3.5 h-3.5 inline mr-1" /> Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ==================== NEW ASSIGNMENT MODAL ====================
function NewAssignmentModal({ isOpen, onClose, batches }: { isOpen: boolean; onClose: () => void; batches: any[] }) {
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState(batches[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(20);
  const [description, setDescription] = useState('');

  const selectedBatch = batches.find(b => b.id === batch);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="w-5 h-5" /> Create New Assignment
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Assignment Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Batch</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                {batches.map((b: any) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              >
                <option value="">Select Subject</option>
                {selectedBatch?.subjects.map((s: string) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Max Marks</label>
              <input 
                type="number" 
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter assignment description"
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert(`Assignment "${title}" created for ${selectedBatch?.name} - ${subject}`);
              onClose();
            }}
            className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Create Assignment
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== ADD TASK MODAL ====================
function AddTaskModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [batch, setBatch] = useState('All');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ClipboardList className="w-5 h-5" /> Assign Task to Faculty
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Task Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Batch</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              >
                <option value="All">All Batches</option>
                <option value="CSE-AIML">CSE-AIML</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Subject</label>
              <select 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              >
                <option value="">Select Subject</option>
                <option value="Operating Systems">Operating Systems</option>
                <option value="Computer Networks">Computer Networks</option>
                <option value="Computer Design">Computer Design</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Priority</label>
              <select 
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Deadline</label>
              <input 
                type="date" 
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-600/20 focus:border-amber-600"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              alert(`Task "${title}" assigned successfully`);
              onClose();
            }}
            className="px-5 py-2.5 bg-amber-600 text-white text-sm font-medium rounded-xl hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20"
          >
            Assign Task
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ==================== SETTINGS VIEW ====================
function SettingsView() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <p className="text-slate-500">Settings panel coming soon...</p>
      </div>
    </div>
  );
}
