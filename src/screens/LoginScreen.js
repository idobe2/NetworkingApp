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
import axios from "axios";
import { SERVER_URL } from "../core/config";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [serverResponse, setServerResponse] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 2. Add isLoading state
  const apiUrl = SERVER_URL;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onLoginPressed = async () => {
    try {
      setIsLoading(true); // 3. Start loading
      setIsAuthenticated(false);
      console.log("enter here:");
      const responseFromServer = await axios.post(SERVER_URL + "/login", {
        email,
        password,
      });
      console.log("enter here2");
      setServerResponse(responseFromServer.data);
      console.log("res:", responseFromServer.data); // TODO: remove this line
      if (responseFromServer.data.success) {
        navigation.navigate("Root", { 
          screen: "Home",
          params: { userId: responseFromServer.data.userId },
         });
      } else {
        console.log("responseFromServer.data:", responseFromServer.data.userId);
        if (responseFromServer.data.tranferTo === "Preferences") {
          navigation.navigate("Root", {
            screen: responseFromServer.data.tranferTo,
            params: { userId: responseFromServer.data.userId },
          });
        } else {
          navigation.navigate(responseFromServer.data.tranferTo, {
            userId: responseFromServer.data.userId,
          });
        }
      }
      if (responseFromServer.data === "You need to verify your email") {
        Alert.alert(responseFromServer.data);
      }
      //TODO: fix the reponse from server
      const responseToFix1 = "Incorrect details " + password;
      const responseToFix2 = " and url: " + email;
      const responseToFix = responseToFix1 + responseToFix2;
      if (responseFromServer.data === responseToFix) {
        Alert.alert("Invalid email or password. Please try again.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // 4. Stop loading
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
