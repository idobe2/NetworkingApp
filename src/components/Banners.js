import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const Banners = ({ onBannerPress }) => {
  const banners = [
    { id: 1, text: "Getting Started", image: require('../assets/get_started.png'), icon: "rocket" },
    { id: 2, text: "Next Activities", image: require('../assets/next_activities.png'), icon: "calendar" },
    // { id: 3, text: "Information", image: require('./assets/information.jpg'), icon: "info-circle" },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* <Text style={styles.welcomeText}>Welcome to Your Dashboard</Text> */}
      {banners.map((banner) => (
        <TouchableOpacity
          key={banner.id}
          style={styles.bannerWrapper}
          onPress={() => onBannerPress(banner.id)}
        >
          <ImageBackground
            source={banner.image}
            style={styles.banner}
            imageStyle={{ borderRadius: 10 }}
          >
            <View style={styles.iconContainer}>
              <Icon name={banner.icon} size={50} color="rgba(255,255,255, 0.7)" />
            </View>
            <Text style={styles.bannerText}>{banner.text}</Text>
          </ImageBackground>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    paddingHorizontal: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  bannerWrapper: {
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 0.7,
  },
  bannerText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
});

export default Banners;
