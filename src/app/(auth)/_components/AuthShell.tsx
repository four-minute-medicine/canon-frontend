'use client'

import Link from 'next/link'
import { ReactNode } from 'react'
import { authBrandName } from './authConfig'

interface AuthShellProps {
  title: string
  description: string
  pills: string[]
  formTitle: string
  formDescription: string
  footerText: string
  footerLinkLabel: string
  footerLinkHref: string
  children: ReactNode
}

export default function AuthShell({
  title,
  description,
  pills,
  formTitle,
  formDescription,
  footerText,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex min-h-screen flex-col lg:flex-row">
        {/* Mobile hero (Medhi-style auth top section) */}
        <aside className="w-full bg-[#0f172a] px-6 py-8 lg:hidden">
          <Link
            href="/"
            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:text-white"
          >
            {authBrandName}
          </Link>

          <div className="mt-6 space-y-3">
            <h1 className="max-w-md text-3xl leading-tight text-white">{title}</h1>
            <p className="max-w-xl text-sm leading-relaxed text-white/75">{description}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90"
              >
                {pill}
              </span>
            ))}
          </div>
        </aside>

        {/* Form side */}
        <section className="relative flex w-full items-center justify-center px-6 py-10 sm:px-8 lg:w-1/2 lg:px-16">
          <Link
            href="/"
            className="absolute left-6 top-5 hidden items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-300 lg:inline-flex"
          >
            {authBrandName}
          </Link>

          <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6 space-y-2">
              <h2 className="text-2xl text-gray-900">{formTitle}</h2>
              <p className="text-sm text-gray-600">{formDescription}</p>
            </div>

            {children}

            <p className="mt-6 text-center text-sm text-gray-600">
              {footerText}{' '}
              <Link
                href={footerLinkHref}
                className="font-medium text-gray-900 underline-offset-2 hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </section>

        {/* Desktop hero side */}
        <aside className="hidden w-1/2 flex-col justify-center gap-5 bg-[#0f172a] px-10 py-12 lg:flex xl:px-16">
          <h1 className="max-w-lg text-5xl leading-tight text-white">{title}</h1>
          <p className="max-w-xl text-sm leading-relaxed text-white/75 xl:text-base">
            {description}
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90"
              >
                {pill}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
