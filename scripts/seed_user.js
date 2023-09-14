require('dotenv').config()
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const admin = require('firebase-admin')

// Firebase Admin SDKの初期化
const serviceAccount = require(process.env
  .NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY_PATH)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

const prepareParams = () => {
  // JSON Schemaの定義
  const ajv = new Ajv()
  addFormats(ajv)

  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
    },
    required: ['name'],
    additionalProperties: false,
  }

  if (!process.argv[2]) {
    console.error('引数が足りません')
    process.exit(1)
  }

  const args = JSON.parse(process.argv[2])
  const validate = ajv.compile(schema)
  if (!validate(args)) {
    console.error(validate.errors)
    process.exit(1)
  }
  const name = args.name

  return {
    name,
  }
}

const createUserDocument = async (name) => {
  try {
    const userId = (
      await admin.firestore().collection('users').add({
        name,
      })
    ).id
    return userId
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const createReservationDocument = async (userId) => {
  try {
    const collectionPath = `users/${userId}/reservations`
    await admin.firestore().collection(collectionPath).add({
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

// Firestoreにデータを登録
const main = async () => {
  const { name } = prepareParams()

  const userId = await createUserDocument(name)
  await createReservationDocument(userId)
}

main()
