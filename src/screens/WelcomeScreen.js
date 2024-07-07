import React from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import HomeBackground from "../components/HomeBackground";
import BackButton from "../components/BackButton";
import Button from "../components/Button";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";

const { width: screenWidth } = Dimensions.get("window");

const WelcomeScreen = ({ navigation }) => {
  const pages = [
    {
      title: "Welcome to Tripy",
      text: "Discover amazing features that will make your trip better.",
      image: require("../assets/welcome.gif"),
    },
    {
      title: "Stay On Track",
      text: "Plan your trip and keep track of your activities with ease.",
      image: require("../assets/stay_on_track.gif"),
    },
    {
      title: "Explore New Features",
      text: "Check out the latest updates and new functionalities.",
      image: require("../assets/explore_features.gif"),
    },
    {
      title: "Get Started",
      text: "Create your first plan and start your adventure!",
      image: require("../assets/get_started.gif"),
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
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const navigateToPage = (pageIndex) => {
    currentPage.value = pageIndex;
    translateX.value = withSpring(pageIndex * -screenWidth);
  };

  return (
    <HomeBackground>
      <BackButton goBack={navigation.goBack} />
      <View style={styles.outerContainer}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => navigateToPage(Math.max(currentPage.value - 1, 0))}
        >
          <Header>{"⬅️"}</Header>
        </TouchableOpacity>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.container, animatedStyle]}>
            {pages.map((page, index) => (
              <View key={index} style={[styles.page, { width: screenWidth }]}>
                <Header>{page.title}</Header>
                <Image source={page.image} style={styles.image} />
                <Paragraph>{page.text}</Paragraph>
                {index === pages.length - 1 && (
                  <View style={styles.startButtonContainer}>
                    <Button
                      mode="contained"
                      onPress={() => navigation.navigate("Planner")}
                    >
                      Start
                    </Button>
                  </View>
                )}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() =>
            navigateToPage(Math.min(currentPage.value + 1, pages.length - 1))
          }
        >
          <Header>{"➡️"}</Header>
        </TouchableOpacity>
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
    </HomeBackground>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    flex: 1,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  pagination: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
    margin: 8,
  },
  leftButton: {
    position: "absolute",
    left: 20,
    top: "50%",
    transform: [{ translateY: -25 }],
    zIndex: 1,
  },
  rightButton: {
    position: "absolute",
    right: 20,
    top: "50%",
    transform: [{ translateY: -25 }],
    zIndex: 1,
  },
  startButtonContainer: {
    position: "absolute",
    bottom: 60,
    left: 150,
    right: 150,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default WelcomeScreen;
