import dayjs from 'dayjs'

import React from 'react'
import { Result } from 'result-type-ts'
import { ReservationRequestButton } from './ReservationRequestButton'

async function fetchRestaurant(id: string) {
  const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await fetch(`${backendBaseURL}/restaurants/${id}`, options)
  const result = res.ok
    ? Result.success(res.json())
    : Result.failure(res.statusText)

  return result.value
}

export type SeatType = {
  id: number
  restaurant_id: number
  number_of_seats: number
  start_at: string
}

type ResponseType = {
  id: number
  name: string
  latitude: string
  longitude: string
  seats: SeatType[]
}

type ParamsType = {
  id: string
}
async function Page(props: { params: ParamsType }) {
  const id = props.params.id
  const restaurant: ResponseType = await fetchRestaurant(id)

  return (
    <>
      <h1>{restaurant.name}の予約可能な席の情報</h1>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>予約可能な席数</th>
            <th>開始時間</th>
            <th>予約</th>
          </tr>
        </thead>
        <tbody>
          {restaurant.seats.map((seat) => {
            return (
              <tr key={seat.id}>
                <td>{seat.id}</td>
                <td>{seat.number_of_seats}</td>
                <td>{dayjs(seat.start_at).format('YYYY/MM/DD HH:mm:ss')}</td>
                <td>
                  {seat.number_of_seats === 0 ? (
                    '--満席--'
                  ) : (
                    <ReservationRequestButton id={seat.id} />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

export default Page
