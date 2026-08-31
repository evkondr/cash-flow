// react custom hook file

import { httpApi } from "@/api/http";
import { Summary, Transaction } from "@/types";
import messageAlert from "@/utils/message-alert";
import { isAxiosError } from "axios";
import { useCallback, useState } from "react";

export const useTransactions = (userId: string) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await httpApi<Transaction[]>(`/transactions`);
      setTransactions(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        messageAlert(error.message, "Error");
      }
      console.error("Error fetching transactions:", error);
    }
  }, []);

  const fetchSummary = useCallback(async () => {
    try {
      const response = await httpApi(`/transactions/summary/`);
      setSummary(response.data);
    } catch (error) {
      if (isAxiosError(error)) {
        messageAlert(error.message, "Error");
      }
      console.error("Error fetching summary:", error);
    }
  }, []);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // can be run in parallel
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      if (isAxiosError(error)) {
        messageAlert(error.message, "Error");
      }
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = async (id: number) => {
    try {
      await httpApi(`/transactions/${id}`, {
        method: "DELETE",
      });
      // Refresh data after deletion
      loadData();
      messageAlert("Transaction deleted successfully0", "Success");
    } catch (error) {
      if (isAxiosError(error)) {
        messageAlert(error.message, "Error");
      }
      console.error("Error deleting transaction:", error);
    }
  };

  return { transactions, summary, isLoading, loadData, deleteTransaction };
};
