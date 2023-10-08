export async function loadAgeGroupTips() {
  try {
    let data = await import("./../public/tips/ageGroupTips.json");

    return data.default;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function loadAllGeneralTips() {
  try {
    let data = await import("./../public/tips/allGeneralTips.json");

    return data.default;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function loadGeneralTips() {
  try {
    let data = await import("./../public/tips/generalTips.json");

    return data.default;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function loadDetailedRecommendationTips() {
  try {
    let data = await import("./../public/tips/detailedRecommendationTips.json");

    return data.default;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
