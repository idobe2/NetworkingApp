import clientApi from "./ClientApi";

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
};