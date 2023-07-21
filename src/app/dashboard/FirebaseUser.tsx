'use client'

import type { User } from 'firebase/auth'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback, useEffect } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

const auth = getAuth(firebaseApp)

const FirebaseUser = () => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<User>()
  const authContext = useAuthContext()

  const handleSignIn = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      const loggedIn = await signInWithEmailAndPassword(auth, email, password)
      if (loggedIn) router.push('/liff/restaurants')
    },
    [email, password, router],
  )

  useEffect(() => {
    ;(async () => {
      if (authContext.user) setUser(authContext.user)
    })()
  }, [authContext.user])

  return (
    <>
      {user ? (
        <>
          <h1>ログイン済</h1>
          <p>uid: {user.uid}</p>
          <p>user: {user.displayName}</p>
          <button
            type='button'
            onClick={() => router.push('/liff/restaurants')}
          >
            レストラン一覧を確認
          </button>
        </>
      ) : (
        <>
          <form onSubmit={handleSignIn}>
            <div>
              <label htmlFor='email'>メールアドレス</label>
              <input
                type='email'
                id='email'
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor='password'>パスワード</label>
              <input
                type='password'
                id='password'
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type='submit'>Firebaseログイン</button>
          </form>
        </>
      )}
    </>
  )
}

export default FirebaseUser
