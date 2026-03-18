'use client'

import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

interface PasswordFieldProps {
  id: string
  label: string
  value: string
  autoComplete: string
  placeholder: string
  onChange: (value: string) => void
}

export default function PasswordField({
  id,
  label,
  value,
  autoComplete,
  placeholder,
  onChange,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          required
          minLength={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword((current) => !current)}
          className="absolute inset-y-0 right-2 inline-flex items-center rounded-md px-1 text-gray-500 transition hover:text-gray-700"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  )
}
