import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DraggableFlatList, {
    RenderItemParams,
    ScaleDecorator,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { RestroomFeatureT } from "@/types";
import { COLORS } from "@/utils/constants";

interface IDefaultModalProps {
    loading: boolean;
    markers: RestroomFeatureT[];
    findNearestRestroom: () => void;
    favorites: RestroomFeatureT[];
    onSelectFavorite: (restroom: RestroomFeatureT) => void;
    onReorderFavorites: (reordered: RestroomFeatureT[]) => void;
}

const DefaultModal: React.FC<IDefaultModalProps> = ({
    loading,
    markers,
    findNearestRestroom,
    favorites,
    onSelectFavorite,
    onReorderFavorites,
}) => {
    const renderFavoriteItem = ({
        item,
        drag,
        isActive,
    }: RenderItemParams<RestroomFeatureT>) => (
        <ScaleDecorator>
            <TouchableOpacity
                onPress={() => !isActive && onSelectFavorite(item)}
                onLongPress={drag}
                delayLongPress={150}
                activeOpacity={0.9}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    marginBottom: 6,
                    backgroundColor: isActive ? "#F3F4F6" : COLORS.white,
                    gap: 10,
                    shadowColor: isActive ? "#000" : "transparent",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isActive ? 0.12 : 0,
                    shadowRadius: 6,
                    elevation: isActive ? 3 : 0,
                }}
            >
                <MaterialIcons name="drag-indicator" size={18} color={COLORS.darkGray} />

                <MaterialIcons name="favorite" size={16} color="#E53935" />

                <Text style={{ fontSize: 14, flex: 1 }} numberOfLines={1}>
                    {item.attributes.Name ?? "Accessible Restroom"}
                </Text>

                <MaterialIcons name="chevron-right" size={18} color={COLORS.darkGray} />
            </TouchableOpacity>
        </ScaleDecorator>
    );

    return (
        <View
            style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 24,
                backgroundColor: "white",
                borderRadius: 20,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
            }}
        >
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 4 }}>
                Accessible Restrooms
            </Text>

            <Text style={{ fontSize: 14, color: COLORS.darkGray, marginBottom: 16 }}>
                {loading ? "Loading..." : `${markers.length} locations`}
            </Text>

            {favorites.length > 0 && (
                <View style={{ marginBottom: 16 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: 8,
                        }}
                    >
                        <Text style={{ fontSize: 14, fontWeight: "600" }}>Favorites</Text>
                    </View>

                    <GestureHandlerRootView>
                        <DraggableFlatList
                            data={favorites}
                            keyExtractor={(item) => String(item.attributes.OBJECTID)}
                            renderItem={renderFavoriteItem}
                            onDragEnd={({ data }) => onReorderFavorites(data)}
                            activationDistance={8}
                            containerStyle={{ maxHeight: 160 }}
                        />
                    </GestureHandlerRootView>
                </View>
            )}

            <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.black,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                    onPress={findNearestRestroom}
                >
                    <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                        Find Nearest
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DefaultModal;