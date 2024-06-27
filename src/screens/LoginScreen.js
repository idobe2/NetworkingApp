import React, { useState } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Alert,
  ActivityIndicator,
} from "react-native"; // 1. Import ActivityIndicator
import { Text, IconButton } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";
import { useAuth } from "../../AuthContext";


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 2. Add isLoading state
  const { setIsAuthenticated } = useAuth();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLoginPressed = async () => {
    try {
      setIsLoading(true); // Start loading
      const response = await userApi.userLogin(email, password);
  
      if (response === null) {
        console.log("response is null");
        setIsLoading(false); // Stop loading
        return;
      }
  
      console.log("response from Api:", response);  
      if (response.success) {
        // console.log("Navigating to Home with userId:", response.userId);
        setIsAuthenticated(true);
        navigation.navigate("Root", { 
          screen: "Home",
        });
      } else {
        const targetScreen = response.tranferTo;
        setIsAuthenticated(true);
        console.log("targetScreen:", targetScreen);
  
        if (targetScreen === "Preferences") {
          // console.log("Navigating to Preferences with userId:", response.userId);
          setIsAuthenticated(true);
          navigation.navigate("Root", {
            screen: targetScreen,
          });
        } else {
          // console.log("Navigating to", targetScreen, "with userId:", response.userId);
          setIsAuthenticated(true);
          navigation.navigate(targetScreen);
        }
      }
    } catch (error) {
      console.log("Error:", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };
  
  
  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
      <TextInput
        placeholder="Email"
        TextInput={email}
        onChangeText={(text) => setEmail(text)}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password.value}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={!showPassword}
          style={[styles.input, { paddingRight: 40 }]}
        />
        <IconButton
          icon={showPassword ? "eye-off" : "eye"}
          onPress={handleTogglePasswordVisibility}
          style={[
            styles.iconButton,
            { position: "absolute", right: 10, bottom: 15 },
          ]}
        />
      </View>
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} /> // Display the loading indicator
      ) : (
        <Button mode="contained" onPress={onLoginPressed}>
          Login
        </Button>
      )}
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("RegisterScreen")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface, // Background color to match TextInput style
    borderColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: 10,
    height: 80, // Adjust height to match TextInput style
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.surface,
  },
  iconButton: {
    margin: 0, // Adjust position of icon
  },
});
