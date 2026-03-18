'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import AuthError from './AuthError'
import AuthShell from './AuthShell'
import PasswordField from './PasswordField'
import { authBrandName, authPills } from './authConfig'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      // Replace with real auth call once backend endpoint is ready.
      await new Promise((resolve) => setTimeout(resolve, 500))
      console.log('Login submitted', { email, password })
    } catch {
      setError('Unable to sign in right now. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      title="Pick Up Where You Left Off"
      description={`One step closer to clinical mastery. Sign in to continue your sessions and access trusted, context-aware guidance in ${authBrandName}.`}
      pills={authPills}
      formTitle="Welcome back"
      formDescription={`Sign in to continue using ${authBrandName}.`}
      footerText="Don’t have an account?"
      footerLinkLabel="Create one"
      footerLinkHref="/signup"
    >
      {error ? <AuthError message={error} /> : null}

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

        <PasswordField
          id="password"
          label="Password"
          value={password}
          autoComplete="current-password"
          placeholder="Enter your password"
          onChange={setPassword}
        />

        <div className="flex justify-center">
          <Link
            href="#"
            className="text-sm font-medium text-gray-800 underline-offset-2 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </AuthShell>
  )
}
