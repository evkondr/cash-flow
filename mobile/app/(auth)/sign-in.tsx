import { styles } from "@/assets/styles/auth.styles";
import { COLORS } from "@/constants/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../components/AuthContext";

const SignIn = () => {
  const { authorize } = useAuth();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isRegistration, setIsRegistration] = useState(true);
  const onSubmitPress = () => {
    authorize(email, password, isRegistration);
  };
  return (
    <View>
      <View style={styles.container}>
        <Image
          source={require("../../assets/images/revenue-i4.png")}
          style={styles.illustration}
        />
        <Text style={styles.title}>
          {isRegistration ? "Create account?" : "Welcome Back"}
        </Text>
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={email}
          placeholder="Enter email"
          placeholderTextColor="#9A8478"
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, error && styles.errorInput]}
          value={password}
          placeholder="Enter password"
          placeholderTextColor="#9A8478"
          secureTextEntry={true}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={onSubmitPress}>
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
          <TouchableOpacity onPress={() => setIsRegistration(!isRegistration)}>
            <Text style={styles.linkText}>
              {isRegistration ? "Sign In?" : "Sing Up"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
