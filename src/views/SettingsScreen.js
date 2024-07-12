import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Alert,
  Linking, // Import Linking
} from "react-native";
import React from "react";
import Button from "../components/Button";
import userApi from "../api/UserApi";
import { theme } from "../core/theme";
import { useAuth } from "../common/AuthContext";
import DrawerContent from "../components/DrawerContent";
import HomeBackground from "../components/HomeBackground";
import ChangePasswordModal from "../components/ChangePasswordModal";
import VerificationCodeModal from "../components/VerificationCodeModal"; // New component for verification code
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const Settings = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const [userType, setUserType] = useState("");
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [isVerificationCodeModalVisible, setIsVerificationCodeModalVisible] =
    useState(false);
  const [email, setEmail] = useState(""); // New state for email

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await userApi.getUserDetails();
        if (response) {
          setUserType(response.userType);
          setEmail(response.email); // Set email from user details
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };
    fetchUserType();
  }, []);

  const handleLogout = async () => {
    console.log("Logout Button Pressed");
    try {
      setIsLoading(true);
      await userApi.check();
      const response = await userApi.userLogout();
      if (response === "logout successful") {
        setIsAuthenticated(false);
      }
      ToastAndroid.show(
        "Goodbye 👋, See you again soon 😊",
        ToastAndroid.SHORT
      );
    } catch (err) {
      console.log("Logout failed " + err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Confirm Account Deletion",
      "Are you sure you want to delete your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Send Verification Code", onPress: () => handleSendVerificationCode() },
      ]
    );
  };

  const handleSendVerificationCode = async () => {
    setIsLoading(true);
    try {
      const response = await userApi.sendVerificationCode(email); // Pass email to sendVerificationCode
      console.log("response: ", response)
      if (response  === 'Verification email sent') {
        ToastAndroid.show("Verification code sent", ToastAndroid.TOP);
        setIsVerificationCodeModalVisible(true);
      } else {
        console.log("Failed to send verification code:", response.error);
      }
    } catch (error) {
      console.error("Error sending verification code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalVisible(true);
  };

  const handleConfirmVerificationCode = async (verificationCode) => {
    setIsLoading(true);
    try {
      const response = await userApi.verifyAndDeleteAccount(verificationCode);
      if (response === 'User data, plans, preferences, and authentication deleted successfully') {
        console.log("Account deleted successfully");
        ToastAndroid.show("Account deleted successfully", ToastAndroid.TOP);
        setIsAuthenticated(false);
      } else {
        console.log("Account deletion failed:", response.error);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsLoading(false);
      setIsVerificationCodeModalVisible(false);
    }
  };

  const handleConfirmChangePassword = async (currentPassword, newPassword) => {
    console.log("Changing password...");
    setIsLoading(true);
    try {
      const response = await userApi.userChangePassword(
        currentPassword,
        newPassword
      );
      if (response.success) {
        console.log("Password changed successfully");
        ToastAndroid.show("Password changed successfully", ToastAndroid.TOP);
      } else {
        console.log("Password change failed:", response.error);
      }
    } catch (error) {
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSupportPress = () => {
    const subject = 'Support Request';
    const body = 'Hello,\n\nI need help with the Tripy app. Here are the details of my issue:\n\n[Describe your issue here]\n\nThank you,\n[Your Name]';
    const mailto = `mailto:tripy@tech-center.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailto);
  };

  const handleResetCache = async () => {
    try {
      await AsyncStorage.clear();
      ToastAndroid.show("Cache has been reset", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Error resetting cache:", error);
      ToastAndroid.show("Failed to reset cache", ToastAndroid.SHORT);
    }
  };

  return (
    <HomeBackground>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.sectionProfile}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <View style={styles.setting}>
              <DrawerContent></DrawerContent>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            {userType === "local" && (
              <View style={styles.setting}>
                <Text style={styles.settingText}>Change Password</Text>
                <Button
                  mode="contained"
                  onPress={handleChangePassword}
                  style={styles.verifyButton}
                >
                  Verify
                </Button>
              </View>
            )}
            <View style={styles.setting}>
              <Text style={styles.settingText}>Delete Account</Text>
              <Button
                mode="contained"
                onPress={handleDeleteAccount}
                style={styles.verifyButton}
              >
                Verify
              </Button>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Button
              mode="contained"
              onPress={handleLogout}
              style={styles.button}
            >
              Logout
            </Button>
          )}
          <Button
            mode="outlined"
            onPress={handleSupportPress}
            style={styles.button}
          >
            Support
          </Button>
          <Button
            mode="outlined"
            onPress={handleResetCache}
            style={styles.button}
          >
            Reset Cache
          </Button>
        </View>
        <ChangePasswordModal
          visible={isChangePasswordModalVisible}
          onClose={() => setIsChangePasswordModalVisible(false)}
          onConfirm={handleConfirmChangePassword}
        />
        <VerificationCodeModal
          visible={isVerificationCodeModalVisible}
          onClose={() => setIsVerificationCodeModalVisible(false)}
          onConfirm={handleConfirmVerificationCode}
          email={email}
        />
      </ScrollView>
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
  header: {
    padding: 20,
    alignItems: "center",
  },
  section: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#add8e6",
    borderRadius: 10,
  },
  sectionProfile: {
    marginVertical: 10,
    padding: 20,
    backgroundColor: "#add8e6",
    borderRadius: 10,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setting: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingText: {
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
  },
  verifyButton: {
    width: 100,
    backgroundColor: "#FFD580",
  },
});

export default Settings;
