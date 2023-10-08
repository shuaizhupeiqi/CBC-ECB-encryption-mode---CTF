import generalStyle from "../styles/GeneralComponent.module.css";
import { parseJSONValues, getAllValuesGivenKey } from "./jsonHelper";
import axios from "axios";
import { phs } from "jsthermalcomfort";
import { checkUserLoggedIn } from "./authHelper";
import { readData } from "./dataHelper";
import { getTimezone } from "../helpers/locationHelper";

export function findTheMaxRiskValue(data) {   //从给定的数据中找出最大的风险值，根据这个风险值确定风险等级
  let maxRisk = data.reduce((max, obj) => {
    return obj.riskValue > max.riskValue ? obj : max;
  });
  let maxRiskValue = maxRisk.riskValue;
  let maxRiskLevel = "Extreme";
  let className = generalStyle.ExtremeLevel;
  if (maxRiskValue < 0.75) {
    maxRiskLevel = "High";
    className = generalStyle.HighLevel;
  }
  if (maxRiskValue < 0.5) {
    maxRiskLevel = "Moderate";
    className = generalStyle.ModerateLevel;
  }
  if (maxRiskValue < 0.25) {
    maxRiskLevel = "Low";
    className = generalStyle.LowLevel;
  }
  return {
    maxRiskValue: maxRiskValue,
    maxRiskLevel: maxRiskLevel,
    className: className,
    time: maxRisk.time,
  };
}

function getData(data) {
  let wDivider = 1;

  //load personal setting from local storage
  if (data) {
    let wValues = getAllValuesGivenKey(data, "w");

    const isAllUndefined = (arr) =>
      arr.every((val) => typeof val === "undefined");

    //if is all undefined, means user did not set any personalized setting, return 1;
    if (isAllUndefined(wValues)) {
      return wDivider;
    }

    const multiply = (accumulator, currentValue) => {
      if (typeof currentValue !== "undefined") {
        return accumulator * currentValue;
      } else {
        return accumulator * 1;
      }
    };

    wDivider = wValues.reduce(multiply, 1) * 0.85;
  }

  return wDivider;
}

export async function getWDivider() {  //根据用户信息获取的一个值
  return new Promise((resolve, reject) => {
    checkUserLoggedIn(async (isLoggedIn, user) => {
      if (isLoggedIn && user && user.emailVerified) {
        try {
          const dataFromFirebase = await readData(`users/${user.uid}`);
          console.log('dataFromFirebase', dataFromFirebase)
          const parsedData = parseJSONValues(dataFromFirebase.settings);
          const wDivider = getData(parsedData);
          resolve(wDivider);
        } catch (error) {
          console.error("Operation failed:", error);

          let data = null;
          if (localStorage.getItem("allValue")) {
            data = parseJSONValues(
              JSON.parse(localStorage.getItem("allValue"))
            );
          }
          const wDivider = getData(data);
          resolve(wDivider);
        }
      } else {
        let data = null;
        if (localStorage.getItem("allValue")) {
          data = parseJSONValues(JSON.parse(localStorage.getItem("allValue")));
        }
        console.log('test123:',localStorage.getItem("allValue"));

        const wDivider = getData(data);
        resolve(wDivider);
      }
    });
  });
}

export async function getHSSData(geoData, currentHour, translation) {
  let wDivider = 1; //给wdivider一个初始值
  try {
    wDivider = await getWDivider();
  } catch (error) {
    console.error("Error getting wDivider:", error);
    wDivider = 1;
  }

  let timeZone = getTimezone(geoData.latitude, geoData.longitude); //获取时区

  const response = await axios.get(`https://api.open-meteo.com/v1/forecast`, { //axios请求天气数据
    params: {
      latitude: geoData.latitude,
      longitude: geoData.longitude,
      hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
      timezone: timeZone,
      forecast_days: "4",
    },  //状态更新
  });

  const hourlyData = response.data.hourly; //从api里获取的天气信息的小时信息

  let temps = hourlyData.temperature_2m;
  let windSpeeds = hourlyData.windspeed_10m;
  let humidities = hourlyData.relativehumidity_2m; //温度，湿度，风速，用之前hourly状态更新的参数来查询

  const data = []; //初始化data，存储风险值

  for (let i = 0; i < 24 * 4; i++) {
    const time = i % 24;

    let rssValue = phs(
      temps[i],
      temps[i] + 20,
      humidities[i],
      windSpeeds[i] * 0.3,
      100,
      1,
      1
    ); 

    let res = rssValue.wp / wDivider; //循环遍历每个小时，并计算风险值

    if (res > 1) {
      res = 1;
    }

    res = parseFloat(res.toFixed(2)); //将res转换为小数点后两位的浮点数

    data.push({ time: time, riskValue: res, divider: wDivider }); //将这些数据保存在data数组里
  }

  const dataForPublicDisplay = data.slice(0, 25); //创建一个包含前25小时的数组

  //subArrays contains all the data for each day, 0: today, 1: tmr: 2: etc.
  const subArrays = [ 
   data.slice(currentHour, 24),
    data.slice(24, 48),
    data.slice(48, 72),
    data.slice(72, 96),
  ]; //创建一个包含每天数据的数组

  let currentRiskValue = data[currentHour].riskValue; //获取当前时间的风险值

  let maxLevelForecast = []; //创建空数组，用来存放最大风险值

  for (let d of subArrays) {
    let max = findTheMaxRiskValue(d);
    maxLevelForecast.push(max);
  }  //遍历每天的数据，找到每天最大的风险值并存储

  let todayMax = maxLevelForecast[0].maxRiskValue; //获取今天的风险最大值
  //current label
  let current = translation.current;

  //max label
  let maxLabel = translation.maxLabel;

  let now = [];
  let max = [];
  let portialNow = [];
  let portialMax = [];  //初始化数组，用于存储当前和最大风险值数据

  if (currentRiskValue == todayMax) {
    maxLabel = translation.currentMax;
    max.push({ riskValue: todayMax, y: 0.5, label: maxLabel });
  } else {
    now.push({ riskValue: currentRiskValue, y: 0.5, label: current });
    max.push({ riskValue: todayMax, y: 0.5, label: maxLabel });
  }

  if (currentRiskValue >= todayMax - 0.01) {
    maxLabel = translation.currentMax;
    portialMax.push({ riskValue: todayMax, y: 0.5, label: maxLabel });
  } else {
    portialNow.push({ riskValue: currentRiskValue, y: 0.5, label: current });
    portialMax.push({ riskValue: todayMax, y: 0.5, label: maxLabel });
  }

  return {
    dataForPublicDisplay: dataForPublicDisplay,
    currentRiskValue: currentRiskValue,
    data: subArrays,
    maxLevelForecast: maxLevelForecast,
    now: now,
    max: max,
    portialNow: portialNow,
    portialMax: portialMax,
  };
}
