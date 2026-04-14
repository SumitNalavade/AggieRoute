import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { RestroomFeatureT } from '@/types';
import { COLORS } from '@/utils/colors';

interface IDefaultModalProps {
    loading: boolean
    markers: RestroomFeatureT[]
    findNearestRestroom: () => void
    favorites: RestroomFeatureT[]
    onSelectFavorite: (restroom: RestroomFeatureT) => void
    onReorderFavorites: (reordered: RestroomFeatureT[]) => void
}

const DefaultModal: React.FC<IDefaultModalProps> = ({ loading, markers, findNearestRestroom, favorites, onSelectFavorite, onReorderFavorites }) => {
    const renderFavoriteItem = ({ item, drag, isActive }: RenderItemParams<RestroomFeatureT>) => (
        <ScaleDecorator>
            <TouchableOpacity
                onPress={() => !isActive && onSelectFavorite(item)}
                onLongPress={drag}
                delayLongPress={150}
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: COLORS.lightGray,
                    gap: 8,
                    backgroundColor: isActive ? COLORS.lightGray : 'transparent',
                    borderRadius: isActive ? 8 : 0,
                }}
            >
                <MaterialIcons name="favorite" size={16} color="#E53935" />
                <Text style={{ fontSize: 14, flex: 1 }} numberOfLines={1}>
                    {item.attributes.Name ?? 'Accessible Restroom'}
                </Text>
                <MaterialIcons name="chevron-right" size={18} color={COLORS.darkGray} />
            </TouchableOpacity>
        </ScaleDecorator>
    );

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

            <Text style={{ fontSize: 14, color: COLORS.darkGray, marginBottom: 16 }}>
                {loading ? 'Loading...' : `${markers.length} locations`}
            </Text>

            {favorites.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Favorites
                    </Text>
                    <GestureHandlerRootView>
                        <DraggableFlatList
                            data={favorites}
                            keyExtractor={(item) => String(item.attributes.OBJECTID)}
                            renderItem={renderFavoriteItem}
                            onDragEnd={({ data }) => onReorderFavorites(data)}
                            style={{ maxHeight: 120 }}
                        />
                    </GestureHandlerRootView>
                </View>
            )}

            <View style={{ flexDirection: 'row', gap: 12 }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.black,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: 'center',
                    }}
                    onPress={findNearestRestroom}
                >
                    <Text style={{ color: COLORS.white, fontWeight: '600' }}>
                        Find Nearest
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default DefaultModal;