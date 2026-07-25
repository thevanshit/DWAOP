'use client'

import { Megaphone, Building2, GraduationCap, FileText, Download } from 'lucide-react'

interface Announcement {
    id: number
    title: string
    message: string
    date: string
    category?: string
    priority?: string
    author?: string
    subject?: string
}

interface OverviewTabProps {
    announcements?: Announcement[]
    administrationAnnouncements?: Announcement[]
    facultyAnnouncements?: Announcement[]
    isCR?: boolean
}

function AnnouncementCard({ title, message, date, subject, type }: { title: string, message: string, date: string, subject?: string, type: 'admin' | 'faculty' }) {
    const isAdmin = type === 'admin'
    return (
        <div className={`p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer ${isAdmin ? 'bg-blue-50/40 border-blue-100 hover:bg-blue-50/60' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/60'}`}>
            <div className="flex items-start justify-between gap-2 mb-2">
                <p className="font-medium text-sm text-slate-800 line-clamp-2">{title}</p>
                {isAdmin && <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-1" />}
            </div>
            <p className="text-xs text-slate-600 line-clamp-2">{message}</p>
            <div className="flex items-center justify-between mt-3">
                {subject && !isAdmin && (
                    <span className="text-[10px] font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{subject}</span>
                )}
                {isAdmin && (
                    <span className="text-[10px] font-medium text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-full">ADMIN</span>
                )}
                <span className="text-[10px] text-slate-400">{date}</span>
            </div>
        </div>
    )
}

function SemesterResources() {
    const resources = [
        {
            title: "4th Semester Syllabus",
            description: "Detailed syllabus for Semester IV subjects",
            file: "#"
        },
        {
            title: "AIML Scheme (2nd Year)",
            description: "Scheme structure for AIML specialization",
            file: "#"
        }
    ]

    return (
        <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 text-base">Semester Resources</h3>
                        <p className="text-xs text-slate-500">Academic documents & syllabus</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                <div className="grid md:grid-cols-2 gap-4">
                    {resources.map((res, i) => (
                        <a
                            key={i}
                            href={res.file}
                            target="_blank"
                            className="group p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all hover:shadow-md bg-slate-50/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-sm text-slate-800">
                                        {res.title}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {res.description}
                                    </p>
                                </div>
                                <Download className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

function Slot({ title, faculty, room, type = 'lecture', colSpan = 1 }: { title?: string, faculty?: string, room?: string, type?: 'lecture' | 'lab' | 'lunch' | 'free', colSpan?: number }) {
    const styles = {
        lecture: "bg-white border-blue-100 shadow-sm",
        lab: "bg-slate-50 border-slate-200",
        lunch: "bg-gray-100 border-gray-200 text-gray-500 flex items-center justify-center",
        free: "bg-gray-50 border-gray-100 opacity-50"
    }

    return (
        <div 
            className={`h-full rounded-xl border p-3 text-xs flex flex-col justify-center transition-all hover:shadow-md ${styles[type]}`}
            style={colSpan > 1 ? { gridColumn: `span ${colSpan} / span ${colSpan}` } : undefined}
        >
            {type === 'lunch' ? (
                <span className="font-medium text-center">Lunch</span>
            ) : type === 'free' ? (
                <span className="text-center">—</span>
            ) : (
                <>
                    <p className="font-semibold text-sm text-slate-800">{title}</p>
                    <p className="text-slate-500 mt-0.5">{faculty}</p>
                    <p className="text-slate-400">{room}</p>
                </>
            )}
        </div>
    )
}

const DayRow = ({ day, children }: { day: string, children: React.ReactNode }) => (
    <div className="grid grid-cols-[60px_repeat(9,1fr)] gap-2 items-stretch">
        <div className="flex items-center justify-center font-semibold text-slate-500 text-xs">{day}</div>
        {children}
    </div>
)

export default function OverviewTab({ announcements, administrationAnnouncements, facultyAnnouncements, isCR = false }: OverviewTabProps) {
    const adminAnns = administrationAnnouncements || []
    const facultyAnns = facultyAnnouncements || []
    const legacyAnns = announcements || []

    return (
        <div className="space-y-6">
            {/* Announcements - Two Column Layout */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center text-amber-600 shadow-sm">
                            <Megaphone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Announcements</h3>
                            <p className="text-xs text-slate-500">Stay updated with latest notices</p>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* Administration Section */}
                    <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <Building2 className="w-4 h-4 text-blue-600" />
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Administration</p>
                        </div>
                        
                        {adminAnns.length === 0 && facultyAnns.length === 0 && legacyAnns.length === 0 ? (
                            <div className="py-8 text-center">
                                <Megaphone className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-500">No announcements</p>
                            </div>
                        ) : adminAnns.length > 0 ? (
                            <div className="space-y-3">
                                {adminAnns.map((ann) => (
                                    <AnnouncementCard 
                                        key={ann.id} 
                                        title={ann.title} 
                                        message={ann.message} 
                                        date={ann.date}
                                        type="admin"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 py-4">No administration announcements</p>
                        )}
                    </div>

                    {/* Faculty Updates Section */}
                    <div className="p-5 space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                            <GraduationCap className="w-4 h-4 text-slate-600" />
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Updates</p>
                        </div>
                        
                        {facultyAnns.length > 0 ? (
                            <div className="space-y-3">
                                {facultyAnns.map((ann) => (
                                    <AnnouncementCard 
                                        key={ann.id} 
                                        title={ann.title} 
                                        message={ann.message} 
                                        date={ann.date}
                                        subject={ann.subject}
                                        type="faculty"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 py-4">No faculty announcements</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Timetable */}
            <div className="bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)]">
                <div className="px-5 py-4 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-semibold text-slate-800 text-base">Weekly Timetable</h3>
                            <p className="text-xs text-slate-500 mt-0.5">B.Tech AI&ML • Sem IV</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-slate-300 rounded-sm"></div>
                                <span className="text-[11px] text-slate-500 font-medium">Lab</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-blue-300 rounded-sm"></div>
                                <span className="text-[11px] text-slate-500 font-medium">Lecture</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 bg-gray-300 rounded-sm"></div>
                                <span className="text-[11px] text-slate-500 font-medium">Lunch</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="p-4">
                    {/* Time Header */}
                    <div className="grid grid-cols-[60px_repeat(9,1fr)] gap-2 text-[9px] text-slate-400 mb-3">
                        <div></div>
                        <div className="text-center font-medium">8:30<br/>-<br/>9:30</div>
                        <div className="text-center font-medium">9:30<br/>-<br/>10:30</div>
                        <div className="text-center font-medium">10:30<br/>-<br/>11:30</div>
                        <div className="text-center font-medium">11:30<br/>-<br/>12:30</div>
                        <div className="text-center font-medium text-amber-600">12:30<br/>-<br/>1:30</div>
                        <div className="text-center font-medium">1:30<br/>-<br/>2:30</div>
                        <div className="text-center font-medium">2:30<br/>-<br/>3:30</div>
                        <div className="text-center font-medium">3:30<br/>-<br/>4:30</div>
                        <div className="text-center font-medium">4:30<br/>-<br/>5:30</div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {/* MONDAY */}
                        <DayRow day="MON">
                            <Slot title="Python LAB G1 / DM LAB G2" faculty="Soni / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="SE" faculty="Pooja" room="RN302" type="lecture" />
                            <Slot title="AI" faculty="Rekha" room="RN302" type="lecture" />
                            <Slot type="lunch" />
                            <Slot title="Python LAB G3 / DM LAB G1" faculty="Soni / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="DM" faculty="Bindu" room="RN302" type="lecture" />
                            <Slot title="DBMS" faculty="Kavita" room="RN302" type="lecture" />
                        </DayRow>

                        {/* TUESDAY */}
                        <DayRow day="TUE">
                            <Slot title="Python LAB G2 / DM LAB G3" faculty="Deepak / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="SE" faculty="Pooja" room="RN302" type="lecture" />
                            <Slot title="DBMS" faculty="Kavita" room="RN302" type="lecture" />
                            <Slot type="lunch" />
                            <Slot title="DM" faculty="Bindu" room="RN302" type="lecture" />
                            <Slot title="DLCD" faculty="—" room="RN209" type="lecture" />
                            <Slot title="DBMS LAB G1" faculty="Mandeep" room="Lab115" type="lab" colSpan={2} />
                        </DayRow>

                        {/* WEDNESDAY */}
                        <DayRow day="WED">
                            <Slot title="Python LAB G3 / DM LAB G1" faculty="Soni / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="OS" faculty="Dr. Anupma" room="RN105" type="lecture" />
                            <Slot type="free" />
                            <Slot type="lunch" />
                            <Slot title="SE" faculty="Pooja" room="RN302" type="lecture" />
                            <Slot title="DBMS" faculty="Kavita" room="RN302" type="lecture" />
                            <Slot title="DBMS LAB G2" faculty="Mandeep" room="Lab115" type="lab" colSpan={2} />
                        </DayRow>

                        {/* THURSDAY */}
                        <DayRow day="THU">
                            <Slot title="Python LAB G1 / DM LAB G2" faculty="Jyoti / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="OS" faculty="Dr. Anupma" room="RN105" type="lecture" />
                            <Slot title="AI" faculty="Rekha" room="RN105" type="lecture" />
                            <Slot type="lunch" />
                            <Slot type="free" />
                            <Slot title="DM" faculty="Bindu" room="RN302" type="lecture" />
                            <Slot title="DLCD" faculty="—" room="RN302" type="lecture" />
                            <Slot type="free" />
                        </DayRow>

                        {/* FRIDAY */}
                        <DayRow day="FRI">
                            <Slot title="Python LAB G2 / DM LAB G3" faculty="Suresh / Umesh" room="Lab115 / Lab317" type="lab" colSpan={2} />
                            <Slot title="OS" faculty="Dr. Anupma" room="RN105" type="lecture" />
                            <Slot title="AI" faculty="Rekha" room="RN105" type="lecture" />
                            <Slot type="lunch" />
                            <Slot title="DLCD" faculty="—" room="RN317" type="lecture" />
                            <Slot type="free" />
                            <Slot title="DBMS LAB G3" faculty="Mandeep" room="Lab115" type="lab" colSpan={2} />
                        </DayRow>
                    </div>
                </div>
            </div>

            {/* Semester Resources */}
            <SemesterResources />
        </div>
    )
}
