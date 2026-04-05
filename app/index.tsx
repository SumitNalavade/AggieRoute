import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

import RestroomFeature from '@/types/RestroomFeature';

export default function HomeScreen() {
  const [markers, setMarkers] = useState<RestroomFeature[]>([]);
  const [region, setRegion] = useState<any>(null);

  const [loading, setLoading] = useState(true);

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

        // 📍 Fetch restroom data
        const res = await fetch(
          'https://gis.tamu.edu/arcgis/rest/services/FCOR/MapInfo_20190529/MapServer/1/query?where=1%3D1&outFields=*&returnGeometry=true&outSR=4326&f=json'
        );

        const data = await res.json();

        setMarkers(
          (data.features || []).filter(
            (f: RestroomFeature) =>
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

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 24,
          backgroundColor: 'white',
          borderRadius: 20,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 4 }}>
          Accessible Restrooms
        </Text>

        <Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          {loading ? 'Loading...' : `${markers.length} locations`}
        </Text>

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#111',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600' }}>
              Find Nearest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: '#f2f2f2',
              paddingVertical: 14,
              borderRadius: 12,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#111', fontWeight: '600' }}>
              Filter
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}