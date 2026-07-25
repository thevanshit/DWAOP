'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/common/DashboardLayout'
import {
    User,
    Mail,
    Phone,
    Calendar,
    MapPin,
    BookOpen,
    Award,
    Edit,
    Download,
    Home,
    FileText,
    TrendingUp,
    ClipboardList,
    GraduationCap,
    Users,
    Clock,
    Shield,
    CreditCard,
    ArrowLeft,
    ChevronRight
} from 'lucide-react'
import { UserRole } from '@/types'

export default function ProfilePage() {
    const router = useRouter()
    const userRole: UserRole = 'student'

    const navItems = [
        { label: 'Overview', icon: <Home className="w-4 h-4" />, href: '/dashboard/student#overview' },
        { label: 'Assignments', icon: <FileText className="w-4 h-4" />, href: '/dashboard/student#assignments' },
        { label: 'Attendance', icon: <Calendar className="w-4 h-4" />, href: '/dashboard/student#attendance' },
        { label: 'Marks', icon: <Award className="w-4 h-4" />, href: '/dashboard/student#marks' },
        { label: 'Requests', icon: <ClipboardList className="w-4 h-4" />, href: '/dashboard/student#requests' },
        { label: 'Track Report', icon: <TrendingUp className="w-4 h-4" />, href: '/dashboard/student#track' },
    ]

    const studentData = {
        name: 'Vanshit Gaur',
        rollNumber: '240010150100',
        email: 'vanshit@gjust.edu.in',
        semester: 4,
        branch: 'Computer Science & Engineering',
        section: 'A',
        enrollmentNumber: 'GJUST/CSE/2021/XXX',
        batchYear: '2021-2025',
        currentCGPA: 8.4,
        overallAttendance: 79,
        dateOfBirth: '2003-01-15',
        gender: 'Male',
        bloodGroup: 'O+',
        contactNumber: '+91 98765 43210',
        emergencyContact: '+91 98765 43211',
        alternateEmail: 'vanshit.personal@gmail.com',
        parentContact: '+91 98765 43212',
        admissionDate: '2021-08-15',
        category: 'General',
        quota: 'State Quota',
        aadhaar: 'XXXX XXXX XXXX 1234',
        nationality: 'Indian',
        religion: 'Hindu',
        fatherName: 'Mr. Rajesh Gaur',
        motherName: 'Mrs. Sunita Gaur',
        permanentAddress: '123, Sector-15, Gurgaon, Haryana - 122001',
        correspondenceAddress: 'Same as above'
    }

    const academicStats = [
        { label: 'Current CGPA', value: studentData.currentCGPA.toString(), sub: 'Out of 10.0', icon: <Award className="w-5 h-5" />, color: 'bg-green-50 text-green-600', border: 'border-green-200' },
        { label: 'Attendance', value: `${studentData.overallAttendance}%`, sub: 'Overall', icon: <Clock className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600', border: 'border-blue-200' },
        { label: 'Semester', value: `Sem ${studentData.semester}`, sub: 'Section {studentData.section}', icon: <BookOpen className="w-5 h-5" />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-200' },
        { label: 'Credits', value: '96', sub: 'Earned', icon: <GraduationCap className="w-5 h-5" />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-200' },
    ]

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    return (
        <DashboardLayout role={userRole} roleLabel="Student" navItems={navItems}>
            <div className="space-y-6">
                {/* Back Button */}
                <button 
                    onClick={() => router.push('/dashboard/student')}
                    className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </button>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--color-text-primary)]">My Profile</h1>
                    <p className="text-[var(--color-text-muted)] mt-1">View and manage your personal information</p>
                </div>

                {/* Hero Section */}
                <div className="
                    bg-gradient-to-br from-white via-[var(--color-primary-faint)]/30 to-white 
                    rounded-2xl border border-black/[0.04]
                    shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                    overflow-hidden
                ">
                    <div className="h-24 bg-gradient-to-r from-[var(--color-primary)] via-blue-500 to-indigo-600"></div>
                    <div className="px-6 md:px-8 pb-8">
                        <div className="flex flex-col md:flex-row md:items-end gap-6 -mt-12">
                            <div className="w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] to-blue-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white">
                                {getInitials(studentData.name)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">{studentData.name}</h2>
                                <p className="text-[var(--color-text-muted)] font-medium">{studentData.rollNumber}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-[var(--color-primary-faint)] text-[var(--color-primary)] text-sm font-medium rounded-full">
                                        Semester {studentData.semester}
                                    </span>
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-sm font-medium rounded-full">
                                        Section {studentData.section}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-50 text-purple-600 text-sm font-medium rounded-full">
                                        {studentData.branch}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-black/[0.04] hover:bg-gray-50 rounded-xl transition-colors shadow-sm">
                                    <Download className="w-4 h-4" />
                                    ID Card
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                                    <Edit className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {academicStats.map((stat, idx) => (
                        <div key={idx} className={`
                            bg-white rounded-2xl border border-black/[0.04]
                            shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                            p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                        `}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-[var(--color-text-muted)]">{stat.label}</span>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                            <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Information Cards Grid */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Personal Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Full Name" value={studentData.name} icon={<User className="w-4 h-4" />} />
                            <InfoCardRow label="Date of Birth" value={new Date(studentData.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} icon={<Calendar className="w-4 h-4" />} />
                            <InfoCardRow label="Gender" value={studentData.gender} icon={<Users className="w-4 h-4" />} />
                            <InfoCardRow label="Blood Group" value={studentData.bloodGroup} icon={<Shield className="w-4 h-4" />} highlight />
                            <InfoCardRow label="Nationality" value={studentData.nationality} icon={<MapPin className="w-4 h-4" />} />
                            <InfoCardRow label="Religion" value={studentData.religion} icon={<BookOpen className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <Phone className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Contact Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Primary Email" value={studentData.email} icon={<Mail className="w-4 h-4" />} />
                            <InfoCardRow label="Alternate Email" value={studentData.alternateEmail} icon={<Mail className="w-4 h-4" />} />
                            <InfoCardRow label="Phone Number" value={studentData.contactNumber} icon={<Phone className="w-4 h-4" />} />
                            <InfoCardRow label="Emergency Contact" value={studentData.emergencyContact} icon={<Phone className="w-4 h-4" />} highlight />
                            <InfoCardRow label="Aadhaar Number" value={studentData.aadhaar} icon={<CreditCard className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Academic Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Enrollment Number" value={studentData.enrollmentNumber} icon={<FileText className="w-4 h-4" />} />
                            <InfoCardRow label="Roll Number" value={studentData.rollNumber} icon={<ClipboardList className="w-4 h-4" />} />
                            <InfoCardRow label="Batch Year" value={studentData.batchYear} icon={<Calendar className="w-4 h-4" />} />
                            <InfoCardRow label="Current Semester" value={`Semester ${studentData.semester}`} icon={<BookOpen className="w-4 h-4" />} />
                            <InfoCardRow label="Section" value={studentData.section} icon={<Users className="w-4 h-4" />} />
                            <InfoCardRow label="Branch" value={studentData.branch} icon={<GraduationCap className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Performance & Enrollment */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <Award className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Performance & Enrollment</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Current CGPA" value={studentData.currentCGPA.toString()} icon={<Award className="w-4 h-4" />} highlight />
                            <InfoCardRow label="Overall Attendance" value={`${studentData.overallAttendance}%`} icon={<Clock className="w-4 h-4" />} highlight />
                            <InfoCardRow label="Admission Date" value={new Date(studentData.admissionDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} icon={<Calendar className="w-4 h-4" />} />
                            <InfoCardRow label="Category" value={studentData.category} icon={<Shield className="w-4 h-4" />} />
                            <InfoCardRow label="Quota" value={studentData.quota} icon={<MapPin className="w-4 h-4" />} />
                        </div>
                    </div>

                    {/* Parent Details */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Parent Details</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Father's Name" value={studentData.fatherName} icon={<User className="w-4 h-4" />} />
                            <InfoCardRow label="Mother's Name" value={studentData.motherName} icon={<User className="w-4 h-4" />} />
                            <InfoCardRow label="Parent Contact" value={studentData.parentContact} icon={<Phone className="w-4 h-4" />} highlight />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="
                        bg-white rounded-2xl border border-black/[0.04]
                        shadow-[0_1px_3px_rgba(0,0,0,0.02),0_4px_12px_rgba(0,0,0,0.02)]
                        hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200
                    ">
                        <div className="px-6 py-4 border-b border-black/[0.04] flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-[var(--color-text-primary)]">Address Information</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <InfoCardRow label="Permanent Address" value={studentData.permanentAddress} icon={<Home className="w-4 h-4" />} />
                            <InfoCardRow label="Correspondence Address" value={studentData.correspondenceAddress} icon={<MapPin className="w-4 h-4" />} />
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

function InfoCardRow({ label, value, icon, highlight }: { label: string; value: string; icon: React.ReactNode; highlight?: boolean }) {
    return (
        <div className="flex items-start justify-between py-2 border-b border-black/[0.04] last:border-0">
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? 'bg-[var(--color-primary-faint)] text-[var(--color-primary)]' : 'bg-gray-50 text-gray-400'}`}>
                    {icon}
                </div>
                <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
            </div>
            <span className={`text-sm font-semibold ${highlight ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-primary)]'} text-right max-w-[60%] truncate`}>{value}</span>
        </div>
    )
}
