import axios, { AxiosError, create, InternalAxiosRequestConfig } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const httpApi = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

let refreshPromise: Promise<string> | null = null;

//Refresh tokens function
const refreshAccessToken = async (): Promise<string> => {
  let refreshToken: string | null = null;
  if (Platform.OS === "web") {
    refreshToken = localStorage.getItem("refreshToken");
  } else {
    refreshToken = await SecureStore.getItemAsync("refreshToken");
  }

  if (!refreshToken) {
    throw new Error("Refresh token not found");
  }

  const response = await axios.post(
    `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
    {
      refreshToken,
    },
  );

  const { accessToken, refreshToken: newRefreshToken } = response.data;

  if (!accessToken || !newRefreshToken) {
    throw new Error("tokens not received");
  }

  if (Platform.OS === "web") {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", newRefreshToken);
  } else {
    await SecureStore.setItemAsync("accessToken", accessToken);
    await SecureStore.setItemAsync("refreshToken", newRefreshToken);
  }

  return accessToken;
};
//REQUEST INTERCEPTOR
httpApi.interceptors.request.use(async (config) => {
  let accessToken: string | null = null;
  if (Platform.OS === "web") {
    accessToken = localStorage.getItem("accessToken");
  } else {
    accessToken = await SecureStore.getItemAsync("accessToken");
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
//RESPONSE INTERCEPTOR
httpApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/auth/refresh")) {
      localStorage.clear();
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const accessToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return httpApi(originalRequest);
    } catch (refreshError) {
      if (Platform.OS === "web") {
        localStorage.clear();
      } else {
        await SecureStore.deleteItemAsync("accessToken");
        await SecureStore.deleteItemAsync("refreshToken");
      }
      return Promise.reject(refreshError);
    }
  },
);
