'use client'

import liff from '@line/liff'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'

const LineUser = () => {
  const router = useRouter()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loggedInStatus, setLoggedInStatus] = useState('')

  useEffect(() => {
    ;(async () => {
      const liffId = `${process.env.NEXT_PUBLIC_LIFF_ID}`
      await liff.init({ liffId })
      // console.info('LIFF init', liff.isLoggedIn())

      if (!liff.isLoggedIn()) liff.login({})
      setLoggedIn(liff.isLoggedIn())

      liff.isLoggedIn()
        ? setLoggedInStatus('ログイン済み')
        : setLoggedInStatus('未ログイン')
    })()
  }, [])

  return (
    <>
      <h1>LINEログイン状態：{loggedInStatus}</h1>
      {loggedIn && (
        <button type='button' onClick={() => router.push('/restaurants')}>
          レストラン一覧を確認
        </button>
      )}
    </>
  )
}

export default LineUser
