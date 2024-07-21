import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import HomeBackground from "../components/HomeBackground";
import Header from "../components/Header";
import Paragraph from "../components/Paragraph";
import TermsModal from "../components/termsModal";
import PrivacyModal from "../components/privacyModal";

const About = () => {
  const [isTermsModalVisible, setIsTermsModalVisible] = useState(false);
  const [isPrivacyModalVisible, setIsPrivacyModalVisible] = useState(false);

  const handleTermsPress = () => {
    setIsTermsModalVisible(true);
  };

  const handlePrivacyPress = () => {
    setIsPrivacyModalVisible(true);
  };

  return (
    <HomeBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Header>About Section 1</Header>
            <View style={styles.setting}>
              <Paragraph style={styles.settingText}>Content for section 1</Paragraph>
            </View>
          </View>
          <View style={styles.section}>
            <Header>About Section 2</Header>
            <TouchableOpacity style={styles.setting} onPress={handleTermsPress}>
              <MaterialIcons name="privacy-tip" size={24} color="black" />
              <Paragraph style={styles.settingText}>Privacy Policy</Paragraph>
              </TouchableOpacity>
            <TouchableOpacity style={styles.setting} onPress={handleTermsPress}>
              <MaterialIcons name="description" size={24} color="black" />
              <Paragraph style={styles.settingText}>Terms & Conditions</Paragraph>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <TermsModal
        visible={isTermsModalVisible}
        onClose={() => setIsTermsModalVisible(false)}
      />
      <PrivacyModal
        visible={isPrivacyModalVisible}
        onClose={() => setIsPrivacyModalVisible(false)}
      />
    </HomeBackground>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  section: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#add8e6",
    borderRadius: 10,
  },
  setting: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default About;
