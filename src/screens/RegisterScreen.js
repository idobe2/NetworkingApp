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
import { signUpUser } from '../api/auth-api'
import Toast from '../components/Toast'
import SocialLogins from '../components/SocialLogins'

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' })
  const [email, setEmail] = useState({ value: '', error: '' })
  const [password, setPassword] = useState({ value: '', error: '' })
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' })
  const [emailResponse, setEmailResponse] = useState('');
  const [passwordResponse, setPasswordResponse] = useState('');
  const [response, setResponse] = useState('');
  const apiUrl = 'https://backend-app-jbun.onrender.com';



  const handleSignup = async () => {
    if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match, please try again');
        return;
    } else {
        try {
            const response_mail = await axios.post(apiUrl +'/post_email', { email });
            const response_password = await axios.post(
                apiUrl + '/post_password',
                { password },
            );
            setEmailResponse(response_mail.data);
            setPasswordResponse(response_password.data);
            if (response_mail.data !== 'Email is available') {
                Alert.alert(response_mail.data);
                console.log('check1');
            } else if (response_password.data !== 'Password received') {
                Alert.alert(response_password.data);
                console.log('check2');
            }
            if (response_mail.data === 'Email is available' && response_password.data === 'Password received' ){
                console.log('check3, enter res');
                const post_response = await axios.post(apiUrl + '/signup', {
                    email,
                    password,
                });
                setResponse(post_response.data)
                console.log('post_response:', post_response.data.success);
                console.log('post_response:', post_response.data.userId);
                if (post_response.data.success) {
                  console.log('check3');
                    Alert.alert('Success', 'Email verification sent');
                    
                    // Navigate to DetailsScreen with UID as parameter
                    navigation.navigate('DetailsScreen', { userId: post_response.data.userId });
                }
                console.log('response:', response);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error',  'Error signing up');
        }
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
                TextInput={email}
                onChangeText={(text) => setEmail(text)}
            />
            <TextInput
                placeholder="Password"
                TextInput={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry
            />
            <TextInput
                placeholder="Confirm password"
                TextInput={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
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
