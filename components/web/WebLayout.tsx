// components/web/WebLayout.tsx
// Main web layout wrapper with sidebar and header

import { useAppTheme } from "@/hooks/use-app-theme";
import React, { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { Sidebar } from "./Sidebar";
import { WebHeader } from "./WebHeader";

// Only render on web - return children directly on mobile
if (Platform.OS !== "web") {
  module.exports = {
    WebLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
}

interface WebLayoutProps {
  children: React.ReactNode;
  title?: string;
  showSearch?: boolean;
  scrollable?: boolean;
}

export function WebLayout({
  children,
  title = "Dashboard",
  showSearch = true,
  scrollable = true,
}: WebLayoutProps) {
  const { colors } = useAppTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentWrapperProps = scrollable
    ? {
        style: [styles.scrollContent, { backgroundColor: colors.background }],
        contentContainerStyle: styles.scrollContentContainer,
        showsVerticalScrollIndicator: false,
      }
    : {
        style: [styles.content, { backgroundColor: colors.background }],
      };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <View style={styles.mainArea}>
        {/* Header */}
        <WebHeader title={title} showSearch={showSearch} />

        {/* Content */}
        <ContentWrapper {...contentWrapperProps}>{children}</ContentWrapper>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    height: "100%",
  },
  mainArea: {
    flex: 1,
    flexDirection: "column",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: 24,
    paddingBottom: 48,
  },
});

export default WebLayout;
