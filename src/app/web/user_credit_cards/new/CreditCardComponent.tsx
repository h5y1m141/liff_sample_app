'use client'

import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'

import React, { FC, useCallback, useState } from 'react'

type Props = {}

export const CreditCardComponent: FC<Props> = () => {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleOnSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!stripe || !elements) {
        return
      }
      setIsLoading(true)

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/web/restaurants`,
        },
      })

      if (error.type === 'card_error' || error.type === 'validation_error') {
        const errorMessage = error.message
        if (errorMessage) setMessage(errorMessage)
      } else {
        setMessage('An unexpected error occured.')
      }

      setIsLoading(false)
    },
    [stripe, elements],
  )

  return (
    <>
      <form id='payment-form' onSubmit={handleOnSubmit}>
        <LinkAuthenticationElement id='link-authentication-element' />
        <PaymentElement />
        <button disabled={isLoading || !stripe || !elements} id='submit'>
          <span id='button-text'>
            {isLoading ? (
              <div className='spinner' id='spinner'></div>
            ) : (
              'Pay now'
            )}
          </span>
        </button>
        {message && <div id='payment-message'>{message}</div>}
      </form>
    </>
  )
}
