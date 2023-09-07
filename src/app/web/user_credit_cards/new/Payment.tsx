'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import type { Stripe } from '@stripe/stripe-js'

import React, { FC, useState, useEffect } from 'react'
import { CreditCardComponent } from './CreditCardComponent'
import { useAuthContext } from '@/src/app/context/auth'

type Props = {}

const backendBaseURL = process.env.NEXT_PUBLIC_BACKEND_URL

export const Payment: FC<Props> = () => {
  const authContext = useAuthContext()
  const [stripePromise, setStripePromise] = useState<Stripe | null>(null)
  const [stripeSecretKey, setStripeSecretKey] = useState<string | null>(null)
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

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
      if (authContext.token) {
        const token = authContext.token
        const res = await fetch(
          `${backendBaseURL}/payment_intents`,
          fetchOption({}, token),
        )
        const data = await res.json()

        if (data) {
          setStripeSecretKey(data.secretKey)
        }
      }
    })()
  }, [authContext])

  return (
    <>
      <h1>クレジットカード登録画面</h1>
      {stripeSecretKey && stripePromise && (
        <>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: stripeSecretKey }}
          >
            <CreditCardComponent />
          </Elements>
        </>
      )}
    </>
  )
}
