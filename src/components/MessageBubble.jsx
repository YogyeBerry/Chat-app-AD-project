import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { formatMessageTime } from '../utils/formatters';
import Avatar from './Avatar';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function MessageBubble({ message, showSender = false }) {
  const isMine = message.isMine;
  const timeFormatted = formatMessageTime(message.createdAt);

  return (
    <View
      style={[
        styles.outerContainer,
        isMine ? styles.outerMine : styles.outerOther,
      ]}
    >
      {!isMine && showSender && (
        <View style={styles.avatarWrapper}>
          <Avatar
            name={message.senderName || 'User'}
            uri={message.senderAvatar}
            size={28}
          />
        </View>
      )}

      <View style={[styles.wrapper, isMine ? styles.wrapperMine : styles.wrapperOther]}>
        {showSender && !isMine && message.senderName ? (
          <Text style={styles.senderName}>{message.senderName}</Text>
        ) : null}

        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleOther,
          ]}
        >
          {message.mediaUrl ? (
            <Image
              source={{ uri: message.mediaUrl }}
              style={styles.mediaImage}
              resizeMode="cover"
            />
          ) : null}

          {message.content ? (
            <Text
              style={[
                styles.content,
                isMine ? styles.contentMine : styles.contentOther,
              ]}
            >
              {message.content}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <Text style={[styles.time, isMine ? styles.timeMine : styles.timeOther]}>
              {timeFormatted}
            </Text>
            {isMine && (
              <Text style={styles.statusIndicator}>
                {message.status === 'sending'
                  ? ' 🕒'
                  : message.status === 'failed'
                  ? ' ⚠️'
                  : ' ✓✓'}
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: SPACING.md,
    alignItems: 'flex-end',
  },
  outerMine: {
    justifyContent: 'flex-end',
  },
  outerOther: {
    justifyContent: 'flex-start',
  },
  avatarWrapper: {
    marginRight: 6,
    marginBottom: 4,
  },
  wrapper: {
    maxWidth: '80%',
  },
  wrapperMine: {
    alignSelf: 'flex-end',
  },
  wrapperOther: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: TYPOGRAPHY.tiny + 1,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 2,
    marginLeft: 4,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    overflow: 'hidden',
  },
  bubbleMine: {
    backgroundColor: COLORS.outgoingBubble,
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.incomingBubble,
    borderBottomLeftRadius: 4,
  },
  content: {
    fontSize: TYPOGRAPHY.body,
    lineHeight: 20,
  },
  contentMine: {
    color: COLORS.outgoingText,
  },
  contentOther: {
    color: COLORS.incomingText,
  },
  mediaImage: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  time: {
    fontSize: TYPOGRAPHY.tiny,
  },
  timeMine: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  timeOther: {
    color: COLORS.textMuted,
  },
  statusIndicator: {
    fontSize: TYPOGRAPHY.tiny,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});
