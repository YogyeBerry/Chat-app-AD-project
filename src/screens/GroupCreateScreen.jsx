import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function GroupCreateScreen() {
  return (
    <View style={styles.container}>
      <Text>Group Create Screen Initialized</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
