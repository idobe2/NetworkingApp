import React from 'react'
import Background from '../components/Background'
import Logo from '../components/Logo'
import Button from '../components/Button'
import Paragraph from '../components/Paragraph'
import SocialLogins from '../components/SocialLogins'

export default function StartScreen({ navigation }) {
  return (
    <Background>
      <Logo />
      {/* <Header>Tripy</Header> */}
      <Paragraph>
        The easiest way to start with your amazing trip.
      </Paragraph>
      {/* <GoogleLogin GoogleLogin={navigation.GoogleLogin}/>
      <FacebookLogin FacebookLogin={navigation.FacebookLogin} /> */}
      <Button
        mode="contained"
        onPress={() => navigation.navigate('Root' ,{ screen: 'Home' })}
      >
        Login
      </Button>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('RegisterScreen')}
      >
        Sign Up
      </Button>
      <SocialLogins SocialLogins={navigation.SocialLogins}/>
    </Background>
  )
}
