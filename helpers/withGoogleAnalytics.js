import { parseJSONValues, getAllValuesGivenKey } from "../helpers/jsonHelper";

const prodTrackingId = "G-KBENT73KP7";
const devTrackingId = "G-SS4FFSB4HY";

export const GA_TRACKING_ID =
  process.env.NODE_ENV === "production" ? prodTrackingId : devTrackingId;

export const pageview = (url) => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url,
  });
};

//track single input change
export const trackSingleInputChange = (fieldName, fieldValue) => {
  if (typeof window !== "undefined") {
    window.gtag("event", "input_change", {
      event_category: "Form",
      event_label: `Changed ${fieldName}: ${fieldValue}`,
    });
  }
};

//track all input change
export const trackInputChange = (formValues) => {
  if (typeof window !== "undefined") {
    Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
      let values = parseJSONValues(fieldValue);
      let arrayValues = "";
      //if the changed input is array
      if (Array.isArray(values)) {
        for (let item of values) {
          arrayValues += item.label += " ";
        }

        fieldValue = arrayValues;
      } else {
        fieldValue = values.label;
      }

      window.gtag("event", "input_change", {
        event_category: "Form",
        event_label: `${fieldName}: ${fieldValue}`,
        field_name: fieldName,
        field_value: fieldValue,
      });
    });
  }
};
