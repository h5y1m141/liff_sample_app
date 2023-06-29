'use client'

import {
  onAuthStateChanged,
  getAuth,
  OAuthProvider,
  signInWithRedirect,
} from 'firebase/auth'
import { getDoc, doc, getFirestore } from 'firebase/firestore'
import React, { FC, useCallback, useEffect, useState } from 'react'
import { firebaseApp } from '@/src/app/firebase'

const provider = new OAuthProvider('oidc.restaurants')
const auth = getAuth(firebaseApp)

type dataType = {
  name: string
}

export const Login: FC = () => {
  const [uid, setUid] = useState('')
  const [data, setData] = useState<dataType[]>()
  const handleSignIn = useCallback(() => {
    signInWithRedirect(auth, provider)
  }, [])

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid
        setUid(uid)
      }
    })
  }, [])

  useEffect(() => {
    ;(async () => {
      if (uid !== '') {
        const collectionName = 'restaurants'
        const docName = 'XIpaOhYvMDWQ6oefKiOn'
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, docName)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) setData([docSnap.data()] as unknown as dataType[])
      }
    })()
  }, [uid])

  return (
    <>
      <h1>LINE</h1>
      {uid === '' && <button onClick={handleSignIn}>ログインする</button>}
      {uid !== '' && <div>uid: {uid}</div>}

      {data && data?.length > 0 && (
        <>
          {data.map((item) => {
            return (
              <>
                <h2>取得件数：{data?.length}</h2>
                <div key={item.name}>{item.name}</div>
              </>
            )
          })}
        </>
      )}
    </>
  )
}
