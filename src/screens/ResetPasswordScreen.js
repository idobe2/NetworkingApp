import React, { useState } from 'react';
import { Alert } from 'react-native';
import Background from '../components/Background';
import BackButton from '../components/BackButton';
import Logo from '../components/Logo';
import Header from '../components/Header';
import TextInput from '../components/TextInput'
import Button from '../components/Button'
import { emailValidator } from '../helpers/emailValidator';
import axios from 'axios';

export default function ResetPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const apiUrl = 'https://backend-app-jbun.onrender.com';
  const [response, setResponse] = useState('');

  const sendResetPasswordEmail = async () => {
    console.log('email', email);
    const emailError = emailValidator(email);
    if (!emailError) {
      try {
        console.log('email2', email);
        const response_mail = await axios.post(apiUrl + '/resetPass', { email });
        setResponse(response_mail.data);
        Alert.alert(response_mail.data);
        console.log(response_mail.data);
        navigation.navigate('LoginScreen')
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An error occurred. Please try again.');
      }
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
