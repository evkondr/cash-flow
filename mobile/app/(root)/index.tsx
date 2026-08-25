import { styles } from "@/assets/styles/home.styles";
import { useAuth } from "@/components/AuthContext";
import BalanceCard from "@/components/BalanceCard";
import EmptyTransactions from "@/components/EmptyTransactions";
import LogoutButton from "@/components/LogoutButton";
import TransactionItem from "@/components/TransactionItem";
import { useTransactions } from "@/hooks/useTransactions";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "@react-navigation/elements";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

export default function MainScreen() {
  const { isLoading: isAuthLoading, userId } = useAuth();
  const {
    loadData,
    isLoading: isTransactionsLoading,
    summary,
    deleteTransaction,
    transactions,
  } = useTransactions(userId as string);
  const router = useRouter();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  const handleDelete = (id: number) => {
    if (Platform.OS === "web") {
      const isConfirmed = confirm("A you sure?");
      if (isConfirmed) {
        deleteTransaction(id);
      }
    } else {
      Alert.alert("Delete transaction", "Are you sure to delete transaction?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(id),
        },
      ]);
    }
  };
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
        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      <FlatList
        style={styles.transactionsList}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<EmptyTransactions />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
