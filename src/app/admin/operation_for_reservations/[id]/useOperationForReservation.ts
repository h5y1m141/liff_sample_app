import { getDoc, doc, getFirestore } from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OperationForReservationType } from '../OperationForReservationList'
import { firebaseApp } from '@/src/app/firebase'

export const useOperationForReservation = () => {
  const params = useParams()
  const [operationId, setOperationId] = useState('')
  const [operationForReservation, setOperationForReservation] =
    useState<OperationForReservationType>()

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setOperationId(id)
  }, [params])

  useEffect(() => {
    ;(async () => {
      const collectionName = 'operation_for_reservations'

      if (operationId !== '') {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, operationId)
        const docSnapshot = await getDoc(docRef)

        if (docSnapshot.exists()) {
          const item: OperationForReservationType = {
            id: docSnapshot.id,
            created_at: docSnapshot.get('created_at').toDate().toLocaleString(),
            latitude: docSnapshot.get('latitude'),
            longitude: docSnapshot.get('longitude'),
          }
          setOperationForReservation(item)
        }
      }
    })()
  }, [operationId])

  return {
    operationForReservation,
  }
}
