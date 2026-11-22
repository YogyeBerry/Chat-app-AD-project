import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import { conversationService } from '../services/conversationService';
import ConversationListItem from '../components/ConversationListItem';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { COLORS } from '../constants/theme';

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

  if (error && conversations.length === 0) {
    return <ErrorState message={error} onRetry={() => fetchConversations(false)} />;
  }

  return (
    <View style={styles.container}>
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
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title="No Conversations Yet"
            message="Start a direct chat or create a group from the contacts tab."
            actionLabel="Find Contacts"
            onAction={() => navigation.navigate('UsersTab')}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
