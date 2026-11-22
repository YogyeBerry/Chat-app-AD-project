import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';

export default function CustomCameraScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { targetScreen = 'Chat', conversation } = route.params || {};

  const [facing, setFacing] = useState('back');
  const [flash, setFlash] = useState('off');
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [takingPhoto, setTakingPhoto] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={COLORS.error} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionMessage}>
          To capture photos directly within the app, camera permissions must be granted.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtnText}>Back to Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash((current) => (current === 'off' ? 'on' : 'off'));
  };

  const takePhoto = async () => {
    if (!cameraRef.current || takingPhoto) return;
    setTakingPhoto(true);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
      });

      if (photo) {
        setCapturedPhoto({
          uri: photo.uri,
          width: photo.width,
          height: photo.height,
          base64: photo.base64 ? `data:image/jpeg;base64,${photo.base64}` : null,
          fileName: `custom_camera_${Date.now()}.jpg`,
        });
      }
    } catch (err) {
      Alert.alert('Capture Error', err.message || 'Failed to capture photo.');
    } finally {
      setTakingPhoto(false);
    }
  };

  const usePhoto = () => {
    if (!capturedPhoto) return;
    // Pass captured photo back to target screen (ChatScreen)
    navigation.navigate(targetScreen, {
      capturedPhoto,
      conversation,
    });
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
  };

  return (
    <View style={styles.container}>
      {capturedPhoto ? (
        // Preview Mode
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedPhoto.uri }} style={styles.previewImage} />
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.retakeBtn} onPress={retakePhoto}>
              <Ionicons name="refresh" size={24} color="#FFFFFF" />
              <Text style={styles.controlText}>Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.usePhotoBtn} onPress={usePhoto}>
              <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
              <Text style={styles.controlText}>Use Photo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Live Viewfinder Mode
        <CameraView
          style={styles.camera}
          facing={facing}
          enableTorch={flash === 'on'}
          ref={cameraRef}
        >
          {/* Top Control Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.topIconBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.topIconBtn} onPress={toggleFlash}>
              <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={24}
                color={flash === 'on' ? '#FBBF24' : '#FFFFFF'}
              />
            </TouchableOpacity>
          </View>

          {/* Bottom Capture Controls */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.flipBtn} onPress={toggleFacing}>
              <Ionicons name="camera-reverse-outline" size={30} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shutterBtn}
              onPress={takePhoto}
              disabled={takingPhoto}
            >
              <View style={styles.shutterInner}>
                {takingPhoto && <ActivityIndicator size="small" color="#FFFFFF" />}
              </View>
            </TouchableOpacity>

            <View style={{ width: 44 }} />
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
    backgroundColor: COLORS.background,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.title,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xs,
  },
  permissionMessage: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 20,
  },
  permissionBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cancelBtn: {
    padding: SPACING.sm,
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl + 10,
  },
  topIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: SPACING.xxl + 10,
  },
  flipBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  previewImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.xxl + 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
  },
  usePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
  },
  controlText: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginLeft: SPACING.xs,
    fontSize: TYPOGRAPHY.body,
  },
});
