
import React, { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { theme } from '../core/theme';
import { FacebookIcon } from '../assets/icons';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import FACEBOOK_APP_ID from '../core/config';
import FIREBASE_CONFIG from '../core/config';
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from '../core/firebaseConfig';
import axios from 'axios';



WebBrowser.maybeCompleteAuthSession();

export default function FacebookLogin() {
  const [user, setUser] = useState(null); 
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "873805167813153",
    redirectUri: 'fb873805167813153://authorize',
  });

  const navigationr = useNavigation(); // Corrected typo


 React.useEffect(() => {
    if (response?.type === 'success' && response?.authentication) {
      const accessToken = response.authentication.accessToken;
      const credential = FacebookAuthProvider.credential(accessToken);
      // const accessToken = credential.accessToken
      signInWithCredential(auth, credential)
      .then((result) => {
        const user = result.user;
        console.log('Successfully signed in with Google', user.email);
        axios.post('https://backend-app-jbun.onrender.com/signInGoogle', { user });
        Alert.alert('Logged in!', `You are now logged in as ${user.email}`);
        navigationr.navigate('HomeScreen'); // This seems to be a typo, should be navigation.navigate
      })
      .catch((error) => {
        console.error('Error signing in with Google', error);
      });

    }
  }, [response]);


  const signInWithFacebook = async () => {
    const result = await promptAsync();
    if (result.type !== 'success') {
      Alert.alert('Error', 'An error occurred. Please try again.');
      return;
    }
  }

  return (
    <TouchableOpacity onPress={signInWithFacebook} style={styles.container}>
      <FacebookIcon />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.facebook,
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
});
