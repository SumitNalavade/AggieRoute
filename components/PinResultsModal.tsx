import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { RestroomFeatureT } from "@/types";
import { COLORS } from "@/utils/colors";

interface IPinResultsModalProps {
    results: { restroom: RestroomFeatureT; distance: number }[];
    onSelect: (restroom: RestroomFeatureT) => void;
    onClose: () => void;
}

const PinResultsModal: React.FC<IPinResultsModalProps> = ({ results, onSelect, onClose }) => {
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
                    alignItems: "center",
                    marginBottom: 16,
                }}
            >
                <View>
                    <Text style={{ fontSize: 20, fontWeight: "700" }}>Nearest Restrooms</Text>
                    <Text style={{ fontSize: 14, color: COLORS.darkGray, marginTop: 2 }}>
                        3 closest to your pin
                    </Text>
                </View>

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

            <ScrollView showsVerticalScrollIndicator={false}>
                {results.map(({ restroom, distance }, index) => (
                    <TouchableOpacity
                        key={restroom.attributes.OBJECTID}
                        onPress={() => onSelect(restroom)}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            paddingVertical: 12,
                            borderBottomWidth: index < results.length - 1 ? 1 : 0,
                            borderBottomColor: COLORS.lightGray,
                            gap: 12,
                        }}
                    >
                        <View
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: 14,
                                backgroundColor: COLORS.black,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text style={{ color: COLORS.white, fontSize: 13, fontWeight: "700" }}>
                                {index + 1}
                            </Text>
                        </View>

                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 15, fontWeight: "600" }} numberOfLines={1}>
                                {restroom.attributes.Name ?? "Accessible Restroom"}
                            </Text>
                            <Text style={{ fontSize: 13, color: COLORS.darkGray, marginTop: 2 }}>
                                {distance.toFixed(2)} mi away
                            </Text>
                        </View>

                        <MaterialIcons name="chevron-right" size={20} color={COLORS.darkGray} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default PinResultsModal;
