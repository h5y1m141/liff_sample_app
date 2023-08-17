import type { User } from 'firebase/auth'
import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
} from 'firebase/firestore'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuthContext } from '@/src/app/context/auth'
import { firebaseApp } from '@/src/app/firebase'
import { BookableTableConverter } from '@/src/app/models/BookableTableModel'
import {
  RestaurantConverter,
  RestaurantType,
} from '@/src/app/models/RestaurantModel'

export const useRestaurant = () => {
  const params = useParams()
  const authContext = useAuthContext()
  const [user, setUser] = useState<User>()
  const [restaurantId, setRestaurantId] = useState('')
  const [restaurant, setRestaurant] = useState<RestaurantType>()

  useEffect(() => {
    const id = params.id
    if (typeof id === 'string') setRestaurantId(id)
  }, [params])

  useEffect(() => {
    if (authContext.user) setUser(authContext.user)
  }, [authContext.user])

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (user?.uid && restaurantId !== '') {
        const db = getFirestore(firebaseApp)
        const docRef = doc(db, collectionName, restaurantId).withConverter(
          RestaurantConverter,
        )
        const docSnapshot = await getDoc(docRef)
        const restaurant = docSnapshot.data()
        const bookableTableCollection = collection(
          docSnapshot.ref,
          'bookable_tables',
        ).withConverter(BookableTableConverter)
        const bookableTableSnapshot = await getDocs(bookableTableCollection)
        const bookableTables = bookableTableSnapshot.docs.map((doc) =>
          doc.data(),
        )
        if (!restaurant) throw new Error('restaurant is not found')

        setRestaurant({
          ...restaurant,
          bookableTables,
        })
      }
    })()
  }, [restaurantId, user?.uid])

  return {
    restaurantId,
    restaurant,
    user,
  }
}
