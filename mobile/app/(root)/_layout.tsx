import { useAuth } from "@/components/AuthContext";
import { Redirect, Stack } from "expo-router";
import React from "react";

export default function RooLayout() {
  const { userToken } = useAuth();
  console.log(userToken);
  if (!userToken) {
    return <Redirect href="/sign-in" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}
