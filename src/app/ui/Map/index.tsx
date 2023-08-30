'use client'

import { latLngToCell, cellToBoundary } from 'h3-js'
import L, { LatLngExpression } from 'leaflet'
import { FC } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
  ZoomControl,
  Polygon,
} from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import iconMarker from './marker-icon.png'

L.Icon.Default.mergeOptions({
  iconUrl: iconMarker,
})

type SummaryType = {
  restaurant_id: string
  count: number
  latitude: number
  longitude: number
  reserved_at: any
}
type Props = {
  latitude: number
  longitude: number
  isCellLayerVisible: boolean
  summaries?: SummaryType[]
}

type CellLayerProps = Omit<Props, 'isCellLayerVisible'>

const generateCoordinates = (start: number, count: number) =>
  Array.from({ length: count }, (_, i) => start + 0.01 * i)

const CellLayer: FC<CellLayerProps> = ({ latitude, longitude, summaries }) => {
  const latitudes = generateCoordinates(latitude, 4)
  const longitudes = generateCoordinates(longitude, 4)

  const sampleLatLngs = latitudes.flatMap((lat) =>
    longitudes.map((lng) => [lat, lng]),
  )
  const latLngs = summaries?.map((summary) => {
    return [summary.latitude, summary.longitude]
  })
  console.info('sampleLatLngs', sampleLatLngs)
  console.info('latLngs', latLngs)
  const hexBoundaries = latLngs?.map(([lat, lng]) => {
    const h3Index = latLngToCell(lat, lng, 9)
    return cellToBoundary(h3Index)
  })
  console.info('hexBoundaries', hexBoundaries)
  // const hexBoundaries = sampleLatLngs.map(([lat, lng]) => {
  //   const h3Index = latLngToCell(lat, lng, 8)
  //   return cellToBoundary(h3Index)
  // })

  return (
    <>
      {hexBoundaries &&
        hexBoundaries.map((hexBoundary, index) => {
          return (
            <>
              <Polygon
                key={index}
                positions={hexBoundary.map((coord) => [coord[0], coord[1]])}
                fillColor='red'
                fillOpacity={0.5}
              />
            </>
          )
        })}
    </>
  )
}

export const Map: FC<Props> = ({
  latitude,
  longitude,
  isCellLayerVisible,
  summaries,
}) => {
  const initialZoomLevel = 14
  const position: LatLngExpression = [latitude, longitude]

  // NOTE
  // 以下のようにdivのstyleで適切な幅などを設定しないと地図内のタイルが部分的にしか表示されない
  // https://github.com/PaulLeCam/react-leaflet/issues/1052#issuecomment-1586217255
  return (
    <div
      id='mapid'
      style={{
        maxWidth: '75vw',
        height: 400,
      }}
    >
      <MapContainer
        style={{
          width: '100%',
          height: '100%',
        }}
        zoom={initialZoomLevel}
        center={position}
      >
        {isCellLayerVisible && (
          <CellLayer
            latitude={latitude}
            longitude={longitude}
            summaries={summaries}
          />
        )}
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
