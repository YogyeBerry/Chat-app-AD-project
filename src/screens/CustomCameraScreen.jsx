import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CustomCameraScreen() {
  return (
    <View style={styles.container}>
      <Text>Custom Camera Screen Initialized</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
