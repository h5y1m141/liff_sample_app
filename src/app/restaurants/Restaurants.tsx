'use client'

import { getDocs, collection, getFirestore } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState, FC } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

export type BookableTableType = {
  id: string
  start_datetime: string
  end_datetime: string
  available_reservation_requests: number
}
export type RestaurantType = {
  id: string
  name: string
  phone: string
  prefecture: string
  bookableTables?: BookableTableType[]
}
export const Restaurants: FC = () => {
  const router = useRouter()
  const authContext = useAuthContext()
  const [restaurants, setRestaurants] = useState<RestaurantType[]>()

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (authContext.user?.uid) {
        const db = getFirestore(firebaseApp)

        const restaurantCollection = collection(db, collectionName)
        const restaurantSnapshot = await getDocs(restaurantCollection)

        const loadedRestaurants: RestaurantType[] = []
        for (const doc of restaurantSnapshot.docs) {
          const name = doc.get('name')
          const phone = doc.get('phone')
          const addressCollection = collection(doc.ref, 'address')
          const addressSnapshot = await getDocs(addressCollection)
          const prefecture = addressSnapshot.docs[0].get('prefecture')

          loadedRestaurants.push({
            id: doc.id,
            name,
            phone,
            prefecture,
          })
        }
        setRestaurants(loadedRestaurants)
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
              <th>住所</th>
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
                  <td>{restaurant.prefecture}</td>
                  <td>
                    {' '}
                    <button
                      type='button'
                      onClick={() =>
                        router.push(`/restaurants/${restaurant.id}`)
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
