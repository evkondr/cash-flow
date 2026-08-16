import { httpApi } from "@/api/http";
import { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Platform } from "react-native";

interface IAuthContext {
  userId: string | null;
  isLoading: boolean;
  authorize: (email: string, password: string, isRegistration: boolean) => void;
  logout: () => void;
}
const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await httpApi.get(`/auth/check`);
        setUserId(data.userId);
      } catch (error) {
        setUserId(null);
        console.log(error);
      }
    };
    checkAuth();
  }, []);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const authorize = async (
    email: string,
    password: string,
    isRegistration: boolean,
  ) => {
    setIsLoading(true);
    try {
      const authUrl = isRegistration ? "register" : "login";
      const response = await httpApi.post(`/auth/${authUrl}`, {
        email,
        password,
      });
      const { refreshToken, accessToken, userId } = response.data;
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      }
      setUserId(userId);
      setIsLoading(false);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        alert(error.message);
      } else {
        alert("Ошибка запроса");
      }
      setIsLoading(false);
    }
  };
  const logout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } else {
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    }
  };

  return (
    <AuthContext.Provider value={{ userId, isLoading, authorize, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): IAuthContext => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth должен использоваться строго внутри AuthProvider");
  }
  return context;
};
