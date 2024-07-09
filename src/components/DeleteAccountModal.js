import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";

const DeleteAccountModal = ({ visible, onClose, onConfirm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      setIsLoading(true);
      try {
        const userDetails = await userApi.getUserDetails();
        setEmail(userDetails.email);
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleConfirm = () => {
    onConfirm(email, password);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            label="Email"
            value={email}
            editable={false}
            style={{backgroundColor: '#d3d3d3', top: 50,}}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={[styles.input, { paddingRight: 40 }]}
            />
            <IconButton
              icon={showPassword ? "eye-off" : "eye"}
              onPress={handleTogglePasswordVisibility}
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
          <Button mode="contained" onPress={onClose} style={[styles.button, { backgroundColor: 'red' }]}>
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
    paddingTop: 0,
    paddingBottom: 0,
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
    marginVertical: 50,
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
    bottom: 30,
  },
});

export default DeleteAccountModal;
