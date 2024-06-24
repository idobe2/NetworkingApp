// RatingStars.js
import React from "react";
import { View, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const RatingStars = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Icon key={i} name="star" style={styles.myStarStyle} />);
      } else if (i === 5 && rating >= 4.5 && rating < 4.9) {
        stars.push(<Icon key={i} name="star-half" style={styles.myStarStyle} />);
      } else if (i === 5 && rating > 4.9) {
        stars.push(<Icon key={i} name="star" style={styles.myStarStyle} />);
      } else {
        stars.push(<Icon key={i} name="star-outline" style={[styles.myStarStyle, styles.myEmptyStarStyle]} />);
      }
    }
    return stars;
  };

  return <View style={styles.starContainer}>{renderStars()}</View>;
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  myStarStyle: {
    color: "#FFD700",
    backgroundColor: "transparent",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  myEmptyStarStyle: {
    color: "#D3D3D3",
  },
});

export default RatingStars;
