import { useAuth } from "@/components/AuthContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function AuthLayout() {
  const { userId } = useAuth();
  if (userId) {
    return <Redirect href="/" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
