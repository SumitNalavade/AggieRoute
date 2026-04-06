import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { RestroomFeatureT } from '@/types';

interface IDefaultModalProps {
    loading: boolean
    markers: RestroomFeatureT[]
    findNearestRestroom: () => void
}

const DefaultModal: React.FC<IDefaultModalProps> = ({ loading, markers, findNearestRestroom }) => {
    return (
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
                    onPress={findNearestRestroom}
                >
                    <Text style={{ color: 'white', fontWeight: '600' }}>
                        Find Nearest
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DefaultModal;