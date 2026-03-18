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
    <div className="min-h-screen bg-[#F7F7F7] text-gray-900">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 overflow-hidden lg:grid-cols-2">
        <aside className="relative flex flex-col justify-between bg-[#0f172a] px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white/90 transition hover:border-white/40 hover:text-white"
            >
              {authBrandName}
            </Link>

            <div className="space-y-4">
              <h1 className="max-w-md text-3xl leading-tight text-white sm:text-4xl">
                {title}
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-white/75 sm:text-base">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white/90 sm:text-sm"
              >
                {pill}
              </span>
            ))}
          </div>
        </aside>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
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
      </div>
    </div>
  )
}
