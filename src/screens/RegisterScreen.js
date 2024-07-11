import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator, confirmValidator } from "../helpers/passwordValidator";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../components/TextInput";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (emailTouched) {
      setEmailError(emailValidator(email));
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(passwordValidator(password));
    }
  }, [password, passwordTouched]);

  useEffect(() => {
    if (confirmPasswordTouched) {
      setConfirmPasswordError(confirmValidator(password, confirmPassword));
    }
  }, [confirmPassword, password, confirmPasswordTouched]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSignup = async () => {
    setIsLoading(true);
    const response = await userApi.userSignup(email, password, confirmPassword);

    if (response.success) {
      Alert.alert("Success", response.message);
      navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Error", response.message);
    }
    setIsLoading(false); // Stop loading
  };

  const isEmailValid = emailValidator(email) === "";
  const isPasswordValid = passwordValidator(password) === "";
  const isConfirmPasswordValid = confirmValidator(password, confirmPassword) === "";
  const isFormValid = isEmailValid && isPasswordValid && isConfirmPasswordValid;

  return (
    <Background>
       <BackButton goBack={navigation.goBack} />
       <ScrollView contentContainerStyle={styles.scrollViewContent}>

      <KeyboardAvoidingView >
        
          <View >
          <View style={styles.logo}>
       <Logo />
       <Header>Create Account</Header>
       </View>
           
            
            <View style={styles.inputContainer}>
              {emailTouched && emailError ? (
                <Ionicons
                  name="close-circle"
                  size={25}
                  color="#b22222"
                  style={styles.iconLeft}
                />
              ) : isEmailValid && email.length > 0 ? (
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color="green"
                  style={styles.iconLeft}
                />
              ) : null}
              <TextInput
                label="Email"
                returnKeyType="next"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailTouched(true);
                }}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                error={emailError}
                style={styles.textInput}
              />
            </View>
            {emailTouched && emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              {passwordTouched && passwordError ? (
                <Ionicons
                  name="close-circle"
                  size={25}
                  color="#b22222"
                  style={styles.iconLeft}
                />
              ) : isPasswordValid && password.length > 0 ? (
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color="green"
                  style={styles.iconLeft}
                />
              ) : null}
              <TextInput
                label="Password"
                returnKeyType="done"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordTouched(true);
                }}
                secureTextEntry={!showPassword}
                style={styles.textInputWithIcon}
                error={passwordError}
              />
              <IconButton
                icon={showPassword ? "eye-off" : "eye"}
                onPress={handleTogglePasswordVisibility}
                style={styles.iconButton}
              />
            </View>
            {passwordTouched && passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
            <View style={styles.inputContainer}>
              {confirmPasswordTouched && confirmPasswordError ? (
                <Ionicons
                  name="close-circle"
                  size={25}
                  color="#b22222"
                  style={styles.iconLeft}
                />
              ) : isConfirmPasswordValid && confirmPassword.length > 0 ? (
                <Ionicons
                  name="checkmark-circle"
                  size={25}
                  color="green"
                  style={styles.iconLeft}
                />
              ) : null}
              <TextInput
                label="Confirm Password"
                returnKeyType="done"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setConfirmPasswordTouched(true);
                }}
                secureTextEntry={!showConfirmPassword}
                style={styles.textInputWithIcon}
                error={confirmPasswordError}
              />
              <IconButton
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={handleToggleConfirmPasswordVisibility}
                style={styles.iconButton}
              />
            </View>
            {confirmPasswordTouched && confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
            {isLoading ? (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            ) : (
              <Button
                mode="contained"
                onPress={handleSignup}
                style={styles.button}
                disabled={!isFormValid}
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
          </View>
        
      </KeyboardAvoidingView>
      </ScrollView>
    </Background>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
    justifyContent: "center",
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  textInputWithIcon: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingRight: 50, // Space for the icon
  },
  iconButton: {
    position: "absolute",
    right: 5,
    top: 25,
  },
  iconLeft: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    top: 75,
  },
  errorText: {
    color: "#b22222",
    marginLeft: 30,
    marginTop: -3,
    bottom: 7,
  },
  button: {
    marginTop: 24,
  },
  logo: {
    alignItems: "center",
    top: 20,
  },
});

