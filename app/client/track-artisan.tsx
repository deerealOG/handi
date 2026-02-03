import { useAppTheme } from "@/hooks/use-app-theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { THEME } from "../../constants/theme";

const { width, height } = Dimensions.get("window");

export default function TrackArtisanScreen() {
    const router = useRouter();
    const { colors } = useAppTheme();
    const params = useLocalSearchParams();
    const { artisan, skill, id } = params;

    // Mock Artisan Location (Lagos, Nigeria coordinates roughly)
    const [artisanLocation, setArtisanLocation] = useState({
        latitude: 6.5244,
        longitude: 3.3792,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    // Mock User Location
    const [userLocation, setUserLocation] = useState({
        latitude: 6.5200,
        longitude: 3.3750,
    });

    const [arrivalTime, setArrivalTime] = useState("15 mins");

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.text === '#FFFFFF' ? "light-content" : "dark-content"} />

            {/* Map View */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={artisanLocation}
            >
                <Marker
                    coordinate={artisanLocation}
                    title={typeof artisan === 'string' ? artisan : "Professional"}
                    description="Current Location"
                >
                    <View style={styles.markerContainer}>
                        <Image
                            source={require("../../assets/images/profileavatar.png")}
                            style={[styles.markerImage, { borderColor: colors.primary }]}
                        />
                        <View style={[styles.markerArrow, { borderBottomColor: colors.primary }]} />
                    </View>
                </Marker>

                <Marker
                    coordinate={userLocation}
                    title="You"
                    pinColor={colors.primary}
                />
            </MapView>

            {/* Header / Back Button */}
            <SafeAreaView style={styles.headerContainer}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: colors.surface }]}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
            </SafeAreaView>

            {/* Bottom Sheet Info */}
            <View style={[styles.bottomSheet, { backgroundColor: colors.surface }]}>
                <View style={[styles.handle, { backgroundColor: colors.border }]} />

                {/* Status Header */}
                <View style={styles.statusHeader}>
                    <View>
                        <Text style={[styles.statusTitle, { color: colors.text }]}>Professional is on the way</Text>
                        <Text style={[styles.statusSubtitle, { color: colors.muted }]}>Arriving in {arrivalTime}</Text>
                    </View>
                    <View style={[styles.statusIconContainer, { backgroundColor: colors.successLight }]}>
                        <MaterialIcons name="delivery-dining" size={24} color={colors.primary} />
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                {/* Artisan Profile */}
                <View style={styles.artisanProfile}>
                    <Image
                        source={require("../../assets/images/profileavatar.png")}
                        style={styles.avatar}
                    />
                    <View style={styles.artisanInfo}>
                        <Text style={[styles.artisanName, { color: colors.text }]}>{artisan || "Professional Name"}</Text>
                        <Text style={[styles.artisanSkill, { color: colors.muted }]}>{skill || "Professional"}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={14} color={colors.star} />
                            <Text style={[styles.ratingText, { color: colors.text }]}>4.8 (120 reviews)</Text>
                        </View>
                    </View>

                    {/* Communication Buttons */}
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.primaryLight }]}>
                            <Ionicons name="call" size={20} color={colors.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.iconButton, { backgroundColor: colors.primaryLight }]}
                            onPress={() => router.push(`/client/chat/${id || '1'}` as any)}
                        >
                            <Ionicons name="chatbubble-ellipses" size={20} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Timeline / Progress */}
                <View style={styles.timelineContainer}>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                        <View style={[styles.timelineLine, { backgroundColor: colors.primary }]} />
                        <Text style={[styles.timelineText, { color: colors.primary }]}>Booking Confirmed</Text>
                    </View>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                        <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.timelineText, { color: colors.primary }]}>On the way</Text>
                    </View>
                    <View style={styles.timelineItem}>
                        <View style={[styles.timelineDot, { backgroundColor: colors.border }]} />
                        <Text style={[styles.timelineText, { color: colors.muted }]}>Arrived</Text>
                    </View>
                </View>

                {/* Cancel Button */}
                <TouchableOpacity style={[styles.cancelButton, { borderColor: colors.error, backgroundColor: colors.errorLight }]}>
                    <Text style={[styles.cancelButtonText, { color: colors.error }]}>Cancel Booking</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background,
    },
    map: {
        width: width,
        height: height,
    },
    headerContainer: {
        position: "absolute",
        top: Platform.OS === 'android' ? 40 : 20,
        left: 20,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: THEME.colors.surface,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        ...THEME.shadow.base,
    },
    markerContainer: {
        alignItems: 'center',
    },
    markerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: THEME.colors.primary,
    },
    markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: THEME.colors.primary,
        transform: [{ rotate: '180deg' }],
        marginTop: -2,
    },
    bottomSheet: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: THEME.colors.surface,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
        paddingBottom: 40,
        ...THEME.shadow.base,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: THEME.colors.border,
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20,
    },
    statusHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    statusTitle: {
        fontFamily: THEME.typography.fontFamily.heading,
        fontSize: THEME.typography.sizes.lg,
        color: THEME.colors.text,
        marginBottom: 4,
    },
    statusSubtitle: {
        fontFamily: THEME.typography.fontFamily.body,
        fontSize: THEME.typography.sizes.sm,
        color: THEME.colors.muted,
    },
    statusIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#F0FDF4", // Light green
        justifyContent: "center",
        alignItems: "center",
    },
    divider: {
        height: 1,
        backgroundColor: THEME.colors.border,
        marginBottom: 20,
    },
    artisanProfile: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
    },
    artisanInfo: {
        flex: 1,
    },
    artisanName: {
        fontFamily: THEME.typography.fontFamily.heading,
        fontSize: THEME.typography.sizes.md,
        color: THEME.colors.text,
        marginBottom: 2,
    },
    artisanSkill: {
        fontFamily: THEME.typography.fontFamily.body,
        fontSize: THEME.typography.sizes.sm,
        color: THEME.colors.muted,
        marginBottom: 4,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    ratingText: {
        fontFamily: THEME.typography.fontFamily.body,
        fontSize: 12,
        color: THEME.colors.text,
    },
    actionButtons: {
        flexDirection: "row",
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#F3F4F6",
        justifyContent: "center",
        alignItems: "center",
    },
    timelineContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    timelineItem: {
        alignItems: 'center',
        flex: 1,
    },
    timelineDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: THEME.colors.border,
        marginBottom: 8,
        zIndex: 1,
    },
    activeDot: {
        backgroundColor: THEME.colors.primary,
    },
    timelineLine: {
        position: 'absolute',
        top: 5,
        left: '50%',
        width: '100%',
        height: 2,
        backgroundColor: THEME.colors.border,
        zIndex: 0,
    },
    activeLine: {
        backgroundColor: THEME.colors.primary,
    },
    timelineText: {
        fontFamily: THEME.typography.fontFamily.body,
        fontSize: 10,
        color: THEME.colors.muted,
        textAlign: 'center',
    },
    activeText: {
        color: THEME.colors.primary,
        fontFamily: THEME.typography.fontFamily.subheading,
    },
    cancelButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: THEME.colors.error,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: THEME.colors.error,
        fontFamily: THEME.typography.fontFamily.subheading,
        fontSize: THEME.typography.sizes.sm,
    }
});
