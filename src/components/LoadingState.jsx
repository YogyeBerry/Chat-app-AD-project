import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function LoadingState({ message = 'Loading...' }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
});
