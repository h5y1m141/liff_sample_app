import { FieldValue, Timestamp } from 'firebase/firestore'
import type {
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreDataConverter,
} from 'firebase/firestore'
import { z } from 'zod'

export const firestoreFieldValueSchema = z.custom<FieldValue>(
  (data) => data instanceof FieldValue,
)

export const firestoreTimestampSchema = z.instanceof(Timestamp)

export const BookableTableSchema = z.object({
  id: z.string(),
  available_reservation_requests: z.number(),
  start_datetime: firestoreTimestampSchema,
  end_datetime: firestoreTimestampSchema,
  created_at: firestoreTimestampSchema,
})

export type BookableTableType = z.infer<typeof BookableTableSchema>

export const BookableTableConverter: FirestoreDataConverter<BookableTableType> =
  {
    toFirestore(bookableTable: BookableTableType): DocumentData {
      const { start_datetime, end_datetime, available_reservation_requests } =
        bookableTable
      const record = {
        start_datetime,
        end_datetime,
        available_reservation_requests,
      }
      const parsed = BookableTableSchema.parse(record)
      return parsed
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): BookableTableType {
      const data = snapshot.data()!
      const parsed = BookableTableSchema.parse({
        ...data,
        id: snapshot.id,
      })

      return parsed
    },
  }
