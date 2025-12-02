import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { THEME } from "../constants/theme";

const { width } = Dimensions.get("window");

interface ToastProps {
  visible: boolean;
  message: string;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
}

export default function Toast({ visible, message, type = "info", onDismiss }: ToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const [show, setShow] = useState(visible);

  useEffect(() => {
    if (visible) {
      setShow(true);
      Animated.spring(translateY, {
        toValue: 50, // Top margin
        useNativeDriver: true,
        friction: 5,
      }).start();

      // Auto dismiss after 3 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      handleDismiss();
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShow(false);
      onDismiss();
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy < 0) {
          translateY.setValue(50 + gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -20) {
          handleDismiss();
        } else {
          Animated.spring(translateY, {
            toValue: 50,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case "success": return "checkmark-circle";
      case "error": return "alert-circle";
      default: return "information-circle";
    }
  };

  const getColor = () => {
    switch (type) {
      case "success": return THEME.colors.success;
      case "error": return THEME.colors.error;
      default: return THEME.colors.primary;
    }
  };

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <View style={[styles.iconContainer, { backgroundColor: getColor() }]}>
        <Ionicons name={getIcon()} size={24} color="white" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{type.charAt(0).toUpperCase() + type.slice(1)}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
      <TouchableOpacity onPress={handleDismiss}>
        <Ionicons name="close" size={20} color={THEME.colors.muted} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 2,
  },
  message: {
    fontSize: 12,
    color: "#6B7280",
  },
});
