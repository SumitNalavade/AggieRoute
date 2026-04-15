import { useRef, useState } from "react";
import { RestroomFeatureT } from "@/types";
import { findNearestN } from "@/utils";
import * as Haptics from "expo-haptics";

type CoordinateT = {
    latitude: number;
    longitude: number;
};

type PinResultT = {
    restroom: RestroomFeatureT;
    distance: number;
};

export function useDroppedPin(
    markers: RestroomFeatureT[],
    onBeforeDrop?: () => void
) {
    const [droppedPin, setDroppedPin] = useState<CoordinateT | null>(null);
    const [pinResults, setPinResults] = useState<PinResultT[]>([]);
    const [showPinModal, setShowPinModal] = useState(false);

    const isMapMoving = useRef(false);
    const pinResultsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const modalTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimers = () => {
        if (pinResultsTimeout.current) clearTimeout(pinResultsTimeout.current);
        if (modalTimeout.current) clearTimeout(modalTimeout.current);
    };

    const dropPin = (coord: CoordinateT) => {
        setShowPinModal(false);
        setPinResults([]);
        setDroppedPin(coord);

        onBeforeDrop?.();

        requestAnimationFrame(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        });

        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setPinResults(findNearestN(coord, markers, 3));
            setShowPinModal(true);
        }, 30);
    };

    const onMapLongPress = (e: {
        nativeEvent: { coordinate: CoordinateT };
    }) => {
        if (isMapMoving.current) return;
        dropPin(e.nativeEvent.coordinate);
    };

    const clearPin = () => {
        clearTimers();
        setDroppedPin(null);
        setPinResults([]);
        setShowPinModal(false);
    };

    const onRegionChange = () => {
        isMapMoving.current = true;
    };

    const onRegionChangeComplete = () => {
        isMapMoving.current = false;
    };

    return {
        droppedPin,
        pinResults,
        showPinModal,
        clearPin,
        onMapLongPress,
        onRegionChange,
        onRegionChangeComplete,
    };
}