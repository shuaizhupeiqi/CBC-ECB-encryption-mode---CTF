import { database } from "./firebaseClient";

export function saveUserData(userId, data) {
  try {
    const userRef = database.ref(`users/${userId}`);
    userRef.update(data);
    console.log("User data saved successfully");
  } catch (error) {
    console.error("Error saving user data:", error);
  }
}

export function createOrUpdateData(path, data) {
  return new Promise(async (resolve, reject) => {
    try {
      const ref = database.ref(path);  //ref是firebase数据库中特定路径的引用，ref（path）是firebase数据库的方法，说明提取指定路径

      // Get the current data at the path
      const snapshot = await ref.once("value");//ref.once是firebase的方法，一次性获取指定路径的数据（数据快照）
      const currentData = snapshot.val(); //从数据快照提取数据，对当前数据的精准复刻

      // If currentData doesn't exist, or if currentData does exist but emailSubscription attribute doesn't,
      // add the emailSubscription field and set it to true
      if (
        !currentData ||
        (currentData && currentData.emailSubscription === undefined) //检查currentdata是否缺少emailSubscription字段
      ) {
        ref.child("emailSubscription").set(true, (error) => { //获取一个指向emailSubscription的引用
          if (error) {
            console.error("Error updating emailSubscription:", error);
            reject(error);
          } else {
            console.log("emailSubscription updated successfully");
          }
        });
      }
      ref.update(data, (error) => { //这里更新路径下的数据？？？？？？？没必要
        if (error) {
          console.error("Error creating or updating data:", error);
          reject(error);
        } else {
          resolve();
        }
      });
    } catch (error) {
      console.error("Error creating or updating data:", error);
      reject(error);
    }
  });
}

export function deleteData(path) {
  return new Promise((resolve, reject) => {
    try {
      const ref = database.ref(path);
      ref.remove((error) => {
        if (error) {
          console.error("Error deleting data:", error);
          reject(error);
        } else {
          console.log("Data deleted successfully");
          resolve();
        }
      });
    } catch (error) {
      console.error("Error deleting data:", error);
      reject(error);
    }
  });
}

export function readData(path) {
  return new Promise((resolve, reject) => {
    try {
      const ref = database.ref(path); //指向数据库特定路径的引用
      ref.once(  //用于一次性读取数据
        "value", //表示想要读取路径下的数据值，例如users
        (snapshot) => {
          const data = snapshot.val(); //回调函数，当数据读取成功后，从snapshot获取实际数据
          // console.log('Data read successfully:', data);
          resolve(data);
        },
        (error) => {
          console.error("Error reading data:", error);
          reject(error);
        }
      );
    } catch (error) {
      console.error("Error reading data:", error);
      reject(error);
    }
  });
}
