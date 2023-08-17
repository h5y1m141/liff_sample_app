import {
  collection,
  getDocs,
  getDoc,
  doc,
  getFirestore,
} from 'firebase/firestore'

import { useEffect, useState } from 'react'

import { firebaseApp } from '@/src/app/firebase'
import { BookableTableConverter } from '@/src/app/models/BookableTableModel'
import {
  RestaurantConverter,
  RestaurantType,
} from '@/src/app/models/RestaurantModel'

export const useRestaurant = (restaurantId: string) => {
  const [restaurant, setRestaurant] = useState<RestaurantType>()

  useEffect(() => {
    ;(async () => {
      const collectionName = 'restaurants'

      if (restaurantId !== '') {
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
  }, [restaurantId])

  return {
    restaurant,
  }
}
