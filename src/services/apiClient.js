import axios from 'axios';
import { API_CONFIG } from '../constants/config';

/**
 * Creates an Axios instance with preconfigured timeouts, interceptors and base settings
 * @param {string} baseURL
 * @returns {import('axios').AxiosInstance}
 */
export function createApiClient(baseURL = API_CONFIG.DEFAULT_BASE_URL) {
  const instance = axios.create({
    baseURL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      let message = 'Network error or server unreachable.';
      if (error.response) {
        message =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server returned status ${error.response.status}`;
      } else if (error.request) {
        message = 'No response from server. Check server URL and network connection.';
      } else if (error.message) {
        message = error.message;
      }
      return Promise.reject(new Error(message));
    }
  );

  return instance;
}
