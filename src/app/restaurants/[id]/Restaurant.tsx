'use client'

import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
} from 'firebase/firestore'
import { useParams } from 'next/navigation'
import React, { useEffect, useState, FC, useCallback } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import { RestaurantType } from '@/src/app/restaurants/Restaurants'

export const Restaurant: FC = () => {
  const params = useParams()
  const authContext = useAuthContext()
  const [restaurantId, setRestaurantId] = useState('')
  const [restaurant, setRestaurant] = useState<RestaurantType>()
  const handleReservation = useCallback(() => {
    console.log('handleReservation')
  }, [])

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setRestaurantId(id)
  }, [params])

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (authContext.user?.uid && restaurantId !== '') {
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
  }, [authContext.user?.uid, restaurantId])

  return (
    <>
      <h1>店舗詳細</h1>
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
    </>
  )
}
