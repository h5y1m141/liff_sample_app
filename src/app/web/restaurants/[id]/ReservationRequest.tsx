'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'
import dayjs from 'dayjs'
import React, { FC, useCallback, useState, useEffect } from 'react'
import { CreditCardComponent } from './CreditCardComponent'
import { SeatType, RestaurantCourseType } from './page'
import { useAuthContext } from '@/src/app/context/auth'

type Props = {
  seats: SeatType[]
  restaurantCourses: RestaurantCourseType[]
}

const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const ReservationRequest: FC<Props> = ({ seats, restaurantCourses }) => {
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
  const [stripeSecretKey, setStripeSecretKey] = useState<string | null>(null)
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  const [selectedSeat, setSelectedSeat] = useState<SeatType>()
  const [selectedRestaurantCourse, setSelectedRestaurantCourse] =
    useState<RestaurantCourseType>()
  const [requestComment, setRequestComment] = useState('')
  const [token, setToken] = useState<string>()
  const authContext = useAuthContext()

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

  useEffect(() => {
    ;(async () => {
      if (publishableKey) {
        setStripePromise(await loadStripe(publishableKey))
      }
    })()
  }, [publishableKey])

  useEffect(() => {
    ;(async () => {
      if (token && selectedSeat && selectedRestaurantCourse?.price) {
        const params = {
          price: selectedRestaurantCourse?.price,
          seat_id: selectedSeat.id,
          restaurant_course_id: selectedRestaurantCourse.id,
          requestComment,
        }
        const res = await fetch(
          `${backendBaseURL}/payment_intents`,
          fetchOption(params, token),
        )
        const data = await res.json()

        if (data) {
          setStripeSecretKey(data.secretKey)
        }
      }
    })()
  }, [token, selectedSeat, selectedRestaurantCourse, requestComment])

  const handleReservation = useCallback(async () => {
    if (!token || !selectedSeat || !selectedRestaurantCourse) return

    const params = {
      seat_id: selectedSeat.id,
      restaurant_course_id: selectedRestaurantCourse.id,
      requestComment,
    }
    const res = await fetch(
      `${backendBaseURL}/reservations`,
      fetchOption({ params }, token),
    )
    console.info('res', res)
  }, [selectedSeat, selectedRestaurantCourse, requestComment, token])

  const handleSelectSeat = useCallback(
    (event: { target: { value: string } }) => {
      const seatId = event.target.value
      if (seatId && seatId !== '') {
        const seat = seats.filter((seat) => seat.id === Number(seatId))
        setSelectedSeat(seat[0])
      }
    },
    [seats],
  )

  const handleSelectRestaurantCourse = useCallback(
    (event: { target: { value: string } }) => {
      const restaurantCourseId = event.target.value
      if (restaurantCourseId && restaurantCourseId !== '') {
        const restaurantCourse = restaurantCourses.filter(
          (seat) => seat.id === Number(restaurantCourseId),
        )
        setSelectedRestaurantCourse(restaurantCourse[0])
      }
    },
    [restaurantCourses],
  )
  const handleComment = useCallback((event: { target: { value: string } }) => {
    setRequestComment(event.target.value)
  }, [])

  useEffect(() => {
    ;(async () => {
      if (authContext.token) setToken(authContext.token)
    })()
  }, [authContext.token])

  return (
    <>
      <h2 style={{ fontSize: '1.2rem' }}>コースを選択</h2>
      <select
        name='seat'
        id='select-seat'
        style={selectStyle}
        onBlur={handleSelectSeat}
      >
        <option value=''>選択してください</option>
        {restaurantCourses.map((course) => {
          return (
            <option value={course.id} key={course.id}>
              {course.name}（料金：
              {new Intl.NumberFormat('ja-JP', {
                style: 'currency',
                currency: 'JPY',
              }).format(course.price)}
            </option>
          )
        })}
      </select>
      <h2 style={{ fontSize: '1.2rem' }}>空席を選択</h2>
      <div>
        <select
          name='seat'
          id='select-seat'
          style={selectStyle}
          onBlur={handleSelectRestaurantCourse}
        >
          <option value=''>選択してください</option>
          {seats.map((seat) => {
            return (
              <option value={seat.id} key={seat.id}>
                {dayjs(seat.start_at).format('YYYY/MM/DD HH:mm:ss')}（席数
                {seat.number_of_seats}）
              </option>
            )
          })}
        </select>
      </div>
      <div>
        <h2 style={{ fontSize: '1.2rem' }}>予約申請に関する伝達事項</h2>
        <textarea
          name='comment'
          id='comment'
          cols={30}
          rows={10}
          placeholder='コメント'
          onChange={handleComment}
        />
      </div>

      {selectedSeat &&
      selectedRestaurantCourse &&
      stripeSecretKey &&
      stripePromise ? (
        <>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: stripeSecretKey }}
          >
            <CreditCardComponent handleReservation={handleReservation} />
          </Elements>
        </>
      ) : (
        <>予約申請するにはコースと空席を選択してください</>
      )}
    </>
  )
}

const selectStyle = {
  border: 2,
  backgroundColor: '#EEEEEE',
  borderRadius: 5,
  marginBottom: 10,
}
