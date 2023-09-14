import type {
  QueryDocumentSnapshot,
  DocumentData,
  FirestoreDataConverter,
} from 'firebase/firestore'
import { z } from 'zod'
import { firestoreTimestampSchema } from './BookableTableModel'

export const SummarySchema = z.object({
  id: z.string(),
  restaurant_id: z.string(),
  count: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  reserved_at: firestoreTimestampSchema,
})

export const ReservationSummarySchema = z.object({
  items: z.array(z.unknown()),
  summaries: z.array(SummarySchema),
})

type ReservationSummaryType = z.infer<typeof ReservationSummarySchema>
export type SummaryType = z.infer<typeof SummarySchema>

export const ReservationSummaryConverter: FirestoreDataConverter<ReservationSummaryType> =
  {
    toFirestore(reservationSummary: ReservationSummaryType): DocumentData {
      const record = reservationSummary
      const parsed = ReservationSummarySchema.parse(record)
      return parsed
    },
    fromFirestore(snapshot: QueryDocumentSnapshot): ReservationSummaryType {
      const data = snapshot.data()!
      const parsed = ReservationSummarySchema.parse({
        ...data,
        id: snapshot.id,
      })

      return parsed
    },
  }
