import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { conversationService } from '../services/conversationService';
import UserListItem from '../components/UserListItem';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function GroupCreateScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { baseUrl, currentUser } = useApp();

  const initialSelected = route.params?.initialSelectedUsers || [];
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState(initialSelected);
  const [creating, setCreating] = useState(false);

  const removeUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => String(u.id) !== String(userId)));
  };

  const handleCreateGroup = async () => {
    const trimmedName = groupName.trim();
    if (!trimmedName) {
      Alert.alert('Group Name Required', 'Please enter a name for your group conversation.');
      return;
    }
    if (selectedUsers.length < 2) {
      Alert.alert('Participants Required', 'A group must have at least 2 other participants.');
      return;
    }

    setCreating(true);
    try {
      const participantIds = selectedUsers.map((u) => u.id);
      const conversation = await conversationService.createConversation(
        baseUrl,
        {
          name: trimmedName,
          participant_ids: participantIds,
          is_group: true,
        },
        currentUser?.id
      );

      // Navigate directly into newly created group chat
      navigation.replace('Chat', {
        conversation,
        title: conversation.title || trimmedName,
      });
    } catch (err) {
      Alert.alert('Creation Failed', err.message || 'Unable to create group conversation.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerInputContainer}>
        <View style={styles.iconCircle}>
          <Ionicons name="people" size={24} color={COLORS.primary} />
        </View>
        <TextInput
          style={styles.nameInput}
          placeholder="Group name..."
          placeholderTextColor={COLORS.textMuted}
          value={groupName}
          onChangeText={setGroupName}
          maxLength={40}
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Participants ({selectedUsers.length})
        </Text>
      </View>

      <FlatList
        data={selectedUsers}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <UserListItem user={item} />
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeUser(item.id)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={22} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createBtn, creating && styles.createBtnDisabled]}
          onPress={handleCreateGroup}
          disabled={creating}
          activeOpacity={0.8}
        >
          {creating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" style={styles.btnIcon} />
              <Text style={styles.createBtnText}>Create Group Chat</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  nameInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.title,
    fontWeight: '600',
    color: COLORS.text,
  },
  sectionHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  userRow: {
    position: 'relative',
  },
  removeBtn: {
    position: 'absolute',
    right: SPACING.lg,
    top: '35%',
  },
  footer: {
    padding: SPACING.lg,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createBtnDisabled: {
    opacity: 0.6,
  },
  btnIcon: {
    marginRight: SPACING.sm,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.body + 1,
    fontWeight: '700',
  },
});
