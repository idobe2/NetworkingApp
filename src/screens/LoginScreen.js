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
import axios from 'axios';
import { SERVER_URL } from '../core/config';


export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [serverResponse, setServerResponse] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHaveDetails, setIsHaveDetails] = useState(false)
  const apiUrl = SERVER_URL;

  let credentials = {
    email: '',
    password: '',
  };

  const onLoginPressed = async () => {
    try {
      setIsAuthenticated(false);
      const responseFromServer = await axios.post(SERVER_URL + '/login', { email, password });
      setServerResponse(responseFromServer.data);
      console.log("res:", responseFromServer.data); // TODO: remove this line
      if (responseFromServer.data.success) {
        navigation.navigate('Root' ,{ screen: 'Home' })
      } else  {
        console.log('responseFromServer.data:', responseFromServer.data.userId);
        navigation.navigate('DetailsScreen', { userId: responseFromServer.data.userId });
      }
      if (responseFromServer.data === 'You need to verify your email'){
        Alert.alert(responseFromServer.data);
      }
      //TODO: fix the reponse from server
      const responseToFix1 = 'Incorrect details ' +password;
      const responseToFix2 = ' and url: ' +email;
      const responseToFix = responseToFix1+responseToFix2;
      if (responseFromServer.data === responseToFix){ 
        Alert.alert('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred. Please try again.');
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
