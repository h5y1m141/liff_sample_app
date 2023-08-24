'use client'

import dayjs from 'dayjs'
import type { User } from 'firebase/auth'
import {
  collection,
  doc,
  getFirestore,
  addDoc,
  serverTimestamp,
  runTransaction,
  getDoc,
} from 'firebase/firestore'

import { useRouter, useParams } from 'next/navigation'
import React, { FC, useState, useEffect, useCallback, Suspense } from 'react'
import { useRestaurant } from './useRestaurant'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import {
  RestaurantConverter,
  RestaurantType,
} from '@/src/app/models/RestaurantModel'

export const Restaurant: FC = () => {
  const params = useParams()
  const authContext = useAuthContext()
  const [user, setUser] = useState<User>()
  const [restaurantId, setRestaurantId] = useState('')

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setRestaurantId(id)
  }, [params])

  useEffect(() => {
    if (authContext.user) setUser(authContext.user)
  }, [authContext.user])
  const { restaurant } = useRestaurant(restaurantId)

  if (!restaurant || !user || !restaurantId)
    return <div>店舗情報を読み込んでます...</div>

  return (
    <Container
      restaurantId={restaurantId}
      restaurant={restaurant}
      user={user}
    />
  )
}

type ContainerProps = {
  restaurantId: string
  restaurant: RestaurantType
  user: User
}

const Container: FC<ContainerProps> = ({ user, restaurant, restaurantId }) => {
  const router = useRouter()
  const handleReservation = useCallback(
    async (id: string) => {
      if (!user?.uid) return

      const db = getFirestore(firebaseApp)

      try {
        await runTransaction(db, async (transaction) => {
          const bookableTableRef = doc(
            db,
            `restaurants/${restaurantId}/bookable_tables`,
            id,
          )
          const bookableTableDoc = await transaction.get(bookableTableRef)

          if (!bookableTableDoc.exists()) throw 'Document does not exist!'

          if (bookableTableDoc.data().available_reservation_requests > 0) {
            await transaction.update(bookableTableRef, {
              available_reservation_requests: 0,
            })
            const colRef = collection(db, `users/${user.uid}/reservations`)
            const restaurantRef = doc(
              db,
              'restaurants',
              restaurantId,
            ).withConverter(RestaurantConverter)
            const restaurantSnap = await getDoc(restaurantRef)
            const restaurant = restaurantSnap.data()
            if (!restaurant) throw 'Document does not exist!'

            await addDoc(colRef, {
              restaurantId: restaurantRef.id,
              restaurantName: restaurant.name,
              latitude: restaurant.latitude,
              longitude: restaurant.longitude,
              created_at: serverTimestamp(),
            })
            return router.push(`/liff/restaurants`)
          } else {
            alert(
              `現在の予約可能な残席数が${
                bookableTableDoc.data().available_reservation_requests
              }になったため予約申請に失敗しました`,
            )
          }
        })
      } catch (e) {
        console.log('Transaction failed: ', e)
        alert('予約申請に失敗しました')
      }
    },
    [restaurantId, router, user],
  )

  return (
    <Screen restaurant={restaurant} handleReservation={handleReservation} />
  )
}

type ScreenProps = {
  restaurant: RestaurantType
  handleReservation: (id: string) => void
}
const Screen: FC<ScreenProps> = ({ restaurant, handleReservation }) => {
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
            </ul>
            <table style={{ width: 800, border: 1 }}>
              <thead>
                <tr>
                  <th>開始日時</th>
                  <th>終了日時</th>
                  <th>残席数</th>
                  <th>予約</th>
                </tr>
              </thead>
              <tbody>
                {restaurant.bookableTables &&
                  restaurant.bookableTables.length > 0 &&
                  restaurant.bookableTables.map((bookableTable) => (
                    <tr key={bookableTable.id}>
                      <td>
                        {dayjs(bookableTable.start_datetime.toDate()).format(
                          'YYYY/MM/DD HH:mm:ss',
                        )}
                      </td>
                      <td>
                        {dayjs(bookableTable.end_datetime.toDate()).format(
                          'YYYY/MM/DD HH:mm:ss',
                        )}
                      </td>
                      <td>{bookableTable.available_reservation_requests}</td>
                      <td>
                        {bookableTable.available_reservation_requests !== 0 ? (
                          <button
                            onClick={() => {
                              handleReservation(bookableTable.id)
                            }}
                          >
                            この日時で予約申請する
                          </button>
                        ) : (
                          '予約申請できません'
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </Suspense>
    </>
  )
}
