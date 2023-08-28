import React from 'react'

import { Map } from '../../../ui/Map'
import { Restaurant } from './Restaurant'

async function Page() {
  return (
    <>
      <Restaurant />
      <Map
        latitude={35.658581}
        longitude={139.745433}
        isCellLayerVisible={false}
      />
    </>
  )
}
export default Page
