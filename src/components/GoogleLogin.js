import React, { useEffect, useState } from "react";
import { View, ToastAndroid, StyleSheet } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import * as WebBrowser from "expo-web-browser";
import { WEB_GOOGLE_CLIENT_ID } from "../core/config";
import { useNavigation } from "@react-navigation/native";
import userApi from "../api/UserApi";
import { useAuth } from "../common/AuthContext";

WebBrowser.maybeCompleteAuthSession();

const GoogleLogin = ({ setLoading }) => {
  const navigation = useNavigation();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_GOOGLE_CLIENT_ID,
      offlineAccess: true,
      scopes: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.birthday.read",
        "https://www.googleapis.com/auth/user.gender.read",
      ],
    });
  }, []);

  const signIn = async () => {
    try {
      setLoading(true);
      const response = await userApi.userGoogleLogin();
      if (response.data.success) {
        setIsAuthenticated(true);
        navigation.navigate("Root", { screen: "Home" });
        console.log("User has authenticated");
        ToastAndroid.show("Welcome Back", ToastAndroid.TOP);
      } else if (!response.data.success) {
        setIsAuthenticated(true);
        const screenType = "login";
        navigation.navigate("Root", {
          screen: "Preferences",
          params: { screenType },
        });
        ToastAndroid.show("Welcome Back", ToastAndroid.TOP);
      } else {
        console.log("Google login failed:", response.error);
      }
    } catch (error) {
      console.log("Error in Google login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GoogleSigninButton
        style={{ width: 250, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />
    </View>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
