import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";

const ChangePasswordModal = ({ visible, onClose, onConfirm }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword(!showCurrentPassword);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleConfirm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill all fields!");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    setIsLoading(true);
    onConfirm(currentPassword, newPassword);
    setIsLoading(false);
    resetFields();
    onClose();
  };

  const handleClose = () => {
    resetFields();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Current Password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <IconButton
              icon={showCurrentPassword ? "eye-off" : "eye"}
              onPress={handleToggleCurrentPasswordVisibility}
              style={styles.iconButton}
            />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              label="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <IconButton
              icon={showNewPassword ? "eye-off" : "eye"}
              onPress={handleToggleNewPasswordVisibility}
              style={styles.iconButton}
            />
          </View>
          <View style={styles.passwordContainer}>
            <TextInput
              label="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <IconButton
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={handleToggleConfirmPasswordVisibility}
              style={styles.iconButton}
            />
          </View>
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Button mode="contained" onPress={handleConfirm} style={styles.button}>
              Confirm
            </Button>
          )}
          <Button mode="contained" onPress={handleClose} style={[styles.button, { backgroundColor: 'red' }]}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.surface,
    borderWidth: 1,
    borderRadius: 10,
    height: 90,
  },
  input: {
    backgroundColor: theme.colors.surface,
    flex: 1,
  },
  iconButton: {
    position: "absolute",
    right: 10,
    bottom: 15,
  },
  button: {
    marginVertical: 10,
    width: "100%",
  },
});

export default ChangePasswordModal;