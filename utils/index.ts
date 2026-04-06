import { RestroomFeatureT } from "@/types";

export const getDistanceToRestroom = (userLocation: { latitude: number; longitude: number }, restroom: RestroomFeatureT): number | null => {
    if (
        !userLocation ||
        !restroom?.geometry ||
        typeof restroom.geometry.x !== "number" ||
        typeof restroom.geometry.y !== "number"
    ) {
        return null;
    }

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const earthRadiusMeters = 6371000;

    const dLat = toRadians(restroom.geometry.y - userLocation.latitude);
    const dLon = toRadians(restroom.geometry.x - userLocation.longitude);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(userLocation.latitude)) *
        Math.cos(toRadians(restroom.geometry.y)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceMeters = earthRadiusMeters * c;

    const miles = distanceMeters * 0.000621371;

    return miles;
};

export const findNearestRestroom = (userLocation: { latitude: number; longitude: number }, markers: RestroomFeatureT[]): RestroomFeatureT | null => {
    if (!userLocation || markers.length === 0) {
        return null;
    }

    let nearestRestroom: RestroomFeatureT | null = null;
    let shortestDistance = Infinity;

    for (const marker of markers) {
        const distance = getDistanceToRestroom(userLocation, marker);

        if (distance === null) continue;

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestRestroom = marker;
        }
    }

    if (!nearestRestroom) {
        return null;
    }

    return nearestRestroom;
};