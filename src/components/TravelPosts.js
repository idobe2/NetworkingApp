import React from "react";
import { View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import Header from "./Header";
import Paragraph from "./Paragraph";
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get("window");

const TravelPosts = () => {
  const navigation = useNavigation();
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

  // Create a loopable posts array by duplicating the first and last posts
  const loopedPosts = [posts[posts.length - 1], ...posts, posts[0]];

  const translateX = useSharedValue(-screenWidth); // Start at the first actual post
  const currentPage = useSharedValue(1); // Adjusted for the looped posts

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX - currentPage.value * screenWidth;
    })
    .onEnd((event) => {
      const offset = event.translationX;
      if (offset > 0 && currentPage.value > 0) {
        currentPage.value -= 1;
      } else if (offset < 0 && currentPage.value < loopedPosts.length - 1) {
        currentPage.value += 1;
      }

      // Smooth transition and boundary adjustment
      translateX.value = withSpring(currentPage.value * -screenWidth, {}, () => {
        if (currentPage.value === 0) {
          currentPage.value = loopedPosts.length - 2;
          translateX.value = (currentPage.value * -screenWidth);
        } else if (currentPage.value === loopedPosts.length - 1) {
          currentPage.value = 1;
          translateX.value = (currentPage.value * -screenWidth);
        }
      });
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const handlePress = (url, title) => {
    navigation.navigate("WebViewScreen", { url, title });
  };

  return (
    <View style={styles.outerContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.container, animatedStyle]}>
          {loopedPosts.map((post, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.post, { width: screenWidth }]}
              onPress={() => handlePress(post.url, post.title)}
            >
              <Header style={styles.title}>{post.title}</Header>
              <View style={styles.imageContainer}>
                <Image source={post.image} style={styles.image} />
              </View>
              <Paragraph style={styles.description}>{post.description}</Paragraph>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </GestureDetector>
      <View style={styles.pagination}>
        {posts.map((_, index) => {
          const dotStyle = useAnimatedStyle(() => {
            return {
              backgroundColor: currentPage.value === index + 1 ? "#000" : "#aaa",
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
    marginTop: 50,
  },
  container: {
    flexDirection: "row",
  },
  post: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5, // Android elevation for shadow
    shadowColor: "#000", // iOS shadow properties
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 150,
  },
  title: {
    fontSize: 20,
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
