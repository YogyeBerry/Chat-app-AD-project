import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { mediaService } from '../services/mediaService';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function NativeCameraLauncher({ onCapture, disabled = false }) {
  const [capturing, setCapturing] = useState(false);

  const handleLaunchCamera = async () => {
    setCapturing(true);
    try {
      const asset = await mediaService.launchNativeCamera();
      if (asset && onCapture) {
        onCapture(asset);
      }
    } catch (err) {
      Alert.alert(
        'Camera Permission Denied',
        err.message || 'Camera permission is required to capture photos.'
      );
    } finally {
      setCapturing(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.cameraButton, disabled && styles.cameraButtonDisabled]}
      onPress={handleLaunchCamera}
      disabled={disabled || capturing}
      activeOpacity={0.7}
    >
      {capturing ? (
        <ActivityIndicator size="small" color={COLORS.primary} />
      ) : (
        <Ionicons name="camera" size={24} color={COLORS.primary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cameraButton: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonDisabled: {
    opacity: 0.5,
  },
});
