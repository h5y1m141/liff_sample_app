import React from 'react'
import { Result } from 'result-type-ts'
import { RestaurantList } from './RestaurantList'

async function fetchRestaurants() {
  const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }
  const res = await fetch(`${backendBaseURL}/restaurants`, options)
  const result = res.ok
    ? Result.success(res.json())
    : Result.failure(res.statusText)

  return result.value
}

// "id": 1,
// "name": "すし黒崎",
// "latitude": "0.000000",
// "longitude": "0.000000",
// "created_at": "2023-08-22T06:12:13.610Z",
// "updated_at": "2023-08-22T06:12:13.610Z",
// "seats": [
//   {
//     "id": 3,
//     "restaurant_id": 1,
//     "number_of_seats": 4,
//     "start_at": "2023-09-05T07:00:00.000Z",
//     "end_at": "2023-09-05T08:00:00.000Z",
//     "created_at": "2023-09-04T06:40:31.030Z",
//     "updated_at": "2023-09-04T06:40:31.030Z"
//   },
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
                  <button type='button'>レストラン詳細</button>
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
