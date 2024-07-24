import React from "react";
import { View, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, ScrollView } from "react-native";
import { theme } from "../core/theme";
import { MaterialIcons } from '@expo/vector-icons';
import { Linking } from "react-native";
import Header from "./Header";
import Paragraph from "./Paragraph";

const PrivacyModal = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlayBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView contentContainerStyle={styles.scrollView}>
            <Header>Privacy Policy</Header>
            <Paragraph>
              This privacy policy applies to the Tripy app (hereby referred to as "Application") for mobile devices that was created by Tripy (hereby referred to as "Service Provider") as a Free service. This service is intended for use "AS IS".
            </Paragraph>
            <Header style={styles.sectionHeader}>Information Collection and Use</Header>
            <Paragraph>
              The Application collects information when you download and use it. This information may include information such as:
              {"\n"}• Your device's Internet Protocol address (e.g. IP address)
              {"\n"}• The pages of the Application that you visit, the time and date of your visit, the time spent on those pages
              {"\n"}• The time spent on the Application
              {"\n"}• The operating system you use on your mobile device
            </Paragraph>
            <Paragraph>
              The Application does not gather precise information about the location of your mobile device.
            </Paragraph>
            <Paragraph>
              The Application collects your device's location, which helps the Service Provider determine your approximate geographical location and make use of it in the below ways:
              {"\n"}• Geolocation Services: The Service Provider utilizes location data to provide features such as personalized content, relevant recommendations, and location-based services.
              {"\n"}• Analytics and Improvements: Aggregated and anonymized location data helps the Service Provider to analyze user behavior, identify trends, and improve the overall performance and functionality of the Application.
              {"\n"}• Third-Party Services: Periodically, the Service Provider may transmit anonymized location data to external services. These services assist them in enhancing the Application and optimizing their offerings.
            </Paragraph>
            <Paragraph>
              The Service Provider may use the information you provided to contact you from time to time to provide you with important information, required notices and marketing promotions.
            </Paragraph>
            <Paragraph>
              For a better experience, while using the Application, the Service Provider may require you to provide us with certain personally identifiable information, including but not limited to Email, Age, Gender, preferences. The information that the Service Provider requests will be retained by them and used as described in this privacy policy.
            </Paragraph>
            <Paragraph>Third Party Access</Paragraph>
            <Paragraph>
              Only aggregated, anonymized data is periodically transmitted to external services to aid the Service Provider in improving the Application and their service. The Service Provider may share your information with third parties in the ways that are described in this privacy statement.
            </Paragraph>
            <Paragraph>
              Please note that the Application utilizes third-party services that have their own Privacy Policy about handling data. Below are the links to the Privacy Policy of the third-party service providers used by the Application:
              {"\n"}• <Paragraph style={styles.link} onPress={() => Linking.openURL("https://www.google.com/policies/privacy/")}>Google Play Services</Paragraph>
            </Paragraph>
            <Paragraph>
              The Service Provider may disclose User Provided and Automatically Collected Information:
              {"\n"}• as required by law, such as to comply with a subpoena, or similar legal process;
              {"\n"}• when they believe in good faith that disclosure is necessary to protect their rights, protect your safety or the safety of others, investigate fraud, or respond to a government request;
              {"\n"}• with their trusted services providers who work on their behalf, do not have an independent use of the information we disclose to them, and have agreed to adhere to the rules set forth in this privacy statement.
            </Paragraph>
            <Header style={styles.sectionHeader}>Opt-Out Rights</Header>
            <Paragraph>
              You can stop all collection of information by the Application easily by uninstalling it. You may use the standard uninstall processes as may be available as part of your mobile device or via the mobile application marketplace or network.
            </Paragraph>
            <Header style={styles.sectionHeader}>Data Retention Policy</Header>
            <Paragraph>
              The Service Provider will retain User Provided data for as long as you use the Application and for a reasonable time thereafter. If you'd like them to delete User Provided Data that you have provided via the Application, please contact them at tripy@tech-center.com and they will respond in a reasonable time.
            </Paragraph>
            <Header style={styles.sectionHeader}>Children</Header>
            <Paragraph>
              The Service Provider does not use the Application to knowingly solicit data from or market to children under the age of 13.
              {"\n"}The Application does not address anyone under the age of 13. The Service Provider does not knowingly collect personally identifiable information from children under 13 years of age. In the case the Service Provider discovers that a child under 13 has provided personal information, the Service Provider will immediately delete this from their servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact the Service Provider (tripy@tech-center.com) so that they will be able to take the necessary actions.
            </Paragraph>
            <Header style={styles.sectionHeader}>Security</Header>
            <Paragraph>
              The Service Provider is concerned about safeguarding the confidentiality of your information. The Service Provider provides physical, electronic, and procedural safeguards to protect information the Service Provider processes and maintains.
            </Paragraph>
            <Header style={styles.sectionHeader}>Changes</Header>
            <Paragraph>
              This Privacy Policy may be updated from time to time for any reason. The Service Provider will notify you of any changes to the Privacy Policy by updating this page with the new Privacy Policy. You are advised to consult this Privacy Policy regularly for any changes, as continued use is deemed approval of all changes.
              {"\n"}This privacy policy is effective as of 2024-07-21.
            </Paragraph>
            <Header style={styles.sectionHeader}>Your Consent</Header>
            <Paragraph>
              By using the Application, you are consenting to the processing of your information as set forth in this Privacy Policy now and as amended by us.
            </Paragraph>
            <Header style={styles.sectionHeader}>Contact Us</Header>
            <Paragraph>
              If you have any questions regarding privacy while using the Application, or have questions about the practices, please contact the Service Provider via email at tripy@tech-center.com.
            </Paragraph>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalContainer: {
    width: "90%",
    height: "70%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  scrollView: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  link: {
    color: theme.colors.primary,
    textDecorationLine: "underline",
  },
});

export default PrivacyModal;
