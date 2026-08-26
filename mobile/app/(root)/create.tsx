import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

const CreateScreen = () => {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleCreate = async () => {};

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CreateScreen;
