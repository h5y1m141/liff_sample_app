'use client'

import React, { FC, useCallback, useState, useEffect } from 'react'
import { Result } from 'result-type-ts'
import { SeatType } from './page'
import { useAuthContext } from '@/src/app/context/auth'

type Props = Pick<SeatType, `id`>

const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL

const fetchOption = (data: any, token: string) => {
  return {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      mode: 'cors',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  }
}

export const ReservationRequestButton: FC<Props> = ({ id }) => {
  const [isReservationRequest, setIsReservationRequest] = useState(false)
  const [token, setToken] = useState<string>()
  const authContext = useAuthContext()

  const handleReservation = useCallback(
    async (id: number) => {
      if (!token) return

      setIsReservationRequest(true)
      const requestBody = { seat_id: id }

      const res = await fetch(
        `${backendBaseURL}/reservations`,
        fetchOption(requestBody, token),
      )
      const result = res.ok
        ? Result.success(await res.json())
        : Result.failure(res.statusText)
      console.info(result)
    },
    [token],
  )

  useEffect(() => {
    ;(async () => {
      if (authContext.token) setToken(authContext.token)
    })()
  }, [authContext.token])

  if (isReservationRequest) return <div>予約申請中...</div>

  return (
    <>
      <button
        onClick={() => {
          handleReservation(id)
        }}
      >
        予約申請
      </button>
    </>
  )
}
