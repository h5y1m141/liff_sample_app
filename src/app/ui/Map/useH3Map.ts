import {
  polygonToCells,
  cellToBoundary,
  cellArea,
  isValidCell,
  getResolution,
} from 'h3-js'
import L from 'leaflet'
import { useState } from 'react'

let map: any, hexLayer: any
type LngLatH3Bounds = [number, number][]

class GeoUtils {
  static EARTH_RADIUS_METERS = 6371000

  static radiansToDegrees(r: number): number {
    return (r * 180) / Math.PI
  }

  static degreesToRadians(d: number): number {
    return (d * Math.PI) / 180
  }

  static getDistanceOnEarthInMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const lat1Rad = GeoUtils.degreesToRadians(lat1)
    const lat2Rad = GeoUtils.degreesToRadians(lat2)
    const lonDelta = GeoUtils.degreesToRadians(lon2 - lon1)
    const x =
      Math.sin(lat1Rad) * Math.sin(lat2Rad) +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.cos(lonDelta)
    return (
      GeoUtils.EARTH_RADIUS_METERS * Math.acos(Math.max(Math.min(x, 1), -1))
    )
  }
}

const ZOOM_TO_H3_RES_CORRESPONDENCE = {
  5: 1,
  6: 2,
  7: 3,
  8: 3,
  9: 4,
  10: 5,
  11: 6,
  12: 6,
  13: 7,
  14: 8,
  15: 9,
  16: 9,
  17: 10,
  18: 10,
  19: 11,
  20: 11,
  21: 12,
  22: 13,
  23: 14,
  24: 15,
}

const H3_RES_TO_ZOOM_CORRESPONDENCE: any = {}
for (const [zoom, res] of Object.entries(ZOOM_TO_H3_RES_CORRESPONDENCE)) {
  H3_RES_TO_ZOOM_CORRESPONDENCE[res] = zoom
}

const getH3ResForMapZoom = (mapZoom) => {
  return (
    ZOOM_TO_H3_RES_CORRESPONDENCE[mapZoom] ?? Math.floor((mapZoom - 1) * 0.7)
  )
}

const h3BoundsToPolygon = (lngLatH3Bounds) => {
  lngLatH3Bounds.push(lngLatH3Bounds[0]) // "close" the polygon
  return lngLatH3Bounds
}

/**
 * Parse the current Query String and return its components as an object.
 */
// const parseQueryString = () => {
//   const queryString = window.location.search
//   const query = {}
//   const pairs = (
//     queryString[0] === '?' ? queryString.substr(1) : queryString
//   ).split('&')
//   for (let i = 0; i < pairs.length; i++) {
//     const pair = pairs[i].split('=')
//     query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
//   }
//   return query
// }

// const queryParams = parseQueryString()

const copyToClipboard = (text: string) => {
  const dummy = document.createElement('textarea')
  document.body.appendChild(dummy)
  dummy.value = text
  dummy.select()
  document.execCommand('copy')
  document.body.removeChild(dummy)
}

export function useH3Map() {
  const [searchH3Id, setSearchH3Id] = useState<string | undefined>()
  const [gotoLatLon, setGotoLatLon] = useState<string | undefined>()
  const [currentH3Res, setCurrentH3Res] = useState<number | undefined>()

  const computeAverageEdgeLengthInMeters = (
    vertexLocations: LngLatH3Bounds,
  ): number => {
    let totalLength = 0
    let edgeCount = 0
    for (let i = 1; i < vertexLocations.length; i++) {
      const [fromLat, fromLng] = vertexLocations[i - 1]
      const [toLat, toLng] = vertexLocations[i]
      const edgeDistance = GeoUtils.getDistanceOnEarthInMeters(
        fromLat,
        fromLng,
        toLat,
        toLng,
      )
      totalLength += edgeDistance
      edgeCount++
    }
    return totalLength / edgeCount
  }

  const updateMapDisplay = () => {
    if (hexLayer) {
      hexLayer.remove()
    }

    hexLayer = L.layerGroup().addTo(map)

    const zoom = map.getZoom()
    setCurrentH3Res(getH3ResForMapZoom(zoom))
    const { _southWest: sw, _northEast: ne } = map.getBounds()

    const boundsPolygon = [
      [sw.lat, sw.lng],
      [ne.lat, sw.lng],
      [ne.lat, ne.lng],
      [sw.lat, ne.lng],
      [sw.lat, sw.lng],
    ]

    if (!currentH3Res) return

    const h3s = polygonToCells(boundsPolygon, currentH3Res)

    for (const h3id of h3s) {
      const polygonLayer = L.layerGroup().addTo(hexLayer)

      const isSelected = h3id === searchH3Id

      const style = isSelected ? { fillColor: 'orange' } : {}

      const h3Bounds = cellToBoundary(h3id)
      const averageEdgeLength = computeAverageEdgeLengthInMeters(h3Bounds)
      const area = cellArea(h3id, 'm2')

      const tooltipText = `
      Cell ID: <b>${h3id}</b>
      <br />
      Average edge length (m): <b>${averageEdgeLength.toLocaleString()}</b>
      <br />
      Cell area (m^2): <b>${area.toLocaleString()}</b>
      `

      const h3Polygon = L.polygon(h3BoundsToPolygon(h3Bounds), style)
        .on('click', () => copyToClipboard(h3id))
        .bindTooltip(tooltipText)
        .addTo(polygonLayer)

      // less SVG, otherwise perf is bad
      if (Math.random() > 0.8 || isSelected) {
        var svgElement = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'svg',
        )
        svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svgElement.setAttribute('viewBox', '0 0 200 200')
        svgElement.innerHTML = `<text x="20" y="70" class="h3Text">${h3id}</text>`
        var svgElementBounds = h3Polygon.getBounds()
        L.svgOverlay(svgElement, svgElementBounds).addTo(polygonLayer)
      }
    }
  }

  const gotoLocation = () => {
    const [lat, lon] = (gotoLatLon || '').split(',').map(Number)
    if (
      Number.isFinite(lat) &&
      Number.isFinite(lon) &&
      lat <= 90 &&
      lat >= -90 &&
      lon <= 180 &&
      lon >= -180
    ) {
      // Update map's view to the given coordinates ...
    }
  }

  const findH3 = () => {
    if (!searchH3Id || !isValidCell(searchH3Id)) {
      return
    }
    const h3Boundary = cellToBoundary(searchH3Id)

    let bounds = undefined

    for ([lat, lng] of h3Boundary) {
      if (bounds === undefined) {
        bounds = new L.LatLngBounds([lat, lng], [lat, lng])
      } else {
        bounds.extend([lat, lng])
      }
    }

    map.fitBounds(bounds)

    const newZoom = H3_RES_TO_ZOOM_CORRESPONDENCE[getResolution(searchH3Id)]
    map.setZoom(newZoom)
  }

  return {
    searchH3Id,
    setSearchH3Id,
    gotoLatLon,
    setGotoLatLon,
    currentH3Res,
    updateMapDisplay,
    gotoLocation,
    findH3,
  }
}
