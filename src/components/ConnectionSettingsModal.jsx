import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

const DEMO_PROFILES = [
  { id: '1', name: 'You (Demo User)' },
  { id: '2', name: 'Alex Johnson' },
  { id: '3', name: 'Sarah Miller' },
  { id: '4', name: 'Michael Chen' },
];

export default function ConnectionSettingsModal({ visible, onClose }) {
  const { baseUrl, setBaseUrl, currentUser, setCurrentUser } = useApp();
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [userNameInput, setUserNameInput] = useState(currentUser?.name || '');
  const [userIdInput, setUserIdInput] = useState(currentUser?.id || '');

  useEffect(() => {
    if (visible) {
      setUrlInput(baseUrl);
      setUserNameInput(currentUser?.name || '');
      setUserIdInput(currentUser?.id || '1');
    }
  }, [visible, baseUrl, currentUser]);

  const selectProfile = (profile) => {
    setUserIdInput(profile.id);
    setUserNameInput(profile.name);
  };

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      Alert.alert('Error', 'Server URL cannot be empty.');
      return;
    }
    setBaseUrl(trimmed);
    setCurrentUser((prev) => ({
      ...prev,
      id: userIdInput.trim() || '1',
      name: userNameInput.trim() || 'You',
    }));
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Network & User Settings</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Quick Switch Profile</Text>
            <View style={styles.presetContainer}>
              {DEMO_PROFILES.map((p) => {
                const isSelected = String(userIdInput) === String(p.id);
                return (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.presetChip, isSelected && styles.presetChipActive]}
                    onPress={() => selectProfile(p)}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected && styles.presetChipTextActive,
                      ]}
                    >
                      {p.name} (ID: {p.id})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Backend Server URL (REST Endpoint)</Text>
            <TextInput
              style={styles.input}
              value={urlInput}
              onChangeText={setUrlInput}
              placeholder="http://192.168.1.100:3000"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Current User Display Name</Text>
            <TextInput
              style={styles.input}
              value={userNameInput}
              onChangeText={setUserNameInput}
              placeholder="Your Name"
              placeholderTextColor={COLORS.textMuted}
            />

            <Text style={styles.label}>Current User ID</Text>
            <TextInput
              style={styles.input}
              value={userIdInput}
              onChangeText={setUserIdInput}
              placeholder="User ID (e.g. 1)"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="numeric"
            />

            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save Configuration</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: SPACING.xl,
    maxHeight: '85%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.text,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: SPACING.sm,
  },
  presetChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  presetChipText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },
  presetChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  label: {
    fontSize: TYPOGRAPHY.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.text,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: TYPOGRAPHY.body,
  },
});
