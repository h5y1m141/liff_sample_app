'use client'

import type { User } from 'firebase/auth'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, FC, useCallback, Suspense } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import { RestaurantType } from '@/src/app/restaurants/Restaurants'

export const Restaurant: FC = () => {
  const router = useRouter()
  const params = useParams()
  const authContext = useAuthContext()
  const [user, setUser] = useState<User>()
  const [restaurantId, setRestaurantId] = useState('')
  const [restaurant, setRestaurant] = useState<RestaurantType>()

  const handleReservation = useCallback(async () => {
    if (!user?.uid) return

    const db = getFirestore(firebaseApp)
    const colRef = collection(db, `users/${user.uid}/reservations`)
    const restaurantRef = doc(db, 'restaurants', restaurantId)
    const docRef = await addDoc(colRef, {
      restaurant: restaurantRef,
      created_at: serverTimestamp(),
    })
    if (docRef) return router.push(`/restaurants`)
  }, [restaurantId, router, user])

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setRestaurantId(id)
  }, [params])

  useEffect(() => {
    if (authContext.user) setUser(authContext.user)
  }, [authContext.user])

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (user?.uid && restaurantId !== '') {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, restaurantId)
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
          const name = docSnapshot.get('name')
          const phone = docSnapshot.get('phone')
          const addressCollection = collection(docSnapshot.ref, 'address')
          const addressSnapshot = await getDocs(addressCollection)
          const prefecture = addressSnapshot.docs[0].get('prefecture')
          const restaurant: RestaurantType = {
            id: docSnapshot.id,
            name,
            phone,
            prefecture,
          }
          setRestaurant(restaurant)
        }
      }
    })()
  }, [restaurantId, user?.uid])

  return (
    <>
      <h1>店舗詳細</h1>
      <Suspense fallback={<div>店舗情報を読み込んでます...</div>}>
        {restaurant && (
          <div key={restaurant.id}>
            <h2>店舗名：{restaurant.name}</h2>
            <h3>詳細情報</h3>
            <ul>
              <li>電話番号：{restaurant.phone}</li>
              <li>住所：{restaurant.prefecture}</li>
            </ul>
            <button onClick={handleReservation}>このお店を予約する</button>
          </div>
        )}
      </Suspense>
    </>
  )
}
