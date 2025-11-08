'use client'

import { useState } from 'react'

interface SkillSection {
  section_title: string
  skills: string
}

interface SkillsFormProps {
  theme: 'light' | 'dark'
  skills: SkillSection[]
  onChange: (skills: SkillSection[]) => void
}

export default function SkillsForm({ theme, skills, onChange }: SkillsFormProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const addSkillSection = () => {
    const newSection: SkillSection = {
      section_title: '',
      skills: ''
    }
    onChange([...skills, newSection])
    setExpandedIndex(skills.length)
  }

  const updateSkillSection = (index: number, field: keyof SkillSection, value: string) => {
    const updated = [...skills]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeSkillSection = (index: number) => {
    const updated = skills.filter((_, i) => i !== index)
    onChange(updated)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Skills</h2>
          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'}`}>Your technical and professional skills</p>
        </div>
        <button
          onClick={addSkillSection}
          className={`${theme === 'dark' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'} text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md`}
        >
          Add Category
        </button>
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
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
                  {skill.section_title || `Skill Category ${index + 1}`}
                </h3>
              </button>
              <button
                onClick={() => removeSkillSection(index)}
                className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-red-600 hover:text-red-700 hover:bg-red-50'} p-1.5 rounded transition-colors text-sm font-medium`}
                title="Remove category"
              >
                Remove
              </button>
            </div>

            {expandedIndex === index && (
              <div className="space-y-3 mt-4 animate-fade-in">
                <input
                  type="text"
                  value={skill.section_title || ''}
                  onChange={(e) => updateSkillSection(index, 'section_title', e.target.value)}
                  placeholder="Category Name (e.g., Programming, Tools)"
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
                    theme === 'dark' 
                      ? 'border-[#2a2a2a] bg-[#1a1a1a] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                      : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
                  }`}
                />
                <input
                  type="text"
                  value={skill.skills || ''}
                  onChange={(e) => updateSkillSection(index, 'skills', e.target.value)}
                  placeholder="Skills (comma-separated)"
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
        {skills.length === 0 && (
          <div className={`text-center py-8 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-400'}`}>
            <p className="text-sm">No skills added yet. Click "Add Category" to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
