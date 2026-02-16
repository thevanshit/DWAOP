'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, BookOpen, Calendar, ClipboardList, FileText, 
  Users, Kanban, Settings, Bell, Search, Plus, X, ChevronDown,
  ClipboardCheck, Award, MessageSquare, CheckCircle2, GraduationCap as GradCap,
  Clock, AlertTriangle, TrendingUp, Users2, CalendarDays, Clipboard
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabType = 'dashboard' | 'subjects' | 'timetable' | 'attendance' | 'assignments' | 'faculty' | 'tasks';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const WORKFLOW_TASKS = {
  todo: [
    { id: 'w1', title: 'Upload CS-301 Mid-Term Marks', type: 'ACADEMIC', priority: 'HIGH', deadline: 'Feb 20', assignee: 'VJ', course: 'Operating Systems' },
    { id: 'w2', title: 'Prepare Lab Manual Experiment 5', type: 'ACADEMIC', priority: 'MEDIUM', deadline: 'Feb 22', assignee: 'VJ', course: 'Computer Networks' },
    { id: 'w3', title: 'Accreditation Data - CO-PO Mapping', type: 'ADMIN', priority: 'CRITICAL', deadline: 'Feb 18', assignee: 'VJ', course: 'Dept' },
    { id: 'w4', title: 'Submit Attendance Register', type: 'ACADEMIC', priority: 'HIGH', deadline: 'Feb 17', assignee: 'VJ', course: 'All Courses' },
  ],
  inProgress: [
    { id: 'w5', title: 'Grade Assignment 3 Submissions', type: 'ACADEMIC', priority: 'MEDIUM', deadline: 'Feb 25', assignee: 'VJ', course: 'Operating Systems' },
    { id: 'w6', title: 'Review Exam Paper - CS302', type: 'ACADEMIC', priority: 'HIGH', deadline: 'Feb 19', assignee: 'VJ', course: 'Computer Networks' },
  ],
  review: [
    { id: 'w7', title: 'Finalize Course Outcomes', type: 'ADMIN', priority: 'HIGH', deadline: 'Feb 28', assignee: 'VJ', course: 'CSE-AIML' },
  ],
  done: [
    { id: 'w8', title: 'Upload Lecture Notes - OS', type: 'ACADEMIC', priority: 'LOW', deadline: 'Feb 10', assignee: 'VJ', course: 'Operating Systems' },
    { id: 'w9', title: 'Complete Invigilation Duty', type: 'ADMIN', priority: 'HIGH', deadline: 'Feb 8', assignee: 'VJ', course: 'Exam Cell' },
  ],
};

const SUBJECTS = [
  { name: 'Operating Systems', code: 'CS-301', batches: ['CSE-AIML', 'CSE', 'IT'], lectures: 3, practicals: 2 },
  { name: 'Computer Networks', code: 'CS-302', batches: ['CSE-AIML', 'CSE'], lectures: 2, practicals: 2 },
  { name: 'Computer Design', code: 'CS-303', batches: ['CSE-AIML', 'CSE-Yoga'], lectures: 2, practicals: 1 },
];

const TIMETABLE = {
  monday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Room 301', type: 'Lecture' },
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Room 301', type: 'Lecture' },
    { time: '11:00-12:00', subject: 'Computer Networks', batch: 'CSE', room: 'Lab 2', type: 'Lab' },
    { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE AIML', room: 'Room 205', type: 'Lecture' },
  ],
  tuesday: [
    { time: '09:00-10:00', subject: 'Computer Networks', batch: 'CSE AIML', room: 'Lab 3', type: 'Lab' },
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE', room: 'Room 302', type: 'Lecture' },
  ],
  wednesday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'IT', room: 'Room 301', type: 'Lecture' },
    { time: '14:00-16:00', subject: 'Operating Systems', batch: 'CSE AIML', room: 'Lab 1', type: 'Lab' },
  ],
  thursday: [
    { time: '10:00-11:00', subject: 'Operating Systems', batch: 'CSE-Yoga', room: 'Room 302', type: 'Lecture' },
  ],
  friday: [
    { time: '09:00-10:00', subject: 'Operating Systems', batch: 'CSE', room: 'Room 101', type: 'Lecture' },
    { time: '14:00-15:00', subject: 'Computer Design', batch: 'CSE AIML', room: 'Room 205', type: 'Lecture' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

export default function FacultyDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState(WORKFLOW_TASKS);
  const [selectedTask, setSelectedTask] = useState<typeof WORKFLOW_TASKS.todo[0] | null>(null);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const currentUser = {
    name: 'Dr. Vineet Jain',
    role: 'Assistant Professor',
    avatar: 'VJ',
    email: 'vineet.jain@gjust.edu.in'
  };

  const getTodayClasses = () => {
    const today = DAYS[new Date().getDay() - 1] || 'monday';
    return TIMETABLE[today as keyof typeof TIMETABLE] || [];
  };

  const todayClasses = getTodayClasses();
  const analytics = {
    classesToday: todayClasses.length,
    batchesToday: [...new Set(todayClasses.map(c => c.batch))].length,
    pendingTasks: Object.values(tasks).flat().length,
    urgentTasks: Object.values(tasks).flat().filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length,
    avgAttendance: '87.5%',
    lecturesThisWeek: 12,
  };

  const insights = [
    { type: 'alert', text: '2 tasks nearing deadline', icon: AlertTriangle },
    { type: 'success', text: 'Attendance +4% this week', icon: TrendingUp },
    { type: 'info', text: 'Admin meeting at 2PM', icon: CalendarDays },
  ];

  const handleDragStart = (taskId: string) => setDraggedTask(taskId);

  const handleDragEnd = (columnId: string) => {
    if (draggedTask) {
      setTasks(prev => {
        const newTasks: typeof WORKFLOW_TASKS = { ...prev };
        for (const col in newTasks) {
          newTasks[col as keyof typeof newTasks] = newTasks[col as keyof typeof newTasks].filter(t => t.id !== draggedTask);
        }
        const taskToMove = Object.values(WORKFLOW_TASKS).flat().find(t => t.id === draggedTask);
        if (taskToMove) {
          newTasks[columnId as keyof typeof newTasks] = [...newTasks[columnId as keyof typeof newTasks], { ...taskToMove }];
        }
        return newTasks;
      });
    }
    setDraggedTask(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-gray-900 overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 z-50 flex items-center px-4">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <div className="w-8 h-8 bg-[#0052CC] rounded-lg flex items-center justify-center">
            <GradCap className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && <span className="font-semibold text-gray-900">GJUST Faculty</span>}
        </Link>
        
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search... (⌘K)" 
              className="w-full h-9 pl-9 pr-4 bg-gray-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
            <div className="w-8 h-8 bg-[#0052CC] rounded-lg flex items-center justify-center text-white font-semibold text-sm">
              {currentUser.avatar}
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
              <p className="text-xs text-gray-500">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: sidebarCollapsed ? 72 : 224 }}
        className="fixed left-0 top-14 bottom-0 bg-white border-r border-gray-200 z-40 overflow-hidden"
      >
        <div className="flex flex-col h-full">
          {/* Collapse Button */}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute top-3 -right-3 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronDown className={cn("w-3 h-3 text-gray-500 transition-transform", sidebarCollapsed && "rotate-90")} />
          </button>

          {/* Main Navigation */}
          <div className="p-3 space-y-1">
            <p className={cn("text-xs font-medium text-gray-400 px-3 mb-2", sidebarCollapsed && "text-center")}>
              {sidebarCollapsed ? 'M' : 'MAIN'}
            </p>
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'timetable', label: 'Timetable', icon: Calendar },
              { id: 'tasks', label: 'Task Board', icon: Kanban },
            ].map((item) => (
              <NavButton 
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveTab(item.id as TabType)}
              />
            ))}
          </div>

          {/* Teaching Section */}
          <div className="p-3 space-y-1">
            <p className={cn("text-xs font-medium text-gray-400 px-3 mb-2", sidebarCollapsed && "text-center")}>
              {sidebarCollapsed ? 'T' : 'TEACHING'}
            </p>
            {[
              { id: 'subjects', label: 'Subjects', icon: BookOpen },
              { id: 'attendance', label: 'Attendance', icon: ClipboardCheck },
              { id: 'assignments', label: 'Assignments', icon: FileText },
            ].map((item) => (
              <NavButton 
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activeTab === item.id}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveTab(item.id as TabType)}
              />
            ))}
          </div>

          {/* System Section */}
          <div className="p-3 space-y-1 mt-auto border-t border-gray-100">
            <NavButton 
              icon={Users}
              label="Faculty"
              isActive={activeTab === 'faculty'}
              collapsed={sidebarCollapsed}
              onClick={() => setActiveTab('faculty')}
            />
            <NavButton 
              icon={Settings}
              label="Settings"
              collapsed={sidebarCollapsed}
              onClick={() => {}}
            />
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main 
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 224 }}
        className="pt-14 p-6 min-h-screen"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'dashboard' && <DashboardView todayClasses={todayClasses} analytics={analytics} insights={insights} onNavigate={setActiveTab} />}
            {activeTab === 'subjects' && <SubjectsView />}
            {activeTab === 'timetable' && <TimetableView />}
            {activeTab === 'tasks' && (
              <KanbanView 
                tasks={tasks} 
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTaskClick={setSelectedTask}
                draggedTask={draggedTask}
              />
            )}
            {activeTab === 'attendance' && <AttendanceView />}
            {activeTab === 'assignments' && <AssignmentsView />}
            {activeTab === 'faculty' && <FacultyView />}
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Task Detail Modal */}
      <AnimatePresence>
        {selectedTask && (
          <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavButton({ icon: Icon, label, isActive, collapsed, onClick }: { icon: any; label: string; isActive?: boolean; collapsed: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
        isActive 
          ? "bg-[#0052CC] text-white shadow-sm" 
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {isActive && (
        <motion.div
          layoutId="nav-active"
          className="absolute left-0 w-1 h-full bg-[#0052CC] rounded-r"
          style={{ backgroundColor: isActive ? '#0052CC' : 'transparent' }}
        />
      )}
      <Icon className="w-5 h-5 flex-shrink-0" />
      {!collapsed && <span>{label}</span>}
      
      {/* Tooltip when collapsed */}
      {collapsed && (
        <span className="absolute left-14 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
          {label}
        </span>
      )}
    </button>
  );
}

function DashboardView({ todayClasses, analytics, insights, onNavigate }: { 
  todayClasses: any[]; 
  analytics: { classesToday: number; batchesToday: number; pendingTasks: number; urgentTasks: number; avgAttendance: string; lecturesThisWeek: number };
  insights: {type: string; text: string; icon: any}[];
  onNavigate: (tab: TabType) => void;
}) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Smart Summary Bar */}
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-[#0052CC] to-[#0747A6] rounded-xl p-6 text-white">
        <h1 className="text-xl font-semibold mb-1">{greeting}! 👋</h1>
        <p className="text-blue-100 text-sm">
          You have {analytics.classesToday} classes today • {analytics.batchesToday} batches • {analytics.pendingTasks} pending tasks ({analytics.urgentTasks} urgent)
        </p>
      </motion.div>

      {/* Insights Bar */}
      <motion.div variants={itemVariants} className="flex gap-3">
        {insights.map((insight, i) => (
          <div key={i} className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium",
            insight.type === 'alert' ? "bg-amber-50 text-amber-700" :
            insight.type === 'success' ? "bg-green-50 text-green-700" :
            "bg-blue-50 text-blue-700"
          )}>
            <insight.icon className="w-4 h-4" />
            {insight.text}
          </div>
        ))}
      </motion.div>

      {/* Action Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-6 gap-4">
        <ActionCard 
          label="Classes Today" 
          value={analytics.classesToday} 
          icon={CalendarDays}
          color="bg-blue-50 hover:bg-blue-100"
          onClick={() => onNavigate('timetable')}
        />
        <ActionCard 
          label="Batches" 
          value={analytics.batchesToday} 
          icon={Users2}
          color="bg-green-50 hover:bg-green-100"
          onClick={() => onNavigate('subjects')}
        />
        <ActionCard 
          label="Pending Tasks" 
          value={analytics.pendingTasks} 
          icon={Clipboard}
          color="bg-amber-50 hover:bg-amber-100"
          onClick={() => onNavigate('tasks')}
        />
        <ActionCard 
          label="Attendance" 
          value={analytics.avgAttendance} 
          icon={TrendingUp}
          color="bg-purple-50 hover:bg-purple-100"
          onClick={() => onNavigate('attendance')}
        />
        <ActionCard 
          label="Lectures/Week" 
          value={analytics.lecturesThisWeek} 
          icon={BookOpen}
          color="bg-cyan-50 hover:bg-cyan-100"
          onClick={() => onNavigate('timetable')}
        />
        <ActionCard 
          label="Quick Actions" 
          value="+" 
          icon={Plus}
          color="bg-gray-100 hover:bg-gray-200"
          onClick={() => {}}
        />
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-3 gap-6">
        {/* Today's Timeline */}
        <motion.div variants={itemVariants} className="col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Today&apos;s Schedule</h3>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{DAY_NAMES[new Date().getDay() - 1] || 'Mon'}</span>
          </div>
          
          {/* Timeline */}
          <div className="space-y-2">
            {todayClasses.length > 0 ? todayClasses.map((cls, i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 text-right">
                  <p className="text-xs text-gray-500">{cls.time.split('-')[0]}</p>
                </div>
                <div className={cn(
                  "w-1 h-12 rounded-full",
                  i === 0 ? "bg-[#0052CC]" : "bg-gray-200 group-hover:bg-gray-300 transition-colors"
                )} />
                <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-semibold text-gray-900">{cls.subject}</p>
                    <p className="text-xs text-gray-500">{cls.batch} • {cls.room}</p>
                  </div>
                  <span className={cn(
                    "text-xs px-2 py-1 rounded font-medium",
                    cls.type === 'Lecture' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  )}>
                    {cls.type}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-gray-500 text-center py-8">No classes scheduled for today</p>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: 'Take Attendance', icon: ClipboardCheck, action: () => onNavigate('attendance') },
              { label: 'Create Assignment', icon: FileText, action: () => onNavigate('assignments') },
              { label: 'Add Task', icon: Plus, action: () => onNavigate('tasks') },
              { label: 'View Faculty', icon: Users, action: () => onNavigate('faculty') },
            ].map((action, i) => (
              <button 
                key={i}
                onClick={action.action}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <div className="w-8 h-8 bg-[#0052CC]/10 rounded-lg flex items-center justify-center">
                  <action.icon className="w-4 h-4 text-[#0052CC]" />
                </div>
                <span className="text-sm font-medium text-gray-700">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function ActionCard({ label, value, icon: Icon, color, onClick }: { label: string; value: string | number; icon: any; color: string; onClick: () => void }) {
  return (
    <motion.button
      variants={itemVariants}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn("p-4 rounded-xl border border-gray-200 bg-white text-left transition-shadow hover:shadow-md", color)}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">{label}</span>
        <Icon className="w-4 h-4 text-gray-400" />
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </motion.button>
  );
}

function SubjectsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">My Subjects</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg text-sm font-medium hover:bg-[#0747A6] transition-colors">
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {SUBJECTS.map((subject, idx) => (
          <motion.div
            key={subject.code}
            variants={itemVariants}
            whileHover={{ y: -2 }}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{subject.code}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{subject.name}</h3>
            <p className="text-xs text-gray-500 mb-3">{subject.lectures} lectures + {subject.practicals} labs/week</p>
            <div className="flex flex-wrap gap-1">
              {subject.batches.map(batch => (
                <span key={batch} className="text-xs bg-[#0052CC]/10 text-[#0052CC] px-2 py-0.5 rounded font-medium">{batch}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function TimetableView() {
  const currentDay = DAY_NAMES[new Date().getDay() - 1] || 'Mon';
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Weekly Timetable</h2>
      <div className="grid grid-cols-6 gap-2">
        {DAY_NAMES.map((day, idx) => (
          <div key={day} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className={cn(
              "py-3 text-center text-sm font-semibold",
              day === currentDay ? "bg-[#0052CC] text-white" : "bg-gray-50 text-gray-700"
            )}>
              {day}
            </div>
            <div className="p-2 space-y-2 min-h-[200px]">
              {TIMETABLE[DAYS[idx] as keyof typeof TIMETABLE]?.map((cls, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 text-center">
                  <p className="text-xs font-semibold text-gray-900 truncate">{cls.subject}</p>
                  <p className="text-[10px] text-gray-500">{cls.time.split('-')[0]}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KanbanView({ tasks, onDragStart, onDragEnd, onTaskClick, draggedTask }: { 
  tasks: typeof WORKFLOW_TASKS;
  onDragStart: (id: string) => void;
  onDragEnd: (column: string) => void;
  onTaskClick: (task: any) => void;
  draggedTask: string | null;
}) {
  const columns = [
    { id: 'todo', label: 'To Do', color: '#0052CC' },
    { id: 'inProgress', label: 'In Progress', color: '#F5A623' },
    { id: 'review', label: 'Under Review', color: '#6554C0' },
    { id: 'done', label: 'Completed', color: '#36B37E' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">Task Board</h2>
          <div className="flex gap-2">
            {['ACADEMIC', 'ADMIN'].map(type => (
              <button key={type} className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors font-medium">
                {type}
              </button>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg text-sm font-medium hover:bg-[#0747A6] transition-colors">
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 h-[calc(100vh-280px)]">
        {columns.map(column => (
          <div 
            key={column.id}
            className="bg-gray-100 rounded-xl p-3 flex flex-col"
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDragEnd(column.id)}
          >
            <div className="flex items-center justify-between mb-3 px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-sm font-semibold text-gray-700">{column.label}</span>
              </div>
              <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded font-medium">
                {tasks[column.id as keyof typeof tasks].length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto">
              {tasks[column.id as keyof typeof tasks].map((task, idx) => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  index={idx}
                  onDragStart={onDragStart}
                  onClick={() => onTaskClick(task)}
                  isDragging={draggedTask === task.id}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, index, onDragStart, onClick, isDragging }: { 
  task: any; 
  index: number;
  onDragStart: (id: string) => void;
  onClick: () => void;
  isDragging: boolean;
}) {
  const priorityColors: Record<string, string> = {
    HIGH: 'text-amber-600 bg-amber-50',
    MEDIUM: 'text-blue-600 bg-blue-50',
    LOW: 'text-gray-500 bg-gray-100',
    CRITICAL: 'text-red-600 bg-red-50',
  };

  return (
    <motion.div
      layout
      variants={itemVariants}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={onClick}
      whileHover={{ y: -2 }}
      className={cn(
        "p-4 bg-white border border-gray-200 rounded-xl cursor-grab active:cursor-grabbing hover:shadow-md transition-all",
        isDragging && "rotate-2 scale-105 border-[#0052CC] shadow-lg z-50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={cn(
          "text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold",
          task.type === 'ACADEMIC' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
        )}>
          {task.type}
        </span>
        <span className={cn("text-xs px-2 py-0.5 rounded font-medium", priorityColors[task.priority])}>
          {task.priority}
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h4>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span className="font-medium">{task.course}</span>
        <span className={new Date(task.deadline) < new Date() ? 'text-red-600 font-medium' : ''}>
          {task.deadline}
        </span>
      </div>
    </motion.div>
  );
}

function TaskDetailModal({ task, onClose }: { task: any; onClose: () => void }) {
  const history = [
    { action: 'Created', user: 'Dr. Vineet Jain', time: 'Feb 15, 10:30 AM' },
    { action: 'Moved to In Progress', user: 'Dr. Vineet Jain', time: 'Feb 16, 2:15 PM' },
    { action: 'Added comment', user: 'Dr. Vineet Jain', time: 'Feb 17, 11:00 AM' },
  ];

  const subtasks = [
    { id: 1, label: 'Draft Questions', done: true },
    { id: 2, label: 'Map CO/PO', done: true },
    { id: 3, label: 'Submit for Moderation', done: false },
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-[480px] bg-white border-l border-gray-200 z-50 overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <span className="text-xs text-gray-400 font-medium">TASK-{task.id.toUpperCase()}</span>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-4">{task.title}</h2>

          <div className="flex gap-2 mb-6">
            <span className={cn(
              "text-xs px-2 py-1 rounded font-medium",
              task.type === 'ACADEMIC' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
            )}>
              {task.type}
            </span>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded font-medium">{task.course}</span>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Sub-tasks</h3>
              <div className="space-y-2">
                {subtasks.map(st => (
                  <div key={st.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      st.done ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}>
                      {st.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={st.done ? "text-gray-400 line-through" : 'text-gray-700'}>{st.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Activity</h3>
              <div className="space-y-3">
                {history.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-gray-300" />
                    <div>
                      <p>{item.action} by <span className="text-gray-600">{item.user}</span></p>
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function AttendanceView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
        <select className="h-10 px-3 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0052CC]/20">
          <option>CSE AIML (45 students)</option>
          <option>CSE (55 students)</option>
          <option>IT (48 students)</option>
        </select>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
        <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">Select a batch to take attendance</p>
      </div>
    </div>
  );
}

function AssignmentsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Assignments</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#0052CC] text-white rounded-lg text-sm font-medium hover:bg-[#0747A6]">
          <Plus className="w-4 h-4" />
          New Assignment
        </button>
      </div>
      <div className="space-y-4">
        {[
          { title: 'OS Assignment 3 - Process Scheduling', batch: 'CSE AIML', due: 'Feb 20', submitted: 32, total: 45 },
          { title: 'CN Lab Exercise - Socket Programming', batch: 'CSE', due: 'Feb 22', submitted: 28, total: 55 },
        ].map((a, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{a.title}</h3>
              <span className="text-xs text-gray-500">Due: {a.due}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="font-medium">{a.batch}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0052CC]" style={{ width: `${(a.submitted/a.total)*100}%` }} />
              </div>
              <span className="font-medium">{a.submitted}/{a.total}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyView() {
  const faculty = [
    { name: 'Dr. Amit Kumar', role: 'HOD', email: 'hod.cse@gjust.edu.in', color: 'bg-blue-100 text-blue-700' },
    { name: 'Dr. Suresh Kumar', role: 'Professor', email: 'suresh@gjust.edu.in', color: 'bg-green-100 text-green-700' },
    { name: 'Dr. Rameshwar Rao', role: 'Associate Professor', email: 'rameshwar@gjust.edu.in', color: 'bg-purple-100 text-purple-700' },
    { name: 'Dr. Vineet Jain', role: 'Assistant Professor', email: 'vineet.jain@gjust.edu.in', color: 'bg-amber-100 text-amber-700' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Faculty Directory</h2>
      <div className="grid grid-cols-4 gap-4">
        {faculty.map((f, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-full ${f.color} flex items-center justify-center mb-3`}>
              <span className="font-semibold">
                {f.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{f.name}</h3>
            <p className="text-xs text-gray-500">{f.role}</p>
            <p className="text-xs text-gray-400 mt-2">{f.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
