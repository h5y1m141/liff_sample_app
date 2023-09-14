import Link from 'next/link'
import React from 'react'
import { Result } from 'result-type-ts'

async function fetchRestaurants() {
  const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const options: RequestInit = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store' as RequestCache,
  }
  const res = await fetch(`${backendBaseURL}/restaurants`, options)
  const result = res.ok
    ? Result.success(await res.json())
    : Result.failure(res.statusText)

  return result.value
}

type SeatType = {
  restaurant_id: number
  number_of_seats: number
  start_at: string
}

type RestaurantType = {
  id: number
  name: string
  latitude: string
  longitude: string
  seats: SeatType[]
}
type ResponseType = {
  restaurants: RestaurantType[]
}

async function Page() {
  const data: ResponseType = await fetchRestaurants()

  return (
    <>
      <h1>NestJSのAPIを利用したレストラン一覧</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>店舗名</th>
            <th>アクション</th>
          </tr>
        </thead>
        <tbody>
          {data.restaurants.map((restaurant) => {
            return (
              <tr key={restaurant.id}>
                <td>{restaurant.id}</td>
                <td>{restaurant.name}</td>
                <td>
                  <Link href={`/web/restaurants/${restaurant.id}`}>
                    レストラン詳細
                  </Link>
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
