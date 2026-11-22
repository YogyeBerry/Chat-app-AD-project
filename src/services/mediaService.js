import * as ImagePicker from 'expo-image-picker';
import { createApiClient } from './apiClient';
import { API_CONFIG } from '../constants/config';

/**
 * Media service for selecting images from gallery, launching camera, and backend upload
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

  /**
   * Upload an image to the backend server via multipart/form-data
   * Falls back gracefully if backend endpoint does not support upload
   * @param {string} baseUrl
   * @param {Object} imageAsset - { uri, fileName, type, base64 }
   * @returns {Promise<string>} Hosted image URL or base64 data
   */
  async uploadImage(baseUrl, imageAsset) {
    if (!imageAsset || (!imageAsset.uri && !imageAsset.base64)) {
      throw new Error('No valid image asset provided for upload.');
    }

    try {
      const client = createApiClient(baseUrl);
      const formData = new FormData();
      formData.append('file', {
        uri: imageAsset.uri,
        name: imageAsset.fileName || 'image.jpg',
        type: 'image/jpeg',
      });

      const response = await client.post(API_CONFIG.ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedUrl =
        response.data?.url ||
        response.data?.media_url ||
        response.data?.imageUrl ||
        response.data?.data?.url;

      if (uploadedUrl) {
        return uploadedUrl;
      }
    } catch (err) {
      // Backend may not have multipart /upload route implemented.
      // Gracefully fall back to base64 inline transmission if available.
      if (imageAsset.base64) {
        return imageAsset.base64;
      }
    }

    // Default to uri if no upload endpoint exists
    return imageAsset.uri;
  },
};
