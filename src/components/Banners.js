import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const Banners = ({ onBannerPress }) => {
  const banners = [
    { id: 1, text: "Getting Started", color: "#FFDBBB", icon: "rocket" },
    { id: 2, text: "Next Activity", color: "#bbdaa4", icon: "calendar" },
    { id: 3, text: "Information", color: "#a7cdf2", icon: "info-circle" },
  ];

  return (
    <ScrollView style={styles.bannersContainer}>
      {banners.map((banner) => (
        <TouchableOpacity
          key={banner.id}
          style={[styles.banner, { backgroundColor: banner.color }]}
          onPress={() => onBannerPress(banner.id)}
        >
          <View style={styles.iconContainer}>
            <Icon name={banner.icon} size={40} color="rgba(0, 0, 0, 0.5)" />
          </View>
          <Text style={styles.bannerText}>{banner.text}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bannersContainer: {
    marginTop: 80, // Adjust the margin to provide space for the search bar
  },
  banner: {
    width: '100%',  // Make the banner width fill the parent container
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    borderRadius: 5,
    marginBottom: 10,  // Adjust margin to add space between banners
    padding: 10,
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    opacity: 0.5,
  },
  bannerText: {
    fontSize: 14,
    color: "#000",
    textAlign: "right",
    textDecorationLine: "underline",
  },
});

export default Banners;
