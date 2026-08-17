// react custom hook file

import { httpApi } from "@/api/http";
import { Transaction } from "@/types";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await httpApi<Transaction[]>(`/transactions/${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await httpApi(`/transactions/summary/${userId}`);
      setSummary(response.data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id: string) => {
    try {
      await httpApi(`/transactions/${id}`, {
        method: "DELETE",
      });
      // Refresh data after deletion
      loadData();
      Alert.alert("Success", "Transaction deleted successfully");
    } catch (error) {
      if (isAxiosError(error)) Alert.alert("Error", error.message);
      console.error("Error deleting transaction:", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
