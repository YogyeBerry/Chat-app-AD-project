import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../components/Avatar';
import { userService } from '../services/userService';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ParticipantInfoScreen() {
  const route = useRoute();
  const { baseUrl } = useApp();
  const { conversation, participant } = route.params || {};

  const isGroup = Boolean(conversation?.isGroup);
  const participants = conversation?.participants || (participant ? [participant] : []);

  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
    // If direct chat, fetch latest detailed profile if available
    if (!isGroup && (participant?.id || participants[0]?.id)) {
      const targetId = participant?.id || participants[0]?.id;
      userService
        .getUserProfile(baseUrl, targetId)
        .then((profile) => {
          if (profile) setProfileDetails(profile);
        })
        .catch(() => {
          // Gracefully fallback to route info
        });
    }
  }, [baseUrl, isGroup, participant?.id, participants]);

  const activeTarget = profileDetails || participant || participants[0] || {};

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        <Avatar
          name={isGroup ? conversation?.title : activeTarget.name || 'User'}
          uri={isGroup ? null : activeTarget.avatar}
          size={84}
          isGroup={isGroup}
        />
        <Text style={styles.title}>
          {isGroup ? conversation?.title : activeTarget.name || 'User'}
        </Text>
        <Text style={styles.subtitle}>
          {isGroup ? `${participants.length} Participants` : activeTarget.email || 'Direct Messaging'}
        </Text>
      </View>

      {isGroup ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Group Members</Text>
          {participants.map((user) => (
            <View key={String(user.id)} style={styles.memberRow}>
              <Avatar name={user.name} uri={user.avatar} size={40} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{user.name}</Text>
                {user.email ? <Text style={styles.memberEmail}>{user.email}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Details</Text>
          <View style={styles.detailRow}>
            <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{activeTarget.name || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>Email Address</Text>
              <Text style={styles.detailValue}>{activeTarget.email || 'Not provided'}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="key-outline" size={20} color={COLORS.primary} style={styles.detailIcon} />
            <View>
              <Text style={styles.detailLabel}>User ID</Text>
              <Text style={styles.detailValue}>{String(activeTarget.id || 'N/A')}</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: TYPOGRAPHY.header,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  section: {
    marginTop: SPACING.md,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '700',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  memberInfo: {
    marginLeft: SPACING.md,
  },
  memberName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.text,
  },
  memberEmail: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  detailIcon: {
    marginRight: SPACING.md,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
    fontWeight: '500',
    marginTop: 2,
  },
});
