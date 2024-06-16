import clientApi from "./ClientApi";
import { Alert } from "react-native";

const userLogin = async (email, password) => {
  try {
    const response = await clientApi.post("/login", {
      email,
      password,
    });
    if (response.data === "You need to verify your email") {
      Alert.alert(response.data);
      return null;
    }
    //TODO: fix the reponse from server
    const responseToFix1 = "Incorrect details " + password;
    const responseToFix2 = " and url: " + email;
    const responseToFix = responseToFix1 + responseToFix2;
    if (response.data === responseToFix) {
      Alert.alert("Invalid email or password. Please try again.");
      return null;
    }
    console.log("User logged in successfully");
    return response.data;
  }
  catch (error) {
    console.log("Api error:", error);
  }
  return null;
    };

const addUser = async (userId, name, formattedDateString, gender) => {
try {
  const response = await clientApi.post("/addDetails", {
    uid: userId,
    name: name,
    birthday: formattedDateString,
    gender: gender,
  });
    console.log("User added successfully");
    return response.data;
    } catch (error) {
    console.log("Api error:", error);
    }
    return null;
};

const addUserPreferences = async (userId, preferences) => {
  try {
    const response = await clientApi.post("/addPreferences", {
      uid: userId,
      preferences: preferences,
    });
    console.log("Preferences added successfully");
    return response.data;
  } catch (error) {
    console.log("Api error:", error);
  }
  return null;
};

export default {
  addUser,
  addUserPreferences,
  userLogin,
};