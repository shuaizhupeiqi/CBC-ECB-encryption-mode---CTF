import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDGbDncnE8u9TuFfzOBWqYasgeDmKaSrSE",
  authDomain: "hss-application.firebaseapp.com",
  projectId: "hss-application",
  storageBucket: "hss-application.appspot.com",
  messagingSenderId: "124675882675",
  appId: "1:124675882675:web:7b389a2a209de8da2efac6",
  measurementId: "G-JT6FHMP7DN",
};

const app = firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();
const firestore = firebase.firestore();
const database = firebase.database();

//track with firebase analytics
export const trackInputChangeViaFirebase = (formValues) => {
  if (typeof window !== "undefined") {
    const analytics = firebase.analytics();
    Object.entries(formValues).forEach(([fieldName, fieldValue]) => {
      analytics.logEvent("input_change", {
        field_name: fieldName,
        field_value: fieldValue,
      });
    });
  }
};

export { storage, firestore, database, app };
