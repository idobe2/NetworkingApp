import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
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
import { nameValidator } from '../helpers/nameValidator'
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [emailResponse, setEmailResponse] = useState('');
  const [passwordResponse, setPasswordResponse] = useState('');
  const [response, setResponse] = useState('');
  const apiUrl = 'http://10.100.102.25:3000';

  // const onSignUpPressed = () => {
  //   const nameError = nameValidator(name.value)
  //   const emailError = emailValidator(email.value)
  //   const passwordError = passwordValidator(password.value)
  //   if (emailError || passwordError || nameError) {
  //     setName({ ...name, error: nameError })
  //     setEmail({ ...email, error: emailError })
  //     setPassword({ ...password, error: passwordError })
  //     return
  //   }
  //   navigation.reset({
  //     index: 0,
  //     routes: [{ name: 'Dashboard' }],
  //   })
  // }



  const handleSignup = async () => {
    try {
        const response_mail = await axios.post(`${apiUrl}/post_email`, { email });
        const response_password = await axios.post(
            `${apiUrl}/post_password`,
            { password },
        );
        setEmailResponse(response_mail.data);
        setPasswordResponse(response_password.data);
        if (response_mail.data !== 'Email is available') {
            Alert.alert(response_mail.data);
            console.log('check1');
        }
        else if (response_password.data !== 'Password received') {
            Alert.alert(response_password.data);
            console.log('check2');
        }
        if (response_mail.data === 'Email is available' && response_password.data === 'Password received' ){
            const post_response = await axios.post(`${apiUrl}/signup`, {
            email,
            password,
        });
            setResponse(post_response.data)
            if (post_response.data  === 'yes')
                Alert.alert('Success', 'Email verification sent');
            console.log(response);
        }


    } catch (error) {
        console.error(error);
        Alert.alert('Error',  'Error signing up');
    }
};

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      {/* <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: '' })}
        error={!!name.error}
        errorText={name.error}
      /> */}
       <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
      <Button
        mode="contained"
        onPress={handleSignup}
        style={{ marginTop: 24 }}
        title="Sign Up"
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
})
