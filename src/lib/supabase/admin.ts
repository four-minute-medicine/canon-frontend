import 'server-only'

import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'
import { getSupabasePublicEnv, getSupabaseServiceRoleKey } from './env'

let adminClient: SupabaseClient | null = null

export const createSupabaseAdminClient = () => {
  if (adminClient) {
    return adminClient
  }

  const { url } = getSupabasePublicEnv()
  const serviceRoleKey = getSupabaseServiceRoleKey()

  adminClient = createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  return adminClient
}
