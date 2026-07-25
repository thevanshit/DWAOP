'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Calendar, FileText, Users, Kanban, Settings, 
  Bell, Plus, X, ChevronLeft, ChevronRight, ClipboardCheck, Award,
  CheckCircle2, Clock, AlertTriangle, TrendingUp, Users2, CalendarDays, 
  Clipboard, BarChart3, Send, Layers, UserCheck, FileUp,
  BookMarked, ClipboardList, BarChart, Megaphone, Search, Filter, Upload,
  Download, Eye, Edit, Trash2, Save, UserMinus, UserPlus, Clock3, Check,
  AlertCircle, Pin, Archive, PanelLeftClose, PanelLeft, ArrowUpRight, ArrowDownRight,
  BookOpen, GraduationCap, Target, Activity, Sparkles, Mail, Phone, User
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { TeacherDashboardProvider, useTeacherDashboardContext } from '@/components/dashboard/teacher/TeacherDashboardProvider';
import { DashboardView } from '@/components/dashboard/teacher/DashboardView';
import { BatchesView } from '@/components/dashboard/teacher/BatchesView';
import { TimetableView } from '@/components/dashboard/teacher/TimetableView';
import { TaskboardView } from '@/components/dashboard/teacher/TaskboardView';
import { AttendanceView } from '@/components/dashboard/teacher/AttendanceView';
import { AssignmentsView } from '@/components/dashboard/teacher/AssignmentsView';
import { MarksEntryView } from '@/components/dashboard/teacher/MarksEntryView';
import { AnalyticsView } from '@/components/dashboard/teacher/AnalyticsView';
import { AnnouncementsView } from '@/components/dashboard/teacher/AnnouncementsView';
import { DirectoryView } from '@/components/dashboard/teacher/DirectoryView';
import { SettingsView } from '@/components/dashboard/teacher/SettingsView';
import { NewAssignmentModal } from '@/components/dashboard/teacher/NewAssignmentModal';
import { AddTaskModal } from '@/components/dashboard/teacher/AddTaskModal';

type TabType = 'dashboard' | 'batches' | 'timetable' | 'attendance' | 'assignments' | 'tasks' | 'marks' | 'analytics' | 'announcements' | 'directory' | 'settings';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

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

function DashboardContent() {
  const router = useRouter();
  const ctx = useTeacherDashboardContext();
  
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [taskFilter, setTaskFilter] = useState<'all' | 'urgent' | 'thisweek'>('all');
  const [selectedBatch, setSelectedBatch] = useState(ctx.batches[0]?.id || '');
  const [selectedAssignment, setSelectedAssignment] = useState<number | null>(null);
  const [announcementType, setAnnouncementType] = useState<'toStudents' | 'fromAdmin'>('toStudents');
  const [attendance, setAttendance] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const [showNewAssignment, setShowNewAssignment] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  const currentUser = ctx.user || { name: 'Dr. Vineet Jain', role: 'Assistant Professor', avatar: 'VJ' };

  const analytics = {
    classesToday: ctx.todayClasses.length,
    totalBatches: ctx.batches.length,
    pendingTasks: ctx.academicTasks.todo.length + ctx.academicTasks.overdue.length + ctx.adminTasks.todo.length + ctx.adminTasks.overdue.length,
    lecturesThisWeek: 18,
    urgentTasks: ctx.academicTasks.overdue.length + ctx.academicTasks.todo.filter(t => t.priority === 'HIGH' || t.priority === 'CRITICAL').length,
  };

  const currentBatch = ctx.batches.find(b => b.id === selectedBatch);
  const currentStudents = ctx.students[selectedBatch as keyof typeof ctx.students] || [];

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
            {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
            {activeTab === 'batches' && <BatchesView batches={ctx.batches} selectedBatch={selectedBatch} onSelectBatch={setSelectedBatch} />}
            {activeTab === 'timetable' && <TimetableView />}
            {activeTab === 'tasks' && <TaskboardView filter={taskFilter} setFilter={setTaskFilter} onAddTask={() => setShowAddTask(true)} />}
            {activeTab === 'attendance' && <AttendanceView batches={ctx.batches} selectedBatch={selectedBatch} onSelectBatch={setSelectedBatch} students={currentStudents} attendance={attendance} onMarkAttendance={handleAttendanceMark} onMarkAllPresent={handleMarkAllPresent} onMarkAllAbsent={handleMarkAllAbsent} />}
            {activeTab === 'assignments' && <AssignmentsView batches={ctx.batches} assignments={ctx.assignments} onNewAssignment={() => setShowNewAssignment(true)} />}
            {activeTab === 'marks' && <MarksEntryView batches={ctx.batches} selectedBatch={selectedBatch} onSelectBatch={setSelectedBatch} assignments={ctx.assignments} selectedAssignment={selectedAssignment} onSelectAssignment={setSelectedAssignment} marksData={ctx.marksData} />}
            {activeTab === 'analytics' && <AnalyticsView batches={ctx.batches} analytics={ctx.analytics} onNewAssignment={() => setShowNewAssignment(true)} />}
            {activeTab === 'announcements' && <AnnouncementsView type={announcementType} setType={setAnnouncementType} announcements={ctx.announcements} />}
            {activeTab === 'directory' && <DirectoryView faculty={ctx.faculty} />}
            {activeTab === 'settings' && <SettingsView />}
          </motion.div>
        </AnimatePresence>
        </div>

        {/* Modals */}
        <NewAssignmentModal isOpen={showNewAssignment} onClose={() => setShowNewAssignment(false)} batches={ctx.batches} />
        <AddTaskModal isOpen={showAddTask} onClose={() => setShowAddTask(false)} />
      </main>
    </div>
  );
}

export default function FacultyDashboard() {
  return (
    <TeacherDashboardProvider>
      <DashboardContent />
    </TeacherDashboardProvider>
  );
}
