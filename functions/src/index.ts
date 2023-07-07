import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

admin.initializeApp()

export const copyReservationToOperation = functions.firestore
  .document('/users/{userId}/reservations/{reservationId}')
  .onCreate(async (snapshot, context) => {
    const { userId, reservationId } = context.params
    const reservationData = snapshot.data()
    const operationForReservationRef = admin
      .firestore()
      .doc(`/operation_for_reservations/${reservationId}`)
    await operationForReservationRef.set(reservationData)
  })
