'use client'

interface SummaryFormProps {
  theme: 'light' | 'dark'
  summary: string
  onChange: (summary: string) => void
}

export default function SummaryForm({ theme, summary, onChange }: SummaryFormProps) {
  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Professional Summary</h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'}`}>A brief overview of your professional background</p>
      </div>
      <textarea
        value={summary || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all resize-none ${
          theme === 'dark' 
            ? 'border-[#2a2a2a] bg-[#111111] text-[#e5e5e5] placeholder-[#a3a3a3]' 
            : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
        }`}
        placeholder="Write a brief professional summary highlighting your experience and key skills..."
      />
      <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-500'}`}>
        Tip: Keep it concise and impactful (2-3 sentences)
      </p>
    </div>
  )
}
