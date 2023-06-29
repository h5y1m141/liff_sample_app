'use client'

import { getDocs, collection, getFirestore, query } from 'firebase/firestore'
import React, { useEffect, useState, FC } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

type dataType = {
  name: string
}
export const Restaurants: FC = () => {
  const authContext = useAuthContext()
  const [data, setData] = useState<dataType[]>()
  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (authContext.user?.uid) {
        const db = getFirestore(firebaseApp)
        const restaurantsQuery = query(collection(db, collectionName))
        const querySnapshot = await getDocs(restaurantsQuery)
        const docSnap = querySnapshot.docs.map((doc) => doc.data())

        if (docSnap.length > 0) setData(docSnap as unknown as dataType[])
      }
    })()
  }, [authContext.user?.uid])

  return (
    <>
      <h1>Restaurants</h1>
      <h2>取得件数：{data?.length}</h2>
      {data && data?.length > 0 && (
        <>
          {data.map((item) => {
            return <div key={item.name}>{item.name}</div>
          })}
        </>
      )}
    </>
  )
}
