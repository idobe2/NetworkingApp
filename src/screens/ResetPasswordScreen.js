import React, { useState } from "react";
import { Alert } from "react-native";
import Background from "../components/Background";
import BackButton from "../components/BackButton";
import Logo from "../components/Logo";
import Header from "../components/Header";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { emailValidator } from "../helpers/emailValidator";
import userApi from "../api/UserApi";

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const sendResetPasswordEmail = async () => {
    const emailError = emailValidator(email);
    if (!emailError) {
      try {
        const response = await userApi.userResetPassword(email);
        Alert.alert(response.message);
        if (response.success) {
          navigation.navigate("LoginScreen");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An error occurred. Please try again.");
      }
    } else {
      Alert.alert("Error", emailError);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Restore Password</Header>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button
        mode="contained"
        onPress={sendResetPasswordEmail}
        style={{ marginTop: 16 }}
      >
        Send Instructions
      </Button>
    </Background>
  );
}
