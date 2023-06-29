'use client'

import { getDoc, doc, getFirestore } from 'firebase/firestore'
import React, { useEffect, useState, FC } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

type dataType = {
  name: string
}
export const Restaurant: FC = () => {
  const authContext = useAuthContext()
  const [data, setData] = useState<dataType>()
  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'
      const docName = 'XIpaOhYvMDWQ6oefKiOn'
      if (authContext.user?.uid) {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, docName)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) setData(docSnap.data() as unknown as dataType)
      }
    })()
  }, [authContext.user?.uid])

  return (
    <>
      <h1>店舗詳細</h1>
      {data && (
        <>
          <div key={data.name}>{data.name}</div>
        </>
      )}
    </>
  )
}
