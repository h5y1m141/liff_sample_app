import * as admin from 'firebase-admin'

// Firebase Admin SDK の初期化
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080'
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'test-project',
  })
}

export { admin }
