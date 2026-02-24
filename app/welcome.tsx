// app/welcome.tsx
import { Button } from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInUp,
} from "react-native-reanimated";
import { THEME } from "../constants/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { setGuestMode } = useAuth();
  const [showLoginPicker, setShowLoginPicker] = useState(false);

  const USER_TYPES = [
    {
      label: "🔧  I need a service",
      type: "client",
      route: "/auth/register-client",
    },
    {
      label: "💼  I provide services",
      type: "artisan",
      route: "/auth/register-artisan",
    },
    {
      label: "🏢  I run a business",
      type: "business",
      route: "/auth/register-business",
    },
  ];

  const LOGIN_TYPES = [
    { label: "👤  Client", type: "client", icon: "person-outline" },
    { label: "💼  Provider", type: "artisan", icon: "construct-outline" },
    { label: "🏢  Business", type: "business", icon: "business-outline" },
    { label: "🔑  Admin", type: "admin", icon: "shield-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {/* Decorative blob */}
      <Animated.View
        entering={FadeIn.duration(1200)}
        style={[styles.decorBlob, { backgroundColor: colors.primary }]}
      />

      {/* Content */}
      <View style={styles.contentContainer}>
        <Animated.View entering={FadeInDown.duration(800)}>
          <Image
            source={require("../assets/images/handi-logo-light.png")}
            style={styles.handIcon}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(300).duration(800)}>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Connect with nearby service providers and professionals around you.
          </Text>
        </Animated.View>

        {/* Register buttons */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(800)}
          style={styles.buttonGroup}
        >
          {USER_TYPES.map((item) => (
            <Button
              key={item.type}
              label={item.label}
              onPress={() => router.push(item.route as any)}
              variant="outline"
            />
          ))}
        </Animated.View>

        {/* Browse as Guest */}
        <Animated.View entering={FadeIn.delay(700).duration(800)}>
          <TouchableOpacity
            onPress={() => {
              setGuestMode(true);
              router.replace("/client" as any);
            }}
          >
            <Text style={[styles.guestText, { color: colors.muted }]}>
              Browse as{" "}
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: THEME.typography.fontFamily.subheading,
                }}
              >
                Guest
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Footer — Log In with type picker */}
      <Animated.View
        entering={FadeIn.delay(900).duration(800)}
        style={styles.footer}
      >
        <Text
          style={[styles.loginText, { color: colors.muted }]}
          onPress={() => setShowLoginPicker(true)}
        >
          Already have an account?{" "}
          <Text
            style={{
              color: colors.primary,
              fontFamily: THEME.typography.fontFamily.subheading,
            }}
          >
            Log In
          </Text>
        </Text>
      </Animated.View>

      {/* Login type picker modal */}
      <Modal visible={showLoginPicker} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Log in as...
            </Text>
            {LOGIN_TYPES.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[styles.modalOption, { borderColor: colors.border }]}
                onPress={() => {
                  setShowLoginPicker(false);
                  router.push({
                    pathname: "/auth/login" as any,
                    params: { type: item.type },
                  });
                }}
              >
                <Text style={[styles.modalOptionText, { color: colors.text }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowLoginPicker(false)}
              style={styles.modalCancel}
            >
              <Text style={[styles.modalCancelText, { color: colors.muted }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: THEME.spacing.lg,
    justifyContent: "center",
  },
  contentContainer: {
    alignItems: "center",
  },
  handIcon: {
    width: 120,
    height: 120,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing["2xl"],
    lineHeight: 24,
    paddingHorizontal: THEME.spacing.lg,
  },
  buttonGroup: {
    width: "100%",
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  guestText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center",
    marginTop: THEME.spacing.sm,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  loginText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
  },
  decorBlob: {
    position: "absolute" as const,
    top: -100,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    opacity: 0.08,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 340,
    borderRadius: THEME.radius.xl,
    padding: 24,
    ...THEME.shadow.float,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontFamily: THEME.typography.fontFamily.heading,
    textAlign: "center",
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    marginBottom: 10,
  },
  modalOptionText: {
    fontFamily: THEME.typography.fontFamily.subheading,
    fontSize: THEME.typography.sizes.base,
    textAlign: "center",
  },
  modalCancel: {
    paddingVertical: 12,
    marginTop: 4,
  },
  modalCancelText: {
    fontFamily: THEME.typography.fontFamily.body,
    fontSize: THEME.typography.sizes.sm,
    textAlign: "center",
  },
});
