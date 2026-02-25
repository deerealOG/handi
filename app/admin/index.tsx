import { Redirect } from "expo-router";

export default function AdminRootRedirect() {
  return <Redirect href="/admin/(tabs)" />;
}
