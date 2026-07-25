import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

export const dynamic = 'force-dynamic'

interface Timetable {
  batch: string
  semester: string
  imageUrl: string
  uploadedAt: string
}

const DATA_FILE = path.join(process.cwd(), 'data', 'timetable.json')

async function loadData(): Promise<Timetable> {
  try {
    const data = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {
      batch: 'BTech AI&ML',
      semester: 'IV',
      imageUrl: '/timetable-sample.png',
      uploadedAt: new Date().toISOString()
    }
  }
}

async function saveData(data: Timetable) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true })
  await writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const batch = searchParams.get('batch')

  const timetable = await loadData()

  if (batch && timetable.batch !== batch) {
    return NextResponse.json({ 
      error: 'Timetable not found for this batch' 
    }, { status: 404 })
  }

  return NextResponse.json(timetable)
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const batch = (formData.get('batch') as string) || 'BTech AI&ML'
    const semester = (formData.get('semester') as string) || 'IV'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPG, PNG, PDF allowed' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'timetable')
    await mkdir(uploadDir, { recursive: true })

    const fileName = `timetable-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    const filePath = path.join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    const timetableData: Timetable = {
      batch,
      semester,
      imageUrl: `/uploads/timetable/${fileName}`,
      uploadedAt: new Date().toISOString()
    }

    await saveData(timetableData)

    return NextResponse.json({ 
      success: true, 
      data: timetableData 
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
