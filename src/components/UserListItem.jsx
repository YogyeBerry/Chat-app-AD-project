import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from './Avatar';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function UserListItem({
  user,
  onPress,
  isSelected = false,
  selectable = false,
}) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={() => onPress && onPress(user)}
      activeOpacity={0.7}
    >
      <Avatar name={user.name} uri={user.avatar} size={48} />
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {user.name}
        </Text>
        {user.email ? (
          <Text style={styles.email} numberOfLines={1}>
            {user.email}
          </Text>
        ) : null}
      </View>
      {selectable && (
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  selectedContainer: {
    backgroundColor: COLORS.primaryLight + '33',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
    justifyContent: 'center',
  },
  name: {
    fontSize: TYPOGRAPHY.title - 2,
    fontWeight: '600',
    color: COLORS.text,
  },
  email: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
});
