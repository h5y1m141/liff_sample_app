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
