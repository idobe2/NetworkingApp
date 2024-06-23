import clientApi from "./ClientApi";

const addPlan = async (destination, arrivalDate, departureDate, social) => {
  try {
    const response = await clientApi.post("/addPlan", {
      destination,
      arrivalDate,
      departureDate,
      social,
    });
    console.log("Plan added successfully");
    return response.data;
  } catch (error) {
    console.log("Api error:", error);
  }
  return null;
};

const fetchPlans = async () => {
  try {
    const response = await clientApi.get("/getUserPlanIds");
    console.log("Plans fetched successfully", response.data);
    const plans = [];
    for (let i = 0; i < response.data.planIds.length; i++) {
      const planId = response.data.planIds[i];
      const plan = await getPlans(planId);
      if (plan) { 
        // Add the planId to the plan object
        plans.push({ ...plan, planId });
      }
    }
    // console.log("Plans:", plans);
    return plans;
  } catch (error) {
    console.log("Api error:", error);
  }
  return null;
};

const getPlans = async (planId) => {
  try {
    const response = await clientApi.post("/getPlanById", { planId });
    // console.log("Plan fetched successfully");
    return response.data;
  } catch (error) {
    console.log("Api error get:", error);
  }
  return null;
}

export default {
  addPlan,
  fetchPlans,
};