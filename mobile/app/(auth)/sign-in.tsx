import { styles } from "@/assets/styles/auth.styles";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../components/AuthContext";

const SignIn = () => {
  const { authorize, isLoading } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatPassword, setRepeatPassword] = useState<string>("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [repeatPasswordError, setRepeatPasswordError] = useState("");
  const [isRegistration, setIsRegistration] = useState(true);
  const resetFields = () => {
    setEmail("");
    setPassword("");
  };
  const onSubmitPress = () => {
    authorize(email, password, isRegistration);
    resetFields();
  };
  const handleSingPress = () => {
    setIsRegistration(!isRegistration);
    resetFields();
  };
  const handleEmailInputChange = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) {
      setEmailError("Email is required.");
    } else if (!emailRegex.test(value)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
    setEmail(value);
  };
  const handlePasswordInputChange = (value: string) => {
    if (!value.length) {
      setPasswordError("Password is required.");
    } else if (value.length < 6) {
      setPasswordError("Min length 6.");
    } else {
      setPasswordError("");
    }
    setPassword(value);
  };
  const handleRepeatPasswordInputChange = (value: string) => {
    if (value.length < 6 || value !== password) {
      setRepeatPasswordError("Passwords do not match.");
    } else {
      setRepeatPasswordError("");
    }
    setRepeatPassword(value);
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>
          {isRegistration ? "Create account?" : "Welcome Back"}
        </Text>
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={[styles.input, emailError && styles.errorInput]}
            value={email}
            placeholder="Enter email"
            placeholderTextColor="#9A8478"
            onChangeText={handleEmailInputChange}
          />
          {emailError ? (
            <Text style={styles.errorInputText}>{emailError}</Text>
          ) : null}
        </View>
        <View style={{ marginBottom: 16 }}>
          <TextInput
            style={[styles.input, passwordError && styles.errorInput]}
            value={password}
            placeholder="Enter password"
            placeholderTextColor="#9A8478"
            secureTextEntry={true}
            onChangeText={handlePasswordInputChange}
          />
          {passwordError ? (
            <Text style={styles.errorInputText}>{passwordError}</Text>
          ) : null}
        </View>
        {isRegistration && (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              style={[styles.input, repeatPasswordError && styles.errorInput]}
              value={repeatPassword}
              placeholder="Repeat password"
              placeholderTextColor="#9A8478"
              secureTextEntry={true}
              onChangeText={handleRepeatPasswordInputChange}
            />
            {repeatPasswordError ? (
              <Text style={styles.errorInputText}>{repeatPasswordError}</Text>
            ) : null}
          </View>
        )}
        <TouchableOpacity
          disabled={isLoading}
          style={styles.button}
          onPress={onSubmitPress}
        >
          <Text style={styles.buttonText}>
            {isRegistration ? "Sign Up" : "Sing In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isRegistration
              ? "Already have an account?"
              : "Don't have an account?"}
          </Text>
          <TouchableOpacity onPress={handleSingPress}>
            <Text style={styles.linkText}>
              {isRegistration ? "Sign In?" : "Sing Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default SignIn;
