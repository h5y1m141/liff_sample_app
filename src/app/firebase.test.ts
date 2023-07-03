import { readFileSync } from 'fs'
import { resolve } from 'path'
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
  assertFails,
} from '@firebase/rules-unit-testing'

import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid'

const rulesPath = resolve(__dirname, '../../firestore.rules')
const rules = readFileSync(rulesPath, 'utf8')

// const projectId = 'test-project-' + uuidv4()
const projectId = 'fortnite-news-1698d'
let testEnv: RulesTestEnvironment
const uid = uuidv4()
const collectionName = 'restaurants'
const docId = uuidv4()

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

describe('ドキュメントの取得', () => {
  beforeEach(async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      const admin = context.firestore()
      const col = collection(admin, collectionName)
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
})
