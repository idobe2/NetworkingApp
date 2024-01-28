import React from 'react'
import { TouchableOpacity, StyleSheet, Platform } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import firebase from 'firebase/app'
import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
} from "firebase/auth";
import * as Google from "expo-auth-session/providers/google"
import { GoogleLogo } from '../assets/icons'
import { theme } from '../core/theme'
import { ANDROID_GOOGLE_CLIENT_ID, IOS_GOOGLE_CLIENT_ID } from '../core/config'
import { StartScreen } from '../screens';

WebBrowser.maybeCompleteAuthSession();


export default function GoogleLogin() {
  const [request, response,promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
});

React.useEffect(() => {
  console.log("enter effect", response);
  if (response?.type === "success") {
      const {id_token} = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
  }
 }, [response]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => promptAsync()}>
      <GoogleLogo />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    borderColor: theme.colors.google,
    backgroundColor: theme.colors.surface,
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 8,
    width: 300,
    marginVertical: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
})
