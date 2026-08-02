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
        if (Platform.OS === "web") {
          token = localStorage.getItem("accessToken");
        } else {
          token = await SecureStore.getItemAsync("accessToken");
        }
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
      const response = await httpApi.post(`/auth/${authUrl}`, {
        email,
        password,
      });
      const { refreshToken, accessToken } = response.data;
      if (Platform.OS === "web") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        await SecureStore.setItemAsync("accessToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      }

      setUserToken(accessToken);
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) {
        console.log(error);
        alert(error.message);
      } else {
        alert("Ошибка запроса");
      }
    }
  };
  const logout = async () => {
    await SecureStore.deleteItemAsync("accessToken");
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
