import { httpApi } from "@/api/http";
import { styles } from "@/assets/styles/create.styles";
import { COLORS } from "@/constants/colors";
import useCategories from "@/hooks/useCategories";
import messageAlert from "@/utils/message-alert";
import { Ionicons } from "@expo/vector-icons";
import { isAxiosError } from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CreateScreen = () => {
  const router = useRouter();
  const {
    categories,
    isCategoriesLoading,
    error: categoriesError,
  } = useCategories();

  const [title, setTitle] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isExpense, setIsExpense] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCreate = async () => {
    if (!title.trim())
      return messageAlert("Please enter a transaction title", "Error");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      messageAlert("Please enter a valid amount", "Error");
      return;
    }
    if (!selectedCategory)
      return Alert.alert("Error", "Please select a category");
    setIsLoading(true);
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));
      await httpApi.post("/transactions", {
        title,
        amount: formattedAmount,
        categoryId: selectedCategory,
      });
      setTitle("");
      setAmount("");
      messageAlert("transaction added", "Success");
    } catch (error) {
      if (isAxiosError(error)) {
        messageAlert(error.message, "Error");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/")}
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
      <View style={styles.card}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                isExpense && styles.typeButtonTextActive,
              ]}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text
              style={[
                styles.typeButtonText,
                !isExpense && styles.typeButtonTextActive,
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>
        {/* AMOUNT CONTAINER */}
        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>
        {/* INPUT CONTAINER */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        {/* TITLE */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />{" "}
          Category
        </Text>
        <View style={styles.categoryGrid}>
          {categories.length === 0 && <Text>No any category</Text>}
          {isCategoriesLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          )}
          {categoriesError && (
            <Text>There is error with categories fetching</Text>
          )}
          {categories.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={
                  selectedCategory === item.id ? COLORS.white : COLORS.text
                }
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === item.id &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
