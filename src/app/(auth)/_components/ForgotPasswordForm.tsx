'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AuthError from './AuthError'
import AuthShell from './AuthShell'
import { authBrandName, authPills } from './authConfig'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()
      const redirectTo = `${window.location.origin}/reset-password`

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo,
        }
      )

      if (resetError) {
        throw resetError
      }

      setSuccessMessage(
        'If an account exists for this email, we sent a password reset link. Please check your inbox.'
      )
    } catch {
      setError('Unable to send reset email right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Reset your password"
      description={`Recover access to ${authBrandName}. We’ll email you a secure reset link.`}
      pills={authPills}
      formTitle="Forgot password?"
      formDescription="Enter your email and we’ll send you a reset link."
      footerText="Remembered your password?"
      footerLinkLabel="Back to sign in"
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

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Sending reset link...' : 'Send reset link'}
        </button>
      </form>

      <div className="mt-4 text-center text-xs text-gray-500">
        <Link href="/signup" className="underline-offset-2 hover:underline">
          Need an account? Create one
        </Link>
      </div>
    </AuthShell>
  )
}
