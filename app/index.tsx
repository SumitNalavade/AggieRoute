import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import DefaultModal from '@/components/DefaultModal';
import SelectedRestroomModal from '@/components/SelectedRestroomModal';
import { RestroomFeatureT, RegionT } from '@/types';

import { findNearestRestroom } from '@/utils';

export default function HomeScreen() {
  const [markers, setMarkers] = useState<RestroomFeatureT[]>([]);
  const [region, setRegion] = useState<RegionT | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedRestroom, setSelectedRestroom] = useState<null | RestroomFeatureT>(null);

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

  const onFindNearestLocation = () => {
    if (!region) {
      throw new Error("Error finding nearest accessible restroom location");
    }

    const nearestRestroom = findNearestRestroom(region, markers );

    setSelectedRestroom(nearestRestroom)
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
      >
        {markers.map((feature) => (
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
          >
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
          </Marker>
        ))}
      </MapView>

      {selectedRestroom ? (
        <SelectedRestroomModal restroom={selectedRestroom} onClose={() => setSelectedRestroom(null)} />
      ) : (
        <DefaultModal loading={loading} markers={markers} findNearestRestroom={onFindNearestLocation} />
      )}

    </SafeAreaView>
  );
}