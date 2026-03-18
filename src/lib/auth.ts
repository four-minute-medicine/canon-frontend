import { createSupabaseServerClient } from './supabase/server'

export const getCurrentUser = async () => {
  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    return null
  }

  return data.user
}
