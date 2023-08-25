'use client'

import React, { FC, useRef, Suspense, useCallback } from 'react'
import { useReactToPrint } from 'react-to-print'

import { Map } from '../../../ui/Map'
import { OperationForReservationType } from '../OperationForReservationList'
import { useOperationForReservation } from './useOperationForReservation'

export const OperationForReservation: FC = () => {
  const { operationForReservation } = useOperationForReservation()

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
            <Map
              latitude={operationForReservation.latitude}
              longitude={operationForReservation.longitude}
            />
          </>
        )}
      </Suspense>
    </>
  )
}
