import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function MessageInput({
  text,
  onChangeText,
  onSend,
  onPickImage,
  onCamera,
  onCustomCamera,
  sending = false,
  previewImage = null,
  onRemovePreview = null,
}) {
  const canSend = Boolean(text.trim() || previewImage);

  return (
    <View style={styles.wrapper}>
      {previewImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewImage.uri }} style={styles.previewImage} />
          <TouchableOpacity
            style={styles.removePreviewBtn}
            onPress={onRemovePreview}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputBar}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={onPickImage}
          disabled={sending}
        >
          <Ionicons name="image-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={onCamera}
          disabled={sending}
        >
          <Ionicons name="camera-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>

        {onCustomCamera && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onCustomCamera}
            disabled={sending}
          >
            <Ionicons name="aperture-outline" size={24} color={COLORS.primaryDark} />
          </TouchableOpacity>
        )}

        <TextInput
          style={styles.textInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textMuted}
          value={text}
          onChangeText={onChangeText}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
          onPress={onSend}
          disabled={!canSend || sending}
        >
          {sending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={18} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
  },
  previewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  removePreviewBtn: {
    marginLeft: SPACING.sm,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  iconButton: {
    padding: SPACING.xs,
    marginRight: 4,
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 4,
    fontSize: TYPOGRAPHY.body,
    maxHeight: 100,
    color: COLORS.text,
    marginHorizontal: SPACING.xs,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.textMuted,
    opacity: 0.5,
  },
});
