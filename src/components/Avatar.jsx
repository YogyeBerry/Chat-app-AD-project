import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export default function Avatar({ name = 'U', uri = null, size = 44, isGroup = false }) {
  const initials = isGroup
    ? '👥'
    : name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase() || 'U';

  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: isGroup ? '#EEF2FF' : COLORS.avatarBg,
  };

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[styles.image, containerStyle]}
        accessibilityLabel={name}
      />
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.initials, { fontSize: size * 0.38, color: COLORS.avatarText }]}>
        {initials}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initials: {
    fontWeight: '700',
  },
});
