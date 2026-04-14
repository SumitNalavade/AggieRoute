import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import DefaultModal from '@/components/DefaultModal';
import SelectedRestroomModal from '@/components/SelectedRestroomModal';
import PinResultsModal from '@/components/PinResultsModal';
import { RestroomFeatureT, RegionT } from '@/types';

import { findNearestRestroom, findNearestN, getDistanceToRestroom, routeToRestroom } from '@/utils';

export default function HomeScreen() {
  const [markers, setMarkers] = useState<RestroomFeatureT[]>([]);
  const [region, setRegion] = useState<RegionT | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedRestroom, setSelectedRestroom] = useState<null | RestroomFeatureT>(null);
  const [selectedRestroomDistance, setSelectedRestroomDistance] = useState<number | null>(null);
  const [droppedPin, setDroppedPin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [pinResults, setPinResults] = useState<{ restroom: RestroomFeatureT; distance: number }[]>([]);
  const [showPinModal, setShowPinModal] = useState(false);
  const pinModalTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMapMoving = useRef(false);

  useEffect(() => {
    const setup = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
          console.log('Location permission denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});

        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });

        const res = await fetch(
          'https://gis.tamu.edu/arcgis/rest/services/FCOR/MapInfo_20190529/MapServer/1/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=json'
        );

        const data = await res.json();

        setMarkers(
          (data.features || []).filter(
            (f: RestroomFeatureT) =>
              f?.geometry &&
              typeof f.geometry.x === 'number' &&
              typeof f.geometry.y === 'number'
          )
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    setup();
  }, []);

  useEffect(() => {
    if(!region || !selectedRestroom) return;

    const selectedRestroomDistance = getDistanceToRestroom(region, selectedRestroom)
    setSelectedRestroomDistance(selectedRestroomDistance)
  }, [selectedRestroom])

  const dropPin = (coord: { latitude: number; longitude: number }) => {
    if (pinModalTimeout.current) clearTimeout(pinModalTimeout.current);
    setShowPinModal(false);
    setDroppedPin(coord);
    setPinResults(findNearestN(coord, markers, 3));
    setSelectedRestroom(null);
    // Delay the modal so the native map has time to render the pin first
    pinModalTimeout.current = setTimeout(() => setShowPinModal(true), 400);
  };

  const onMapLongPress = (e: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    if (isMapMoving.current) return;
    dropPin(e.nativeEvent.coordinate);
  };

  const clearPin = () => {
    if (pinModalTimeout.current) clearTimeout(pinModalTimeout.current);
    setDroppedPin(null);
    setPinResults([]);
    setShowPinModal(false);
  };

  const onFindNearestLocation = () => {
    if (!region) {
      throw new Error("Error finding nearest accessible restroom location");
    }

    const nearestRestroom = findNearestRestroom(region, markers );
  
    if(!nearestRestroom) {
      return null;
    }
    
    setSelectedRestroom(nearestRestroom);
  }

  if (!region) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
        <Text>Getting your location...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView

        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onRegionChange={() => { isMapMoving.current = true; }}
        onRegionChangeComplete={() => { isMapMoving.current = false; }}
        onLongPress={onMapLongPress}
      >
        {droppedPin && (
          <Marker
            key={`pin-${droppedPin.latitude}-${droppedPin.longitude}`}
            coordinate={droppedPin}
            pinColor="#E53935"
          />
        )}

        {markers.map((feature) => {
          const pinRank = pinResults.findIndex(
            (r) => r.restroom.attributes.OBJECTID === feature.attributes.OBJECTID
          );
          const isTopThree = pinRank !== -1;

          return (
            <Marker
              key={feature.attributes.OBJECTID}
              coordinate={{
                latitude: feature.geometry.y,
                longitude: feature.geometry.x,
              }}
              title={feature.attributes.Name || 'Accessible Restroom'}
              description={
                feature.attributes.Notes?.replace(/<br\s*\/?>/gi, '\n') || 'No details available'
              }
              onPress={() => setSelectedRestroom(feature)}
              tracksViewChanges={pinResults.length > 0}
            >
              {isTopThree ? (
                <View
                  style={{
                    backgroundColor: '#1A73E8',
                    borderRadius: 999,
                    width: 28,
                    height: 28,
                    borderWidth: 2,
                    borderColor: 'white',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.3,
                    shadowRadius: 3,
                    elevation: 4,
                  }}
                >
                  <Text style={{ color: 'white', fontSize: 13, fontWeight: '700' }}>
                    {pinRank + 1}
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 999,
                    padding: 6,
                    borderWidth: 2,
                    borderColor: '#111',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialIcons name="accessible" size={12} color="#111" />
                </View>
              )}
            </Marker>
          );
        })}
      </MapView>

      {selectedRestroom ? (
        <SelectedRestroomModal restroom={selectedRestroom} distance={selectedRestroomDistance} onDirections={routeToRestroom} onClose={() => setSelectedRestroom(null)} />
      ) : droppedPin && showPinModal ? (
        <PinResultsModal results={pinResults} onSelect={setSelectedRestroom} onClose={clearPin} />
      ) : (
        <DefaultModal loading={loading} markers={markers} findNearestRestroom={onFindNearestLocation} />
      )}

    </SafeAreaView>
  );
}