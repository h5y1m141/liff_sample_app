require('dotenv').config()
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const dayjs = require('dayjs')
const admin = require('firebase-admin')
const v4 = require('uuid').v4

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
      startDatetime: { type: 'string', format: 'date-time' },
      endDatetime: { type: 'string', format: 'date-time' },
      duration: { type: 'integer', minimum: 1 },
      availableReservationRequests: { type: 'integer', minimum: 1 },
      restaurantName: { type: 'string' },
    },
    required: [
      'startDatetime',
      'endDatetime',
      'duration',
      'availableReservationRequests',
      'restaurantName',
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
  const restaurantName = args.restaurantName

  return {
    restaurantName,
    startDatetime,
    endDatetime,
    duration,
    availableReservationRequests,
  }
}

const createBookableTableDocument = async (
  id,
  start,
  end,
  availableReservationRequests,
) => {
  try {
    const collectionPath = `restaurants/${id}/bookable_tables`
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

const createRestaurantDocument = async (restaurantName) => {
  try {
    const restaurantId = (
      await admin
        .firestore()
        .collection('restaurants')
        .add({
          name: `${restaurantName}`,
          phone: `090-1234-3456`,
        })
    ).id
    return restaurantId
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const createRestaurantAddressDocument = async (restaurantId) => {
  try {
    await admin
      .firestore()
      .collection(`restaurants/${restaurantId}/address`)
      .add({ prefecture: '東京都' })
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

// Firestoreにデータを登録
const main = async () => {
  const {
    restaurantName,
    startDatetime,
    endDatetime,
    duration,
    availableReservationRequests,
  } = prepareParams()
  let currentDatetime = startDatetime
  const id = await createRestaurantDocument(restaurantName)
  await createRestaurantAddressDocument(id)

  while (currentDatetime.isBefore(endDatetime)) {
    const start = currentDatetime.toDate()
    const end = currentDatetime.add(duration, 'hour').toDate()
    await createBookableTableDocument(
      id,
      start,
      end,
      availableReservationRequests,
    )
    currentDatetime = currentDatetime.add(duration, 'hour')
  }
}

main()
