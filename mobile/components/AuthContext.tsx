import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

const API_URL = "http://10.0.2";

interface IAuthContext {
  userToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}
const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      let token: string | null = null;
      try {
        token = await SecureStore.getItemAsync("userToken");
      } catch (e) {
        console.log("Ошибка чтения токена", e);
      }
      if (!token) setUserToken(token);

      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
      });
      const { token } = response.data;

      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    } catch (error) {
      if (isAxiosError(error)) {
        Alert.alert(error.response?.data?.error || "Ошибка входа");
      }
    }
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, login, logout }}>
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
