import { useAuth } from "@/components/AuthContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RooLayout() {
  const { userId, isLoading } = useAuth();
  if (isLoading) return null;
  if (!userId) {
    return <Redirect href="/sign-in" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
