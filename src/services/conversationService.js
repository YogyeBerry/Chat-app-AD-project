import { createApiClient } from './apiClient';
import { API_CONFIG } from '../constants/config';
import { normalizeConversation, normalizeMessage } from '../utils/models';

/**
 * Conversation & Messaging API Service
 */
export const conversationService = {
  /**
   * Fetch all conversations for the user
   * @param {string} baseUrl
   * @param {string} currentUserId
   * @returns {Promise<Array>}
   */
  async getConversations(baseUrl, currentUserId) {
    const client = createApiClient(baseUrl);
    const response = await client.get(API_CONFIG.ENDPOINTS.CONVERSATIONS);
    const rawData = response.data;

    let list = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && Array.isArray(rawData.conversations)) {
      list = rawData.conversations;
    } else if (rawData && Array.isArray(rawData.data)) {
      list = rawData.data;
    }

    return list
      .map((conv) => normalizeConversation(conv, currentUserId))
      .filter(Boolean);
  },

  /**
   * Create a conversation (direct or group)
   * @param {string} baseUrl
   * @param {Object} payload - { participant_ids: string[], is_group: boolean, name?: string }
   * @param {string} currentUserId
   * @returns {Promise<Object>}
   */
  async createConversation(baseUrl, payload, currentUserId) {
    const client = createApiClient(baseUrl);
    const response = await client.post(API_CONFIG.ENDPOINTS.CONVERSATIONS, payload);
    const raw = response.data?.conversation || response.data?.data || response.data;
    return normalizeConversation(raw, currentUserId);
  },

  /**
   * Fetch messages for a specific conversation
   * @param {string} baseUrl
   * @param {string} conversationId
   * @param {string} currentUserId
   * @returns {Promise<Array>}
   */
  async getMessages(baseUrl, conversationId, currentUserId) {
    const client = createApiClient(baseUrl);
    const response = await client.get(API_CONFIG.ENDPOINTS.MESSAGES, {
      params: { conversation_id: conversationId },
    });
    const rawData = response.data;

    let list = [];
    if (Array.isArray(rawData)) {
      list = rawData;
    } else if (rawData && Array.isArray(rawData.messages)) {
      list = rawData.messages;
    } else if (rawData && Array.isArray(rawData.data)) {
      list = rawData.data;
    }

    return list
      .map((msg) => normalizeMessage(msg, currentUserId))
      .filter(Boolean);
  },

  /**
   * Send a message
   * @param {string} baseUrl
   * @param {Object} payload - { conversation_id: string, content: string, media_url?: string }
   * @param {string} currentUserId
   * @returns {Promise<Object>}
   */
  async sendMessage(baseUrl, payload, currentUserId) {
    const client = createApiClient(baseUrl);
    const response = await client.post(API_CONFIG.ENDPOINTS.MESSAGES, payload);
    const raw = response.data?.message || response.data?.data || response.data;
    return normalizeMessage(raw, currentUserId);
  },
};
