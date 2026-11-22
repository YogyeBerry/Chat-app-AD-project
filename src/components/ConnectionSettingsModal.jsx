import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function ConnectionSettingsModal({ visible, onClose }) {
  const { baseUrl, setBaseUrl, currentUser, setCurrentUser } = useApp();
  const [urlInput, setUrlInput] = useState(baseUrl);
  const [userNameInput, setUserNameInput] = useState(currentUser?.name || '');
  const [userIdInput, setUserIdInput] = useState(currentUser?.id || '');

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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.text,
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
    marginTop: SPACING.xl,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: TYPOGRAPHY.body,
  },
});
