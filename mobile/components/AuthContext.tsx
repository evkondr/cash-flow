import axios, { isAxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

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
        if (SecureStore) {
          token = await SecureStore.getItemAsync("userToken");
        } else {
          token = localStorage.getItem("userToken");
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
      const response = await axios.post(`${API_URL}/auth/${authUrl}`, {
        email,
        password,
      });
      const { refreshToken, accessToken } = response.data;
      if (SecureStore) {
        await SecureStore.setItemAsync("userToken", accessToken);
        await SecureStore.setItemAsync("refreshToken", refreshToken);
      } else {
        localStorage.set("userToken", accessToken);
        localStorage.set("refreshToken", refreshToken);
      }

      setUserToken(accessToken);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error);
        alert(error.message);
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
