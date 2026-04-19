type LngLat = { lng: number; lat: number };

export function circlePolygonGeoJson(center: LngLat, radiusMiles: number, steps = 64) {
  const radiusKm = radiusMiles * 1.609344;
  const earthRadiusKm = 6371.0088;
  const angularDistance = radiusKm / earthRadiusKm;

  const toRad = (value: number) => (value * Math.PI) / 180;
  const toDeg = (value: number) => (value * 180) / Math.PI;

  const lat1 = toRad(center.lat);
  const lng1 = toRad(center.lng);

  const coords: [number, number][] = [];

  for (let i = 0; i <= steps; i += 1) {
    const bearing = (2 * Math.PI * i) / steps;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(angularDistance) +
        Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
    );

    const lng2 =
      lng1 +
      Math.atan2(
        Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
        Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
      );

    coords.push([toDeg(lng2), toDeg(lat2)]);
  }

  return {
    type: "Feature" as const,
    properties: {
      radiusMiles,
    },
    geometry: {
      type: "Polygon" as const,
      coordinates: [coords],
    },
  };
}
