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
  runTransaction,
} from 'firebase/firestore'

import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, FC, useCallback, Suspense } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import {
  RestaurantType,
  BookableTableType,
} from '@/src/app/liff/restaurants/Restaurants'

export const Restaurant: FC = () => {
  const params = useParams()
  const authContext = useAuthContext()
  const [user, setUser] = useState<User>()
  const [restaurantId, setRestaurantId] = useState('')
  const [restaurant, setRestaurant] = useState<RestaurantType>()

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
          const bookableTableCollection = collection(
            docSnapshot.ref,
            'bookable_tables',
          )
          const addressSnapshot = await getDocs(addressCollection)
          const prefecture = addressSnapshot.docs[0].get('prefecture')
          const bookableTables = await getDocs(bookableTableCollection)
          const items: BookableTableType[] = []
          bookableTables.docs.forEach((doc) => {
            items.push({
              id: doc.id,
              start_datetime: doc
                .data()
                .start_datetime.toDate()
                .toLocaleString(),
              end_datetime: doc.data().end_datetime.toDate().toLocaleString(),
              available_reservation_requests:
                doc.data().available_reservation_requests,
            })
          })

          const restaurant: RestaurantType = {
            id: docSnapshot.id,
            name,
            phone,
            prefecture,
            bookableTables: items,
          }
          setRestaurant(restaurant)
        }
      }
    })()
  }, [restaurantId, user?.uid])

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
            const restaurantRef = doc(db, 'restaurants', restaurantId)
            await addDoc(colRef, {
              restaurant: restaurantRef,
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
              <li>住所：{restaurant.prefecture}</li>
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
                      <td>{bookableTable.start_datetime}</td>
                      <td>{bookableTable.end_datetime}</td>
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
