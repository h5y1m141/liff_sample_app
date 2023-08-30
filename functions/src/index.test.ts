import * as admin from 'firebase-admin'
import functions from 'firebase-functions-test'
import { copyReservationToOperation } from './index'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`,
}

const firebaseTest = functions(
  firebaseConfig,
  process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY_PATH,
)
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'

describe('copyReservationToOperation', () => {
  let wrapped
  let db

  beforeAll(() => {
    wrapped = firebaseTest.wrap(copyReservationToOperation)
    db = admin.firestore()
  })

  test('/operation_for_reservations配下のコレクションにドキュメントがコピーされる', async () => {
    const userId = (await db.collection('users').add({ name: 'test user' })).id
    const reservationId = (
      await db.collection(`users/${userId}/reservations`).add({
        restaurant_id: 'restaurant001',
        latitude: 35.123456,
        longitude: 139.123456,
        restaurant_name: 'すし大崎',
        created_at: '2022-01-01',
      })
    ).id
    expect(userId).not.toBeNull()
    expect(reservationId).not.toBeNull()

    const beforeReservation = {
      restaurant_id: 'restaurant001',
      latitude: 35.123456,
      longitude: 139.123456,
      restaurant_name: 'すし大崎',
      created_at: '2022-01-01',
    }

    const beforeSnap = firebaseTest.firestore.makeDocumentSnapshot(
      beforeReservation,
      `users/${userId}/reservations/${reservationId}`,
    )
    firebaseTest.firestore.makeDocumentSnapshot(
      { created_at: '2022-01-01' },
      '/reservation_summaries',
    )
    const wrappedCopyReservationToOperation = firebaseTest.wrap(
      copyReservationToOperation,
    )

    // paramsに事前に設定したuserIdやreservationIdを渡さないと、複製先のドキュメントIDがundefinedになるので注意
    await wrappedCopyReservationToOperation(beforeSnap, {
      params: { userId, reservationId },
    })

    const operationForReservation = (
      await db
        .collection(`/operation_for_reservations/`)
        .doc(reservationId)
        .get()
    ).data()
    console.info('operationForReservation', operationForReservation)
    expect(operationForReservation.restaurant_name).toBe('すし大崎')
  })
})
