import RestroomFeatureT from "@/types/RestroomFeature";

export const findNearestRestroom = (userLocation: { latitude: number; longitude: number }, markers: RestroomFeatureT[]): RestroomFeatureT | null => {
    if (!userLocation || markers.length === 0) {
        return null;
    }

    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const getDistanceInMeters = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const earthRadius = 6371000;

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return earthRadius * c;
    };

    let nearestRestroom: RestroomFeatureT | null = null;
    let shortestDistance = Infinity;

    for (const marker of markers) {
        if (
            !marker?.geometry ||
            typeof marker.geometry.x !== 'number' ||
            typeof marker.geometry.y !== 'number'
        ) {
            continue;
        }

        const distance = getDistanceInMeters(
            userLocation.latitude,
            userLocation.longitude,
            marker.geometry.y,
            marker.geometry.x
        );

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestRestroom = marker;
        }
    }

    return nearestRestroom;

};