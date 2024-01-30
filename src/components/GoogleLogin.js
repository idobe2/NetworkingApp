import React, { useEffect } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import firebase from 'firebase/app';
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleLogo } from '../assets/icons';
import { theme } from '../core/theme';
import { ANDROID_GOOGLE_CLIENT_ID } from '../core/config';
import { auth } from '../core/firebaseConfig';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const [userinfo, setUserinfo] = React.useState();
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: ANDROID_GOOGLE_CLIENT_ID,
    webClientId: '826066565685-qoiplj4jcnc0pudaqkhm7aqk6t4qflr2.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    console.log('response', response);
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log('Successfully signed in with Google', user);
        })
        .catch((error) => {
          console.error('Error signing in with Google', error);
        });
    }
  }, [response]);

  return (
    <TouchableOpacity style={styles.container} onPress={() => promptAsync()}>
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
    width: 300,
    marginVertical: 10,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 8,
  },
});