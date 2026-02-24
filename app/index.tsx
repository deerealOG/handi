import { Redirect } from "expo-router";
import { Platform } from "react-native";

export default function Index() {
  // Web users go directly to landing page, mobile app users go to splash/onboarding
  if (Platform.OS === "web") {
    return <Redirect href="/landing" />;
  }
  return <Redirect href="/splash" />;
}
