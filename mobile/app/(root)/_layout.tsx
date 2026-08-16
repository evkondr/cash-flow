import { useAuth } from "@/components/AuthContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RooLayout() {
  const { userId } = useAuth();
  console.log(userId);
  if (!userId) {
    return <Redirect href="/sign-in" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
