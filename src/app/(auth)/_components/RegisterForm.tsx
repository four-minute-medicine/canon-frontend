'use client'

import { useState } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import AuthError from './AuthError'
import AuthShell from './AuthShell'
import PasswordField from './PasswordField'
import {
  authBrandName,
  authPills,
  genderOptions,
  trainingLevelOptions,
} from './authConfig'

export default function RegisterForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [levelOfTraining, setLevelOfTraining] = useState('')
  const [levelOfTrainingOther, setLevelOfTrainingOther] = useState('')
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

    const trimmedFirstName = firstName.trim()
    const trimmedLastName = lastName.trim()
    const trimmedPhoneNumber = phoneNumber.trim()
    const resolvedTrainingLevel =
      levelOfTraining === 'other'
        ? levelOfTrainingOther.trim()
        : levelOfTraining

    if (!trimmedFirstName || !trimmedLastName) {
      setError('First name and last name are required.')
      return
    }

    if (!levelOfTraining) {
      setError('Level of training is required.')
      return
    }

    if (levelOfTraining === 'other' && !levelOfTrainingOther.trim()) {
      setError('Please specify your level of training.')
      return
    }

    if (!/^\d{6,15}$/.test(trimmedPhoneNumber)) {
      setError('Please enter a valid phone number (numbers only, 6-15 digits).')
      return
    }

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
            first_name: trimmedFirstName,
            last_name: trimmedLastName,
            full_name: `${trimmedFirstName} ${trimmedLastName}`.trim(),
            gender,
            date_of_birth: dateOfBirth,
            phone_number: trimmedPhoneNumber,
            training_level: resolvedTrainingLevel,
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

      setFirstName('')
      setLastName('')
      setGender('')
      setDateOfBirth('')
      setPhoneNumber('')
      setLevelOfTraining('')
      setLevelOfTrainingOther('')
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="firstName" className="text-sm text-gray-700">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Jane"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="lastName" className="text-sm text-gray-700">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="gender" className="text-sm text-gray-700">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              {genderOptions.map((option) => (
                <option key={option.value || 'default'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="dateOfBirth" className="text-sm text-gray-700">
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label htmlFor="phoneNumber" className="text-sm text-gray-700">
              Phone number
            </label>
            <input
              id="phoneNumber"
              type="tel"
              autoComplete="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="070 868 7575"
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
        </div>

        <div className="space-y-1.5">
          <label htmlFor="levelOfTraining" className="text-sm text-gray-700">
            Level of training
          </label>
          <select
            id="levelOfTraining"
            value={levelOfTraining}
            onChange={(e) => setLevelOfTraining(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Select level...</option>
            {trainingLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {levelOfTraining === 'other' ? (
          <div className="space-y-1.5">
            <label htmlFor="levelOfTrainingOther" className="text-sm text-gray-700">
              Other training level
            </label>
            <input
              id="levelOfTrainingOther"
              type="text"
              required
              value={levelOfTrainingOther}
              onChange={(e) => setLevelOfTrainingOther(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="Please specify your level of training"
            />
          </div>
        ) : null}

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
