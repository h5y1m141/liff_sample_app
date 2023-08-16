import type {
  QueryDocumentSnapshot,
  DocumentData,
  SnapshotOptions,
  FirestoreDataConverter,
} from 'firebase/firestore'
import { serverTimestamp } from 'firebase/firestore'

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
  bookableTables?: BookableTableType[]
}

export const RestaurantConverter: FirestoreDataConverter<RestaurantType> = {
  toFirestore(restaurant: RestaurantType): DocumentData {
    return {
      name: restaurant.name,
      phone: restaurant.phone,
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
    }
  },
}
