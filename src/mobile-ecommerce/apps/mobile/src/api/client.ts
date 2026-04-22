import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import Config from '../constants/config';

const apiClient: AxiosInstance = axios.create({
  baseURL: Config.API_URL,
  timeout: Config.TIMEOUTS.API_REQUEST,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(Config.SECURE_STORE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // If secure store fails, continue without token
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        await SecureStore.deleteItemAsync(Config.SECURE_STORE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(Config.SECURE_STORE_KEYS.USER_DATA);
      } catch {
        // Ignore cleanup errors
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
