// Explore.js
import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Banners from "../components/Banners";
import InfoModal from "../components/InfoModal";
import HomeBackground from "../components/HomeBackground";

export default function Explore({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  const handlePlaceSelect = (placeDetails, photoUrl) => {
    // Handle place selection if needed, or leave it empty
  };

  const handleBannerPress = (bannerId) => {
    console.log(`Banner ${bannerId} pressed`);
    if (bannerId === 1) {
      navigation.navigate("Welcome");
    } else if (bannerId === 3) {
      setModalVisible(true); // Show modal when bannerId is 3
    }
    else if (bannerId === 2){
      navigation.navigate("NextActivities");
    }
  };

  return (
    <HomeBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* <SearchPlacesBar onPlaceSelect={handlePlaceSelect} /> */}
          <Banners onBannerPress={handleBannerPress} />
        </View>
        <InfoModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </SafeAreaView>
    </HomeBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    bottom: 50,
  },
});