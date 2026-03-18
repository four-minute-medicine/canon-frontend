'use client'

import { FormEvent, useState } from 'react'
import AuthError from './AuthError'
import AuthShell from './AuthShell'
import PasswordField from './PasswordField'
import { authBrandName, authPills } from './authConfig'

export default function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      // Replace with real registration call once backend endpoint is ready.
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Registration submitted', { fullName, email, password })
    } catch {
      setError('Unable to create your account right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title={`Create Your ${authBrandName} Account`}
      description={`${authBrandName} gives you trusted, context-aware support for your clinical workflow with a cleaner, faster search experience.`}
      pills={authPills}
      formTitle="Get started"
      formDescription={`Create your account to begin using ${authBrandName}.`}
      footerText="Already have an account?"
      footerLinkLabel="Sign in"
      footerLinkHref="/login"
    >
      {error ? <AuthError message={error} /> : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-sm text-gray-700">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Dr Jane Doe"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="name@hospital.org"
          />
        </div>

        <PasswordField
          id="password"
          label="Password"
          value={password}
          autoComplete="new-password"
          placeholder="Create a strong password"
          onChange={setPassword}
        />

        <PasswordField
          id="confirmPassword"
          label="Confirm password"
          value={confirmPassword}
          autoComplete="new-password"
          placeholder="Re-enter your password"
          onChange={setConfirmPassword}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </AuthShell>
  )
}
