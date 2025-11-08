'use client'

interface HeaderFormProps {
  theme: 'light' | 'dark'
  data: {
    name: string
    contact_info: string
  }
  onChange: (data: { name: string; contact_info: string }) => void
}

export default function HeaderForm({ theme, data, onChange }: HeaderFormProps) {
  const handleChange = (field: 'name' | 'contact_info', value: string) => {
    onChange({
      ...data,
      [field]: value
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Header Information</h2>
        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-[#a3a3a3]' : 'text-gray-600'}`}>Your name and contact details</p>
      </div>
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'}`}>
            Full Name
          </label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
              theme === 'dark' 
                ? 'border-[#2a2a2a] bg-[#111111] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
            }`}
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-[#e5e5e5]' : 'text-gray-700'}`}>
            Contact Information
          </label>
          <input
            type="text"
            value={data.contact_info || ''}
            onChange={(e) => handleChange('contact_info', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all ${
              theme === 'dark' 
                ? 'border-[#2a2a2a] bg-[#111111] text-[#e5e5e5] placeholder-[#a3a3a3]' 
                : 'border-gray-300 bg-white text-gray-900 placeholder-gray-400'
            }`}
            placeholder="email@example.com | (555) 123-4567 | linkedin.com/in/username"
          />
        </div>
      </div>
    </div>
  )
}
