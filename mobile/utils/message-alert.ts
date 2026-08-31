import { Alert, Platform } from "react-native";

const messageAlert = (message: string, severity: "Success" | "Error") => {
  if (Platform.OS === "web") {
    alert(message);
  } else {
    Alert.alert(severity, message);
  }
};

export default messageAlert;
