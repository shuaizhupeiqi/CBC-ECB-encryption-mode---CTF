import { Col, message } from "antd";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import Layout from "./layout";
import cookie from "react-cookies";
import dayjs from "dayjs";
import { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import { reverseGeocode, getTimezone } from "../helpers/locationHelper";
import AddressDropDown from "../components/AddressDropDown";
import HssRiskDisplay from "../components/HssRiskDisplay";
import LoadingCard from "../components/LoadingCard";
import showAlert from "../components/Notification";
import { getHSSData } from "../helpers/hssHelper";
import { useLanguage } from "../hooks/useLanguage";
import { useRecoilState } from 'recoil'
import { locationState } from '../store/location'


import {
  createOrUpdateData,
  deleteData,
  readData,
} from "../helpers/dataHelper";
import { parseJSONValues, getAllValuesGivenKey } from "../helpers/jsonHelper";
import { checkUserLoggedIn, getUserInfo } from "../helpers/authHelper";
import { ImportOutlined } from "@ant-design/icons";

const week = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const HomePage = (props) => {
  const { isPublicDisplay, publicDisplayGeoData, languageHelper, getHssDataCallBack } = props

  const [loading, setLoading] = useState(false)
  const [reloadAddress, setReloadAddress] = useState(false)
  const [data, setData] = useState([])

  const [addressDefaultValue, setAddressDefaultValue] = useState("Parramatta Westfield, NSW, 2150")
  const [hour, setHour] = useState(0)
  const [forcasts, setForcasts] = useState([])
  const [maxLevelForecast, setMaxLevelForecast] = useState([])
  const [chartType, setChartType] = useState("LineChart")
  const [currentRiskValue, setCurrentRiskValue] = useState(0)
  const [legendNow, setLegendNow] = useState([])
  const [legendMax, setLegendMax] = useState([])
  const [portialLegendNow, setPortialLegendNow] = useState([])
  const [portialLegendMax, setPortialLegendMax] = useState([])
  const [geoData, setGeoData] = useState({})
  const [dataForPublicDisplay, setDataForPublicDisplay] = useState({})

  const [location, setLocation] = useRecoilState(locationState)




  const translation = useLanguage(languageHelper, 'HomePage')

  //获取未来3天的时间并显示在chart上方
  const getWillDay = useCallback((day = 0) => {
    let willDay = dayjs().add(day, 'day')
    let tomorrowNum = willDay.day()
    let tomorrowDate = willDay.format('DD/MM')
    return [tomorrowNum, tomorrowDate]
  }, [])

  const setDay = useCallback(() => {
    let forcastWeekday = [1, 2, 3].map((item) => {
      const [weekNum, dayDate] = getWillDay(item)
      let aaa = week[weekNum]
      return { label: aaa, date: dayDate }
    })

    let hour = dayjs().hour();
    setHour(hour == 23 ? 0 : hour);
    setForcasts(forcastWeekday);
  }, [])

//主要是用于获取风险值的函数
  const setLoadedData = useCallback(async (geoData = {}) => {
    try {
      // 
      if (Object.keys(geoData).length <= 0) return null;

      const hssRiskData = await getHSSData(
        geoData,
        hour,
        translation
      );
      console.log('assdf', hssRiskData)
      
      const { dataForPublicDisplay, currentRiskValue, data, maxLevelForecast, now, max, portialNow, portialMax, } = hssRiskData || {}
      if (isPublicDisplay) {
        getHssDataCallBack({
          dataForPublicDisplay,
          hour,
        });
      }
      const { suburb, state, postcode } = geoData
      setAddressDefaultValue(`${suburb}, ${state}, ${postcode}`)
      setGeoData(geoData)
      setCurrentRiskValue(currentRiskValue)
      setData(data)
      // setLoading(false)
      setMaxLevelForecast(maxLevelForecast)
      setLegendMax(max)
      setLegendNow(now)
      setPortialLegendNow(portialNow)
      setPortialLegendMax(portialMax)
      setDataForPublicDisplay(dataForPublicDisplay)
    } catch (err) {
      console.log('loadData err', err)
    } finally {
      setLoading(false)
    }
  }, [hour, translation, getHssDataCallBack, isPublicDisplay])

//将用户数据保存在cookie里的函数组件，后面集中调用
  const loadGeodataFromCookie = useCallback(() => {
    let geoData = cookie.load("geoData");
    if (geoData) {
      const { latitude, longitude } = geoData
      const timeZone = getTimezone(latitude, longitude);
      setLocation({
        latitude,
        longitude,
        hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
        timezone: timeZone,
      })
    } else {
      geoData = { ...location };
    }
    setLoadedData(geoData);
  }, [])

//loaddata函数
  const loadData = useCallback(async () => {

    setLoading(true)
    try {
      const user = await getUserInfo(); //获取用户信息

      if (user && user.emailVerified) {
      
        try {

          console.log('uuu',user)
          const dataFromFirebase = await readData(`users/${user.uid}`); //从firebase读取用户数据
          const geoData = parseJSONValues(dataFromFirebase.geoData);//利用parseJSONValues函数将用户信息里的geodata解析出来
          const timeZone = getTimezone(geoData.latitude, geoData.longitude); //获取时区
          // 更新状态
          setLocation({
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m", //这个字符串是查询天气数据时的一组参数
            timezone: timeZone,
          })
          await setLoadedData(geoData);
        } catch (error) {
          console.error(
            "Get user geo data from firebase operation failed:",
            error
          );
          await loadGeodataFromCookie(); //出现错误时从cookie获取数据
        }
      } else {
        await loadGeodataFromCookie(); //当if语句不成立，尝试从cookie获取数据
      }
    } catch (err) {
      console.log('loadData err', err)
    }
    // setLoading(false)
  }, [loadGeodataFromCookie, setLoadedData])

  useEffect(() =>{
    setDay()
    loadData()
  },[])

  const handleLocateMeCallBack = useCallback(async () => {
    // 首先将loading和reloadaddress的状态设置
    setLoading(true)
    setReloadAddress(true)

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude; // 浏览器提供的方法，使用浏览器的API获取用户经纬度，弹出窗口询问是否允许网页获取位置信息

      const data = await reverseGeocode(lat, lon); //使用此函数获取与用户坐标接近的地理位置信息

      if (data) { //如果获得了与用户接近的地理数据，创建jsonval数组
        const { postcode, suburb, state } = data
        const jsonVal = {
          postcode,
          suburb,
          latitude: lat,
          longitude: lon,
          state,
        };

        const user = await getUserInfo(); //通过此函数获取用户当前信息

        setAddressDefaultValue(`${suburb}, ${state}, ${postcode}`)
                //将获得到的地理信息组成一个字符串
        let timezone = getTimezone(lat, lon);
        setLocation({
          latitude: lat,
          longitude: lon,
          suburb,
          postcode,
          //variable needed, unchanged
          hourly:
            "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
          timezone,
        })
        //将获得到的地理信息组成一个字符串
        
        //获取经纬度对应的时区

        if (user && user.emailVerified) {
          try {
            await createOrUpdateData(`users/${user.uid}`, { geoData: jsonVal }) //创建用户信息，获取用户uid，将jsonVal的信息赋值给用户的geodata
          } catch (error) { //.catch方法，用于处理createOrUpdateData函数失败返回的结果
            cookie.save("geoData", JSON.stringify(jsonVal));
          }
        } else {
          //将地理信息保存在cookie，将jsonval转换格式
          cookie.save("geoData", JSON.stringify(jsonVal));
        }
        loadData();
      } else {
        showAlert("error", "Location Error", "Unable to get your location."); //显示警告信息
      }
      setLoading(false)
      setReloadAddress(false)
    });
  }, [loadData])


  const setDataWhenHandleAddressCallBack = useCallback((values, lat, lon, jsonVal) => {
    const [postcode, suburb, latitude, longitude, state] = values || []
    let timeZone = getTimezone(latitude, longitude);
    setLocation({
      latitude,
      longitude,
      suburb,
      postcode,
      //variable needed, unchanged
      hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
      timezone: timeZone,
    })
    loadData();
  }, [])

  const handleAddressCallBack = useCallback(async (values) => { //下拉框事件
    const [postcode, suburb, lat, lon, state] = values || []
    const jsonVal = {
      postcode,
      suburb,
      latitude: lat,
      longitude: lon,
      state,
    };

    const user = await getUserInfo();
    if (user && user.emailVerified) {
      try {
        await createOrUpdateData(`users/${user.uid}`, { geoData: jsonVal }) //创建用户信息，获取用户uid，将jsonVal的信息赋值给用户的geodata

      } catch (error) { //.catch方法，用于处理createOrUpdateData函数失败返回的结果
        cookie.save("geoData", JSON.stringify(jsonVal));
      }
    } else {
      cookie.save("geoData", JSON.stringify(jsonVal));
    }
    setDataWhenHandleAddressCallBack(values)
  }, [])
 

  const renderAddressDropdown = useMemo(() => {
    return reloadAddress || loading ? (
      <LoadingCard />
    ) : (
      <AddressDropDown
        handleLocateMeCallBack={handleLocateMeCallBack}
        handleAddressCallBack={handleAddressCallBack}
        defaultValue={addressDefaultValue}
        geoData={geoData}
      />
    );
  }, [reloadAddress,geoData,loading,addressDefaultValue])
  // reloadAddress, loading, geoData, addressDefaultValue




  return (
    <div>
      <Layout>
      <Col>
        {isPublicDisplay ? null : renderAddressDropdown}
        {reloadAddress || loading ? (
          <LoadingCard />
        ) : (
          <HssRiskDisplay
            isPublicDisplay={isPublicDisplay}
            maxLevelForecast={maxLevelForecast}
            currentRiskValue={currentRiskValue}
            data={data}
            loading={loading}
            forcasts={forcasts}
            chartType={chartType}
            legendNow={legendNow}
            legendMax={legendMax}
            portialLegendNow={portialLegendNow}
            portialLegendMax={portialLegendMax}
            dataForPublicDisplay={dataForPublicDisplay}
          />
        )}
      </Col>
      </Layout>

    </div>
  )
}

export default withRouter(LanguageHelper(HomePage));