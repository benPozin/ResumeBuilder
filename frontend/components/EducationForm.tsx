'use client'

import { useState } from 'react'

interface Education {
  institution: string
  degree: string
  dates: string
}

interface EducationFormProps {
  theme: 'light' | 'dark'
  education: Education[]
  onChange: (education: Education[]) => void
}

export default function EducationForm({ theme, education, onChange }: EducationFormProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const addEducation = () => {
    const newEdu: Education = {
      institution: '',
      degree: '',
      dates: ''
    }
    onChange([...education, newEdu])
    setExpandedIndex(education.length)
  }

  const updateEducation = (index: number, field: keyof Education, value: string) => {
    const updated = [...education]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeEducation = (index: number) => {
    const updated = education.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Education</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'}`}>Your educational background</p>
        </div>
        <button
          onClick={addEducation}
          className={`${theme === 'dark' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
        >
          Add Education
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className={`border rounded-lg p-4 transition-colors ${
            theme === 'dark' 
              ? 'border-[#2a2a2a] bg-[#111111] hover:border-slate-600' 
              : 'border-gray-200 bg-gray-50 hover:border-slate-300'
          }`}>
            <div className="flex justify-between items-start mb-3">
              <button
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                className="text-left flex-1 group"
              >
                <h3 className={`font-semibold text-base transition-colors ${
                  theme === 'dark' 
                    ? 'text-white group-hover:text-slate-400' 
                    : 'text-gray-900 group-hover:text-slate-600'
                }`}>
                  {edu.institution || `Education ${index + 1}`}
                </h3>
              </button>
              <button
                onClick={() => removeEducation(index)}
                className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'} p-1.5 rounded transition-colors text-sm font-medium`}
              >
                Remove
              </button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 mt-4 animate-fade-in">
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Institution Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Degree or Certification"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={edu.dates || ''}
                  onChange={(e) => updateEducation(index, 'dates', e.target.value)}
                  placeholder="Date Range (e.g., 2015 - 2019)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
        {education.length === 0 && (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-400'}`}>
            <p className="text-sm">No education entries added yet. Click "Add Education" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
