'use client'

import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

import React, { FC, useCallback, useState } from 'react'

type Props = {
  handleReservation: () => void
}

export const CreditCardComponent: FC<Props> = ({ handleReservation }) => {
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
      if (!error) await handleReservation()

      if (error.type === 'card_error' || error.type === 'validation_error') {
        const errorMessage = error.message
        if (errorMessage) setMessage(errorMessage)
      } else {
        setMessage('An unexpected error occured.')
      }

      setIsLoading(false)
    },
    [stripe, elements, handleReservation],
  )

  return (
    <>
      <form id='payment-form' onSubmit={handleOnSubmit}>
        <PaymentElement />
        <button
          style={{
            marginTop: 10,
            backgroundColor: 'gray',
            padding: 10,
            color: 'white',
            borderRadius: 5,
          }}
          disabled={isLoading || !stripe || !elements}
          id='submit'
        >
          <span id='button-text'>
            {isLoading ? (
              <div className='spinner' id='spinner'></div>
            ) : (
              'この内容で申請'
            )}
          </span>
        </button>
        {message && <div id='payment-message'>{message}</div>}
      </form>
    </>
  )
}
