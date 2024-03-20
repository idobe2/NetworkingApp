import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
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
import axios from "axios";
import { SERVER_URL } from "../core/config";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    error: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 2. Add isLoading state
  const apiUrl = SERVER_URL;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async () => {
    setIsLoading(true); // Start loading
    if (password.value !== confirmPassword.value) {
      Alert.alert("Error", "Passwords do not match, please try again");
      setIsLoading(false); // Stop loading
      return;
    } else {
      try {
        const response_mail = await axios.post(apiUrl + "/post_email", {
          email: email.value,
        });
        const response_password = await axios.post(apiUrl + "/post_password", {
          password: password.value,
        });
        if (
          response_mail.data !== "Email is available" ||
          response_password.data !== "Password received"
        ) {
          Alert.alert("Error", response_mail.data || response_password.data);
          setIsLoading(false); // Stop loading
          return;
        }
        const post_response = await axios.post(apiUrl + "/signup", {
          email: email.value,
          password: password.value,
        });
        if (post_response.data.success) {
          Alert.alert(
            "Success",
            "You have successfully registered. Email verification sent."
          );
          navigation.navigate("LoginScreen");
        } else {
          Alert.alert(
            "Error",
            post_response.data.message || "Error signing up"
          );
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "Error signing up");
      } finally {
        setIsLoading(false); // Stop loading
      }
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
          style={[styles.input, { paddingRight: 40 }]} // Add padding to avoid text overlap with the icon
        />
        <IconButton
          icon={showPassword ? "eye-off" : "eye"}
          onPress={handleTogglePasswordVisibility}
          style={[
            styles.iconButton,
            { position: "absolute", right: 10, bottom: 15 },
          ]} // Adjust position as needed
        />
      </View>
      <View style={styles.passwordContainer}>
        <TextInput
          label="Confirm Password"
          returnKeyType="done"
          value={confirmPassword.value}
          onChangeText={(text) =>
            setConfirmPassword({ value: text, error: "" })
          }
          secureTextEntry={!showConfirmPassword}
          style={[styles.input, { paddingRight: 40 }]} // Add padding to avoid text overlap with the icon
        />
        <IconButton
          icon={showConfirmPassword ? "eye-off" : "eye"}
          onPress={handleToggleConfirmPasswordVisibility}
          style={[
            styles.iconButton,
            { position: "absolute", right: 10, bottom: 15 },
          ]} // Adjust position as needed
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSignup}
          style={{ marginTop: 24 }}
        >
          Sign Up
        </Button>
      )}
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
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
