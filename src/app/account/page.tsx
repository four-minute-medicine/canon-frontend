'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FiAlertTriangle, FiHelpCircle, FiUser } from 'react-icons/fi'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { genderOptions, trainingLevelOptions } from '@/app/(auth)/_components/authConfig'
import ChatLayout from '../components/chatLayout'

type AccountForm = {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  phoneNumber: string
  email: string
  levelOfTraining: string
}

export default function AccountPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [form, setForm] = useState<AccountForm>({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    phoneNumber: '',
    email: '',
    levelOfTraining: '',
  })

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createSupabaseBrowserClient()
      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) {
        router.push('/login')
        return
      }

      setForm({
        firstName: String(user.user_metadata?.first_name ?? ''),
        lastName: String(user.user_metadata?.last_name ?? ''),
        gender: String(user.user_metadata?.gender ?? ''),
        dateOfBirth: String(user.user_metadata?.date_of_birth ?? ''),
        phoneNumber: String(user.user_metadata?.phone_number ?? ''),
        email: user.email ?? '',
        levelOfTraining: String(user.user_metadata?.training_level ?? ''),
      })
      setIsLoading(false)
    }

    loadProfile()
  }, [router])

  const handleProfileSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    const supabase = createSupabaseBrowserClient()

    if (!/^\d{6,15}$/.test(form.phoneNumber.replace(/\s+/g, ''))) {
      setError('Please enter a valid phone number (numbers only, 6-15 digits).')
      return
    }

    setIsSavingProfile(true)
    const fullName = `${form.firstName} ${form.lastName}`.trim()

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        full_name: fullName,
        gender: form.gender,
        date_of_birth: form.dateOfBirth,
        phone_number: form.phoneNumber.replace(/\s+/g, ''),
        training_level: form.levelOfTraining,
      },
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setMessage('Profile updated successfully.')
    }

    setIsSavingProfile(false)
  }

  const handlePasswordSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    const supabase = createSupabaseBrowserClient()

    if (!currentPassword) {
      setError('Please enter your current password.')
      return
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }

    setIsSavingPassword(true)

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: currentPassword,
    })

    if (reauthError) {
      setError('Current password is incorrect.')
      setIsSavingPassword(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
    } else {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setMessage('Password updated successfully.')
    }

    setIsSavingPassword(false)
  }

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <ChatLayout isAuthenticated>
      <div className="custom-scrollbar h-full overflow-y-auto bg-[#F7F7F7] px-4 py-8 sm:px-6">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
        <aside className="h-fit w-full rounded-3xl border border-gray-200 bg-white p-5 lg:w-[300px]">
          <h2 className="text-3xl text-[#1e1e1e]">Manage Your Account</h2>

          <div className="mt-6 space-y-2">
            <button className="flex w-full items-center gap-3 rounded-xl bg-[#f4f4f4] px-4 py-3 text-left text-sm text-[#1e1e1e]">
              <FiUser />
              Edit Profile
            </button>
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-[#1e1e1e]">
              <FiHelpCircle />
              Helpdesk
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="mt-8 w-full rounded-full border border-black px-4 py-3 text-sm text-black transition hover:bg-black hover:text-white"
          >
            Logout
          </button>

          <Link
            href="/"
            className="mt-3 inline-block w-full text-center text-xs text-gray-500 underline-offset-2 hover:underline"
          >
            Back to chat
          </Link>
        </aside>

        <main className="flex-1 space-y-8 rounded-3xl border border-gray-200 bg-white p-5 sm:p-7">
          {isLoading ? (
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm text-gray-600">
              Loading account...
            </div>
          ) : null}

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          {message ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}

          {!isLoading ? (
            <>
              <section>
            <h1 className="text-4xl text-[#1e1e1e]">Profile</h1>
            <form className="mt-5 space-y-4" onSubmit={handleProfileSubmit}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  value={form.firstName}
                  onChange={(e) => setForm((prev) => ({ ...prev, firstName: e.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                  placeholder="First name"
                />
                <input
                  value={form.lastName}
                  onChange={(e) => setForm((prev) => ({ ...prev, lastName: e.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                  placeholder="Last name"
                />
                <select
                  value={form.gender}
                  onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                >
                  {genderOptions.map((option) => (
                    <option key={option.value || 'default'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                />
                <input
                  value={form.phoneNumber}
                  onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  className="rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                  placeholder="Phone number"
                />
                <input
                  value={form.email}
                  disabled
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500"
                />
              </div>

              <div className="space-y-4">
                <div className="max-w-md space-y-1.5">
                  <label htmlFor="levelOfTraining" className="text-sm text-gray-700">
                    Level of training
                  </label>
                  <select
                    id="levelOfTraining"
                    value={form.levelOfTraining}
                    onChange={(e) => setForm((prev) => ({ ...prev, levelOfTraining: e.target.value }))}
                    className="block w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                  >
                    <option value="">Select level...</option>
                    {trainingLevelOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="rounded-full bg-[#1e1e1e] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2d2d2d] disabled:opacity-60"
                >
                  {isSavingProfile ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
              </section>

              <section>
            <h2 className="text-4xl text-[#1e1e1e]">Security</h2>
            <form className="mt-5 space-y-4" onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                placeholder="Current password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                placeholder="New password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none focus:border-black/60"
                placeholder="Confirm new password"
              />

              <button
                type="submit"
                disabled={isSavingPassword}
                className="rounded-full bg-[#1e1e1e] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2d2d2d] disabled:opacity-60"
              >
                {isSavingPassword ? 'Saving...' : 'Save changes'}
              </button>
            </form>
              </section>

              <section className="rounded-3xl border border-red-100 bg-[#fff1f1] p-6">
            <h3 className="text-3xl text-[#1e1e1e]">Delete Account</h3>
            <p className="mt-3 max-w-2xl text-sm text-[#1e1e1e]">
              To cancel your Cannon account and delete all your search-related data, click the button below.
              <span className="font-semibold"> Warning:</span> This action is permanent.
            </p>
            <button
              type="button"
              onClick={() => setError('Account deletion is not enabled yet. Please contact support.')}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-red-400 px-6 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              <FiAlertTriangle />
              Delete My Account
            </button>
              </section>
            </>
          ) : null}
        </main>
      </div>
      </div>
    </ChatLayout>
  )
}
