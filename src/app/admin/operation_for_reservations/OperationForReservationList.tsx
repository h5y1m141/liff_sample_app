'use client'

import {
  collection,
  getFirestore,
  where,
  query,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore'

import React, { useEffect, useState, FC, Suspense } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'

export type OperationForReservationType = {
  id: string
  created_at: string
}

export const OperationForReservationList: FC = () => {
  const authContext = useAuthContext()
  const [reservations, setReservations] =
    useState<OperationForReservationType[]>()
  useEffect(() => {
    const collectionName = 'operation_for_reservations'

    if (authContext.user?.uid) {
      const db = getFirestore(firebaseApp)

      const compareDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
      const q = query(
        collection(db, collectionName),
        orderBy('created_at', 'desc'),
        limit(5),
        where('created_at', '>', compareDate),
      )
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: OperationForReservationType[] = []
        querySnapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            created_at: doc.data().created_at.toDate().toLocaleString(),
          })
        })
        setReservations(items)
      })
      return unsubscribe
    }
  }, [authContext.user?.uid])

  return (
    <>
      <Suspense fallback={<div>店舗情報を読み込んでます...</div>}>
        {reservations && reservations.length > 0 && (
          <>
            <h1>予約一覧</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>申請日</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  return (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{reservation.created_at}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </Suspense>
    </>
  )
}
