import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Button as RNButton,
  ImageBackground,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import userApi from "../api/UserApi";
import { emailValidator } from "../helpers/emailValidator";
import {
  passwordValidator,
  confirmValidator,
} from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import { ageValidator } from "../helpers/ageValidator";
import { Ionicons } from "@expo/vector-icons";
import TextInput from "../components/TextInput";
import CalendarPicker from "react-native-calendar-picker";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";
import NetInfo from "@react-native-community/netinfo";
import CheckBox from "@react-native-community/checkbox";
import PrivacyModal from "../components/PrivacyModal";
import TermsModal from "../components/TermsModal";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [nameTouched, setNameTouched] = useState(false);
  const [selectedDateTouched, setSelectedDateTouched] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [termsModalVisible, setTermsModalVisible] = useState(false);

  const openPrivacyPolicy = () => {
    setPrivacyModalVisible(true);
  };

  const openTermsConditions = () => {
    setTermsModalVisible(true);
  };

  useEffect(() => {
    if (emailTouched) {
      setEmailError(emailValidator(email));
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      setPasswordError(passwordValidator(password));
    }
  }, [password, passwordTouched]);

  useEffect(() => {
    if (confirmPasswordTouched) {
      setConfirmPasswordError(confirmValidator(password, confirmPassword));
    }
  }, [confirmPassword, password, confirmPasswordTouched]);

  useEffect(() => {
    if (nameTouched) {
      setNameError(nameValidator(name));
    }
  }, [name, nameTouched]);

  useEffect(() => {
    if (selectedDateTouched) {
      setAgeError(ageValidator(selectedDate));
    }
  }, [selectedDate, selectedDateTouched]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const onDateChange = (date) => {
    setSelectedDate(date);
    setSelectedDateTouched(true);
    setShowModal(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, "0");
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = formattedDate.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSignup = async () => {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      Alert.alert(
        "No Internet Connection",
        "Please check your network connection and try again."
      );
      return;
    }

    setIsLoading(true);
    const formattedDateString = formatDate(selectedDate);
    const response = await userApi.userSignup(
      email,
      password,
      confirmPassword,
      name,
      formattedDateString,
      gender
    );

    if (response.success) {
      Alert.alert("Success", response.message);
      navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Error", response.message);
    }
    setIsLoading(false);
  };

  const isEmailValid = emailValidator(email) === "";
  const isPasswordValid = passwordValidator(password) === "";
  const isConfirmPasswordValid =
    confirmValidator(password, confirmPassword) === "";
  const isNameValid = nameValidator(name) === "";
  const isGenderSelected = gender !== null && gender !== "";
  const isBirthDateSelected = selectedDate !== null;
  const isAgeValid = ageValidator(selectedDate) === "";
  const isFormValid =
    isEmailValid &&
    isPasswordValid &&
    isConfirmPasswordValid &&
    isNameValid &&
    isGenderSelected &&
    isBirthDateSelected &&
    isAgeValid &&
    privacyChecked;

  const genderOptions = [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ];

  return (
    <ImageBackground
      source={require("../assets/background_dot.png")}
      resizeMode="repeat"
      style={styles.background}
    >
      <ScrollView>
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.logo}>
            <Logo />
            <Header>Create Account</Header>
          </View>
          <View style={styles.inputContainer}>
            {emailTouched && emailError ? (
              <Ionicons
                name="close-circle"
                size={25}
                color="#b22222"
                style={styles.iconLeft}
              />
            ) : isEmailValid && email.length > 0 ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.iconLeft}
              />
            ) : null}
            <TextInput
              label="Email"
              returnKeyType="next"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailTouched(true);
              }}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
              error={emailError}
              style={styles.textInput}
            />
          </View>
          {emailTouched && emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            {nameTouched && nameError ? (
              <Ionicons
                name="close-circle"
                size={25}
                color="#b22222"
                style={styles.iconLeft}
              />
            ) : isNameValid && name.length > 0 ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.iconLeft}
              />
            ) : null}
            <TextInput
              label="Name"
              returnKeyType="next"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setNameTouched(true);
              }}
              style={styles.textInput}
            />
          </View>
          {nameTouched && nameError ? (
            <Text style={styles.errorText}>{nameError}</Text>
          ) : null}
          <View style={{ marginVertical: 12 }}>
            <Dropdown
              data={genderOptions}
              labelField="label"
              valueField="value"
              placeholder="Select gender"
              value={gender}
              onChange={(item) => {
                setGender(item.value);
              }}
              style={[
                styles.dropdown,
                isGenderSelected ? styles.selectedDropdown : null,
              ]}
              selectedTextStyle={styles.selectedText}
            />
            {isGenderSelected && (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.genderIcon}
              />
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.input}
          >
            {selectedDateTouched && ageError ? (
              <Ionicons
                name="close-circle"
                size={25}
                color="#b22222"
                style={styles.ageIconLeft}
              />
            ) : isBirthDateSelected && isAgeValid ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.ageIconLeft}
              />
            ) : null}
            <Text style={styles.inputText}>
              {selectedDate ? formatDate(selectedDate) : "Birth date"}
            </Text>
            <FontAwesome
              name="calendar"
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
          </TouchableOpacity>
          {selectedDateTouched && ageError ? (
            <Text style={styles.ageErrorText}>{ageError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            {passwordTouched && passwordError ? (
              <Ionicons
                name="close-circle"
                size={25}
                color="#b22222"
                style={styles.iconLeft}
              />
            ) : isPasswordValid && password.length > 0 ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.iconLeft}
              />
            ) : null}
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordTouched(true);
              }}
              secureTextEntry={!showPassword}
              style={styles.textInputWithIcon}
              error={passwordError}
            />
            <IconButton
              icon={showPassword ? "eye-off" : "eye"}
              onPress={handleTogglePasswordVisibility}
              style={styles.iconButton}
            />
          </View>
          {passwordTouched && passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <View style={styles.inputContainer}>
            {confirmPasswordTouched && confirmPasswordError ? (
              <Ionicons
                name="close-circle"
                size={25}
                color="#b22222"
                style={styles.iconLeft}
              />
            ) : isConfirmPasswordValid && confirmPassword.length > 0 ? (
              <Ionicons
                name="checkmark-circle"
                size={25}
                color="green"
                style={styles.iconLeft}
              />
            ) : null}
            <TextInput
              label="Confirm Password"
              returnKeyType="done"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setConfirmPasswordTouched(true);
              }}
              secureTextEntry={!showConfirmPassword}
              style={[styles.textInputWithIcon, { marginBottom: 10 }]}
              error={confirmPasswordError}
            />
            <IconButton
              icon={showConfirmPassword ? "eye-off" : "eye"}
              onPress={handleToggleConfirmPasswordVisibility}
              style={styles.iconButton}
            />
          </View>

          {confirmPasswordTouched && confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              flexGrow: 1,
              justifyContent: "center",
              width: "100%",
            }}
          >
            <CheckBox
              value={privacyChecked}
              onValueChange={setPrivacyChecked}
              tintColors={{ true: theme.colors.primary, false: "grey" }}
              style={{ marginLeft: 15 }}
            />
            <View>
              <Text>
                Confirm you agree to our{" "}
                <Text
                  style={{
                    color: theme.colors.primary,
                    textDecorationLine: "underline",
                  }}
                  onPress={openPrivacyPolicy}
                >
                  Privacy Policy
                </Text>{" "}
                and{" "}
                <Text
                  style={{
                    color: theme.colors.primary,
                    textDecorationLine: "underline",
                    marginBottom: 10,
                  }}
                  onPress={openTermsConditions}
                >
                  Terms & Conditions
                </Text>
              </Text>
            </View>
          </View>
          <PrivacyModal
            visible={privacyModalVisible}
            onClose={() => setPrivacyModalVisible(false)}
          />
          <TermsModal
            visible={termsModalVisible}
            onClose={() => setTermsModalVisible(false)}
          />
          {isLoading ? (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          ) : (
            <Button
              mode="contained"
              onPress={handleSignup}
              style={styles.button}
              disabled={!isFormValid}
            >
              Sign Up
            </Button>
          )}
          <View style={styles.row}>
            <Text>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        <Modal
          visible={showModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <CalendarPicker
                onDateChange={onDateChange}
                selectedStartDate={selectedDate}
                previousTitle="Previous"
                nextTitle="Next"
                selectedDayTextColor={theme.colors.primary}
                selectedDayBackgroundColor={theme.colors.accent}
                todayBackgroundColor={theme.colors.background}
                selectedDayStyle={styles.selectedDayStyle}
                selectedDayTextStyles={styles.selectedDayText}
              />
              <RNButton
                title="Close"
                onPress={() => setShowModal(false)}
                color={theme.colors.primary}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
      <BackButton goBack={navigation.goBack} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    backgroundColor: theme.colors.surface,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    width: "100%",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    marginTop: 12,
    justifyContent: "center",
    marginBottom: 20,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
  },
  textInputWithIcon: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    paddingRight: 50,
  },
  iconButton: {
    position: "absolute",
    right: 5,
    top: 25,
  },
  iconLeft: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    top: 75,
  },
  errorText: {
    color: "#b22222",
    marginLeft: 30,
    marginTop: -3,
    bottom: 7,
  },
  ageErrorText: {
    color: "#b22222",
    marginLeft: 30,
    marginTop: 10,
    bottom: 12,
  },
  ageIconLeft: {
    position: "absolute",
    left: 0,
    zIndex: 1,
    top: 60,
  },
  button: {
    alignContent: "center",
    width: "100",
  },
  logo: {
    alignItems: "center",
    marginTop: 35,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    padding: 15,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: "grey",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  inputText: {
    fontSize: 16,
    color: theme.colors.text,
    flex: 1,
  },
  icon: {
    marginLeft: 10,
  },
  selectedDayStyle: {
    backgroundColor: theme.colors.accent,
    borderRadius: 16,
  },
  selectedDayText: {
    color: theme.colors.primary,
    fontWeight: "bold",
  },
  dropdown: {
    width: "100%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderColor: "grey",
    padding: 15,
    marginBottom: 12,
  },
  selectedText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  selectedDropdown: {
    borderColor: "green",
  },
  genderIcon: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
});
