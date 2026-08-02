import axios, { create } from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const httpApi = create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

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

httpApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      let refreshToken: string | null = null;
      if (Platform.OS === "web") {
        refreshToken = localStorage.getItem("refreshToken");
      } else {
        refreshToken = await SecureStore.getItemAsync("refreshToken");
      }
      const res = await axios.post("/refresh", { refreshToken });
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
      } else {
        await SecureStore.setItemAsync("accessToken", res.data.accessToken);
        await SecureStore.setItemAsync("refreshToken", res.data.refreshToken);
      }
      error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
      return httpApi(error.config);
    }
    return Promise.reject(error);
  },
);
