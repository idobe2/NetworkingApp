/* import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Alert} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import firebase from 'firebase/app';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signOut
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleLogo } from '../assets/icons';
import { theme } from '../core/theme';
import { ANDROID_GOOGLE_CLIENT_ID, WEB_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID} from '../core/config';
import { auth } from '../core/firebaseConfig';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import clientApi from '../api/ClientApi';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [userinfo, setUserinfo] = React.useState();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
    iosClientId: IOS_GOOGLE_CLIENT_ID,
    webClientId: WEB_GOOGLE_CLIENT_ID,
  });

  const navigationr = useNavigation();

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
  
      const credential = GoogleAuthProvider.credential(id_token);
  
      signInWithCredential(auth, credential)
        .then((result) => {
          const user = result.user;
          console.log('Successfully signed in with Google', user.email);
          clientApi.post('/signInGoogle', { user });
          // axios.post('https://backend-app-jbun.onrender.com/signInGoogle', { user });
          Alert.alert('Logged in!', You are now logged in as ${user.email});
          navigationr.navigate('Root' ,{ screen: 'Home' });
        })
        .catch((error) => {
          console.error('Error signing in with Google', error);
        });
    }
  }, [response]);

  const handleGoogleSignIn = async () => {
    // Clear Firebase session before signing in
    await signOut(auth);

    // Initiate Google sign-in
    promptAsync();
    
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleGoogleSignIn}>
      <GoogleLogo />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.google,
    backgroundColor: theme.colors.surface,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    width: 50,
    marginVertical: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
}); */

import React, { useEffect, useState } from "react";
import {
  View,
  ToastAndroid,
  StyleSheet,
} from "react-native";
import { GoogleSignin, GoogleSigninButton, statusCodes } from "@react-native-google-signin/google-signin";
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
        ToastAndroid.show("Welcome Back", ToastAndroid.TOP);
      } else if (!response.data.success) {
        setIsAuthenticated(true);
        navigation.navigate("Root", { screen: "Preferences" });
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