import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { RestroomFeatureT } from "@/types";
import { COLORS } from "@/utils/colors";

interface ISelectedRestroomModalProps {
    restroom: RestroomFeatureT;
    distance: number | null;
    onClose: () => void;
    onDirections: (restroom: RestroomFeatureT) => any;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const SelectedRestroomModal: React.FC<ISelectedRestroomModalProps> = ({ restroom, distance, onClose, onDirections, isFavorite, onToggleFavorite }) => {
    const name = restroom.attributes?.Name || "Accessible Restroom";
    const notes = restroom.attributes?.Notes?.replace(/<br\s*\/?>/gi, "\n") || "No additional details available.";

    return (
        <View
            style={{
                position: "absolute",
                left: 16,
                right: 16,
                bottom: 24,
                backgroundColor: COLORS.white,
                borderRadius: 20,
                padding: 20,
                shadowColor: COLORS.shadowDark,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 12,
                elevation: 8,
            }}
        >
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 12,
                }}
            >
                <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 4 }}>
                        {name}
                    </Text>

                    {distance && (
                        <Text style={{ fontSize: 14, color: COLORS.darkGray }}>
                            { distance.toFixed(2) } mi away
                        </Text>
                    )}
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                    <TouchableOpacity
                        onPress={onToggleFavorite}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: COLORS.lightGray,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons
                            name={isFavorite ? "favorite" : "favorite-border"}
                            size={20}
                            color={isFavorite ? "#E53935" : COLORS.black}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onClose}
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 18,
                            backgroundColor: COLORS.lightGray,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MaterialIcons name="close" size={20} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>

            <Text
                style={{
                    fontSize: 14,
                    color: COLORS.darkGray,
                    marginBottom: 16,
                    lineHeight: 20,
                }}
            >
                {notes}
            </Text>

            <View style={{ flexDirection: "row", gap: 12 }}>
                <TouchableOpacity
                    onPress={() => onDirections(restroom)}
                    style={{
                        flex: 1,
                        backgroundColor: COLORS.black,
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: COLORS.white, fontWeight: "600" }}>
                        Directions
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SelectedRestroomModal;