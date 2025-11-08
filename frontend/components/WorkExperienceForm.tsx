'use client'

import { useState } from 'react'

interface WorkExperience {
  company: string
  title: string
  dates: string
  items: string[]
}

interface WorkExperienceFormProps {
  theme: 'light' | 'dark'
  experiences: WorkExperience[]
  onChange: (experiences: WorkExperience[]) => void
}

export default function WorkExperienceForm({ theme, experiences, onChange }: WorkExperienceFormProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const addExperience = () => {
    const newExp: WorkExperience = {
      company: '',
      title: '',
      dates: '',
      items: ['']
    }
    onChange([...experiences, newExp])
    setExpandedIndex(experiences.length)
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    const updated = [...experiences]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    const updated = [...experiences]
    updated[expIndex].items[bulletIndex] = value
    onChange(updated)
  }

  const addBullet = (expIndex: number) => {
    const updated = [...experiences]
    updated[expIndex].items.push('')
    onChange(updated)
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experiences]
    updated[expIndex].items.splice(bulletIndex, 1)
    onChange(updated)
  }

  const removeExperience = (index: number) => {
    const updated = experiences.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Work Experience</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'}`}>Your professional work history</p>
        </div>
        <button
          onClick={addExperience}
          className={`${theme === 'dark' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
        >
          Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp, index) => (
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
                  {exp.company || `Experience ${index + 1}`}
                </h3>
              </button>
              <button
                onClick={() => removeExperience(index)}
                className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'} p-1.5 rounded transition-colors text-sm font-medium`}
                title="Remove experience"
              >
                Remove
              </button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 mt-4 animate-fade-in">
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Company Name"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => updateExperience(index, 'title', e.target.value)}
                  placeholder="Job Title"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={exp.dates || ''}
                  onChange={(e) => updateExperience(index, 'dates', e.target.value)}
                  placeholder="Date Range (e.g., Jan 2020 - Present)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <div>
                  <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'}`}>
                    Responsibilities & Achievements
                  </label>
                  {exp.items.map((bullet, bulletIndex) => (
                    <div key={bulletIndex} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(index, bulletIndex, e.target.value)}
                        placeholder="Achievement or responsibility"
                        className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          theme === 'dark' 
                            ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      <button
                        onClick={() => removeBullet(index, bulletIndex)}
                        className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'} px-3 rounded transition-colors text-sm font-medium`}
                        title="Remove bullet"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addBullet(index)}
                    className={`${theme === 'dark' ? 'text-slate-400 hover:text-slate-300 hover:bg-slate-900/20' : 'text-slate-600 hover:text-slate-700 hover:bg-slate-50'} text-sm font-medium px-3 py-1.5 rounded transition-colors`}
                  >
                    + Add Bullet Point
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {experiences.length === 0 && (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-400'}`}>
            <p className="text-sm">No work experience added yet. Click "Add Experience" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
