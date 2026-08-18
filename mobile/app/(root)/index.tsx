import { styles } from "@/assets/styles/home.styles";
import { useAuth } from "@/components/AuthContext";
import LogoutButton from "@/components/LogoutButton";
import { useTransactions } from "@/hooks/useTransactions";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

export default function MainScreen() {
  const { isLoading: isAuthLoading, userId } = useAuth();
  const { loadData, isLoading: isTransactionsLoading } = useTransactions(
    userId as string,
  );
  const router = useRouter();
  useEffect(() => {
    loadData();
  }, [loadData]);

  if (isAuthLoading || isTransactionsLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>{userId}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push("/create")}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <LogoutButton />
          </View>
        </View>
      </View>
    </View>
  );
}
