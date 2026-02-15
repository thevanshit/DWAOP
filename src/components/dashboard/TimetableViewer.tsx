'use client'

import { Calendar, Check } from 'lucide-react'

interface StudentInfo {
  batch?: string
  branch?: string
  semester?: number
}

function AimlTimetable() {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Weekly Timetable - CSE AI&ML Semester IV
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-center text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">8:30-9:30</th>
            <th className="border border-gray-300 p-2">9:30-10:30</th>
            <th className="border border-gray-300 p-2">10:30-11:30</th>
            <th className="border border-gray-300 p-2">11:30-12:30</th>
            <th className="border border-gray-300 p-2 bg-amber-100">Lunch</th>
            <th className="border border-gray-300 p-2">1:30-2:30</th>
            <th className="border border-gray-300 p-2">2:30-3:30</th>
            <th className="border border-gray-300 p-2">3:30-4:30</th>
            <th className="border border-gray-300 p-2">4:30-5:30</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Monday</td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G1<br/>DM LAB G2
            </td>
            <td className="border border-gray-300 p-2">SE</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2 bg-amber-50 font-bold" rowSpan={5}>
              LUNCH<br/>12:30-1:30
            </td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G3<br/>DM LAB G1
            </td>
            <td className="border border-gray-300 p-2">DM</td>
            <td className="border border-gray-300 p-2">DBMS</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Tuesday</td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G2<br/>DM LAB G3
            </td>
            <td className="border border-gray-300 p-2">SE</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">DM</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2" colSpan={2}>DBMS LAB G1</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Wednesday</td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G3<br/>DM LAB G1
            </td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">SE</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>DBMS LAB G2</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Thursday</td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G1<br/>DM LAB G2
            </td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">DM</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Friday</td>
            <td className="border border-gray-300 p-2" colSpan={2}>
              Python LAB G2<br/>DM LAB G3
            </td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2" colSpan={2}>DBMS LAB G3</td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function CseTimetable() {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Weekly Timetable - CSE Semester IV
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-center text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">8:30-9:30</th>
            <th className="border border-gray-300 p-2">9:30-10:30</th>
            <th className="border border-gray-300 p-2">10:30-11:30</th>
            <th className="border border-gray-300 p-2">11:30-12:30</th>
            <th className="border border-gray-300 p-2 bg-amber-100">Lunch</th>
            <th className="border border-gray-300 p-2">1:30-2:30</th>
            <th className="border border-gray-300 p-2">2:30-3:30</th>
            <th className="border border-gray-300 p-2">3:30-4:30</th>
            <th className="border border-gray-300 p-2">4:30-5:30</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Monday</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>OS Lab G1</td>
            <td className="border border-gray-300 p-2 bg-amber-50 font-bold" rowSpan={5}>LUNCH<br/>12:30-1:30</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2" colSpan={2}>Python Lab G2</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Tuesday</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>AI Lab G1</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Wednesday</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2" colSpan={2}>OS Lab G2</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2" colSpan={2}>AI Lab G3</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Thursday</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2" colSpan={2}>Python Lab G3</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Friday</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function ItTimetable() {
  return (
    <div className="overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Weekly Timetable - IT Semester IV
      </h2>
      <table className="w-full border-collapse border border-gray-300 text-center text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 p-2">Day</th>
            <th className="border border-gray-300 p-2">8:30-9:30</th>
            <th className="border border-gray-300 p-2">9:30-10:30</th>
            <th className="border border-gray-300 p-2">10:30-11:30</th>
            <th className="border border-gray-300 p-2">11:30-12:30</th>
            <th className="border border-gray-300 p-2 bg-amber-100">Lunch</th>
            <th className="border border-gray-300 p-2">1:30-2:30</th>
            <th className="border border-gray-300 p-2">2:30-3:30</th>
            <th className="border border-gray-300 p-2">3:30-4:30</th>
            <th className="border border-gray-300 p-2">4:30-5:30</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Monday</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>Python Lab G1</td>
            <td className="border border-gray-300 p-2 bg-amber-50 font-bold" rowSpan={5}>LUNCH<br/>12:30-1:30</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>DBMS Lab G1</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Tuesday</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2" colSpan={2}>DBMS Lab G2</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Wednesday</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>Python Lab G2</td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Thursday</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2" colSpan={2}>AI Lab G1</td>
            <td className="border border-gray-300 p-2">OS</td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
          </tr>
          <tr>
            <td className="border border-gray-300 p-2 font-medium">Friday</td>
            <td className="border border-gray-300 p-2">DBMS</td>
            <td className="border border-gray-300 p-2">DLCD</td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2"></td>
            <td className="border border-gray-300 p-2">Python</td>
            <td className="border border-gray-300 p-2">AI</td>
            <td className="border border-gray-300 p-2" colSpan={2}>OS Lab G1</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function getBranchType(specialization?: string, branch?: string): string {
  if (specialization?.toLowerCase().includes('ai') || specialization?.toLowerCase().includes('ml')) {
    return 'aiml'
  }
  if (branch?.toLowerCase().includes('information') || branch?.toLowerCase().includes('it')) {
    return 'it'
  }
  return 'cse'
}

export default function TimetableViewer({ studentInfo }: { studentInfo?: StudentInfo }) {
  const branchType = getBranchType(studentInfo?.branch, studentInfo?.branch)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Weekly Timetable</h3>
            <p className="text-sm text-gray-500">
              {studentInfo?.branch ? `${studentInfo.branch}` : 'Select your branch'}
              {studentInfo?.semester && ` • Semester ${studentInfo.semester}`}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {branchType === 'aiml' && <AimlTimetable />}
        {branchType === 'cse' && <CseTimetable />}
        {branchType === 'it' && <ItTimetable />}
      </div>

      <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded"></div>
            <span className="text-gray-500">Lab (2 hrs)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-amber-50 border border-amber-300 rounded"></div>
            <span className="text-gray-500">Lunch Break</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-600">
          <Check className="w-3.5 h-3.5" />
          <span>Official Timetable</span>
        </div>
      </div>
    </div>
  )
}
