import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { THEME } from "../constants/theme";

type BarChartCardProps = {
  data: number[];
};

export default function BarChartCard({ data }: BarChartCardProps) {
  const screenWidth = Dimensions.get("window").width - THEME.spacing.lg * 2;
  const hasData = data && data.length > 0;

  // fallback dataset (for empty data)
  const chartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data: hasData ? data : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  return (
    <View style={[styles.container, styles.shadow]}>
      <Text style={styles.title}>Weekly Jobs Overview 📈</Text>

      {hasData ? (
        <BarChart
          style={styles.chart}
          data={chartData}
          width={screenWidth}
          height={220}
          yAxisLabel=""
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: THEME.colors.white,
            backgroundGradientFrom: THEME.colors.white,
            backgroundGradientTo: THEME.colors.white,
            decimalPlaces: 0,
            color: (opacity = 1) =>
              `rgba(147, 51, 234, ${opacity})`, // admin purple
            labelColor: (opacity = 1) =>
              `rgba(142, 142, 147, ${opacity})`, // muted text
            barPercentage: 0.6,
          }}
          verticalLabelRotation={0}
        />
      ) : (
        <View style={styles.noDataBox}>
          <Text style={styles.noDataText}>No chart data available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.radius.lg,
    padding: THEME.spacing.lg,
    marginTop: THEME.spacing.lg,
  },
  title: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: "700",
    color: THEME.colors.text,
    marginBottom: THEME.spacing.sm,
  },
  chart: {
    borderRadius: THEME.radius.md,
  },
  noDataBox: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.md,
  },
  noDataText: {
    color: THEME.colors.muted,
    fontSize: THEME.typography.sizes.base,
  },
  shadow: {
    shadowColor: "rgba(28,140,75,0.6)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
});
