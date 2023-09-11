import React from 'react'
import { Result } from 'result-type-ts'
import { ReservationRequest } from './ReservationRequest'

async function fetchRestaurant(id: string) {
  const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store' as RequestCache,
  }
  const res = await fetch(`${backendBaseURL}/restaurants/${id}`, options)
  const result = res.ok
    ? Result.success(await res.json())
    : Result.failure(res.statusText)

  return result.value
}

export type SeatType = {
  id: number
  restaurant_id: number
  number_of_seats: number
  start_at: string
}

export type RestaurantCourseType = {
  id: number
  restaurant_id: number
  name: string
  price: number
}

type ResponseType = {
  id: number
  name: string
  latitude: string
  longitude: string
  seats: SeatType[]
  restaurant_courses: RestaurantCourseType[]
}

type ParamsType = {
  id: string
}
async function Page(props: { params: ParamsType }) {
  const id = props.params.id
  const restaurant: ResponseType = await fetchRestaurant(id)

  return (
    <div style={{ padding: 10 }}>
      <h1 style={{ fontSize: '1.5rem' }}>{restaurant.name}の予約申請を行う</h1>

      <ReservationRequest
        seats={restaurant.seats.filter((seat) => seat.number_of_seats > 0)}
        restaurantCourses={restaurant.restaurant_courses}
      />
    </div>
  )
}

export default Page
