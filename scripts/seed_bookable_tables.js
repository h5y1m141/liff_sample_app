require('dotenv').config()
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const dayjs = require('dayjs')
const admin = require('firebase-admin')

// Firebase Admin SDKの初期化
const serviceAccount = require(process.env
  .NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY_PATH)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'http://localhost:8080',
})

const prepareParams = () => {
  // JSON Schemaの定義
  const ajv = new Ajv()
  addFormats(ajv)

  const schema = {
    type: 'object',
    properties: {
      startDatetime: { type: 'string', format: 'date-time' },
      endDatetime: { type: 'string', format: 'date-time' },
      duration: { type: 'integer', minimum: 1 },
      availableReservationRequests: { type: 'integer', minimum: 1 },
      restaurantId: { type: 'string' },
    },
    required: [
      'startDatetime',
      'endDatetime',
      'duration',
      'availableReservationRequests',
      'restaurantId',
    ],
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
  const startDatetime = dayjs(args.startDatetime)
  const endDatetime = dayjs(args.endDatetime)
  const duration = parseInt(args.duration)
  const availableReservationRequests = parseInt(
    args.availableReservationRequests,
  )
  // Firestoreのコレクションのパス
  const restaurantId = args.restaurantId
  const collectionPath = `restaurants/${restaurantId}/bookable_tables`

  return {
    startDatetime,
    endDatetime,
    duration,
    availableReservationRequests,
    collectionPath,
  }
}

// Firestoreにデータを登録する関数
const createBookableTableDocument = async (
  start,
  end,
  availableReservationRequests,
  collectionPath,
) => {
  try {
    await admin.firestore().collection(collectionPath).add({
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      startDatetime: start,
      endDatetime: end,
      availableReservationRequests,
    })
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

// Firestoreにデータを登録
const main = async () => {
  const {
    startDatetime,
    endDatetime,
    duration,
    availableReservationRequests,
    collectionPath,
  } = prepareParams()
  let currentDatetime = startDatetime
  while (currentDatetime.isBefore(endDatetime)) {
    const start = currentDatetime.toDate()
    const end = currentDatetime.add(duration, 'hour').toDate()
    await createBookableTableDocument(
      start,
      end,
      availableReservationRequests,
      collectionPath,
    )
    currentDatetime = currentDatetime.add(duration, 'hour')
  }
}

main()
