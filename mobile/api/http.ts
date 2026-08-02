import { create } from "axios";
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
    accessToken = await SecureStore.getItem("accessToken");
  }
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});
