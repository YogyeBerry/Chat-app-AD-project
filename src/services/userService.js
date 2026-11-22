import { createApiClient } from './apiClient';
import { API_CONFIG } from '../constants/config';
import { normalizeUser } from '../utils/models';

/**
 * User Service - handles user fetching and profiles
 */
export const userService = {
  /**
   * Fetch all users
   * @param {string} baseUrl
   * @returns {Promise<Array>} List of normalized users
   */
  async getUsers(baseUrl) {
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

    return userList.map(normalizeUser).filter(Boolean);
  },

  /**
   * Fetch single user profile
   * @param {string} baseUrl
   * @param {string} userId
   * @returns {Promise<Object>} Normalized user profile
   */
  async getUserProfile(baseUrl, userId) {
    const client = createApiClient(baseUrl);
    const response = await client.get(API_CONFIG.ENDPOINTS.USER_PROFILE, {
      params: { user_id: userId },
    });
    const raw = response.data?.user || response.data?.data || response.data;
    return normalizeUser(raw);
  },
};
