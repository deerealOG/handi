import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { THEME } from '../../constants/theme';

export default function TransactionReceipt() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Transaction Receipt</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.colors.background,
  },
  text: {
    color: THEME.colors.text,
    fontSize: 18,
  },
});
