import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ErrorState({
  message = 'An unexpected error occurred.',
  onRetry = null,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={56} color={COLORS.error} />
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  message: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: SPACING.xs,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: TYPOGRAPHY.body,
  },
});
