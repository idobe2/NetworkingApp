import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width: screenWidth } = Dimensions.get('window');

const WelcomeScreen = () => {
  const pages = [
    {
      title: 'Welcome to Tripy',
      text: 'Discover amazing features that will make your trip better.',
    },
    {
      title: 'Stay Connected',
      text: 'Connect with friends and share your experiences.',
    },
    {
      title: 'Explore New Features',
      text: 'Check out the latest updates and new functionalities.',
    },
    {
      title: 'Get Started',
      text: 'Sign up or log in to begin your journey with Tripy.',
    },
  ];

  const translateX = useSharedValue(0);
  const currentPage = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX - currentPage.value * screenWidth;
    })
    .onEnd((event) => {
        const offset = event.translationX;
        if (offset > 0 && currentPage.value > 0) {
            currentPage.value -= 1;
        } else if (offset < 0 && currentPage.value < pages.length - 1) {
            currentPage.value += 1;
        }
        translateX.value = withSpring(currentPage.value * -screenWidth);
        }
    );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {pages.map((page, index) => (
            <View key={index} style={[styles.page, { width: screenWidth }]}>
              <Text style={styles.title}>{page.title}</Text>
              <Text style={styles.text}>{page.text}</Text>
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
      <View style={styles.pagination}>
        {pages.map((_, index) => {
          const dotStyle = useAnimatedStyle(() => {
            return {
              opacity: currentPage.value === index ? 1 : 0.5,
            };
          });
          return <Animated.View key={index} style={[styles.dot, dotStyle]} />;
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
    margin: 8,
  },
});

export default WelcomeScreen;