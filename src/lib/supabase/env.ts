const requiredEnvError = (name: string) =>
  `Missing environment variable: ${name}. Add it to your .env.local file.`

const requireEnv = (name: string, value: string | undefined) => {
  if (!value) {
    throw new Error(requiredEnvError(name))
  }

  return value
}

export const getSupabasePublicEnv = () => ({
  url: requireEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
  anonKey: requireEnv(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
})

export const getSupabaseServiceRoleKey = () =>
  requireEnv('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY)
