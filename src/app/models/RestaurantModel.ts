import type {
  QueryDocumentSnapshot,
  DocumentData,
  SnapshotOptions,
  FirestoreDataConverter,
} from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'
import { BookableTableType } from '@/src/app/models/BookableTableModel'

export type RestaurantType = {
  id: string
  name: string
  phone: string
  latitude: number
  longitude: number
  bookableTables?: BookableTableType[]
}

export const RestaurantConverter: FirestoreDataConverter<RestaurantType> = {
  toFirestore(restaurant: RestaurantType): DocumentData {
    return {
      name: restaurant.name,
      phone: restaurant.phone,
      latitude: restaurant.latitude,
      longitude: restaurant.longitude,
      created_at: serverTimestamp(),
    }
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions,
  ): RestaurantType {
    const data = snapshot.data(options)!

    return {
      id: snapshot.id,
      name: data.name,
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    }
  },
}
