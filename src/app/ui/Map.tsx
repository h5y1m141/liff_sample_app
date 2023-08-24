'use client'

import { LatLngExpression } from 'leaflet'
import { FC } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import './Map.css'

const ComponentResize = () => {
  const map = useMap()

  setTimeout(() => {
    map.invalidateSize()
  }, 0)

  return null
}

export const Map: FC = () => {
  const latitude = 35.658581
  const longitude = 139.745433
  const initialZoomLevel = 13
  const position: LatLngExpression = [latitude, longitude]

  // NOTE
  // 以下のようにdivのstyleで適切な幅などを設定しないと地図内のタイルが部分的にしか表示されない
  // https://github.com/PaulLeCam/react-leaflet/issues/1052#issuecomment-1586217255
  return (
    <div
      style={{
        maxWidth: '75vw',
        height: 600,
      }}
    >
      <MapContainer
        style={{
          height: '100%',
          width: '100%',
        }}
        zoom={initialZoomLevel}
        center={position}
      >
        <ComponentResize />
        <ScaleControl position='bottomright' imperial={false} />
        <ZoomControl position='bottomright' />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  )
}
