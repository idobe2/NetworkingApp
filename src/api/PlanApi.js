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
    console.log("Api error fetch:", error);
  }
  return null;
};

const getPlans = async (planId) => {
  try {
    const response = await clientApi.post("/getPlanById", { planId });
    // console.log("get plan by id:", response.data);
    return response.data;
  } catch (error) {
    console.log("Api error get:", error);
  }
  return null;
};

const deletePlan = async (planId) => {
  console.log("Delete Plan:", planId);
  try {
    const response = await clientApi.post("/deletePlan", { planId });
    // console.log("Plan deleted successfully");
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

// const checkSelectedDates = async (arrivalDate, departureDate) => {
//   try {
//     const plans = await fetchPlans();
//     if (!plans) {
//       return false;
//     }
//     const newArrivalDate = new Date(arrivalDate);
//     const newDepartureDate = new Date(departureDate);

//     for (let plan of plans) {
//       const planArrivalDate = new Date(plan.arrivalDate);
//       const planDepartureDate = new Date(plan.departureDate);

//       // Check if the new dates overlap with any existing plan dates
//       if (
//         (newArrivalDate >= planArrivalDate && newArrivalDate <= planDepartureDate) ||
//         (newDepartureDate >= planArrivalDate && newDepartureDate <= planDepartureDate) ||
//         (newArrivalDate <= planArrivalDate && newDepartureDate >= planDepartureDate)
//       ) {
//         console.log("Dates overlap with existing plan");
//         return true; // Overlap found
//       }
//     }
//     return false; // No overlap found
//   } catch (error) {
//     console.log("Api error:", error);
//     return false;
//   }
// };

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

export default {
  addPlan,
  fetchPlans,
  deletePlan,
  generateActivities,
  replaceActivity,
  deleteActivity,
  generateMeals,
  addMeal,
  // checkSelectedDates
};
