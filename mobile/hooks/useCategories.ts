import { httpApi } from "@/api/http";
import { Category } from "@/types";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";

const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] =
    useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const { data } = await httpApi.get<Category[]>("/categories");
        setCategories(data);
      } catch (error) {
        if (isAxiosError(error)) {
          setError(error.message);
        }
      } finally {
        setIsCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return {
    categories,
    isCategoriesLoading,
    error,
  };
};
export default useCategories;
