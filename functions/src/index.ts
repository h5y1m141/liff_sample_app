import * as admin from 'firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'

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
      console.log(`EventID: ${id} has already triggered.`)
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
    if (hasAlreadyTriggered(context.eventId, 'copyReservationToOperation')) {
      return null
    }

    const { reservationId } = context.params
    const reservationData = snapshot.data()
    const operationForReservationRef = admin
      .firestore()
      .doc(`/operation_for_reservations/${reservationId}`)
    await operationForReservationRef.set(reservationData)
  })
