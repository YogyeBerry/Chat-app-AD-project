import * as ImagePicker from 'expo-image-picker';

/**
 * Media service for selecting images from gallery or triggering camera
 */
export const mediaService = {
  /**
   * Request media library permissions and open image picker
   * @returns {Promise<Object|null>} Selected asset or null
   */
  async pickImageFromGallery() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access photos was denied. Please enable photo access in your system settings.');
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type || 'image',
      base64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null,
      fileName: asset.fileName || `photo_${Date.now()}.jpg`,
    };
  },

  /**
   * Request camera permissions and launch native camera intent
   * @returns {Promise<Object|null>} Captured asset or null
   */
  async launchNativeCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access camera was denied. Please enable camera access in your system settings.');
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type || 'image',
      base64: asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : null,
      fileName: asset.fileName || `capture_${Date.now()}.jpg`,
    };
  },
};
