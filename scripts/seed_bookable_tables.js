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
      start_datetime: { type: 'string', format: 'date-time' },
      end_datetime: { type: 'string', format: 'date-time' },
      duration: { type: 'integer', minimum: 1 },
      available_reservation_requests: { type: 'integer', minimum: 1 },
      restaurant_name: { type: 'string' },
      latitude: { type: 'number' },
      longitude: { type: 'number' },
    },
    required: [
      'start_datetime',
      'end_datetime',
      'duration',
      'available_reservation_requests',
      'restaurant_name',
      'latitude',
      'longitude',
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
  const startDatetime = dayjs(args.start_datetime)
  const endDatetime = dayjs(args.end_datetime)
  const duration = parseInt(args.duration)
  const availableReservationRequests = parseInt(
    args.available_reservation_requests,
  )
  const restaurantName = args.restaurant_name
  const latitude = args.latitude
  const longitude = args.longitude

  return {
    restaurantName,
    latitude,
    longitude,
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
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      start_datetime: start,
      end_datetime: end,
      available_reservation_requests: availableReservationRequests,
    })
  } catch (error) {
    console.error('Error adding document: ', error)
  }
}

const createRestaurantDocument = async (
  restaurantName,
  latitude,
  longitude,
) => {
  try {
    const restaurantId = (
      await admin
        .firestore()
        .collection('restaurants')
        .add({
          name: `${restaurantName}`,
          latitude,
          longitude,
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
    latitude,
    longitude,
  } = prepareParams()
  let currentDatetime = startDatetime
  const id = await createRestaurantDocument(restaurantName, latitude, longitude)
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
