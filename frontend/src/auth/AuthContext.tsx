import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  getMe,
  obtainToken,
  registerUser,
  tokens,
  type User,
} from '../api/auth'

type AuthContextValue = {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Restore the session on first load if we still hold a valid token.
  useEffect(() => {
    let active = true
    ;(async () => {
      if (tokens.access || tokens.refresh) {
        try {
          const me = await getMe()
          if (active) setUser(me)
        } catch {
          tokens.clear()
        }
      }
      if (active) setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [])

  const login = async (username: string, password: string) => {
    await obtainToken(username, password)
    setUser(await getMe())
  }

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    await registerUser(username, email, password)
    // Registration succeeded — log them straight in.
    await obtainToken(username, password)
    setUser(await getMe())
  }

  const logout = () => {
    tokens.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
