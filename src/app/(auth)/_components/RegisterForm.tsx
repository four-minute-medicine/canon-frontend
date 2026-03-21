'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
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
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const emailRedirectTo = `${window.location.origin}/login`

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo,
          data: {
            full_name: fullName,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data.user?.identities?.length === 0) {
        setError('This email is already registered. Please sign in instead.')
        return
      }

      setFullName('')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setSuccessMessage(
        'Account created. Please check your email and confirm your account before signing in.'
      )
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setError(submissionError.message)
      } else {
        setError('Unable to create your account right now. Please try again.')
      }
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
      {successMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

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
