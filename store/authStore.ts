import { create } from 'zustand'
import { type User as SupabaseAuthUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { User as AppUser } from '@/types/user'

interface ProfileRow {
  id: string
  email: string
  first_name?: string | null
  last_name?: string | null
  phone?: string | null
  role?: AppUser['role'] | null
  avatar?: string | null
  created_at?: string | null
  updated_at?: string | null
}

interface AuthStore {
  user: AppUser | null
  loading: boolean
  setUser: (user: AppUser | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<AppUser>) => Promise<SupabaseAuthUser | null>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

const getMetadataValue = (authUser: SupabaseAuthUser, keys: string[]): string | undefined => {
  const metadata = (authUser.user_metadata || {}) as Record<string, unknown>
  for (const key of keys) {
    const value = metadata[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      return value
    }
  }
  return undefined
}

const normalizeProfile = (profile: ProfileRow | null): Partial<AppUser> => {
  if (!profile) return {}

  return {
    id: profile.id,
    email: profile.email,
    firstName: profile.first_name ?? undefined,
    lastName: profile.last_name ?? undefined,
    phone: profile.phone ?? undefined,
    role: profile.role ?? 'user',
    avatar: profile.avatar ?? undefined,
    createdAt: profile.created_at ?? undefined,
    updatedAt: profile.updated_at ?? undefined
  }
}

const fetchProfile = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error loading profile:', error)
    return null
  }

  return data as ProfileRow | null
}

const profilePayloadFromAuthUser = (authUser: SupabaseAuthUser) => ({
  id: authUser.id,
  email: authUser.email,
  firstName: getMetadataValue(authUser, ['firstName', 'first_name']),
  lastName: getMetadataValue(authUser, ['lastName', 'last_name']),
  phone: getMetadataValue(authUser, ['phone'])
})

const ensureProfile = async (authUser: SupabaseAuthUser): Promise<ProfileRow | null> => {
  const existingProfile = await fetchProfile(authUser.id)
  if (existingProfile) return existingProfile

  try {
    const response = await fetch('/api/profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profilePayloadFromAuthUser(authUser))
    })

    if (!response.ok) {
      console.warn('Profile bootstrap failed with status:', response.status)
      return null
    }
  } catch (error) {
    console.warn('Profile bootstrap request failed:', error)
    return null
  }

  return await fetchProfile(authUser.id)
}

const mergeAuthUser = (authUser: SupabaseAuthUser, profile: ProfileRow | null): AppUser => {
  const normalizedProfile = normalizeProfile(profile)

  return {
    ...authUser,
    ...normalizedProfile,
    firstName: normalizedProfile.firstName ?? getMetadataValue(authUser, ['firstName', 'first_name']),
    lastName: normalizedProfile.lastName ?? getMetadataValue(authUser, ['lastName', 'last_name']),
    phone: normalizedProfile.phone ?? getMetadataValue(authUser, ['phone']),
    role: normalizedProfile.role ?? 'user'
  } as AppUser
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  setUser: (user) => set({ user }),

  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error

    if (data.user) {
      const profile = await ensureProfile(data.user)
      set({ user: mergeAuthUser(data.user, profile) })
    }
  },

  signUp: async (email, password, userData) => {
    const metadata = {
      ...userData,
      first_name: userData.firstName,
      last_name: userData.lastName
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })

    if (error) {
      if (error.message?.includes('Database error saving new user')) {
        throw new Error('Database trigger failed while creating your profile. Apply supabase/fix_auth_signup.sql in Supabase SQL Editor, then retry registration.')
      }
      throw error
    }

    // Return the created auth user to the caller so the client can create
    // the profile via the server-side Prisma API (avoids relying on Supabase
    // service role permissions).
    return data.user
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  initialize: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      const profile = await ensureProfile(session.user)

      set({ 
        user: mergeAuthUser(session.user, profile),
        loading: false 
      })
    } else {
      set({ loading: false })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await ensureProfile(session.user)
        set({ user: mergeAuthUser(session.user, profile) })
      } else {
        set({ user: null })
      }
    })
  }
}))
