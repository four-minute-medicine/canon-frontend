'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AuthError from './AuthError'
import AuthShell from './AuthShell'
import PasswordField from './PasswordField'
import { authBrandName, authPills } from './authConfig'

export default function ResetPasswordForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [hasRecoverySession, setHasRecoverySession] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()

    const checkRecoverySession = async () => {
      const { data } = await supabase.auth.getSession()
      setHasRecoverySession(Boolean(data.session))
      setIsCheckingSession(false)
    }

    checkRecoverySession()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'PASSWORD_RECOVERY' || session) {
          setHasRecoverySession(true)
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        throw updateError
      }

      setSuccessMessage('Your password has been updated. Redirecting to sign in...')
      setTimeout(() => {
        router.push('/login')
      }, 1200)
    } catch {
      setError('Unable to update password right now. Please request a new reset link.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Set a new password"
      description={`Create a new password to secure your ${authBrandName} account.`}
      pills={authPills}
      formTitle="Reset password"
      formDescription="Choose a new password for your account."
      footerText="Need another link?"
      footerLinkLabel="Request reset email"
      footerLinkHref="/forgot-password"
    >
      {error ? <AuthError message={error} /> : null}
      {successMessage ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      {isCheckingSession ? (
        <p className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Verifying your reset link...
        </p>
      ) : null}

      {!isCheckingSession && !hasRecoverySession ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          This reset link is invalid or has expired. Please request a new password reset email.
        </p>
      ) : null}

      {!isCheckingSession && hasRecoverySession ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            id="newPassword"
            label="New password"
            value={password}
            autoComplete="new-password"
            placeholder="Create a strong password"
            onChange={setPassword}
          />

          <PasswordField
            id="confirmNewPassword"
            label="Confirm new password"
            value={confirmPassword}
            autoComplete="new-password"
            placeholder="Re-enter your new password"
            onChange={setConfirmPassword}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Updating password...' : 'Update password'}
          </button>
        </form>
      ) : null}
    </AuthShell>
  )
}
