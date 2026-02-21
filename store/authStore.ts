import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { User } from '@/types/user'

interface AuthStore {
  user: User | null
  loading: boolean
  setUser: (user: User | null) => void
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<any>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        // include profile fetch error so caller sees DB issues
        throw profileError
      }

      set({ user: { ...data.user, ...profile } as User })
    }
  },

  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) throw error

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
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (profileError) {
        console.error('Error loading profile during initialize:', profileError)
        set({ loading: false })
        return
      }

      set({ 
        user: { ...session.user, ...profile } as User,
        loading: false 
      })
    } else {
      set({ loading: false })
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error loading profile on auth state change:', profileError)
          set({ user: { ...session.user } as User })
          return
        }

        set({ user: { ...session.user, ...profile } as User })
      } else {
        set({ user: null })
      }
    })
  }
}))