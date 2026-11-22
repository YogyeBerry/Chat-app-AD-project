import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { conversationService } from '../services/conversationService';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ChatScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const { conversation: initialConversation, participant } = route.params || {};

  const [conversation, setConversation] = useState(initialConversation || null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [initLoading, setInitLoading] = useState(!initialConversation && Boolean(participant));
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const flatListRef = useRef(null);
  const pollingTimerRef = useRef(null);

  // Configure navigation header title and info button
  useEffect(() => {
    navigation.setOptions({
      headerTitle: conversation?.title || participant?.name || 'Chat',
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ParticipantInfo', {
              conversation,
              participant,
            });
          }}
          style={styles.headerInfoBtn}
        >
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ),
    });
  }, [conversation, participant, navigation]);

  // Load message history for active conversation
  const loadMessages = useCallback(async (isRefresh = false, silent = false) => {
    if (!conversation?.id) return;
    if (isRefresh) setRefreshing(true);
    else if (!silent) setFetchingMessages(true);
    if (!silent) setError(null);

    try {
      const history = await conversationService.getMessages(
        baseUrl,
        conversation.id,
        currentUser?.id
      );
      setMessages(history);
      setError(null);
    } catch (err) {
      if (!silent) {
        setError(err.message || 'Failed to retrieve message history');
      }
    } finally {
      if (!silent) setFetchingMessages(false);
      setRefreshing(false);
    }
  }, [baseUrl, conversation?.id, currentUser?.id]);

  useEffect(() => {
    if (conversation?.id) {
      loadMessages();

      // Background message polling refresh mechanism (every 6 seconds)
      pollingTimerRef.current = setInterval(() => {
        loadMessages(false, true);
      }, 6000);
    }

    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [conversation?.id, loadMessages]);

  // Retry sending a previously failed message
  const handleRetryMessage = async (failedMsg) => {
    // Mark back to sending status
    setMessages((prev) =>
      prev.map((m) => (m.id === failedMsg.id ? { ...m, status: 'sending' } : m))
    );

    try {
      const sentMessage = await conversationService.sendMessage(
        baseUrl,
        {
          conversation_id: failedMsg.conversationId,
          content: failedMsg.content,
          media_url: failedMsg.mediaUrl || undefined,
        },
        currentUser?.id
      );

      setMessages((prev) =>
        prev.map((m) => (m.id === failedMsg.id ? { ...sentMessage, isMine: true } : m))
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m) => (m.id === failedMsg.id ? { ...m, status: 'failed' } : m))
      );
      Alert.alert('Retry Failed', err.message || 'Could not deliver message on retry.');
    }
  };

  // Handle sending text message with optimistic update
  const handleSendMessage = async () => {
    const textToSend = inputText.trim();
    if (!textToSend && !selectedImage) return;

    if (!conversation?.id) {
      Alert.alert('Conversation not ready', 'Please wait until conversation initializes.');
      return;
    }

    const tempId = `temp_${Date.now()}`;
    const optimisticMessage = {
      id: tempId,
      conversationId: conversation.id,
      senderId: currentUser?.id,
      senderName: currentUser?.name || 'You',
      content: textToSend,
      mediaUrl: selectedImage?.uri || null,
      createdAt: new Date().toISOString(),
      isMine: true,
      status: 'sending',
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputText('');
    setSending(true);

    try {
      const sentMessage = await conversationService.sendMessage(
        baseUrl,
        {
          conversation_id: conversation.id,
          content: textToSend,
          media_url: selectedImage?.uri || undefined,
        },
        currentUser?.id
      );

      // Replace optimistic entry with confirmed server response
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...sentMessage, isMine: true } : msg))
      );
    } catch (err) {
      // Mark as failed in UI
      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? { ...msg, status: 'failed' } : msg))
      );
      Alert.alert('Send Failed', err.message || 'Could not deliver message. Tap bubble to retry.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.innerContainer}>
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="cloud-offline-outline" size={16} color={COLORS.error} />
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity onPress={() => loadMessages(true)}>
              <Text style={styles.errorRetryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {initLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.initText}>Connecting to conversation...</Text>
          </View>
        ) : fetchingMessages && messages.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.initText}>Loading message history...</Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={item.status === 'failed' ? 0.6 : 1}
                onPress={() => {
                  if (item.status === 'failed') {
                    Alert.alert(
                      'Failed Message',
                      'Do you want to retry sending this message?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Retry', onPress: () => handleRetryMessage(item) },
                      ]
                    );
                  }
                }}
              >
                <MessageBubble
                  message={item}
                  showSender={Boolean(conversation?.isGroup)}
                />
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => loadMessages(true)}
                colors={[COLORS.primary]}
                tintColor={COLORS.primary}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="chatbox-outline"
                title="Say Hello!"
                message="No messages in this chat yet. Send the first message below."
              />
            }
            onContentSizeChange={() => {
              if (messages.length > 0) {
                flatListRef.current?.scrollToEnd({ animated: true });
              }
            }}
          />
        )}

        <MessageInput
          text={inputText}
          onChangeText={setInputText}
          onSend={handleSendMessage}
          onPickImage={() => {}}
          onCamera={() => {}}
          onCustomCamera={() => {}}
          sending={sending}
          previewImage={selectedImage}
          onRemovePreview={() => setSelectedImage(null)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  innerContainer: {
    flex: 1,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.errorLight,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.error,
  },
  errorBannerText: {
    flex: 1,
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.error,
  },
  errorRetryText: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.error,
    paddingHorizontal: SPACING.xs,
  },
  headerInfoBtn: {
    padding: SPACING.xs,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  initText: {
    marginTop: SPACING.md,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingVertical: SPACING.md,
    flexGrow: 1,
  },
});
