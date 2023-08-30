import * as admin from 'firebase-admin'
import { FieldValue, FirestoreDataConverter } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import { info } from 'firebase-functions/logger'
import {
  ReservationType,
  reservationConverter,
} from './models/ReservationModel'

admin.initializeApp()

// NOTE: 「同一のpathに対する同一のFirestoreトリガーを使った関数を複数定義した際に
// 1つの関数だけでなく複数の関数でeventIDが重複する可能性がある」という以下記事の情報を参考に対応
// https://techblog.sgr-ksmt.dev/2019/12/16/104935/
const hasAlreadyTriggered = (
  eventID: string,
  suffix: string,
): Promise<boolean> => {
  const id = [eventID, suffix].join('-')
  return admin.firestore().runTransaction(async (transaction) => {
    const ref = admin
      .firestore()
      .collection('reservation_to_operation_events')
      .doc(id)
    const doc = await transaction.get(ref)
    if (doc.exists) {
      info(`EventID: ${id} has already triggered.`)
      return true
    } else {
      transaction.set(ref, {
        created_at: FieldValue.serverTimestamp(),
      })
      return false
    }
  })
}

export const copyReservationToOperation = functions.firestore
  .document('/users/{userId}/reservations/{reservationId}')
  .onCreate(async (snapshot, context) => {
    const { reservationId } = context.params
    const check = await hasAlreadyTriggered(
      context.eventId,
      'copyReservationToOperation',
    )
    console.info('reservationId', reservationId)
    console.info('dup check', check)

    if (check) {
      return null
    }

    const reservationData = snapshot.data()
    const operationForReservationRef = admin
      .firestore()
      .doc(`/operation_for_reservations/${reservationId}`)
    await operationForReservationRef.set(reservationData)
    await summarizeReservation(reservationConverter)
  })

const summarizeReservation = async (
  reservationConverter: FirestoreDataConverter<ReservationType>,
) => {
  const ref = admin
    .firestore()
    .collection('/operation_for_reservations')
    .withConverter(reservationConverter)
  const snapshot = await ref.get()
  const reservations = snapshot.docs.map((doc) => doc.data())
  const summaries = generateSummaries(reservations)

  const hasUndefinedValues = reservations.some((reservation) =>
    Object.values(reservation).some((value) => value === undefined),
  )
  const collectionRef = admin.firestore().collection('/reservation_summaries')
  if (collectionRef && !hasUndefinedValues) {
    await collectionRef.add({
      created_at: FieldValue.serverTimestamp(),
      items: reservations,
      summaries,
    })
  }
}

export const generateSummaries = (reservations: ReservationType[]) => {
  const summaries = Object.values(
    reservations.reduce((acc, cur) => {
      const key = `${cur.restaurant_id}-${cur.created_at}`
      if (!acc[key]) {
        acc[key] = {
          restaurant_id: cur.restaurant_id,
          reserved_at: cur.created_at,
          count: 0,
          latitude: cur.latitude,
          longitude: cur.longitude,
        }
      }
      acc[key].count++
      return acc
    }, {}),
  )
  return summaries
}
