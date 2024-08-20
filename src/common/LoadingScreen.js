import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

const LoadingScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  // Logo fade animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(
          fadeAnim,
          {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }
        ),
        Animated.timing(
          fadeAnim,
          {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
            easing: Easing.linear,
          }
        )
      ])
    ).start();
  }, [fadeAnim]);

  // Progress bar animation
  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(progress, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
        easing: Easing.linear
      }).start();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logo, { opacity: fadeAnim }]}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
      <Text style={styles.text}>Loading...</Text>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progressBarWidth }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  logo: {
    marginBottom: 30,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 18,
    color: '#2C3E50',
  },
  progressBarContainer: {
    marginTop: 20,
    height: 20,
    width: '80%',
    backgroundColor: '#DDD',
    borderRadius: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#827353',
    borderRadius: 10,
  },
});

export default LoadingScreen;
