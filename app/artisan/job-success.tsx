import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";
import { THEME } from "../../constants/theme";

export default function JobSuccess() {
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(0)).current; // ✅ persists across renders

  useEffect(() => {
    // Animate scale bounce
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 80,
      useNativeDriver: true,
    }).start();

    // Auto redirect to Jobs tab after 3 seconds
    const timer = setTimeout(() => {
      router.push("/artisan/(tabs)/jobs");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, scaleAnim]); // ✅ stable dependencies

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.successCircle,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image
          source={require("../../assets/images/success.png")}
          style={styles.icon}
        />
      </Animated.View>

      <Text style={styles.title}>Job Completed!</Text>
      <Text style={styles.subtitle}>
        Great work! You’ve successfully completed this job.{"\n"}Payment will be
        processed shortly.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(28,140,75,0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    width: 70,
    height: 70,
    tintColor: THEME.colors.primary,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: THEME.colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: THEME.colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
});
