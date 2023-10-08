import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebaseui/dist/firebaseui.css";

const firebaseConfig = {
  apiKey: "AIzaSyDGbDncnE8u9TuFfzOBWqYasgeDmKaSrSE",
  authDomain: "hss-application.firebaseapp.com",
  projectId: "hss-application",
  storageBucket: "hss-application.appspot.com",
  messagingSenderId: "124675882675",
  appId: "1:124675882675:web:7b389a2a209de8da2efac6",
  measurementId: "G-JT6FHMP7DN",
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

export const checkUserLoggedIn = (callback) => {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      callback(true, user);
    } else {
      // No user is signed in.
      callback(false, null);
    }
  });
};

export const getUserInfo = async () => {
  return new Promise((resolve, reject) => {
    firebase.auth().onAuthStateChanged((user) => {
      //firebase.auth用于访问数据库的方法，，，onAuthStateChanged事件监听器，用户登录状态变化时触发
      if (user) {
        resolve(user); //如果用户存在（已登陆），resolve函数传递user对象，将promise状态设置为fulfilled
      } else {
        resolve(undefined);//如果用户不存在（未登陆），resolve函数传递user对象，将promise状态设置为fulfilled
      }
    }, reject);
  });
};
