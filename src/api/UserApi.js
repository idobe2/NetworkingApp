import clientApi from "./ClientApi";

const addUser = async (userId, name, formattedDateString, gender) => {
try {
  const response = await clientApi.post("/addDetails", {
    uid: userId,
    name: name,
    birthday: formattedDateString,
    gender: gender,
  });
    console.log("Response:", response.data);
    return response.data;
    } catch (error) {
    console.log("Error api:", error);
    }
    return null;
};

export default {
  addUser,
};