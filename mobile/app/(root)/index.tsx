import { useAuth } from "@/components/AuthContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function MainScreen() {
  const { isLoading, userId } = useAuth();
  const { loadData, transactions } = useTransactions(userId as string);
  useEffect(() => {
    loadData();
  }, []);
  console.log(transactions);
  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <View>
      <Text>Home Page</Text>
    </View>
  );
}
