import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { formatConversationTime } from '../utils/formatters';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ConversationListItem({ conversation, onPress }) {
  const lastMessageText = conversation.lastMessage
    ? conversation.lastMessage.content || (conversation.lastMessage.mediaUrl ? '📷 Photo' : '')
    : 'No messages yet';

  const timeDisplay = formatConversationTime(conversation.updatedAt);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(conversation)}
      activeOpacity={0.7}
    >
      <Avatar
        name={conversation.title}
        isGroup={conversation.isGroup}
        size={52}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.title} numberOfLines={1}>
            {conversation.title}
          </Text>
          {timeDisplay ? <Text style={styles.time}>{timeDisplay}</Text> : null}
        </View>
        <View style={styles.bottomRow}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {lastMessageText}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
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
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: TYPOGRAPHY.title - 2,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  time: {
    fontSize: TYPOGRAPHY.tiny,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: TYPOGRAPHY.caption + 1,
    color: COLORS.textSecondary,
    flex: 1,
    marginRight: SPACING.sm,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '700',
  },
});
