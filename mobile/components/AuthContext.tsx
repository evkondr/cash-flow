import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = "http://localhost:4000";

interface IAuthContext {
  userToken: string | null;
  isLoading: boolean;
  authorize: (email: string, password: string, isRegistration: boolean) => void;
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

  const authorize = async (
    email: string,
    password: string,
    isRegistration: boolean,
  ) => {
    try {
      const authUrl = isRegistration ? "register" : "login";
      const response = await axios.post(`${API_URL}/${authUrl}}`, {
        email,
        password,
      });
      const { token } = response.data;

      await SecureStore.setItemAsync("userToken", token);
      setUserToken(token);
    } catch (error) {
      if (isAxiosError(error)) {
        alert(error.response?.data?.error || "Ошибка запроса");
      } else {
        alert("Ошибка запроса");
      }
    }
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync("userToken");
    setUserToken(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, isLoading, authorize, logout }}>
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
