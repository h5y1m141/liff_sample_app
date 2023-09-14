import {
  collection,
  getFirestore,
  where,
  query,
  onSnapshot,
  orderBy,
  limit,
} from 'firebase/firestore'

import { useState, useEffect } from 'react'

import { firebaseApp } from '@/src/app/firebase'

export type OperationForReservationType = {
  id: string
  created_at: string
  latitude: number
  longitude: number
}

export const useReservations = () => {
  const [reservations, setReservations] =
    useState<OperationForReservationType[]>()
  useEffect(() => {
    const collectionName = 'operation_for_reservations'
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
          latitude: doc.data().latitude,
          longitude: doc.data().longitude,
          created_at: doc.data().created_at.toDate().toLocaleString(),
        })
      })
      setReservations(items)
    })
    return unsubscribe
  }, [])

  return { reservations }
}
