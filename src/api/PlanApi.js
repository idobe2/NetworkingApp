import clientApi from "./ClientApi";

const addPlan = async (
  destination,
  arrivalDate,
  departureDate,
  social,
  loadLevel
) => {
  try {
    const response = await clientApi.post("/addPlan", {
      destination,
      arrivalDate,
      departureDate,
      social,
      loadLevel,
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
    return plans;
  } catch (error) {
    console.log("Api error fetch:", error);
  }
  return null;
};

const getPlans = async (planId) => {
  try {
    const response = await clientApi.post("/getPlanById", { planId });
    const plan = await verifyPlan(response.data);
    return plan;
  } catch (error) {
    console.log("Api error get:", error);
  }
  return null;
};

const deletePlan = async (planId) => {
  console.log("Delete Plan:", planId);
  try {
    const response = await clientApi.post("/deletePlan", { planId });
    console.log("Plan deleted successfully");
    return response.data;
  } catch (error) {
    console.log("Api delete error:", error);
  }
  return null;
};

const generateActivities = async (planId, day, activity) => {
  try {
    console.log("Generate Activities:", planId, day, activity);
    const response = await clientApi.post("/editActivity", {
      planId,
      day: day.toString(),
      activity: activity.toString(),
    });
    console.log("Activities generated successfully");
    return response.data;
  } catch {
    console.log("Api error:", error);
  }
  return null;
};

const replaceActivity = async (planId, day, activity, newActivity) => {
  console.log("Replace Activity:", planId, day, activity, newActivity);
  try {
    const response = await clientApi.post("/replaceActivity", {
      planId,
      dayIndex: day.toString(),
      activityIndex: activity.toString(),
      newActivity: newActivity.toString(),
    });
    console.log("Activity replaced successfully");
    return response.data;
  } catch {
    console.log("Api error:", error);
  }
};

const generateMeals = async (planId, day, activity, mealType) => {
  console.log("Generate Meals:", planId, day, activity, mealType);
  try {
    const response = await clientApi.post("/FindRestaurantNearBy", {
      planId,
      day: day.toString(),
      activity: activity.toString(),
      mealType: mealType.toString(),
    });
    console.log("Meals generated successfully");
    return response.data;
  } catch {
    console.log("Api error:", error);
  }
}

const addMeal = async (planId, dayIndex, activityIndex, restaurantName, placeId) => {
  try {
    const response = await clientApi.post("/addRestaurantToPlan", {
      planId,
      dayIndex: dayIndex.toString(),
      activityIndex: activityIndex.toString(),
      restaurantName: restaurantName.toString(),
      placeId,
    });
    console.log("Meal added successfully");
    return response.data;
  } catch {
    console.log("Api error:", error);
  }
}

const deleteActivity = async (planId, day, activity) => {
  try {
    const response = await clientApi.post("/deleteActivity", {
      planId,
      dayIndex: day.toString(),
      activityIndex: activity.toString(),
    });
    console.log("Activity deleted successfully");
    return response.data;
  } catch {
    console.log("Api error:", error);
  }
}

const verifyPlan = async (plan) => {
  if (!plan) {
    return null;
  }
  if (!plan.destination) {
    return null;
  }
  if (!plan.arrivalDate) {
    return null;
  }
  if (!plan.departureDate) {
    return null;
  }
  if (!plan.social) {
    return null;
  }
  if (plan.travelPlan[0].day.includes("-")) {
    console.log("Bad date format, changing to correct format...");
  for (let i = 0; i < plan.travelPlan.length; i++) {
    const day = plan.travelPlan[i].day;
    const date = day.split("-");
    plan.travelPlan[i].day = date[2] + "/" + date[1] + "/" + date[0].slice(2);
  }
}
  return plan;
}

export default {
  addPlan,
  fetchPlans,
  deletePlan,
  generateActivities,
  replaceActivity,
  deleteActivity,
  generateMeals,
  addMeal,
  getPlans,
  verifyPlan,
};
