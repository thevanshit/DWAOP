'use client'

import DashboardLayout from '@/components/common/DashboardLayout'
import { 
  Home, 
  Calendar, 
  FileText, 
  Users, 
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  GraduationCap,
  UserCheck,
  Award,
  BookOpen,
  ChevronRight,
  Crown,
  UserCircle
} from 'lucide-react'
import { useState } from 'react'

const batches = [
  { id: 1, name: 'CSE Batch 1', strength: 70, crBoy: 'Karan', crGirl: 'Maheshwari' },
  { id: 2, name: 'CSE Batch 2', strength: 70, crBoy: 'Harsh Kalkal', crGirl: 'Nikita' },
  { id: 3, name: 'CSE (AIML) Batch 1', strength: 70, crBoy: 'Ronit', crGirl: 'Naman' },
  { id: 4, name: 'CSE (AIML) Batch 2', strength: 70, crBoy: 'Gaurav', crGirl: 'Priyanka' },
  { id: 5, name: 'CSE IT', strength: 70, crBoy: 'Rohit Verma', crGirl: 'Meera Joshi' },
]

const facultyMembers = [
  {
    level: 'Professors',
    icon: Crown,
    color: 'from-purple-500 to-pink-600',
    members: [
      { name: 'Prof. Yogesh Chaba', designation: 'Senior Professor', subjects: ['Computer Science', 'Advanced Algorithms'] },
      { name: 'Prof. Rishi Pal Singh', designation: 'Professor', subjects: ['Database Systems', 'Data Mining'] },
      { name: 'Prof. Om Prakash Sangwan', designation: 'Professor', subjects: ['Software Engineering', 'System Design'] },
      { name: 'Prof. Sanjeev Kumar', designation: 'Professor & Chief Warden', subjects: ['Computer Networks', 'Network Security'] },
      { name: 'Prof. Jyoti', designation: 'Professor', subjects: ['Machine Learning', 'AI'] },
      { name: 'Prof. Sunila', designation: 'Professor', subjects: ['Web Technologies', 'Cloud Computing'] },
      { name: 'Prof. Jaswinder Singh', designation: 'Professor', subjects: ['Operating Systems', 'Distributed Systems'] },
    ]
  },
  {
    level: 'Associate Professors',
    icon: Award,
    color: 'from-indigo-500 to-purple-600',
    members: [
      { name: 'Dr. Ritu Makani', designation: 'Associate Professor', subjects: ['Data Structures', 'Algorithm Design'] },
    ]
  },
  {
    level: 'Assistant Professors',
    icon: Award,
    color: 'from-blue-500 to-cyan-600',
    members: [
      { name: 'Dr. Jai Bhagwan', designation: 'Assistant Professor', subjects: ['Programming Languages', 'C++'] },
      { name: 'Dr. Narender Kumar', designation: 'Assistant Professor', subjects: ['Computer Networks', 'Network Protocols'] },
      { name: 'Dr. Manoj', designation: 'Assistant Professor', subjects: ['Database Management', 'SQL'] },
      { name: 'Dr. Abhishek Kajal', designation: 'Assistant Professor', subjects: ['Web Development', 'Full Stack'] },
      { name: 'Dr. Sakshi Dhingra', designation: 'Assistant Professor', subjects: ['Machine Learning', 'Deep Learning'] },
      { name: 'Dr. Anju', designation: 'Assistant Professor', subjects: ['Software Engineering', 'Agile Methods'] },
      { name: 'Dr. Sunita', designation: 'Assistant Professor', subjects: ['Operating Systems', 'Linux'] },
      { name: 'Dr. Deepak Nandal', designation: 'Assistant Professor', subjects: ['Data Science', 'Python'] },
      { name: 'Dr. Krishan Kumar', designation: 'Assistant Professor', subjects: ['Cloud Computing', 'AWS'] },
      { name: 'Dr. Sudhanshu Gaur', designation: 'Assistant Professor', subjects: ['Mobile Computing', 'Android'] },
    ]
  },
  {
    level: 'Counsellors & Contract Faculty',
    icon: UserCheck,
    color: 'from-green-500 to-emerald-600',
    members: [
      { name: 'Dr. Sunil Kumar', designation: 'Counsellor', subjects: ['Student Guidance', 'Career Counseling'] },
      { name: 'Ms. Renu Bansal', designation: 'Assistant Professor (Contract)', subjects: ['Java Programming', 'OOP'] },
      { name: 'Sh. Amit Kumar', designation: 'Assistant Professor (Contract)', subjects: ['Web Technologies', 'JavaScript'] },
      { name: 'Sh. Ankur Garg', designation: 'Assistant Professor (Contract)', subjects: ['Database Systems', 'MySQL'] },
      { name: 'Sh. Ayush Sharma', designation: 'Assistant Professor (Contract)', subjects: ['Python Programming', 'Data Analysis'] },
      { name: 'Ms. Ravika Goel', designation: 'Assistant Professor (Contract)', subjects: ['Machine Learning', 'AI Basics'] },
      { name: 'Sh. Davinder Singh', designation: 'Assistant Professor (Contract)', subjects: ['Computer Networks', 'Networking'] },
      { name: 'Dr. Anupma', designation: 'Assistant Professor (Contract)', subjects: ['Software Engineering', 'Project Management'] },
      { name: 'Ms. Deepsheikha Dogra', designation: 'Assistant Professor (Contract)', subjects: ['Web Development', 'React'] },
      { name: 'Ms. Mona Gupta', designation: 'Assistant Professor (Contract)', subjects: ['Data Structures', 'Algorithms'] },
      { name: 'Sh. Pawan Kumar', designation: 'Assistant Professor (Contract)', subjects: ['Operating Systems', 'System Programming'] },
      { name: 'Ms. Nisha Rani', designation: 'Assistant Professor (Contract)', subjects: ['Database Management', 'MongoDB'] },
      { name: 'Sh. Ashwani Kumar', designation: 'Assistant Professor (Contract)', subjects: ['Cloud Computing', 'Azure'] },
      { name: 'Ms. Bindu Rani', designation: 'Assistant Professor (Contract)', subjects: ['Mobile App Development', 'Flutter'] },
      { name: 'Ms. Rekha', designation: 'Assistant Professor (Contract)', subjects: ['Web Technologies', 'Node.js'] },
      { name: 'Sh. Ramesh Kumar', designation: 'Assistant Professor (Contract)', subjects: ['Programming Fundamentals', 'C'] },
      { name: 'Pooja Rani', designation: 'Assistant Professor (Contract)', subjects: ['Data Science', 'R Programming'] },
      { name: 'Shweta Mittal', designation: 'Assistant Professor (Contract)', subjects: ['Machine Learning', 'TensorFlow'] },
      { name: 'Sh. Anand Kumar', designation: 'Assistant Professor (Contract)', subjects: ['Computer Networks', 'Security'] },
    ]
  },
]

export default function TeacherDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null)

  const navItems = [
    { label: 'Dashboard', icon: <Home className="w-5 h-5" />, href: '#overview' },
    { label: 'Batches', icon: <Users className="w-5 h-5" />, href: '#batches' },
    { label: 'Faculty', icon: <GraduationCap className="w-5 h-5" />, href: '#faculty' },
    { label: 'Attendance Sessions', icon: <Calendar className="w-5 h-5" />, href: '#attendance' },
    { label: 'Assignments', icon: <FileText className="w-5 h-5" />, href: '#assignments' },
    { label: 'Internal Marks', icon: <CheckCircle className="w-5 h-5" />, href: '#marks' },
    { label: 'Tasks', icon: <BookOpen className="w-5 h-5" />, href: '#tasks' },
    { label: 'Settings', icon: <Settings className="w-5 h-5" />, href: '#settings' },
  ]

  return (
    <DashboardLayout role="teacher" roleLabel="Faculty Dashboard" navItems={navItems}>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 p-6">
          <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_30%_20%,rgba(147,51,234,0.15),transparent_55%)]" />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                Welcome, <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Faculty</span>
              </h1>
              <p className="text-gray-600">
                Manage your batches, students, and academic workflows.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Total Batches</span>
                <span className="text-xl font-bold text-purple-600">{batches.length}</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Total Students</span>
                <span className="text-xl font-bold text-blue-600">{batches.length * 70}</span>
              </div>
              <div className="flex flex-col items-center px-4 py-2 rounded-xl bg-white/70 backdrop-blur border border-gray-100">
                <span className="text-xs text-gray-500">Pending Tasks</span>
                <span className="text-xl font-bold text-orange-600">8</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Items Assigned</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Pending Evaluations</p>
                <p className="text-3xl font-bold">8</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Attendance Sessions</p>
                <p className="text-3xl font-bold">15</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 text-white p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide opacity-80 mb-1">Delayed Tasks</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="card rounded-2xl">
          <div className="border-b border-jira-gray-200 mb-6">
            <div className="flex space-x-6 overflow-x-auto">
              {['overview', 'batches', 'faculty', 'attendance', 'assignments', 'marks', 'tasks'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`pb-4 px-2 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    selectedTab === tab
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-jira-gray-600 hover:text-jira-gray-900'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Quick Stats Row */}
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-blue-700 font-medium mb-1">Pending Evaluations</p>
                      <p className="text-2xl font-bold text-blue-900">8</p>
                    </div>
                    <Clock className="w-8 h-8 text-blue-600 opacity-50" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-purple-700 font-medium mb-1">Active Sessions</p>
                      <p className="text-2xl font-bold text-purple-900">3</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600 opacity-50" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-green-700 font-medium mb-1">Marks Completed</p>
                      <p className="text-2xl font-bold text-green-900">12/15</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-600 opacity-50" />
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-orange-700 font-medium mb-1">Urgent Tasks</p>
                      <p className="text-2xl font-bold text-orange-900">2</p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-orange-600 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Items Assigned to Me */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Items Assigned to Me</h3>
                    <p className="text-sm text-gray-600">Your pending tasks and responsibilities</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All</button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { title: 'Evaluate Data Structures Assignment 3', type: 'assignment', priority: 'high', due: '2 days', batch: 'CSE Batch 1', icon: FileText },
                    { title: 'Finalize Internal Marks - DBMS', type: 'marks', priority: 'critical', due: '1 day', batch: 'CSE Batch 2', icon: CheckCircle },
                    { title: 'Review Leave Request', type: 'leave', priority: 'medium', due: '3 days', batch: 'CSE (AIML) Batch 1', icon: Calendar },
                    { title: 'Prepare Exam Question Paper - SE', type: 'task', priority: 'high', due: '5 days', batch: 'CSE IT', icon: BookOpen },
                  ].map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <div key={idx} className="p-5 border border-jira-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start space-x-3 flex-1">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              item.priority === 'critical' ? 'bg-red-100' :
                              item.priority === 'high' ? 'bg-orange-100' :
                              'bg-blue-100'
                            }`}>
                              <IconComponent className={`w-5 h-5 ${
                                item.priority === 'critical' ? 'text-red-600' :
                                item.priority === 'high' ? 'text-orange-600' :
                                'text-blue-600'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-1">{item.title}</p>
                              <p className="text-xs text-gray-600 mb-2">{item.batch}</p>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                                  item.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                  item.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                  'bg-blue-100 text-blue-700'
                                }`}>
                                  {item.priority}
                                </span>
                                <span className="text-xs text-gray-500">Due in {item.due}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button className="w-full btn-primary text-sm py-2 mt-3">View Details</button>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quick Batch Overview */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Quick Batch Overview</h3>
                    <p className="text-sm text-gray-600">Your assigned batches at a glance</p>
                  </div>
                  <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">View All Batches</button>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  {batches.slice(0, 3).map((batch, idx) => (
                    <div key={batch.id} className="p-5 border border-jira-gray-200 rounded-xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50 group cursor-pointer">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${
                          idx === 0 ? 'from-blue-500 to-blue-600' :
                          idx === 1 ? 'from-purple-500 to-purple-600' :
                          'from-pink-500 to-pink-600'
                        }`}>
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{batch.name}</h4>
                          <p className="text-xs text-gray-600">{batch.strength} students</p>
                        </div>
                      </div>
                      <div className="space-y-2 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center space-x-2">
                            <UserCircle className="w-4 h-4 text-blue-600" />
                            <span>Boy CR:</span>
                          </span>
                          <span className="font-semibold text-gray-900">{batch.crBoy}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center space-x-2">
                            <UserCircle className="w-4 h-4 text-pink-600" />
                            <span>Girl CR:</span>
                          </span>
                          <span className="font-semibold text-gray-900">{batch.crGirl}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Batches Tab */}
          {selectedTab === 'batches' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">All Batches</h3>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Batch</span>
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {batches.map((batch) => (
                  <div
                    key={batch.id}
                    onClick={() => setSelectedBatch(selectedBatch === batch.id ? null : batch.id)}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                      selectedBatch === batch.id
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg scale-105'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedBatch === batch.id
                            ? 'bg-gradient-to-br from-purple-500 to-blue-600'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200'
                        }`}>
                          <GraduationCap className={`w-6 h-6 ${selectedBatch === batch.id ? 'text-white' : 'text-gray-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-gray-900">{batch.name}</h4>
                          <p className="text-sm text-gray-600">Strength: {batch.strength} students</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${selectedBatch === batch.id ? 'rotate-90' : ''}`} />
                    </div>

                    {/* CR Section */}
                    <div className="space-y-3 pt-4 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Class Representatives</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <UserCircle className="w-4 h-4 text-blue-600" />
                            <span className="text-sm text-gray-700">Boy CR:</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{batch.crBoy}</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-pink-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <UserCircle className="w-4 h-4 text-pink-600" />
                            <span className="text-sm text-gray-700">Girl CR:</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{batch.crGirl}</span>
                        </div>
                      </div>
                    </div>

                    {selectedBatch === batch.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <button className="w-full btn-primary text-sm py-2">View Batch Details</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Faculty Members Tab */}
          {selectedTab === 'faculty' && (
            <div className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Faculty Members</h3>
                <p className="text-sm text-gray-600">Department faculty and their specializations</p>
              </div>

              <div className="space-y-6">
                {facultyMembers.map((level, idx) => {
                  const IconComponent = level.icon
                  return (
                    <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
                      {/* Level Header */}
                      <div className={`bg-gradient-to-r ${level.color} p-4`}>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-white">{level.level}</h4>
                            <p className="text-sm text-white/80">{level.members.length} members</p>
                          </div>
                        </div>
                      </div>

                      {/* Members List */}
                      <div className="p-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          {level.members.map((member, memberIdx) => (
                            <div
                              key={memberIdx}
                              className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div>
                                  <h5 className="font-semibold text-gray-900">{member.name}</h5>
                                  <p className="text-sm text-gray-600">{member.designation}</p>
                                </div>
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                  <UserCircle className="w-6 h-6 text-gray-600" />
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {member.subjects.map((subject, subIdx) => (
                                  <span
                                    key={subIdx}
                                    className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-md font-medium"
                                  >
                                    {subject}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {selectedTab === 'attendance' && (
            <div className="space-y-6">
              {/* Header + Quick stats */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Attendance Sessions</h3>
                  <p className="text-sm text-gray-600">
                    Manage today&apos;s sessions and track class participation across all batches.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="hidden md:flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Open</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 ml-3" />
                    <span>Closed</span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 ml-3" />
                    <span>Finalised</span>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Session</span>
                  </button>
                </div>
              </div>

              {/* Sessions list */}
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    subject: 'Data Structures',
                    batch: 'CSE Batch 1',
                    date: 'Dec 13, 2024',
                    time: '10:00 AM - 11:00 AM',
                    status: 'open',
                    room: 'C-302',
                    present: 44,
                    total: 50,
                  },
                  {
                    subject: 'Database Management',
                    batch: 'CSE Batch 2',
                    date: 'Dec 12, 2024',
                    time: '2:00 PM - 3:00 PM',
                    status: 'closed',
                    room: 'Lab-2',
                    present: 36,
                    total: 48,
                  },
                  {
                    subject: 'Software Engineering',
                    batch: 'CSE (AIML) Batch 1',
                    date: 'Dec 11, 2024',
                    time: '11:00 AM - 12:00 PM',
                    status: 'finalised',
                    room: 'C-210',
                    present: 41,
                    total: 45,
                  },
                  {
                    subject: 'Computer Networks',
                    batch: 'CSE IT',
                    date: 'Dec 11, 2024',
                    time: '9:00 AM - 10:00 AM',
                    status: 'open',
                    room: 'Lab-1',
                    present: 52,
                    total: 70,
                  },
                ].map((session, idx) => {
                  const percentage = Math.round((session.present / session.total) * 100)
                  const statusColor =
                    session.status === 'open'
                      ? 'bg-emerald-100 text-emerald-700'
                      : session.status === 'closed'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'

                  const barColor =
                    percentage >= 85 ? 'bg-emerald-500' : percentage >= 75 ? 'bg-amber-400' : 'bg-red-500'

                  return (
                    <div
                      key={idx}
                      className="p-5 border border-jira-gray-200 rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900">{session.subject}</h4>
                          <p className="text-sm text-jira-gray-600">
                            {session.batch} • {session.date} • {session.time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">Room: {session.room}</p>
                        </div>
                        <span className={`px-3 py-1 text-xs rounded-full capitalize ${statusColor}`}>
                          {session.status}
                        </span>
                      </div>

                      {/* Attendance progress */}
                      <div className="mt-3 mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Attendance</span>
                          <span className="font-medium text-gray-900">
                            {session.present}/{session.total} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-jira-gray-200 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Present</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="w-2 h-2 rounded-full bg-red-500" />
                            <span>Absent</span>
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="btn-secondary text-xs px-3 py-1.5 flex items-center space-x-2">
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                          {session.status === 'closed' && (
                            <button className="btn-primary text-xs px-3 py-1.5">Finalize</button>
                          )}
                          {session.status === 'open' && (
                            <button className="btn-secondary text-xs px-3 py-1.5">Close</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {selectedTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Assignments</h3>
                  <p className="text-sm text-gray-600">
                    Plan, track and evaluate all course assignments across your batches.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>Assigned</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 ml-3" />
                    <span>Under Review</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-3" />
                    <span>Evaluated</span>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Assignment</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Data Structures Assignment 3',
                    batch: 'CSE Batch 1',
                    deadline: 'Dec 15, 2024',
                    maxMarks: 100,
                    submissions: 45,
                    totalStudents: 50,
                    status: 'assigned',
                    type: 'Problem Set',
                  },
                  {
                    title: 'Database Design Project',
                    batch: 'CSE Batch 2',
                    deadline: 'Dec 10, 2024',
                    maxMarks: 150,
                    submissions: 38,
                    totalStudents: 42,
                    status: 'under review',
                    type: 'Project',
                  },
                  {
                    title: 'SE Case Study Report',
                    batch: 'CSE (AIML) Batch 1',
                    deadline: 'Dec 05, 2024',
                    maxMarks: 50,
                    submissions: 45,
                    totalStudents: 45,
                    status: 'evaluated',
                    type: 'Case Study',
                  },
                ].map((assignment, idx) => {
                  const progress = Math.round(
                    (assignment.submissions / assignment.totalStudents) * 100
                  )
                  const statusColor =
                    assignment.status === 'assigned'
                      ? 'bg-blue-100 text-blue-700'
                      : assignment.status === 'under review'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-emerald-100 text-emerald-700'

                  return (
                    <div
                      key={idx}
                      className="p-5 border border-jira-gray-200 rounded-2xl hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 pr-4">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-lg text-gray-900">
                              {assignment.title}
                            </h4>
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${statusColor}`}>
                              {assignment.status}
                            </span>
                          </div>
                          <p className="text-sm text-jira-gray-600 mb-1">{assignment.batch}</p>
                          <p className="text-xs text-gray-500">
                            Type: <span className="font-medium text-gray-700">{assignment.type}</span> •
                            &nbsp;Max Marks: <span className="font-medium">{assignment.maxMarks}</span>
                          </p>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-3 mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Submission Progress</span>
                          <span className="font-medium text-gray-900">
                            {assignment.submissions}/{assignment.totalStudents} ({progress}%)
                          </span>
                        </div>
                        <div className="w-full bg-jira-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full ${
                              progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
                        <span>Deadline: {assignment.deadline}</span>
                        <span>
                          Status:{' '}
                          <span className="font-semibold text-gray-800 capitalize">
                            {assignment.status}
                          </span>
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="btn-primary text-xs px-3 py-2 flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Submissions</span>
                        </button>
                        <button className="btn-secondary text-xs px-3 py-2 flex items-center space-x-2">
                          <Edit className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Marks Tab */}
          {selectedTab === 'marks' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Internal Marks</h3>
                  <p className="text-sm text-gray-600">
                    Manage and track internal assessment marks across all subjects and batches.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="hidden md:flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600">
                    <span className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>Draft</span>
                    <span className="w-2 h-2 rounded-full bg-amber-400 ml-3" />
                    <span>Submitted</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-3" />
                    <span>Finalised</span>
                  </div>
                  <button className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Enter Marks</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    subject: 'Data Structures',
                    batch: 'CSE Batch 1',
                    status: 'draft',
                    students: 50,
                    entered: 45,
                    components: { assignments: 35, tests: 40, attendance: 10 },
                    totalMarks: 85,
                    maxMarks: 100,
                  },
                  {
                    subject: 'Database Management',
                    batch: 'CSE Batch 2',
                    status: 'submitted',
                    students: 48,
                    entered: 48,
                    components: { assignments: 30, tests: 35, attendance: 8 },
                    totalMarks: 73,
                    maxMarks: 100,
                  },
                  {
                    subject: 'Software Engineering',
                    batch: 'CSE (AIML) Batch 1',
                    status: 'draft',
                    students: 45,
                    entered: 30,
                    components: { assignments: 0, tests: 0, attendance: 0 },
                    totalMarks: 0,
                    maxMarks: 100,
                  },
                  {
                    subject: 'Computer Networks',
                    batch: 'CSE IT',
                    status: 'finalised',
                    students: 70,
                    entered: 70,
                    components: { assignments: 32, tests: 38, attendance: 12 },
                    totalMarks: 82,
                    maxMarks: 100,
                  },
                ].map((item, idx) => {
                  const progress = Math.round((item.entered / item.students) * 100)
                  const statusColor =
                    item.status === 'draft'
                      ? 'bg-gray-100 text-gray-700 border-gray-300'
                      : item.status === 'submitted'
                      ? 'bg-amber-100 text-amber-700 border-amber-300'
                      : 'bg-emerald-100 text-emerald-700 border-emerald-300'

                  return (
                    <div
                      key={idx}
                      className="p-5 border border-jira-gray-200 rounded-2xl hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-gray-900 mb-1">{item.subject}</h4>
                          <p className="text-sm text-jira-gray-600 mb-2">{item.batch}</p>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 text-xs rounded-full capitalize border ${statusColor}`}>
                              {item.status}
                            </span>
                            {item.status === 'finalised' && (
                              <span className="text-xs text-emerald-600 font-medium flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>Locked</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Marks Entry Progress</span>
                          <span className="font-semibold text-gray-900">
                            {item.entered}/{item.students} ({progress}%)
                          </span>
                        </div>
                        <div className="w-full bg-jira-gray-200 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`h-2.5 rounded-full ${
                              progress === 100 ? 'bg-emerald-500' : progress >= 80 ? 'bg-blue-500' : 'bg-amber-400'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Components Breakdown */}
                      {item.status !== 'draft' || item.entered > 0 ? (
                        <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Assignments</p>
                            <p className="text-sm font-bold text-gray-900">{item.components.assignments}/40</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Tests</p>
                            <p className="text-sm font-bold text-gray-900">{item.components.tests}/40</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600 mb-1">Attendance</p>
                            <p className="text-sm font-bold text-gray-900">{item.components.attendance}/20</p>
                          </div>
                          <div className="text-center border-l border-gray-300 pl-2">
                            <p className="text-xs text-gray-600 mb-1">Total</p>
                            <p className="text-sm font-bold text-purple-600">{item.totalMarks}/{item.maxMarks}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500">No marks entered yet</p>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="flex-1 btn-primary text-sm px-4 py-2 flex items-center justify-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View/Edit</span>
                        </button>
                        {item.status === 'draft' && item.entered === item.students && (
                          <button className="btn-secondary text-sm px-4 py-2">Submit for Review</button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Tasks Tab */}
          {selectedTab === 'tasks' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold">Departmental Tasks</h3>
                  <p className="text-sm text-gray-600">
                    Track and manage your departmental responsibilities and assignments.
                  </p>
                </div>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Task</span>
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { name: 'To Do', color: 'from-gray-100 to-gray-200', count: 4 },
                  { name: 'In Progress', color: 'from-blue-100 to-blue-200', count: 3 },
                  { name: 'Review', color: 'from-amber-100 to-amber-200', count: 2 },
                  { name: 'Done', color: 'from-emerald-100 to-emerald-200', count: 5 },
                ].map((column, colIdx) => (
                  <div key={column.name} className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-900">{column.name}</h4>
                      <span className="px-2 py-1 text-xs font-bold bg-white rounded-full text-gray-700 border border-gray-300">
                        {column.count}
                      </span>
                    </div>
                    <div className="space-y-3 min-h-[200px]">
                      {[
                        { title: 'Prepare Exam Question Paper - Data Structures', priority: 'high', due: '5 days', assignee: 'You', type: 'exam' },
                        { title: 'Accreditation Documentation Review', priority: 'medium', due: '10 days', assignee: 'Dr. Ritu Makani', type: 'documentation' },
                        { title: 'Faculty Meeting Preparation', priority: 'low', due: '3 days', assignee: 'You', type: 'meeting' },
                      ].slice(0, colIdx === 0 ? 2 : colIdx === 1 ? 2 : colIdx === 2 ? 1 : 0).map((task, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <p className="font-semibold text-sm text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                              {task.title}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2 ${
                              task.priority === 'high' ? 'bg-red-100 text-red-700' :
                              task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                {task.assignee.charAt(0)}
                              </div>
                              <span className="text-xs text-gray-600">{task.assignee}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{task.due}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-md">
                              {task.type}
                            </span>
                          </div>
                        </div>
                      ))}
                      {colIdx === 0 && (
                        <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-purple-400 hover:text-purple-600 transition-colors flex items-center justify-center space-x-2">
                          <Plus className="w-4 h-4" />
                          <span>Add Task</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
