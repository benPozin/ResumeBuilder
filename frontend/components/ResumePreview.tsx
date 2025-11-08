'use client'

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

interface ResumePreviewProps {
  theme: 'light' | 'dark'
  data: ResumeData
}

export default function ResumePreview({ theme, data }: ResumePreviewProps) {
  return (
    <div className={`border rounded-lg shadow-sm ${
      theme === 'dark' 
        ? 'bg-[#111111] border-[#2a2a2a]' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`text-center mb-6 pb-6 border-b ${
        theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-300'
      }`}>
        <h1 className={`text-2xl font-bold mb-2 tracking-tight ${
          theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
        }`}>
          {data.name || 'Your Name'}
        </h1>
        <p className={`text-xs font-normal ${
          theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'
        }`}>
          {data.contact_info || 'your.email@example.com | (555) 123-4567'}
        </p>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className={`mb-6 pb-6 border-b ${
          theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'
        }`}>
          <p className={`text-xs leading-relaxed ${
            theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'
          }`}>
            {data.summary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {data.work_experience && data.work_experience.length > 0 && (
        <div className={`mb-6 pb-6 border-b ${
          theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'
        }`}>
          <h2 className={`text-xs font-bold mb-4 tracking-wide uppercase ${
            theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
          }`}>
            Relevant Work Experience
          </h2>
          {data.work_experience.map((exp, index) => (
            <div key={index} className="mb-5 last:mb-0">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <h3 className={`font-semibold text-xs ${
                    theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
                  }`}>
                    {exp.company || 'Company Name'}
                  </h3>
                  <p className={`text-xs italic font-medium ${
                    theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-700'
                  }`}>
                    {exp.title || 'Job Title'}
                  </p>
                </div>
                <p className={`text-xs font-normal whitespace-nowrap ml-4 ${
                  theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'
                }`}>
                  {exp.dates || 'Date Range'}
                </p>
              </div>
              {exp.items && exp.items.length > 0 && (
                <ul className="list-disc list-inside ml-3 mt-2 space-y-0.5">
                  {exp.items.filter(item => item.trim()).map((item, itemIndex) => (
                    <li key={itemIndex} className={`text-xs leading-relaxed ${
                      theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'
                    }`}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <div className={`mb-6 pb-6 border-b ${
          theme === 'dark' ? 'border-[#2a2a2a]' : 'border-gray-200'
        }`}>
          <h2 className={`text-xs font-bold mb-4 tracking-wide uppercase ${
            theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
          }`}>
            Skills
          </h2>
          {data.skills.map((skill, index) => (
            <div key={index} className="mb-2 last:mb-0">
              <span className={`font-semibold text-xs ${
                theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
              }`}>
                {skill.section_title || 'Category'}:{' '}
              </span>
              <span className={`text-xs ${
                theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'
              }`}>
                {skill.skills || 'Skills list'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <div className="mb-6">
          <h2 className={`text-xs font-bold mb-4 tracking-wide uppercase ${
            theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
          }`}>
            Education
          </h2>
          {data.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-semibold text-xs ${
                    theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-900'
                  }`}>
                    {edu.institution || 'Institution Name'}
                  </h3>
                  <p className={`text-xs italic font-medium ${
                    theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-700'
                  }`}>
                    {edu.degree || 'Degree'}
                  </p>
                </div>
                <p className={`text-xs font-normal whitespace-nowrap ml-4 ${
                  theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'
                }`}>
                  {edu.dates || 'Date Range'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {!data.name && !data.summary && (!data.work_experience || data.work_experience.length === 0) && (
        <div className="text-center py-12">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-400'
          }`}>
            Fill out the form to see your resume preview
          </p>
        </div>
      )}
    </div>
  )
}
