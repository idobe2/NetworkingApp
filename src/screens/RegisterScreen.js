import React, { useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { Text, IconButton } from 'react-native-paper' // Import IconButton from react-native-paper
import Background from '../components/Background'
import Logo from '../components/Logo'
import Header from '../components/Header'
import Button from '../components/Button'
import TextInput from '../components/TextInput'
import BackButton from '../components/BackButton'
import { theme } from '../core/theme'
import axios from 'axios';
import { SERVER_URL } from '../core/config';


export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState({ value: '', error: '' });
  const [email, setEmail] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });
  const [showPassword, setShowPassword] = useState(false); // State to manage password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State to manage confirm password visibility
  const [emailResponse, setEmailResponse] = useState('');
  const [passwordResponse, setPasswordResponse] = useState('');
  const [response, setResponse] = useState('');
  const apiUrl = SERVER_URL;

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
                    Alert.alert('You have successfully registered', 'Email verification sent');
                    
                    // Navigate to DetailsScreen with UID as parameter
                    navigation.navigate('LoginScreen');
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
    <TextInput
      placeholder="Email"
      value={email.value}
      onChangeText={(text) => setEmail(text)}
    />
    <View style={styles.passwordContainer}>
  <TextInput
    placeholder="Password"
    value={password.value}
    onChangeText={(text) => setPassword(text)}
    secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
    style={styles.input}
  />
  <IconButton // Eye icon button to toggle password visibility
    icon={showPassword ? 'eye-off' : 'eye'}
    onPress={handleTogglePasswordVisibility}
    style={styles.iconButton}
  />
</View>
<View style={styles.passwordContainer}>
  <TextInput
    placeholder="Confirm password"
    value={confirmPassword.value}
    onChangeText={(text) => setConfirmPassword(text)}
    secureTextEntry={!showConfirmPassword} // Toggle secureTextEntry based on showConfirmPassword state
    style={styles.input}
  />
  <IconButton // Eye icon button to toggle password visibility
    icon={showConfirmPassword ? 'eye-off' : 'eye'}
    onPress={handleToggleConfirmPasswordVisibility}
    style={styles.iconButton}
  />
</View>
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
);
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
  passwordContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface, // Background color to match TextInput style
    borderColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: 10,
    height: 80, // Adjust height to match TextInput style
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.surface,
  },
  iconButton: {
    margin: -40, // Adjust position of icon
  },
});




