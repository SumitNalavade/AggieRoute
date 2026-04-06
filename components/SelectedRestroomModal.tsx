import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { RestroomFeatureT } from "@/types";

interface ISelectedRestroomModalProps {
    restroom: RestroomFeatureT;
    distance: number | null;
    onClose: () => void;
    onDirections: (restroom: RestroomFeatureT) => any;
}

const SelectedRestroomModal: React.FC<ISelectedRestroomModalProps> = ({ restroom, distance, onClose, onDirections }) => {
    const name = restroom.attributes?.Name || "Accessible Restroom";
    const notes = restroom.attributes?.Notes?.replace(/<br\s*\/?>/gi, "\n") || "No additional details available.";

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
                        <Text style={{ fontSize: 14, color: "#666" }}>
                            { distance.toFixed(2) } mi away
                        </Text>
                    )}
                </View>

                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18,
                        backgroundColor: "#f2f2f2",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <MaterialIcons name="close" size={20} color="#111" />
                </TouchableOpacity>
            </View>

            <Text
                style={{
                    fontSize: 14,
                    color: "#666",
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
                        backgroundColor: "#111",
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "white", fontWeight: "600" }}>
                        Directions
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onClose}
                    style={{
                        flex: 1,
                        backgroundColor: "#f2f2f2",
                        paddingVertical: 14,
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#111", fontWeight: "600" }}>
                        Back
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SelectedRestroomModal;