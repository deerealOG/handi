// components/common/ErrorBoundary.tsx
// Error boundary for catching render errors

import { useAppTheme } from "@/hooks/use-app-theme";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { Component, ReactNode } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { THEME } from "../../constants/theme";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorFallback onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

// Functional fallback component
function ErrorFallback({ onRetry }: { onRetry: () => void }) {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Icon name="alert-circle-outline" size={64} color={THEME.colors.error} />
      <Text style={[styles.title, { color: colors.text }]}>
        Something went wrong
      </Text>
      <Text style={[styles.message, { color: colors.muted }]}>
        We encountered an unexpected error. Please try again.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: THEME.spacing.xl,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontFamily: THEME.typography.fontFamily.heading,
    marginTop: THEME.spacing.lg,
    marginBottom: THEME.spacing.sm,
  },
  message: {
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.body,
    textAlign: "center",
    marginBottom: THEME.spacing.xl,
  },
  retryButton: {
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: THEME.spacing.md,
    borderRadius: THEME.radius.pill,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: THEME.typography.sizes.base,
    fontFamily: THEME.typography.fontFamily.subheading,
  },
});

export default ErrorBoundary;
