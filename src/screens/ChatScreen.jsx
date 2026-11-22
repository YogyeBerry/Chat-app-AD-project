import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { conversationService } from '../services/conversationService';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const { conversation: initialConversation, participant } = route.params || {};

  const [conversation, setConversation] = useState(initialConversation || null);
  const [initLoading, setInitLoading] = useState(!initialConversation && Boolean(participant));
  const [error, setError] = useState(null);

  // Initialize or fetch conversation if only participant was supplied
  const initDirectConversation = useCallback(async () => {
    if (conversation) return;
    if (!participant) return;

    setInitLoading(true);
    setError(null);
    try {
      // Create or retrieve 1-to-1 conversation with participant
      const newConv = await conversationService.createConversation(
        baseUrl,
        {
          participant_ids: [participant.id],
          is_group: false,
        },
        currentUser?.id
      );
      setConversation(newConv);
      navigation.setOptions({
        title: newConv.title || participant.name,
      });
    } catch (err) {
      // In case server requires existing conversation lookup, or fallback
      setError(err.message || 'Could not initiate conversation');
    } finally {
      setInitLoading(false);
    }
  }, [baseUrl, participant, currentUser, conversation, navigation]);

  useEffect(() => {
    if (!conversation && participant) {
      initDirectConversation();
    }
  }, [conversation, participant, initDirectConversation]);

  if (initLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.initText}>Starting conversation with {participant?.name}...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Conversation Active: {conversation?.id ? conversation.id : 'Pending'}
      </Text>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  initText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  infoText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
  errorText: {
    marginTop: SPACING.sm,
    color: COLORS.error,
    fontSize: TYPOGRAPHY.caption,
  },
});
