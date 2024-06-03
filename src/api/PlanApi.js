import clientApi from "./ClientApi";

const addPlan = async (userId, destination, social, arrivalDate, departureDate) => {
    console.log("Plan:", userId, destination, social, arrivalDate, departureDate);
//   try {
//     const response = await clientApi.post("/addPlan", {
//       plan: plan,
//     });
//     console.log("Plan added successfully");
//     return response.data;
//   } catch (error) {
//     console.log("Api error:", error);
//   }
//   return null;
};


export default {
  addPlan,
};