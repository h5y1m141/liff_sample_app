'use client'

import liff from '@line/liff'
import React, { useCallback } from 'react'

export const SendMessage = () => {
  const handleMessage = useCallback(async () => {
    console.info('handleMessage')
    const liffId = `${process.env.NEXT_PUBLIC_LIFF_ID}`
    await liff.init({ liffId })
    console.info('client', liff.isInClient())
    if (liff.isInClient()) {
      liff
        .sendMessages([
          {
            type: 'text',
            text: 'LIFFからメッセージを送りました',
          },
        ])
        .then(() => {
          console.log('message sent')
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
  }, [])

  return (
    <>
      <button type='button' onClick={() => handleMessage()}>
        メッセージを送信
      </button>
    </>
  )
}
