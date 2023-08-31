'use client'

import { useRouter } from 'next/navigation'
import React, { FC, Suspense } from 'react'
import { Map } from '../../ui/Map'
import { useReservationSummaries } from './useReservationSummaries'
import { useReservations } from './useReservations'

export const OperationForReservationList: FC = () => {
  const router = useRouter()
  const { reservations } = useReservations()
  const { summaries } = useReservationSummaries()

  return (
    <>
      <Suspense fallback={<div>店舗情報を読み込んでます...</div>}>
        {reservations && reservations.length > 0 && (
          <>
            <h1>予約一覧</h1>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>申請日</th>
                  <th>アクション</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => {
                  return (
                    <tr key={reservation.id}>
                      <td>{reservation.id}</td>
                      <td>{reservation.created_at}</td>
                      <td>
                        <button
                          type='button'
                          onClick={() =>
                            router.push(
                              `/admin/operation_for_reservations/${reservation.id}`,
                            )
                          }
                        >
                          予約詳細
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </>
        )}
      </Suspense>
      <Suspense fallback={<div>店舗単位の予約サマリーを読み込んでます...</div>}>
        {summaries && (
          <div>
            <Map
              latitude={summaries ? summaries[0].latitude : 0}
              longitude={summaries ? summaries[0].longitude : 0}
              isCellLayerVisible={true}
              summaries={summaries}
            />
          </div>
        )}
      </Suspense>
    </>
  )
}
