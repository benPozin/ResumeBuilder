'use client'

import { useState, useEffect } from 'react'
import HeaderForm from '@/components/HeaderForm'
import SummaryForm from '@/components/SummaryForm'
import WorkExperienceForm from '@/components/WorkExperienceForm'
import SkillsForm from '@/components/SkillsForm'
import EducationForm from '@/components/EducationForm'
import ResumePreview from '@/components/ResumePreview'
import { useTheme } from '@/components/ThemeProvider'

// Use Next.js API routes instead of Flask backend
const API_BASE_URL = '/api'

interface WorkExperience {
  company: string
  title: string
  dates: string
  items: string[]
}

interface SkillSection {
  section_title: string
  skills: string
}

interface Education {
  institution: string
  degree: string
  dates: string
}

interface ResumeData {
  name: string
  contact_info: string
  summary: string
  work_experience: WorkExperience[]
  skills: SkillSection[]
  education: Education[]
}

export default function Home() {
  const { theme, toggleTheme } = useTheme()
  const [resumeData, setResumeData] = useState<ResumeData>({
    name: '',
    contact_info: '',
    summary: '',
    work_experience: [],
    skills: [],
    education: []
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [previewVisible, setPreviewVisible] = useState(true)
  const [previewSize, setPreviewSize] = useState<'small' | 'medium' | 'large'>('medium')

  // Start with empty form - users can add their own data
  // No need to load sample data on mount

  const loadExampleData = async () => {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(`${API_BASE_URL}/sample-data?example=true`)
      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `Server returned ${response.status}: ${response.statusText}` }
        }
        throw new Error(errorData.error || errorData.message || `Backend returned ${response.status}: ${response.statusText}`)
      }
      const data = await response.json()
      setResumeData(data)
      setMessage('Example data loaded! You can edit it or clear it to start fresh.')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      console.error('Error loading example data:', error)
      setMessage(`Error: Could not load example data. ${error instanceof Error ? error.message : 'Unknown error'}`)
      setTimeout(() => setMessage(''), 5000)
    } finally {
      setLoading(false)
    }
  }

  const clearForm = () => {
    setResumeData({
      name: '',
      contact_info: '',
      summary: '',
      work_experience: [],
      skills: [],
      education: []
    })
    setMessage('Form cleared!')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleGenerateResume = async (format: 'docx' | 'pdf' = 'docx') => {
    setLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`${API_BASE_URL}/generate-resume?format=${format}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `Server returned ${response.status}: ${response.statusText}` }
        }
        const errorMsg = errorData.error || errorData.message || `Backend returned ${response.status}: ${response.statusText}`
        throw new Error(errorMsg)
      }

      // Check if PDF generation fell back to DOCX
      const pdfFallback = response.headers.get('X-PDF-Fallback') === 'true'
      const actualFormat = pdfFallback ? 'docx' : format
      
      // Get the blob and create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      // Generate unique filename with readable timestamp (natural date format)
      const now = new Date()
      const month = now.toLocaleString('en-US', { month: 'short' }) // Nov, Dec, etc.
      const day = String(now.getDate()).padStart(2, '0') // 08, 15, etc.
      const year = now.getFullYear()
      const hours = now.getHours()
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = hours >= 12 ? 'PM' : 'AM'
      const hour12 = hours % 12 || 12 // Convert to 12-hour format
      const timestamp = `${month}-${day}-${year}_${hour12}-${minutes}${ampm}`
      const baseName = resumeData.name.replace(/[^a-zA-Z0-9]/g, '_') || 'resume'
      a.download = `${baseName}_${timestamp}.${actualFormat}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      if (pdfFallback) {
        setMessage(`PDF generation failed (permission issue). DOCX file downloaded instead. You can convert it to PDF manually using Word or other tools.`)
      } else {
        setMessage(`Resume generated successfully as ${actualFormat.toUpperCase()}!`)
      }
      setTimeout(() => setMessage(''), 5000)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('NetworkError')) {
        setMessage(`Error: Could not connect to backend. Make sure Flask is running on http://localhost:5000. Start it with: python3 app.py`)
      } else {
        setMessage(`Error: ${errorMsg}`)
      }
      console.error('Error generating resume:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  return (
    <div 
      key={theme}
      className="min-h-screen transition-all duration-500"
      style={{
        background: theme === 'dark' 
          ? 'linear-gradient(to bottom right, #0a0a0a, #111111, #1a1a1a)'
          : 'linear-gradient(to bottom right, rgb(249 250 251), rgb(248 250 252 / 0.3), rgb(249 250 251 / 0.2))'
      }}
    >
      <div className="container mx-auto px-4 py-6 max-w-7xl relative">
        {/* Header with theme toggle */}
        <header className="mb-8 pb-6 relative">
          {/* Gradient border line */}
          <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
            theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-500/50 via-purple-500 to-blue-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]' 
              : 'bg-gradient-to-r from-blue-400/60 via-purple-500/80 to-blue-400/60 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
          }`} />
          <div className="flex items-center justify-between">
            {/* Left: Title and subtitle */}
            <div className="flex-1">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className={`text-4xl font-bold bg-gradient-to-r ${theme === 'dark' ? 'from-white via-slate-300 to-white' : 'from-gray-900 via-slate-700 to-gray-900'} bg-clip-text text-transparent mb-1 animate-gradient`}>
                    Resume Builder
                  </h1>
                  <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Create professional resumes with ease
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Action buttons grouped */}
            <div className="flex items-center gap-3">
              {/* Theme toggle - more prominent */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all duration-300 hover:scale-110 active:scale-95 ${
                  theme === 'dark' 
                    ? 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 hover:bg-[#252525] hover:border-[#3a3a3a] shadow-[0_0_15px_rgba(0,0,0,0.5)]' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                }`}
                aria-label="Toggle dark mode"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              {/* Divider with gradient */}
              <div className={`h-10 w-0.5 rounded-full ${
                theme === 'dark' 
                  ? 'bg-gradient-to-b from-blue-500/50 via-purple-500 to-blue-500/50 shadow-[0_0_8px_rgba(139,92,246,0.5)]' 
                  : 'bg-gradient-to-b from-blue-400/60 via-purple-500/80 to-blue-400/60 shadow-[0_0_8px_rgba(139,92,246,0.3)]'
              }`} />

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={loadExampleData}
                  className={`px-5 py-2.5 text-white font-medium rounded-xl transition-all duration-300 text-sm shadow-md hover:shadow-lg hover:scale-105 active:scale-95 ${
                    theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Load Example
                </button>
                <button
                  onClick={clearForm}
                  className={`px-5 py-2.5 font-medium rounded-xl border transition-all duration-300 text-sm shadow-sm hover:shadow-md hover:scale-105 active:scale-95 ${
                    theme === 'dark' 
                      ? 'bg-[#1a1a1a] hover:bg-[#252525] text-[#e5e5e5] border-[#2a2a2a] hover:border-[#3a3a3a]' 
                      : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  Clear Form
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Message banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 animate-fade-in shadow-sm ${
            message.includes('Error') 
              ? theme === 'dark' 
                ? 'bg-red-900/10 text-red-300 border-red-600' 
                : 'bg-red-50 text-red-800 border-red-500'
              : message.includes('successfully')
              ? theme === 'dark'
                ? 'bg-green-900/10 text-green-300 border-green-600'
                : 'bg-green-50 text-green-800 border-green-500'
              : theme === 'dark'
              ? 'bg-blue-900/10 text-blue-300 border-blue-600'
              : 'bg-blue-50 text-blue-800 border-blue-500'
          }`}>
            <span className="font-medium text-sm">{message}</span>
          </div>
        )}

        <div className={`grid grid-cols-1 gap-6 transition-all duration-300 ${
          previewVisible 
            ? previewSize === 'small' 
              ? 'xl:grid-cols-4' 
              : previewSize === 'large' 
                ? 'xl:grid-cols-2' 
                : 'xl:grid-cols-3'
            : 'xl:grid-cols-1'
        }`}>
          {/* Left Column - Forms */}
          <div className={`space-y-6 ${previewVisible ? (previewSize === 'small' ? 'xl:col-span-3' : previewSize === 'large' ? 'xl:col-span-1' : 'xl:col-span-2') : 'xl:col-span-1'}`}>
            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <HeaderForm 
                theme={theme}
                data={resumeData} 
                onChange={(data) => {
                  updateResumeData('name', data.name)
                  updateResumeData('contact_info', data.contact_info)
                }}
              />
            </div>

            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <SummaryForm 
                theme={theme}
                summary={resumeData.summary} 
                onChange={(summary) => updateResumeData('summary', summary)}
              />
            </div>

            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <WorkExperienceForm 
                theme={theme}
                experiences={resumeData.work_experience} 
                onChange={(experiences) => updateResumeData('work_experience', experiences)}
              />
            </div>

            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <SkillsForm 
                theme={theme}
                skills={resumeData.skills} 
                onChange={(skills) => updateResumeData('skills', skills)}
              />
            </div>

            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <EducationForm 
                theme={theme}
                education={resumeData.education} 
                onChange={(education) => updateResumeData('education', education)}
              />
            </div>

            {/* Generate Buttons */}
            <div className={`rounded-lg shadow-sm border p-6 transition-all duration-300 hover:shadow-md ${
              theme === 'dark' 
                ? 'bg-[#1a1a1a] shadow-[0_0_20px_rgba(0,0,0,0.3)] border-[#2a2a2a] hover:shadow-[0_0_25px_rgba(0,0,0,0.4)]' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => handleGenerateResume('docx')}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                    theme === 'dark' 
                      ? 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                      : 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate DOCX'}
                </button>
                <button
                  onClick={() => handleGenerateResume('pdf')}
                  disabled={loading}
                  className={`flex-1 bg-gradient-to-r text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${
                    theme === 'dark' 
                      ? 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700' 
                      : 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate PDF'}
                </button>
              </div>
              <div className={`text-xs rounded-lg p-3 border ${
                theme === 'dark' 
                  ? 'text-[#a3a3a3] bg-amber-900/10 border-amber-800/30' 
                  : 'text-gray-600 bg-amber-50 border-amber-200'
              }`}>
                <strong className={theme === 'dark' ? 'text-amber-300' : 'text-amber-800'}>Note:</strong> PDF generation on macOS may prompt for file access permission. If prompted, click "Select..." and choose the file. You can also generate DOCX and convert it manually using Word or other tools.
              </div>
            </div>
          </div>

          {/* Right Column - Preview */}
          {previewVisible && (
            <div className={`${previewSize === 'small' ? 'xl:col-span-1' : previewSize === 'large' ? 'xl:col-span-1' : 'xl:col-span-1'}`}>
              <div className="sticky top-6">
                <div className={`rounded-lg shadow-lg border transition-all duration-300 ${
                  theme === 'dark' 
                    ? 'bg-[#1a1a1a] shadow-[0_0_30px_rgba(0,0,0,0.4)] border-[#2a2a2a]' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`flex items-center justify-between p-4 border-b ${
                    theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'
                  }`}>
                    <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'}`}>
                      Live Preview
                    </h2>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-1 rounded-lg p-1 ${
                        theme === 'dark' ? 'bg-[#111111]' : 'bg-gray-100'
                      }`}>
                        <button
                          onClick={() => setPreviewSize('small')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            previewSize === 'small'
                              ? theme === 'dark'
                                ? 'bg-[#1a1a1a] text-[#e5e5e5] shadow-sm'
                                : 'bg-white text-gray-900 shadow-sm'
                              : theme === 'dark'
                              ? 'text-[#a3a3a3] hover:text-[#e5e5e5]'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Small preview"
                        >
                          S
                        </button>
                        <button
                          onClick={() => setPreviewSize('medium')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            previewSize === 'medium'
                              ? theme === 'dark'
                                ? 'bg-[#1a1a1a] text-[#e5e5e5] shadow-sm'
                                : 'bg-white text-gray-900 shadow-sm'
                              : theme === 'dark'
                              ? 'text-[#a3a3a3] hover:text-[#e5e5e5]'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Medium preview"
                        >
                          M
                        </button>
                        <button
                          onClick={() => setPreviewSize('large')}
                          className={`px-2 py-1 text-xs rounded transition-colors ${
                            previewSize === 'large'
                              ? theme === 'dark'
                                ? 'bg-[#1a1a1a] text-[#e5e5e5] shadow-sm'
                                : 'bg-white text-gray-900 shadow-sm'
                              : theme === 'dark'
                              ? 'text-[#a3a3a3] hover:text-[#e5e5e5]'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                          title="Large preview"
                        >
                          L
                        </button>
                      </div>
                      <button
                        onClick={() => setPreviewVisible(false)}
                        className={`p-1.5 rounded transition-colors ${
                          theme === 'dark' 
                            ? 'text-[#a3a3a3] hover:text-[#e5e5e5] hover:bg-[#111111]' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                        }`}
                        title="Hide preview"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className={`overflow-y-auto ${previewSize === 'small' ? 'max-h-[60vh] p-4' : previewSize === 'large' ? 'max-h-[85vh] p-8' : 'max-h-[75vh] p-6'}`}>
                    <ResumePreview theme={theme} data={resumeData} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {!previewVisible && (
            <div className="fixed bottom-6 right-6 z-50">
              <button
                onClick={() => setPreviewVisible(true)}
                className={`text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center gap-2 text-sm font-medium ${
                  theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'
                }`}
                title="Show preview"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Show Preview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
