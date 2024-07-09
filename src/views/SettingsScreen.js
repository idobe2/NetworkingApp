import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ToastAndroid,
  Alert,
} from "react-native";
import React from "react";
import Button from "../components/Button";
import userApi from "../api/UserApi";
import { theme } from "../core/theme";
import { useAuth } from "../common/AuthContext";
import DrawerContent from "../components/DrawerContent";
import HomeBackground from "../components/HomeBackground";
import ChangePasswordModal from "../components/ChangePasswordModal";
import DeleteAccountModal from "../components/DeleteAccountModal";

const Settings = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const [userType, setUserType] = useState("");
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] =
    useState(false);
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        const response = await userApi.getUserDetails();
        if (response) setUserType(response.userType);
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
    if (userType === "google") {
      Alert.alert(
        "Confirm Account Deletion",
        "Are you sure you want to delete your account?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress: () => handleConfirmDeleteAccount() },
        ]
      );
    } else {
      setIsDeleteAccountModalVisible(true);
    }
  };

  const handleChangePassword = () => {
    setIsChangePasswordModalVisible(true);
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

  const handleConfirmDeleteAccount = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await userApi.userDeleteAccount(email, password);
      if (response.success) {
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
        </View>
        <ChangePasswordModal
          visible={isChangePasswordModalVisible}
          onClose={() => setIsChangePasswordModalVisible(false)}
          onConfirm={handleConfirmChangePassword}
        />
        <DeleteAccountModal
          visible={isDeleteAccountModalVisible}
          onClose={() => setIsDeleteAccountModalVisible(false)}
          onConfirm={handleConfirmDeleteAccount}
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
