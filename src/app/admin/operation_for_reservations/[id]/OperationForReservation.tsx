'use client'

import { getDoc, doc, getFirestore } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import React, {
  FC,
  useEffect,
  useState,
  useRef,
  Suspense,
  useCallback,
} from 'react'
import { useReactToPrint } from 'react-to-print'

import { OperationForReservationType } from '../OperationForReservationList'
import { firebaseApp } from '@/src/app/firebase'

export const OperationForReservation: FC = () => {
  const params = useParams()
  const [operationId, setOperationId] = useState('')
  const [operationForReservation, setOperationForReservation] =
    useState<OperationForReservationType>()

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setOperationId(id)
  }, [params])

  useEffect(() => {
    ;(async () => {
      const collectionName = 'operation_for_reservations'

      if (operationId !== '') {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, operationId)
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
          const item: OperationForReservationType = {
            id: docSnapshot.id,
            created_at: docSnapshot.get('created_at').toDate().toLocaleString(),
          }
          setOperationForReservation(item)
        }
      }
    })()
  }, [operationId])

  if (!operationForReservation) return <>Loading....</>

  return <Container operationForReservation={operationForReservation} />
}

type ContainerProps = {
  operationForReservation: OperationForReservationType
}

const Container: FC<ContainerProps> = ({ operationForReservation }) => {
  const componentRef = useRef<HTMLDivElement | null>(null)
  const pageStyle = `
  @page { 
    size: auto;
    margin: 5mm;
  }
  
  @media print {
    body { -webkit-print-color-adjust: exact; }
    table { break-after: auto; }
    tr    { break-inside:avoid; break-after:auto }
    td    { break-inside:avoid; break-after:auto }
  }
`

  /**
   * 印刷対象のコンポーネントを設定します
   */
  const reactToPrintContent = useCallback(() => {
    if (!componentRef.current) return null
    return componentRef.current
  }, [])

  /**
   * 印刷プレビューを表示します
   */
  const handlePrint = useReactToPrint({
    pageStyle, // 印刷のスタイリングを指定
    content: reactToPrintContent, // 印刷エリアを指定
    removeAfterPrint: true, // 印刷後に印刷用のiframeを削除する
  })

  return (
    <>
      <div className='p-4'>
        <div className='flex justify-center'>
          <div className='w-1/4'>
            <button
              onClick={handlePrint}
              className={
                'w-full h-9 font-semibold rounded-medium border border-gray-darkest text-white bg-blue-500 hover:bg-indigo-700'
              }
            >
              印刷
            </button>
          </div>
        </div>
        <Screen
          operationForReservation={operationForReservation}
          componentRef={componentRef}
        />
      </div>
    </>
  )
}

type ScreenProps = ContainerProps & {
  componentRef: React.MutableRefObject<HTMLDivElement | null>
}

const Screen: FC<ScreenProps> = ({ operationForReservation, componentRef }) => {
  return (
    <>
      <Suspense fallback={<div>申請された予約情報を読み込んでます...</div>}>
        {operationForReservation && (
          <>
            <div ref={componentRef}>
              <h1>予約情報</h1>
              <h2>以下の内容で予約の申請がありました</h2>
              <h3>詳細</h3>
              <ul>
                <li>ID：{operationForReservation.id}</li>
                <li>申請日：{operationForReservation.created_at}</li>
              </ul>
            </div>
          </>
        )}
      </Suspense>
    </>
  )
}
