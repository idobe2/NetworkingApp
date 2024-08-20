import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import SocialLogins from '../components/SocialLogins'
import AnimatedLogo from "../common/AnimatedLogo"

export default function StartScreen({ navigation }) {
  const [loading, setLoading] = useState(false);

  return (
    <Background>
      <Logo />
      <Paragraph>
        The easiest way to start with your amazing trip.
      </Paragraph>
      <Button
        style={{ bottom: -5 }}
        mode="contained"
        onPress={() => navigation.navigate('LoginScreen')}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
      <SocialLogins setLoading={setLoading} />
      {loading && (
        <View style={styles.loadingOverlay}>
          <AnimatedLogo />
        </View>
      )}
    </Background>
  )
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 1,
  },
})