'use client'

import type { User } from 'firebase/auth'
import { getAuth, OAuthProvider, signInWithRedirect } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import React, { useState, useCallback, useEffect } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

const provider = new OAuthProvider('oidc.restaurants')
const auth = getAuth(firebaseApp)

const LineUser = () => {
  const router = useRouter()
  const [user, setUser] = useState<User>()
  const authContext = useAuthContext()

  const handleSignIn = useCallback(() => {
    signInWithRedirect(auth, provider)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (authContext.user) setUser(authContext.user)
    })()
  }, [authContext.user])

  return (
    <>
      {user ? (
        <>
          <h1>LINEログイン済</h1>
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
          <button onClick={() => handleSignIn()}>LINEログイン</button>
        </>
      )}
    </>
  )
}

export default LineUser
