import React from 'react';
import { ImageBackground, StyleSheet, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { theme } from '../core/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeBackground({ children }) {
  return (
    <ImageBackground
      source={require('../assets/background_home.png')}
      resizeMode="repeat"
      style={styles.background}
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.surface}
      />
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.safeArea}>
          {children}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    backgroundColor: theme.colors.surface,
  },
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
  },
});
