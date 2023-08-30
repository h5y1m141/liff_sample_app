'use client'

import { useRouter } from 'next/navigation'
import React, { FC, Suspense } from 'react'
import { useReservations } from './useReservations'

export const OperationForReservationList: FC = () => {
  const router = useRouter()
  const { reservations } = useReservations()

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
    </>
  )
}
