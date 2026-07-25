// ==================== Student Dashboard Data ====================

export interface Subject {
  id: number
  name: string
  code: string
  attendance: number
  totalClasses: number
  presentClasses: number
  assignmentCompletion: number
  readinessScore: number
  lastClass: string
  nextClass: string
}

export interface TimetableSlot {
  time: string
  subject: string
  room: string
  faculty: string
}

export interface Announcement {
  id: number
  title: string
  message: string
  date: string
  priority?: 'high' | 'medium' | 'low'
}

export interface FacultyAnnouncement extends Announcement {
  subject: string
}

export interface Resource {
  id: number
  title: string
  description: string
  type: string
  file: string
}

export interface ClassSlot {
  time: string
  subject: string
  room: string
  faculty: string
  type: 'Lecture' | 'Lab'
}

export interface DayClasses {
  date: string
  day: string
  slots: ClassSlot[]
}

export interface Assignment {
  id: number
  subject: string
  category: 'theory' | 'lab'
  title: string
  description: string
  type: 'project' | 'coding' | 'documentation' | 'questions'
  submissionType: 'github' | 'file' | 'text'
  dueDate: string
  status: 'pending' | 'submitted' | 'evaluated' | 'late'
  maxMarks: number
  submittedDate?: string
  marks?: number
  githubLink?: string
}

export interface Mark {
  subject: string
  subjectCode?: string
  internal1: number
  internal2: number
  assignment: number
  total: number
  status: string
}

export interface TrackReport {
  semester: string
  year: string
  attendance: number
  marks: number | null
  cgpa: number | null
  status: 'locked' | 'in_progress' | 'completed'
}

export interface FeeItem {
  id: number
  semester: string
  year: string
  tuition: number
  hostel: number
  library: number
  exam: number
  total: number
  status: 'paid' | 'pending'
  paidDate?: string
  ref?: string
  dueDate?: string
}

export interface Transaction {
  id: number
  date: string
  amount: number
  method: string
  reference: string
  semester: string
}

export interface HostelInfo {
  name: string
  block: string
  roomNumber: string
  floor: string
  bedType: string
  messType: string
  warden: string
  wardens: string[]
  contact: string
}

export interface HostelHistoryItem {
  year: string
  semester: string
  hostel: string
  block: string
  room: string
  status: 'current' | 'previous'
}

export interface HostelAmenity {
  id: number
  name: string
  icon: any
  available: boolean
  description: string
}

export interface MessMenu {
  [meal: string]: string[]
}

export interface EmergencyContact {
  id: number
  name: string
  phone: string
  available: string
}

export interface SportsFacility {
  id: number
  name: string
  icon: string
  courts?: number
  ground?: number
  tables?: number
  available: boolean
  timing: string
}

export interface SportsEvent {
  id: number
  name: string
  sport: string
  date: string
  venue: string
  registrationDeadline: string
  fee: number
  type: string
  teams?: number
  participants?: number
  registered: boolean
}

export interface SportsAchievement {
  id: number
  student: string
  event: string
  sport: string
  position: string
  date: string
}

export interface SemesterSubjectDetail {
  name: string
  marks: number
  grade: string
}

export interface SemesterDetail {
  semester: string
  year: string
  subjects: SemesterSubjectDetail[]
}

// ==================== DATA CONSTANTS ====================

export const SUBJECTS: Subject[] = [
  { id: 1, name: 'Data Structures', code: 'CS301', attendance: 88, totalClasses: 25, presentClasses: 22, assignmentCompletion: 85, readinessScore: 90, lastClass: 'Feb 10', nextClass: 'Feb 15' },
  { id: 2, name: 'Database Systems', code: 'CS302', attendance: 80, totalClasses: 25, presentClasses: 20, assignmentCompletion: 60, readinessScore: 70, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 3, name: 'Operating Systems', code: 'CS303', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 50, readinessScore: 62, lastClass: 'Feb 11', nextClass: 'Feb 14' },
  { id: 4, name: 'Software Engineering', code: 'CS304', attendance: 92, totalClasses: 25, presentClasses: 23, assignmentCompletion: 95, readinessScore: 94, lastClass: 'Feb 13', nextClass: 'Feb 17' },
  { id: 5, name: 'Computer Networks', code: 'CS305', attendance: 76, totalClasses: 25, presentClasses: 19, assignmentCompletion: 70, readinessScore: 75, lastClass: 'Feb 12', nextClass: 'Feb 16' },
  { id: 6, name: 'Web Technologies', code: 'CS306', attendance: 84, totalClasses: 25, presentClasses: 21, assignmentCompletion: 80, readinessScore: 82, lastClass: 'Feb 14', nextClass: 'Feb 18' },
]

export const TIMETABLE = [
  { day: 'Monday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '11:00-12:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '14:00-16:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma' }] },
  { day: 'Tuesday', slots: [{ time: '09:00-10:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '10:00-11:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '11:00-12:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }] },
  { day: 'Wednesday', slots: [{ time: '09:00-10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '10:00-11:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh' }, { time: '11:00-12:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '14:00-16:00', subject: 'DBMS Lab', room: 'Lab-2', faculty: 'Prof. Kumar' }] },
  { day: 'Thursday', slots: [{ time: '09:00-10:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }, { time: '10:00-11:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }, { time: '11:00-12:00', subject: 'OS Lab', room: 'Lab-1', faculty: 'Dr. Singh' }] },
  { day: 'Friday', slots: [{ time: '09:00-10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma' }, { time: '10:00-11:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma' }, { time: '11:00-12:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar' }] },
]

export const ADMIN_ANNOUNCEMENTS: Announcement[] = [
  { id: 1, title: 'Minor 2 Examination Schedule', message: 'Minor 2 exams will be held from March 1-5, 2026. Detailed schedule will be uploaded soon. Prepare accordingly.', date: '2026-02-12', priority: 'high' },
  { id: 2, title: 'Holiday on 16th February', message: 'College will remain closed on 16th February on the occasion of Konark 2026.', date: '2026-02-11', priority: 'medium' },
  { id: 3, title: 'Mid-Term Break', message: 'Mid-term break from Feb 20-25. College reopens on 26th February.', date: '2026-02-10', priority: 'low' },
]

export const FACULTY_ANNOUNCEMENTS: FacultyAnnouncement[] = [
  { id: 4, title: 'Operating Systems Class Cancelled', message: 'OS class on Tuesday (Feb 17) has been cancelled due to faculty meeting.', subject: 'Operating Systems', date: '2026-02-14' },
  { id: 5, title: 'DBMS Assignment Deadline Extended', message: 'DBMS Assignment 2 deadline extended to 26th Feb due to server issues.', subject: 'Database Systems', date: '2026-02-13' },
  { id: 6, title: 'DBMS Lab Cancelled', message: 'DBMS Lab on Wednesday (Feb 18) has been cancelled.', subject: 'Database Systems', date: '2026-02-12' },
  { id: 7, title: 'AI Project Review', message: 'AI project first review will be conducted on Feb 20. Submit proposals by Feb 18.', subject: 'Artificial Intelligence', date: '2026-02-11' },
]

export const SEMESTER_RESOURCES: Resource[] = [
  { id: 1, title: '4th Semester Syllabus', description: 'Detailed syllabus for Semester IV subjects', type: 'syllabus', file: '#' },
  { id: 2, title: 'AI&ML Scheme (2nd Year)', description: 'Scheme structure for AI&ML specialization', type: 'scheme', file: '#' },
  { id: 3, title: 'Academic Calendar', description: 'Important dates and events for odd semester 2025-26', type: 'calendar', file: '#' },
  { id: 4, title: 'Lab Manual', description: 'Practical experiments and lab guidelines', type: 'lab', file: '#' },
]

export const UPCOMING_CLASSES: DayClasses[] = [
  { date: '2026-02-17', day: 'Monday', slots: [{ time: '09:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' }, { time: '10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar', type: 'Lecture' }, { time: '14:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma', type: 'Lab' }] },
  { date: '2026-02-18', day: 'Tuesday', slots: [{ time: '09:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh', type: 'Lecture' }, { time: '10:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' }, { time: '11:00', subject: 'Software Engineering', room: 'A104', faculty: 'Prof. Verma', type: 'Lecture' }] },
]

export const TODAY_CLASSES: ClassSlot[] = [
  { time: '09:00', subject: 'Data Structures', room: 'A101', faculty: 'Dr. Sharma', type: 'Lecture' },
  { time: '10:00', subject: 'Database Systems', room: 'A102', faculty: 'Prof. Kumar', type: 'Lecture' },
  { time: '11:00', subject: 'Operating Systems', room: 'A103', faculty: 'Dr. Singh', type: 'Lecture' },
  { time: '14:00', subject: 'SE Lab', room: 'Lab-1', faculty: 'Prof. Verma', type: 'Lab' },
]

export const ASSIGNMENTS: Assignment[] = [
  { id: 1, subject: 'DBMS', category: 'theory', title: 'SQL Optimization Assignment', description: 'Optimize the given SQL queries for better performance', type: 'coding', submissionType: 'file', dueDate: '2026-02-20', status: 'pending', maxMarks: 50 },
  { id: 2, subject: 'DBMS', category: 'theory', title: 'ER Diagram Design', description: 'Create ER diagram for online bookstore system', type: 'project', submissionType: 'file', dueDate: '2026-02-12', status: 'submitted', maxMarks: 75, submittedDate: '2026-02-10' },
  { id: 3, subject: 'DBMS', category: 'theory', title: 'Normalization Quiz', description: 'Complete the normalization exercises', type: 'questions', submissionType: 'text', dueDate: '2026-02-08', status: 'evaluated', maxMarks: 25, marks: 22 },
  { id: 4, subject: 'OS', category: 'theory', title: 'Process Scheduling Report', description: 'Write a detailed report on CPU scheduling algorithms', type: 'documentation', submissionType: 'text', dueDate: '2026-02-25', status: 'pending', maxMarks: 50 },
  { id: 5, subject: 'SE', category: 'theory', title: 'UML System Design', description: 'Create UML diagrams for library management system', type: 'project', submissionType: 'file', dueDate: '2026-03-01', status: 'pending', maxMarks: 100 },
  { id: 6, subject: 'AI', category: 'theory', title: 'Search Algorithms Project', description: 'Implement BFS and DFS for puzzle solving', type: 'project', submissionType: 'github', dueDate: '2026-02-28', status: 'pending', maxMarks: 75 },
]

export const MARKS: Mark[] = [
  { subject: 'Data Structures', subjectCode: 'CS301', internal1: 20, internal2: 21, assignment: 0, total: 41, status: 'finalized' },
  { subject: 'Database Systems', subjectCode: 'CS302', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'under_review' },
  { subject: 'Operating Systems', subjectCode: 'CS303', internal1: 20, internal2: 22, assignment: 0, total: 42, status: 'draft' },
  { subject: 'Software Engineering', subjectCode: 'CS304', internal1: 22, internal2: 21, assignment: 0, total: 43, status: 'finalized' },
  { subject: 'Computer Networks', subjectCode: 'CS305', internal1: 21, internal2: 20, assignment: 0, total: 41, status: 'draft' },
  { subject: 'Web Technologies', subjectCode: 'CS306', internal1: 21, internal2: 21, assignment: 0, total: 42, status: 'draft' },
]

export const TRACK_REPORTS: TrackReport[] = [
  { semester: 'Semester 1', year: '2024-25', attendance: 82, marks: 245, cgpa: 8.2, status: 'locked' },
  { semester: 'Semester 2', year: '2024-25', attendance: 78, marks: 238, cgpa: 7.9, status: 'locked' },
  { semester: 'Semester 3', year: '2025-26', attendance: 85, marks: 252, cgpa: 8.4, status: 'locked' },
  { semester: 'Semester 4', year: '2025-26', attendance: 79, marks: null, cgpa: null, status: 'in_progress' },
]

export const FEE_STRUCTURE: FeeItem[] = [
  { id: 1, semester: 'Semester 1', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-07-20', ref: 'TXN/2024/001' },
  { id: 2, semester: 'Semester 2', year: '2024-25', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2024-12-15', ref: 'TXN/2024/002' },
  { id: 3, semester: 'Semester 3', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'paid', paidDate: '2025-07-18', ref: 'TXN/2025/001' },
  { id: 4, semester: 'Semester 4', year: '2025-26', tuition: 42000, hostel: 13550, library: 2000, exam: 1500, total: 59050, status: 'pending', dueDate: '2026-02-28' },
]

export const TRANSACTIONS: Transaction[] = [
  { id: 1, date: '2024-07-20', amount: 59050, method: 'Online Transfer', reference: 'TXN/2024/001', semester: 'Semester 1' },
  { id: 2, date: '2024-12-15', amount: 59050, method: 'UPI Payment', reference: 'TXN/2024/002', semester: 'Semester 2' },
  { id: 3, date: '2025-07-18', amount: 59050, method: 'Online Transfer', reference: 'TXN/2025/001', semester: 'Semester 3' },
]

export const CURRENT_HOSTEL: HostelInfo = {
  name: 'Vivekanand Hostel',
  block: 'BH4 (Boys Hostel 4)',
  roomNumber: '2A Wing, 318',
  floor: '3rd Floor',
  bedType: '4 Sharing',
  messType: 'Vegetarian',
  warden: 'Dr. O.P. Sangwan (Chief Warden)',
  wardens: ['Mr. Shardul', 'Mr. Manoj Yadav'],
  contact: '+91 1800 123 4567',
}

export const HOSTEL_HISTORY: HostelHistoryItem[] = [
  { year: '2025-26', semester: 'Semester 4', hostel: 'Vivekanand Hostel', block: 'BH4', room: '318', status: 'current' },
  { year: '2025-26', semester: 'Semester 3', hostel: 'Vivekanand Hostel', block: 'BH4', room: '215', status: 'previous' },
  { year: '2024-25', semester: 'Semester 2', hostel: 'Vivekanand Hostel', block: 'BH4', room: '112', status: 'previous' },
  { year: '2024-25', semester: 'Semester 1', hostel: 'Vivekanand Hostel', block: 'BH4', room: '108', status: 'previous' },
]

export const HOSTEL_AMENITIES: HostelAmenity[] = [
  { id: 1, name: 'WiFi', icon: 'Wifi', available: true, description: 'High-speed internet 24/7' },
  { id: 2, name: 'Laundry', icon: 'FlaskConical', available: true, description: 'Automated laundry machines' },
  { id: 3, name: 'Parking', icon: 'Car', available: true, description: 'Two-wheeler parking available' },
  { id: 4, name: 'Mess', icon: 'Utensils', available: true, description: 'Multi-cuisine mess facility' },
  { id: 5, name: 'Security', icon: 'Shield', available: true, description: '24/7 security & CCTV' },
  { id: 6, name: 'Gym', icon: 'Dumbbell', available: true, description: 'Indoor gymnasium' },
]

export const MESS_MENU: MessMenu = {
  breakfast: ['Puri Sabzi', 'Paratha', 'Oats', 'Poha', 'Eggs', 'Milk', 'Tea/Coffee'],
  lunch: ['Dal Makhani', 'Rice', 'Roti', 'Vegetables', 'Pickle', 'Salad', 'Buttermilk'],
  snacks: ['Samosa', 'Pakora', 'Tea/Coffee', 'Biscuits', 'Fruits'],
  dinner: ['Paneer', 'Rice', 'Roti', 'Dal', 'Vegetables', 'Salad', 'Dessert'],
}

export const HOSTEL_EMERGENCY: EmergencyContact[] = [
  { id: 1, name: 'Warden Office', phone: '+91 1800 123 4567', available: '24/7' },
  { id: 2, name: 'Security Gate', phone: '+91 1800 123 4568', available: '24/7' },
  { id: 3, name: 'Medical Emergency', phone: '+91 1800 123 4569', available: '24/7' },
  { id: 4, name: 'Maintenance', phone: '+91 1800 123 4570', available: '9 AM - 6 PM' },
]

export const SPORTS_FACILITIES: SportsFacility[] = [
  { id: 1, name: 'Badminton', icon: '🏸', courts: 2, available: true, timing: '6 AM - 9 PM' },
  { id: 2, name: 'Basketball', icon: '🏀', courts: 1, available: true, timing: '6 AM - 9 PM' },
  { id: 3, name: 'Cricket', icon: '🏏', ground: 1, available: true, timing: '6 AM - 6 PM' },
  { id: 4, name: 'Football', icon: '⚽', ground: 1, available: true, timing: '6 AM - 6 PM' },
  { id: 5, name: 'Table Tennis', icon: '🏓', tables: 4, available: true, timing: '8 AM - 9 PM' },
  { id: 6, name: 'Chess', icon: '♟️', tables: 10, available: true, timing: '10 AM - 8 PM' },
  { id: 7, name: 'Gym', icon: '🏋️', available: true, timing: '5 AM - 10 PM' },
  { id: 8, name: 'Swimming', icon: '🏊', available: true, timing: '6 AM - 8 PM' },
]

export const SPORTS_EVENTS: SportsEvent[] = [
  { id: 1, name: 'Inter-College Basketball Tournament', sport: 'Basketball', date: '2026-02-25', venue: 'Main Court', registrationDeadline: '2026-02-20', fee: 500, type: 'Tournament', teams: 8, registered: true },
  { id: 2, name: 'Annual Badminton Championship', sport: 'Badminton', date: '2026-03-01', venue: 'Sports Complex', registrationDeadline: '2026-02-25', fee: 300, type: 'Championship', participants: 64, registered: false },
  { id: 3, name: 'Cricket League 2026', sport: 'Cricket', date: '2026-03-05', venue: 'Cricket Ground', registrationDeadline: '2026-02-28', fee: 1000, type: 'League', teams: 12, registered: false },
  { id: 4, name: 'Table Tennis Open', sport: 'Table Tennis', date: '2026-02-28', venue: 'Sports Complex', registrationDeadline: '2026-02-22', fee: 200, type: 'Open', participants: 32, registered: true },
]

export const SPORTS_ACHIEVEMENTS: SportsAchievement[] = [
  { id: 1, student: 'Vanshit Gaur', event: 'Inter-College Badminton 2025', sport: 'Badminton', position: 'Winner', date: '2025-11-15' },
  { id: 2, student: 'Vanshit Gaur', event: 'Annual Sports Meet', sport: 'Table Tennis', position: 'Runner-up', date: '2025-09-20' },
]

export const SUBJECT_NOTES = [
  {
    id: 1,
    subject: 'Operating Systems',
    code: 'CS303',
    topics: ['Process Scheduling', 'Deadlock Prevention', 'Memory Management', 'File Systems'],
    notes: [
      { title: 'CPU Scheduling Algorithms', type: 'PDF', pages: 12 },
      { title: 'Deadlock Notes', type: 'PDF', pages: 8 },
      { title: 'Memory Management PPT', type: 'PPT', pages: 25 },
    ]
  },
  {
    id: 2,
    subject: 'Computer Networks',
    code: 'CS305',
    topics: ['OSI Model', 'TCP/IP', 'Routing', 'Network Security'],
    notes: [
      { title: 'Networking Fundamentals', type: 'PDF', pages: 15 },
      { title: 'TCP/IP Notes', type: 'PDF', pages: 10 },
      { title: 'Routing Protocols', type: 'PDF', pages: 8 },
    ]
  },
  {
    id: 3,
    subject: 'Software Engineering',
    code: 'CS304',
    topics: ['SDLC', 'UML Diagrams', 'Agile Methods', 'Testing'],
    notes: [
      { title: 'SDLC Overview', type: 'PDF', pages: 10 },
      { title: 'UML Tutorial', type: 'PDF', pages: 18 },
      { title: 'Agile Methodology', type: 'PPT', pages: 20 },
    ]
  },
  {
    id: 4,
    subject: 'Data Structures & Algorithms',
    code: 'CS301',
    topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting'],
    notes: [
      { title: 'DSA Basics', type: 'PDF', pages: 20 },
      { title: 'Tree traversals', type: 'PDF', pages: 12 },
      { title: 'Graph Algorithms', type: 'PDF', pages: 15 },
      { title: 'Sorting Techniques', type: 'PDF', pages: 10 },
    ]
  },
]

export const TRACK_SEMESTER_DETAILS: SemesterDetail[] = [
  { semester: 'Semester 1', year: '2024-25', subjects: [
    { name: 'Mathematics I', marks: 85, grade: 'A' },
    { name: 'Physics', marks: 78, grade: 'B+' },
    { name: 'Chemistry', marks: 82, grade: 'A' },
    { name: 'Programming', marks: 88, grade: 'A+' },
    { name: 'English', marks: 75, grade: 'B' },
  ]},
  { semester: 'Semester 2', year: '2024-25', subjects: [
    { name: 'Mathematics II', marks: 80, grade: 'A' },
    { name: 'Data Structures', marks: 85, grade: 'A' },
    { name: 'Digital Logic', marks: 73, grade: 'B+' },
    { name: 'Communicative English', marks: 72, grade: 'B' },
    { name: 'Engineering Mechanics', marks: 76, grade: 'B+' },
  ]},
  { semester: 'Semester 3', year: '2025-26', subjects: [
    { name: 'Database Systems', marks: 82, grade: 'A' },
    { name: 'Operating Systems', marks: 79, grade: 'B+' },
    { name: 'Software Engineering', marks: 88, grade: 'A+' },
    { name: 'Computer Networks', marks: 75, grade: 'B' },
    { name: 'AI/ML Basics', marks: 85, grade: 'A' },
  ]},
]
