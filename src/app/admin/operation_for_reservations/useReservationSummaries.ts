import { getDoc, doc, getFirestore } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { firebaseApp } from '@/src/app/firebase'

export type SummaryType = {
  restaurant_id: string
  count: number
  latitude: number
  longitude: number
  reserved_at: any
}

export const useReservationSummaries = () => {
  const [summaries, setSummaries] = useState<SummaryType[]>()
  useEffect(() => {
    ;(async () => {
      const collectionName = 'reservation_summaries'
      const docId = 'gkmPjFIO88DqGMrWoUB5'

      const db = getFirestore(firebaseApp)
      const docRef = doc(db, collectionName, docId)
      const docSnapshot = await getDoc(docRef)

      if (docSnapshot.exists()) {
        const summaries = docSnapshot.get('summaries')
        setSummaries(summaries)
      }
    })()
  }, [])

  return {
    summaries,
  }
}
