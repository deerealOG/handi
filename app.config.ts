import "dotenv/config";
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const mapsKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  const useMockEnv = process.env.EXPO_PUBLIC_USE_MOCK;
  const useMock =
    typeof useMockEnv === "string"
      ? useMockEnv.trim().toLowerCase() === "true"
      : !apiUrl; // default to mock when no API URL is supplied

  return {
    ...config,
    name: "HANDI",
    slug: "HANDI",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "handi",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      ...config.ios,
      supportsTablet: true,
      config: {
        googleMapsApiKey: mapsKey,
      },
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        backgroundColor: "#368951",
        foregroundImage: "./assets/images/handi-logo.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: mapsKey,
        },
      },
      package: "ng.com.handiapp",
    },
    web: {
      ...config.web,
      output: "static",
      favicon: "/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/handi-splash.png",
          resizeMode: "contain",
          backgroundColor: "#368951",
        },
      ],
      "expo-font",
      "expo-web-browser",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      ...config.extra,
      router: {},
      eas: {
        projectId: "7a15a2a7-238a-4cdd-be80-2a0f315f547f",
      },
      apiUrl,
      useMock,
    },
  };
};
