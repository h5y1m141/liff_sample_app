'use client'
import type { User } from 'firebase/auth'
import { onAuthStateChanged, getAuth } from 'firebase/auth'
import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { firebaseApp } from '@/src/app/firebase'

export type AuthContextProps = {
  user: User
}
export type AuthProps = {
  children: ReactNode
}
const AuthComponentContext = createContext<Partial<AuthContextProps>>({})

export const useAuthContext = () => {
  return useContext(AuthComponentContext)
}

export const AuthComponent = ({ children }: AuthProps) => {
  const auth = getAuth(firebaseApp)
  const [isChecking, setIsChecking] = useState(true)
  const [user, setUser] = useState<User>()
  const value = {
    user,
  }

  useEffect(() => {
    const authStateChanged = onAuthStateChanged(auth, async (user) => {
      setIsChecking(false)
      if (user) {
        setUser(user)
      }
    })
    return () => {
      authStateChanged()
    }
  }, [auth])

  if (isChecking) return <div>Loading....</div>
  if (!user) return <div>LINEログインが完了していません</div>

  return (
    <AuthComponentContext.Provider value={value}>
      {children}
    </AuthComponentContext.Provider>
  )
}
