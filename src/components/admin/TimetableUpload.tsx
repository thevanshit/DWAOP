'use client'

import { useState, useRef, useEffect } from 'react'
import { Upload, Image as ImageIcon, X, Check, Loader2, Calendar } from 'lucide-react'

interface TimetableUploadProps {
  onUploadSuccess?: (data: { imageUrl: string; batch: string; semester: string }) => void
}

export default function TimetableUpload({ onUploadSuccess }: TimetableUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [batch, setBatch] = useState('BTech AI&ML')
  const [semester, setSemester] = useState('IV')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentTimetable, setCurrentTimetable] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchCurrentTimetable()
  }, [])

  const fetchCurrentTimetable = async () => {
    try {
      const res = await fetch('/api/timetable', { cache: 'no-store' })
      const data = await res.json()
      setCurrentTimetable(data)
    } catch (e) {
      console.error(e)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError(null)
      const reader = new FileReader()
      reader.onload = () => setPreview(reader.result as string)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('batch', batch)
      formData.append('semester', semester)

      const response = await fetch('/api/timetable', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(true)
      setCurrentTimetable(data.data)
      onUploadSuccess?.(data.data)
      
      setTimeout(() => {
        setSuccess(false)
        setFile(null)
        setPreview(null)
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Current Timetable Status */}
      {currentTimetable?.imageUrl && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
              <Check className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-green-800">Current Timetable</p>
              <p className="text-sm text-green-600">
                {currentTimetable.batch} • Semester {currentTimetable.semester} • Updated {new Date(currentTimetable.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <a 
              href={currentTimetable.imageUrl} 
              target="_blank"
              className="text-sm text-green-700 hover:underline"
            >
              View
            </a>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Upload Timetable</h3>
              <p className="text-sm text-gray-500">Upload official timetable image for students</p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Batch & Semester */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
              <select 
                value={batch}
                onChange={(e) => setBatch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="BTech AI&ML">BTech AI&ML</option>
                <option value="BTech CSE">BTech CSE</option>
                <option value="BTech IT">BTech IT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select 
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="I">I</option>
                <option value="II">II</option>
                <option value="III">III</option>
                <option value="IV">IV</option>
                <option value="V">V</option>
                <option value="VI">VI</option>
                <option value="VII">VII</option>
                <option value="VIII">VIII</option>
              </select>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timetable Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            
            {!file ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors cursor-pointer"
              >
                <ImageIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">Click to upload image (JPG, PNG, PDF)</span>
                <span className="text-xs text-gray-400 mt-1">Max 10MB</span>
              </button>
            ) : (
              <div className="relative border border-gray-200 rounded-xl p-4">
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 p-1 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                
                {preview && (
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="text-xs text-gray-400 mt-1">Will be uploaded to: {batch} - Sem {semester}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700">Timetable uploaded successfully!</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Timetable
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 text-center">
            Uploaded timetable will be automatically visible to all students of this batch
          </p>
        </div>
      </div>
    </div>
  )
}
