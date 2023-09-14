import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing'

import {
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const rulesPath = resolve(__dirname, '../../firestore.rules')
const rules = readFileSync(rulesPath, 'utf8')
const projectId = 'fortnite-news-1698d'

let testEnv: RulesTestEnvironment
// TODO: 本当はuuidv4()でランダムなuidを生成したものを活用する。
// その処理にするためにはFirebaseAuthenticationのCustom Claimsにadminロールを付与する
// 機能が必要
const uid = 'pDDrMsBwcOU1u5ZlrQLd5WptpzU2'
const restaurantCollectionName = 'restaurants'
const userCollectionName = 'users'
const docId = uuidv4()
const addressId = uuidv4()
const reservationId = uuidv4()

export const initTest = async () => {
  const env = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules,
      port: 8080,
      host: '127.0.0.1',
    },
  })
  return env
}
beforeAll(async () => {
  // テストプロジェクト環境の作成
  testEnv = await initTest()
})

afterAll(async () => {
  await testEnv.cleanup()
})

const getDB = () => {
  // ログイン情報つきのContextを作成し、そこから Firestore インスタンスを得る。
  // authenticatedContextは引数をUIDにもつ認証済みContextを返す。
  const authenticatedContext = testEnv.authenticatedContext(uid)
  const clientDB = authenticatedContext.firestore()

  // ゲストContextを作成し、そこから Firestore インスタンスを得る。
  // unauthenticatedContextは未認証Contextを返す。
  const unauthenticatedContext = testEnv.unauthenticatedContext()
  const guestClientDB = unauthenticatedContext.firestore()
  return { clientDB, guestClientDB }
}

describe('restaurantsコレクション配下のドキュメントの取得', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const admin = context.firestore()
      const col = collection(admin, restaurantCollectionName)
      const docRef = doc(col, docId)
      await setDoc(docRef, { name: 'レストラン１' })

      return Promise.resolve()
    })
  })

  it('認証済みで条件を満たす場合は可能', async () => {
    const { clientDB } = getDB()
    const testCol = collection(clientDB, 'restaurants')
    const docRef = doc(testCol, docId)
    const docSnap = await getDoc(docRef)
    expect(docSnap.exists()).toBe(true)
  })

  it('認証してない場合は不可能', async () => {
    const { guestClientDB } = getDB()
    const testCol = collection(guestClientDB, 'restaurants')
    const docRef = doc(testCol, docId)
    await assertFails(getDoc(docRef))
  })

  describe('サブコレクションのaddressの取得', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const admin = context.firestore()
        const col = collection(
          admin,
          `${restaurantCollectionName}/${docId}/address`,
        )
        const docRef = doc(col, addressId)
        await setDoc(docRef, { prefecture: '東京都' })

        return Promise.resolve()
      })
    })

    it('認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB()
      const testCol = collection(
        clientDB,
        `${restaurantCollectionName}/${docId}/address`,
      )
      const docRef = doc(testCol, addressId)
      const docSnap = await getDoc(docRef)
      expect(docSnap.exists()).toBe(true)
    })

    it('認証してない場合は不可能', async () => {
      const { guestClientDB } = getDB()
      const testCol = collection(
        guestClientDB,
        `${restaurantCollectionName}/${docId}/address`,
      )
      const docRef = doc(testCol, docId)
      await assertFails(getDoc(docRef))
    })
  })
  describe('サブコレクションのbookable_tables', () => {
    const tableId = uuidv4()

    describe('ドキュメントの取得', () => {
      beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const admin = context.firestore()
          const col = collection(
            admin,
            `${restaurantCollectionName}/${docId}/bookable_tables`,
          )
          const docRef = doc(col, tableId)
          await setDoc(docRef, { availableReservationRequests: 4 })

          return Promise.resolve()
        })
      })

      it('認証済みで条件を満たす場合は可能', async () => {
        const { clientDB } = getDB()
        const testCol = collection(
          clientDB,
          `${restaurantCollectionName}/${docId}/bookable_tables`,
        )
        const docRef = doc(testCol, tableId)
        const docSnap = await getDoc(docRef)
        expect(docSnap.exists()).toBe(true)
      })

      it('認証してない場合は不可能', async () => {
        const { guestClientDB } = getDB()
        const testCol = collection(
          guestClientDB,
          `${restaurantCollectionName}/${docId}/bookable_tables`,
        )
        const docRef = doc(testCol, docId)
        await assertFails(getDoc(docRef))
      })
    })
    describe('ドキュメントの更新', () => {
      it('認証済みで条件を満たす場合は可能', async () => {
        const { clientDB } = getDB()
        const testCol = collection(
          clientDB,
          `${restaurantCollectionName}/${docId}/bookable_tables`,
        )
        const docRef = doc(testCol, tableId)
        await assertSucceeds(setDoc(docRef, { created_at: serverTimestamp() }))
      })

      it('認証してない場合は不可能', async () => {
        const { guestClientDB } = getDB()
        const testCol = collection(
          guestClientDB,
          `${restaurantCollectionName}/${docId}/bookable_tables`,
        )
        const docRef = doc(testCol, tableId)
        await assertFails(setDoc(docRef, { created_at: serverTimestamp() }))
      })
    })
  })
})

describe('usersコレクション配下のドキュメントの取得', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const admin = context.firestore()
      const col = collection(admin, userCollectionName)
      const docRef = doc(col, uid)
      await setDoc(docRef, { name: 'ユーザー１' })

      return Promise.resolve()
    })
  })

  it('認証済みで条件を満たす場合は可能', async () => {
    const { clientDB } = getDB()
    const testCol = collection(clientDB, 'users')
    const docRef = doc(testCol, uid)
    const docSnap = await getDoc(docRef)
    expect(docSnap.exists()).toBe(true)
  })

  it('認証してない場合は不可能', async () => {
    const { guestClientDB } = getDB()
    const testCol = collection(guestClientDB, 'users')
    const docRef = doc(testCol, uid)
    await assertFails(getDoc(docRef))
  })
  describe('reservationsコレクション配下のドキュメントの取得', () => {
    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const admin = context.firestore()
        const col1 = collection(admin, userCollectionName)
        const docRef1 = doc(col1, uid)
        await setDoc(docRef1, { name: 'ユーザー１' })

        const col2 = collection(
          admin,
          `${userCollectionName}/${uid}/reservations`,
        )
        const docRef2 = doc(col2, reservationId)
        await setDoc(docRef2, {
          visit_date: 'レストラン２',
          created_at: serverTimestamp(),
        })

        return Promise.resolve()
      })
    })

    it('認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB()
      const testCol = collection(
        clientDB,
        `${userCollectionName}/${uid}/reservations`,
      )
      const docRef = doc(testCol, reservationId)
      const docSnap = await getDoc(docRef)
      expect(docSnap.exists()).toBe(true)
    })

    it('認証してない場合は不可能', async () => {
      const { guestClientDB } = getDB()
      const testCol = collection(guestClientDB, 'users')
      const docRef = doc(testCol, uid)
      await assertFails(getDoc(docRef))
    })
  })
})

describe('operation_for_reservations', () => {
  describe('ドキュメントの取得', () => {
    const operationForReservationName = 'operation_for_reservations'
    const docId = uuidv4()

    beforeEach(async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
        const admin = context.firestore()
        const col = collection(admin, operationForReservationName)
        const docRef = doc(col, docId)
        await setDoc(docRef, { created_at: serverTimestamp() })

        return Promise.resolve()
      })
    })

    it('認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB()
      const testCol = collection(clientDB, 'operation_for_reservations')
      const docRef = doc(testCol, docId)
      const docSnap = await getDoc(docRef)
      expect(docSnap.exists()).toBe(true)
    })

    it('認証してない場合は不可能', async () => {
      const { guestClientDB } = getDB()
      const testCol = collection(guestClientDB, 'operation_for_reservations')
      const docRef = doc(testCol, docId)
      await assertFails(getDoc(docRef))
    })
  })
  describe('ドキュメントの作成', () => {
    const docId = uuidv4()

    it('認証済みで条件を満たす場合は可能', async () => {
      const { clientDB } = getDB()
      const testCol = collection(clientDB, 'operation_for_reservations')
      const docRef = doc(testCol, docId)
      await assertFails(setDoc(docRef, { created_at: serverTimestamp() }))
    })

    it('認証してない場合は不可能', async () => {
      const { guestClientDB } = getDB()
      const testCol = collection(guestClientDB, 'operation_for_reservations')
      const docRef = doc(testCol, docId)
      await assertFails(setDoc(docRef, { created_at: serverTimestamp() }))
    })
  })
})
