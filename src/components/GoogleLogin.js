import React, { useEffect } from 'react';
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
          axios.post('https://backend-app-jbun.onrender.com/signInGoogle', { user });
          Alert.alert('Logged in!', `You are now logged in as ${user.email}`);
          navigationr.navigate('HomeScreen');
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
});