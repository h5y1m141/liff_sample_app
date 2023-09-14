import * as admin from 'firebase-admin'
import type { DocumentData } from 'firebase-admin/firestore'
import { FirestoreDataConverter } from 'firebase-admin/firestore'

export type ReservationType = {
  id: string
  restaurant_id: string
  restaurant_name: string
  created_at: string
  latitude: number
  longitude: number
}

export const reservationConverter: FirestoreDataConverter<ReservationType> = {
  toFirestore(reservation: ReservationType): DocumentData {
    return {
      restaurant_name: reservation.restaurant_name,
      latitude: reservation.latitude,
      longitude: reservation.longitude,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    }
  },
  fromFirestore(
    snapshot: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>,
  ): ReservationType {
    const data = snapshot.data()!

    return {
      id: snapshot.id,
      restaurant_id: data.restaurant_id,
      restaurant_name: data.restaurant_name,
      latitude: data.latitude,
      longitude: data.longitude,
      created_at: data.created_at,
    }
  },
}
