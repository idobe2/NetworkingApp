import React, { useState } from 'react'
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native'
import { Text } from 'react-native-paper'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import { emailValidator } from '../helpers/emailValidator'
import { passwordValidator } from '../helpers/passwordValidator'
import axios from 'axios';
import Toast from '../components/Toast'
import SocialLogins from '../components/SocialLogins'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [serverResponse, setServerResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const apiUrl = 'http://10.100.102.25:3000';

  let credentials = {
    email: '',
    password: '',
  };

  const onLoginPressed = async () => {
    try {
      credentials = {
        email,
        password,
      };
      console.log("pass:", credentials.password ,"email", credentials.email)
      setIsAuthenticated(false);
      const responseFromServer = await axios.post(`https://backend-app-jbun.onrender.com/post_signin`, { credentials });
      console.log("enter 2");
      setServerResponse(responseFromServer.data);
      console.log("res:", responseFromServer.data);
      if (responseFromServer.data === 'Welcome !') {
        navigation.replace('HomeScreen')
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      if (responseFromServer.data === 'You need to verify your email'){
        Alert.alert(responseFromServer.data);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

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
            <TextInput
                placeholder="Password"
                TextInput={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ResetPasswordScreen')}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
       
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
