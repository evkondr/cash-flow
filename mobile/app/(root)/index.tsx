import { useAuth } from "@/components/AuthContext";
import { ActivityIndicator, Text, View } from "react-native";

export default function MainScreen() {
  const { isLoading, userToken } = useAuth();

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
