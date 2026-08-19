import { styles } from "@/assets/styles/home.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { useAuth } from "./AuthContext";

const LogoutButton = () => {
  const { logout } = useAuth();
  const handleLogout = () => {
    if (Platform.OS === "web") {
      const isConfirmed = confirm("A you sure?");
      if (isConfirmed) {
        logout();
      }
    } else {
      Alert.alert("Logout", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: logout },
      ]);
    }
  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  );
};

export default LogoutButton;
