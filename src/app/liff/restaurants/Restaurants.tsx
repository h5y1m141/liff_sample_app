'use client'

import { getDocs, collection, getFirestore } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, FC } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import {
  RestaurantConverter,
  RestaurantType,
} from '@/src/app/models/RestaurantModel'

export const Restaurants: FC = () => {
  const router = useRouter()
  const authContext = useAuthContext()
  const [restaurants, setRestaurants] = useState<RestaurantType[]>()

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (authContext.user?.uid) {
        const db = getFirestore(firebaseApp)
        const restaurantCollection = collection(
          db,
          collectionName,
        ).withConverter(RestaurantConverter)
        const restaurantSnapshot = await getDocs(restaurantCollection)
        setRestaurants(restaurantSnapshot.docs.map((doc) => doc.data()))
      }
    })()
  }, [authContext.user?.uid, router])

  return (
    <>
      {restaurants && restaurants?.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>店舗名</th>
              <th>店舗連絡先</th>
              <th>アクション</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => {
              return (
                <tr key={restaurant.id}>
                  <td>{restaurant.id}</td>
                  <td>{restaurant.name}</td>
                  <td>{restaurant.phone}</td>
                  <td>
                    <button
                      type='button'
                      onClick={() =>
                        router.push(`/liff/restaurants/${restaurant.id}`)
                      }
                    >
                      レストラン詳細
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </>
  )
}
