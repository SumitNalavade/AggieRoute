import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <MapView
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        initialRegion={{
          latitude: 30.6153,
          longitude: -96.3411,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{
            latitude: 30.6153,
            longitude: -96.3411,
          }}
          title="Accessible Restroom"
          description="Closest available restroom"
        />
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
          Nearest Restroom
        </Text>

        <Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          Evans Library • 2 min away
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
              Start Route
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
              Details
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}