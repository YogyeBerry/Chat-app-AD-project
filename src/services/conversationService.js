import { createApiClient } from './apiClient';
import { API_CONFIG } from '../constants/config';
import { normalizeConversation, normalizeMessage } from '../utils/models';
import { localMockStore } from './localMockStore';

/**
 * Conversation & Messaging API Service with automatic offline fallback
 */
export const conversationService = {
  /**
   * Fetch all conversations for the user
   * @param {string} baseUrl
   * @param {string} currentUserId
   * @returns {Promise<Array>}
   */
  async getConversations(baseUrl, currentUserId) {
    try {
      const client = createApiClient(baseUrl);
      const response = await client.get(API_CONFIG.ENDPOINTS.CONVERSATIONS, {
        params: currentUserId ? { user_id: currentUserId } : {},
      });
      const rawData = response.data;

      let list = [];
      if (Array.isArray(rawData)) {
        list = rawData;
      } else if (rawData && Array.isArray(rawData.conversations)) {
        list = rawData.conversations;
      } else if (rawData && Array.isArray(rawData.data)) {
        list = rawData.data;
      }

      localMockStore.setOffline(false);
      return list
        .map((conv) => normalizeConversation(conv, currentUserId))
        .filter(Boolean);
    } catch (err) {
      localMockStore.setOffline(true);
      const localList = localMockStore.getConversations(currentUserId);
      return localList
        .map((conv) => normalizeConversation(conv, currentUserId))
        .filter(Boolean);
    }
  },

  /**
   * Create a conversation (direct or group)
   * @param {string} baseUrl
   * @param {Object} payload - { participant_ids: string[], is_group: boolean, name?: string }
   * @param {string} currentUserId
   * @returns {Promise<Object>}
   */
  async createConversation(baseUrl, payload, currentUserId) {
    try {
      const client = createApiClient(baseUrl);
      const response = await client.post(API_CONFIG.ENDPOINTS.CONVERSATIONS, {
        ...payload,
        creator_id: currentUserId,
      });
      const raw = response.data?.conversation || response.data?.data || response.data;
      return normalizeConversation(raw, currentUserId);
    } catch (err) {
      const localConv = localMockStore.createConversation({
        ...payload,
        creator_id: currentUserId,
      });
      return normalizeConversation(localConv, currentUserId);
    }
  },

  /**
   * Fetch messages for a specific conversation
   * @param {string} baseUrl
   * @param {string} conversationId
   * @param {string} currentUserId
   * @returns {Promise<Array>}
   */
  async getMessages(baseUrl, conversationId, currentUserId) {
    try {
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
    } catch (err) {
      const localMsgs = localMockStore.getMessages(conversationId);
      return localMsgs
        .map((msg) => normalizeMessage(msg, currentUserId))
        .filter(Boolean);
    }
  },

  /**
   * Send a message
   * @param {string} baseUrl
   * @param {Object} payload - { conversation_id: string, content: string, media_url?: string }
   * @param {string} currentUserId
   * @returns {Promise<Object>}
   */
  async sendMessage(baseUrl, payload, currentUserId) {
    try {
      const client = createApiClient(baseUrl);
      const response = await client.post(API_CONFIG.ENDPOINTS.MESSAGES, payload);
      const raw = response.data?.message || response.data?.data || response.data;
      return normalizeMessage(raw, currentUserId);
    } catch (err) {
      const localMsg = localMockStore.sendMessage(payload);
      return normalizeMessage(localMsg, currentUserId);
    }
  },
};
