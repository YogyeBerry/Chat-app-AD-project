import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConversationsScreen() {
  return (
    <View style={styles.container}>
      <Text>Conversations Screen Initialized</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
