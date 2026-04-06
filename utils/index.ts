import { RestroomFeatureT } from "@/types";
import { Linking, Platform } from "react-native";

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

export const routeToRestroom = (restroom: RestroomFeatureT) => {
    if (
        !restroom?.geometry ||
        typeof restroom.geometry.x !== "number" ||
        typeof restroom.geometry.y !== "number"
    ) {
        return;
    }

    const latitude = restroom.geometry.y;
    const longitude = restroom.geometry.x;

    const rawName =
        restroom.attributes?.Name?.trim() ||
        restroom.attributes?.BldgNum?.trim() ||
        "Accessible Restroom";

    const rawBuildingNumber = restroom.attributes?.BldgNum?.trim();

    const label = rawBuildingNumber && rawBuildingNumber !== rawName
        ? `${rawName} - ${rawBuildingNumber} Accessible Restroom`
        : `${rawName} Accessible Restroom`;

    const encodedLabel = encodeURIComponent(label);

    const url =
        Platform.OS === "ios"
            ? `http://maps.apple.com/?ll=${latitude},${longitude}&q=${encodedLabel}`
            : `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodedLabel})`;

    Linking.openURL(url);
};