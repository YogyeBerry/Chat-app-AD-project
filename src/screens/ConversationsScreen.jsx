import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { conversationService } from '../services/conversationService';
import ConversationListItem from '../components/ConversationListItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ConversationsScreen() {
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchConversations = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await conversationService.getConversations(baseUrl, currentUser?.id);
      setConversations(data);
    } catch (err) {
      setError(err.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [baseUrl, currentUser]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleOpenConversation = (conversation) => {
    navigation.navigate('Chat', {
      conversation,
      title: conversation.title,
    });
  };

  if (loading && !refreshing) {
    return <LoadingState message="Loading your conversations..." />;
  }

  return (
    <View style={styles.container}>
      {error && conversations.length > 0 && (
        <View style={styles.errorBanner}>
          <Ionicons name="warning-outline" size={16} color={COLORS.error} />
          <Text style={styles.errorBannerText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchConversations(true)}>
            <Text style={styles.errorRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {error && conversations.length === 0 ? (
        <ErrorState
          message={error}
          onRetry={() => fetchConversations(false)}
        />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <ConversationListItem
              conversation={item}
              onPress={handleOpenConversation}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchConversations(true)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="chatbubbles-outline"
              title="No Conversations Yet"
              message="Start a direct chat or create a group from your contacts directory."
              actionLabel="Discover Contacts"
              onAction={() => navigation.navigate('UsersTab')}
            />
          }
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('UsersTab')}
        activeOpacity={0.85}
      >
        <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
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
});
