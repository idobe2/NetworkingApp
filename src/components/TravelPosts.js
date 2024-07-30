import React from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity, Alert } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Linking from 'expo-linking';
import Header from "./Header";
import Paragraph from "./Paragraph";

const { width: screenWidth } = Dimensions.get("window");

const TravelPosts = () => {
  const posts = [
    {
      title: "Discover Hidden Gems",
      description: "Explore the lesser-known destinations for a unique experience.",
      image: require("../assets/hidden_gems.png"), // Placeholder image path
      url: "https://medium.com/@positiveaffirmations91/uncovering-the-hidden-gems-exploring-lesser-known-tourist-destinations-b253078a9780", // Placeholder URL
    },
    {
      title: "Best Techno Festivals in 2024",
      description: "Festivals are a great way to have more memorable experiences.",
      image: require("../assets/music_festivals.png"), // Placeholder image path
      url: "https://medium.com/clubnight/best-techno-festivals-2024-in-europe-electronic-music-657d0031e562", // Placeholder URL
    },
    {
      title: "Exploring the Culinary Delights",
      description: "Taste the exquisite cuisines from different cultures around the world.",
      image: require("../assets/culinary_delights.png"), // Placeholder image path
      url: "https://medium.com/@armaanakhan91/exploring-the-culinary-delights-9948bb0b3f6b", // Placeholder URL
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
      } else if (offset < 0 && currentPage.value < posts.length - 1) {
        currentPage.value += 1;
      }
      translateX.value = withSpring(currentPage.value * -screenWidth);
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = (url) => {
    Alert.alert(
      "Open Link",
      "Would you like to open this link?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open",
          onPress: () => Linking.openURL(url),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {posts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.post, { width: screenWidth }]}
              onPress={() => handlePress(post.url)}
            >
              <Header style={styles.title}>{post.title}</Header>
              <Image source={post.image} style={styles.image} />
              <Paragraph style={styles.description}>{post.description}</Paragraph>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </GestureDetector>
      <View style={styles.pagination}>
        {posts.map((_, index) => {
          const dotStyle = useAnimatedStyle(() => {
            return {
              backgroundColor: currentPage.value === index ? "#000" : "#aaa",
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
    marginTop: 100,
 },
  container: {
    flexDirection: "row",
  },
  post: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: 300,
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
    margin: 5,
  },
});

export default TravelPosts;
