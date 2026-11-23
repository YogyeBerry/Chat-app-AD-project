import { createApiClient } from './apiClient';
import { API_CONFIG } from '../constants/config';
import { normalizeUser } from '../utils/models';
import { localMockStore } from './localMockStore';

/**
 * User Service - handles user fetching and profiles with automatic offline fallback
 */
export const userService = {
  /**
   * Fetch all users
   * @param {string} baseUrl
   * @returns {Promise<Array>} List of normalized users
   */
  async getUsers(baseUrl) {
    try {
      const client = createApiClient(baseUrl);
      const response = await client.get(API_CONFIG.ENDPOINTS.USERS);
      const rawData = response.data;

      let userList = [];
      if (Array.isArray(rawData)) {
        userList = rawData;
      } else if (rawData && Array.isArray(rawData.users)) {
        userList = rawData.users;
      } else if (rawData && Array.isArray(rawData.data)) {
        userList = rawData.data;
      }

      localMockStore.setOffline(false);
      return userList.map(normalizeUser).filter(Boolean);
    } catch (err) {
      // Gracefully fall back to local mock store when server is unreachable
      localMockStore.setOffline(true);
      const localUsers = localMockStore.getUsers();
      return localUsers.map(normalizeUser).filter(Boolean);
    }
  },

  /**
   * Fetch single user profile
   * @param {string} baseUrl
   * @param {string} userId
   * @returns {Promise<Object>} Normalized user profile
   */
  async getUserProfile(baseUrl, userId) {
    try {
      const client = createApiClient(baseUrl);
      const response = await client.get(API_CONFIG.ENDPOINTS.USER_PROFILE, {
        params: { user_id: userId },
      });
      const raw = response.data?.user || response.data?.data || response.data;
      return normalizeUser(raw);
    } catch (err) {
      const localUser = localMockStore.getUserProfile(userId);
      return normalizeUser(localUser);
    }
  },
};
