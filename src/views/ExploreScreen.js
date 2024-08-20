import React, { useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import Banners from "../components/Banners";
import InfoModal from "../components/InfoModal";
import HomeBackground from "../components/HomeBackground";
import TravelPosts from "../components/TravelPosts";

export default function Explore({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleBannerPress = (bannerId) => {
    console.log(`Banner ${bannerId} pressed`);
    if (bannerId === 1) {
      navigation.navigate("Welcome");
    } else if (bannerId === 3) {
      setModalVisible(true);
    }
    else if (bannerId === 2){
      navigation.navigate("NextActivities");
    }
  };

  return (
    <HomeBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Banners onBannerPress={handleBannerPress} />
        </View>
        <TravelPosts />
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