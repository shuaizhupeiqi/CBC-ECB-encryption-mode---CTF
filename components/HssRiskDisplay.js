import React, { Component, useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Collapse, Button } from "antd";
import { cloneDeep } from 'lodash';
import Router, { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import {
  loadAgeGroupTips,
  loadAllGeneralTips,
  loadGeneralTips,
  loadDetailedRecommendationTips,
} from "../helpers/tipHelper";
import hssRiskDisplayStyle from "./../styles/HssRiskDisplay.module.css";
import generalStyle from "../styles/GeneralComponent.module.css";

import Chart from "./Chart";
import ChartForPublicDisplay from "./ChartForPublicDisplay";
import BottomLegend from "./BottomLegend";
import Image from "next/image";

import LoadingCard from "./LoadingCard";
import PopOver from "./Popover";
import AgeGroupRisk from "./AgeGroupRisk";
// import CustomizedMap from "./CustomizedMap";
import { SettingOutlined } from "@ant-design/icons";
import {useLanguage} from "../hooks/useLanguage"
import { useRecoilValue } from 'recoil'
import { locationState } from '../store/location'
import dynamic from 'next/dynamic'
import ButtonGroup from './addnewpeople'; // 请确保路径正确

//yzz
import { useInView } from 'react-intersection-observer';



// Client Components:
const CustomizedMap = dynamic(() => import("./CustomizedMap"))
// const Chart = dynamic(() => import("./Chart"))


const { Panel } = Collapse;

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const HssRiskDisplay = (props) => {
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true, // 只触发一次
  });


  const {
    isPublicDisplay,
    dataForPublicDisplay,
    data,
    currentRiskValue,
    forcasts,
    chartType,
    maxLevelForecast,
    legendNow,
    legendMax,
    portialLegendNow,
    portialLegendMax,
    languageHelper
  } = props

  const [loading, setLoading] = useState(true)
  const [riskLevel, setRiskLevel] = useState('Extreme')
  const [riskClassName, setRiskClassName] = useState(generalStyle.ExtremeLevel)
  const [ageGroupTips, setAgeGroupTips] = useState({})
  const [allGeneralTips, setAllGeneralTips] = useState({})
  const [generalTips, setGeneralTips] = useState({})
  const [detailedRecommendationTips, setDetailedRecommendationTips] = useState({})
  const parameters = useRecoilValue(locationState)
  const translation = useLanguage(languageHelper, 'CurrentHssRiskDisplay')

  const generateRiskDisplay = useCallback((generalTips, allGeneralTips) => {
    let currentRiskLevel = riskLevel;
    let riskClass = riskClassName;
    let general = cloneDeep(generalTips)

    if (currentRiskValue < 0.25) {
      currentRiskLevel = "Low";
      riskClass = generalStyle.LowLevel;
      general = allGeneralTips.low;
    } else if (currentRiskValue < 0.5 && currentRiskValue >= 0.25) {
      currentRiskLevel = "Moderate";
      riskClass = generalStyle.ModerateLevel;
      general = allGeneralTips.moderate;
    } else if (currentRiskValue < 0.75 && currentRiskValue >= 0.5) {
      currentRiskLevel = "High";
      riskClass = generalStyle.HighLevel;
      general = allGeneralTips.high;
    }
    setRiskLevel(currentRiskLevel)
    setRiskClassName(riskClass)
    setGeneralTips(general)
  }, [currentRiskValue, riskClassName])

  const loadTips = useCallback(async () => {
    setLoading(true)
    //加载提示，状态更新，风险显示加成
    const { ageGroupTips = {} } = await loadAgeGroupTips();
    const { allGeneralTips = {} } = await loadAllGeneralTips();
    const { generalTips = {} } = await loadGeneralTips();
    const { detailedRecommendationTips = {} } = await loadDetailedRecommendationTips();

    setAgeGroupTips(ageGroupTips)
    setAllGeneralTips(allGeneralTips)
    setGeneralTips(generalTips)
    setDetailedRecommendationTips(detailedRecommendationTips)

    generateRiskDisplay(generalTips, allGeneralTips);
    setLoading(false)
  }, [])

  useEffect(() => {
    loadTips()
  }, [])

  const calculateRiskLevel = useCallback((riskValue) => { //根据风险等级设计相应的样式类名
    let res = "Extreme";
    let className = generalStyle.ExtremeLevel;
    if (riskValue < 0.25) {
      res = "Low";
      className = generalStyle.LowLevel;
    } else if (riskValue < 0.5) {
      res = "Moderate";
      className = generalStyle.ModerateLevel;
    } else if (riskValue < 0.75) {
      res = "High";
      className = generalStyle.HighLevel;
    }

    return {
      riskLevel: res,
      className: className,
    };
  }, [])

// 定义各个风险等级的建议
  const recommendations = {
    "Low": {
        "Cool yourself": [
            {tip: "Keep hydrated by drinking water", imgSrc: "/icons/water-bottle.png" }],
        "Use fans effectively": [
            {tip: "Use fans", imgSrc: "/icons/fan.png" }],
        "Keep your house cool": [
            {tip: "Open windows only if it is hotter inside than outside", imgSrc: "/icons/ventilation.png" },
            {tip: "Block sunlight using blinds or curtains", imgSrc: "/icons/blinds.png" },
            {tip: "Set the air conditioner at 27˚C and use a fan pointing at you", imgSrc: "/icons/ac.png" },
            {tip: "Use an evaporative cooler", imgSrc: "/icons/evaporative.png" },
        ],
        "Plan your day": [
            {tip: "Wear lightweight, loose-fitting clothing preferably white", imgSrc: "/icons/tank-top.png" }],
    },
    "Moderate": {
        "Cool yourself": [
            {tip: "Drink a glass of water every hour even if you do not feel thirsty", imgSrc: "/icons/slush-drink.png" },
            {tip: "Wrap a wet towel loosely around your head and neck", imgSrc: "/icons/squeeze.png" },
        ],
        "Use fans effectively": [
            {tip: "Use fans", imgSrc: "/icons/fan.png" },
            {tip: "Use a misting fan in a shaded well-ventilated area", imgSrc: "/icons/misting_fan.png" },
        ],
        "Keep your house cool": [
            {tip: "Block sunlight using blinds or curtains", imgSrc: "/icons/blinds.png" },
            {tip: "Open windows only if it is hotter inside than outside", imgSrc: "/icons/ventilation.png" },
            {tip: "Set the air conditioner at 27˚C and use a fan pointing at you", imgSrc: "/icons/ac.png" },
        ],
        "Plan your day": []
    },
    "High": {
        "Cool yourself": [
            {tip: "Drink a glass of water every hour even if you do not feel thirsty", imgSrc: "/icons/slush-drink.png" },
            {tip: "Keep your skin wet with a spray bottle or by applying water", imgSrc: "/icons/spray.png" },
            {tip: "Wrap a wet towel loosely around your head and neck", imgSrc: "/icons/squeeze.png" },
        ],
        "Use fans effectively": [
             {tip: "Use a misting fan in a shaded well-ventilated area", imgSrc: "/icons/misting_fan.png" },
        ],
        "Keep your house cool": [
            {tip: "Block sunlight using blinds or curtains", imgSrc: "/icons/blinds.png" },
            {tip: "Open windows only if it is hotter inside than outside", imgSrc: "/icons/ventilation.png" },
            {tip: "Set the air conditioner at 27˚C and use a fan pointing at you", imgSrc: "/icons/ac.png" },
            {tip: "Use an evaporative cooler", imgSrc: "/icons/evaporative.png" },
        ],
        "Plan your day": [
            {tip: "Wear lightweight, loose-fitting clothing preferably white", imgSrc: "/icons/tank-top.png" },
            {tip: "Rest more often, in a shaded place with natural air movement", imgSrc: "/icons/alone.png" },
            {tip: "Avoid strenuous activities", imgSrc: "/icons/no-running.png" },
            {tip: "Check on people who may be vulnerable to the heat", imgSrc: "/icons/vulnerable_heat.png" },
        ]
    },
    "Extreme": {
        "Cool yourself": [
            {tip: "Drink a glass of water every hour even if you do not feel thirsty", imgSrc: "/icons/slush-drink.png" },
            {tip: "Keep your skin wet with a spray bottle or by applying water", imgSrc: "/icons/spray.png" },
            {tip: "Wrap a wet towel loosely around your head and neck", imgSrc: "/icons/squeeze.png" },
        ],
        "Use fans effectively": [
            {tip: "Use a misting fan in a shaded well-ventilated area", imgSrc: "/icons/misting_fan.png" },
        ],
        "Keep your house cool": [
            {tip: "Block sunlight using blinds or curtains", imgSrc: "/icons/blinds.png" },
            {tip: "Open windows only if it is hotter inside than outside", imgSrc: "/icons/ventilation.png" },
            {tip: "Set the air conditioner at 27˚C and use a fan pointing at you", imgSrc: "/icons/ac.png" },
            {tip: "Use an evaporative cooler", imgSrc: "/icons/evaporative.png" },
        ],
        "Plan your day": [
            {tip: "Wear lightweight, loose-fitting clothing preferably white", imgSrc: "/icons/tank-top.png" },
            {tip: "Rest more often, in a shaded place with natural air movement", imgSrc: "/icons/alone.png" },
            {tip: "Avoid strenuous activities", imgSrc: "/icons/no-running.png" },
            {tip: "Check on people who may be vulnerable to the heat", imgSrc: "/icons/vulnerable_heat.png" },
        ]
    }
  };


// 根据风险等级动态渲染建议
  const detailedRecommendation = useCallback((riskLevel) => {
    const data = recommendations[riskLevel];
    if (!data) return null;

    return (
        <Collapse className={hssRiskDisplayStyle.detailedRecommendatonMainDiv}>
            {Object.entries(data).map(([category, tips], index) => (
                <Collapse.Panel header={category} key={index + 1}>
                    {tips.map(({ tip, imgSrc }, tipIndex) => (
                        <div key={tipIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e8e8e8', paddingBottom: '10px' }}>
                            <Image src={basePath + imgSrc} alt={tip} width={35} height={35} />
                            <span style={{ flexGrow: 1, marginLeft: '10px' }}>{tip}</span>
                        </div>
                    ))}
                </Collapse.Panel>
            ))}
        </Collapse>
    );
  }, [basePath]);

  const riskTips = useMemo(() => {  //渲染风险提示
    return (
      <Row>
        <Col className={hssRiskDisplayStyle.riskTipCol}>
          {generalTips?.map?.(({ key, icon, label }) => (
            <Row
              key={key}
              className={hssRiskDisplayStyle.generalTipRow}
            >
              <Image
                src={basePath + icon}
                alt=""
                width={35}
                height={35}
              />
              <p>{translation?.[label]}</p>
            </Row>
          ))}
        </Col>
      </Row>
    );
  }, [generalTips, translation])

  const renderRiskValueDisplay = useMemo(() => {
    const maxRiskLevel = calculateRiskLevel(maxLevelForecast?.[0]?.maxRiskValue)?.riskLevel
    const a = detailedRecommendation(riskLevel)

    return loading ? (
      <LoadingCard />
    ) : (
      <div
        id={hssRiskDisplayStyle.coloredDiv}
        className={riskClassName}
      >

        {detailedRecommendationTips ?
          <div>
            <Col>
              <Row span={3} id={hssRiskDisplayStyle.currentRiskLabelRow}>
                <p className={hssRiskDisplayStyle.riskLevelHeader}>
                  {translation.CurrentHssLabel}
                </p>
                <PopOver
                  content={a}
                  child={
                    <p className={hssRiskDisplayStyle.riskLevelLabel}>
                      {translation?.[riskLevel]}
                    </p>
                  }
                />
              </Row>

            </Col>
            {riskTips}
            <Row id={hssRiskDisplayStyle.currentRiskLabelMaxRow}>
                <p className={hssRiskDisplayStyle.riskLevelHeaderTodayMax}>
                  {translation.TodayMaxHssLabel}
                </p>
                <PopOver
                  content={a}
                  child={
                    <p className={hssRiskDisplayStyle.riskLevelTodayMaxLabel}>
                      {
                        translation[maxRiskLevel]
                      }
                    </p>
                  }
                />
                <p className={hssRiskDisplayStyle.riskLevelHeaderTodayMaxTime}>
                  {translation.AtTimeLabel}{" "}
                  {maxLevelForecast?.[0]?.time}:00
                </p>
              </Row>
          </div>
          : null}
      </div>
    )
   }, [translation, maxLevelForecast, detailedRecommendationTips, riskClassName, riskLevel, riskTips, detailedRecommendation, calculateRiskLevel])


   //  //第三个组件，三个人群，

   const renderAgeGroupRiskDisplay = useMemo(() => { //风险值的显示及年龄组风险显示
   // console.log('Cookiestest:', data);

    return loading ? (
      <LoadingCard />
    ) : (
      <AgeGroupRisk
        loading={loading}
        data={data}
        currentRiskValue={currentRiskValue}
        maxLevelForecast={maxLevelForecast}
      />
    );


  }, [loading,data,currentRiskValue,maxLevelForecast])

//新功能添加新人群

const renderButtonGroup = useMemo(() => {
  return  (


    <ButtonGroup
     data={data}
    />
  );
}, []);






  const handleSettingPage = useCallback(() => {  //导航到setting的页面
    Router.push({
      pathname: "/SettingPage",
    });
  }, [])

  const renderPersonalizedSettingsButton = useMemo(() => {
    return loading ? (
      <LoadingCard />
    ) : (
      <div>
        <Row>
          {/* <Button
            id={hssRiskDisplayStyle.personalizedButton}
            type="primary"
            onClick={handleSettingPage}
            icon={<SettingOutlined />}
          >
            {translation.PersonalizedButton}
          </Button> */}
        </Row>

        <BottomLegend
          legendNow={legendNow}
          legendMax={legendMax}
          loading={loading}
          portialLegendNow={portialLegendNow}
          portialLegendMax={portialLegendMax}
        />
      </div>
    );
  }, [translation, loading, legendNow, legendMax, portialLegendNow, portialLegendMax])

  const renderDetailedRecommendationCollapse = useMemo(() => {
    return loading ? (
      <LoadingCard />
    ) : (
      <div>
        <Collapse className={hssRiskDisplayStyle.collapseForecast}>
          <Panel
            header={translation.DetailedRecommendationLabel}
            key="1"
          >
            {detailedRecommendationTips
              ? detailedRecommendation(riskLevel)
              : null}
          </Panel>
        </Collapse>
      </div>
    );
  }, [loading, translation, riskLevel, detailedRecommendationTips, detailedRecommendation])

  const todayForecastDividerHeader = useMemo(() => {
    let maxRiskValue = maxLevelForecast?.[0]?.maxRiskValue;
    let res = calculateRiskLevel(maxRiskValue);
    const a = detailedRecommendation(res.riskLevel)
    return (
      <Row className={hssRiskDisplayStyle.forcastRow}>
        <Row>{translation.TodaysForecastLabel}</Row>
        <Row className={hssRiskDisplayStyle.forcastLevelMainRow}>
          <div className={hssRiskDisplayStyle.forcastLevelMainRowLabel}>
            <p>{translation.MaxRiskLabel}</p>
          </div>
          <PopOver
            content={a}
            trigger="click"
            child={
              <div
                className={`${hssRiskDisplayStyle.maxRiskLevelDiv} ${res.className}`}
              >
                <p className={hssRiskDisplayStyle.maxRiskLevelText}>
                  {translation[res.riskLevel]}
                </p>
              </div>
            }
          />
        </Row>
      </Row>
    );
  }, [maxLevelForecast, translation, calculateRiskLevel, detailedRecommendation])

  const renderTodayForecastCollapse = useMemo(() => {
    return loading ? (
      <LoadingCard />
    ) : (
      <div>
        <Collapse
          className={hssRiskDisplayStyle.collapseForecast}
          defaultActiveKey={["1"]}
        >
          <Panel header={todayForecastDividerHeader} key="1">
            <Col>
              <Chart
                parameters={parameters}
                data={data[0]}
                loading={loading}
                chartType={chartType}
              />
            </Col>
          </Panel>
        </Collapse>
      </div>
    );
  }, [loading, parameters, data, chartType, todayForecastDividerHeader])


  const collapseHeader = useCallback((forecast, max) => {
    // console.log('258', JSON.parse(JSON.stringify(max)))
    console.log('259',forecast)
    const a = detailedRecommendation(max.maxRiskLevel)
    console.log('261',a)
    return (
      <Row className={hssRiskDisplayStyle.forcastRow}>
        <Row>{forecast?.label + "-" + forecast?.date}</Row>
        <Row className={hssRiskDisplayStyle.forcastLevelMainRow}>
          <div className={hssRiskDisplayStyle.forcastLevelMainRowLabel}>
            <p>{translation.MaxRiskLabel}</p>
          </div>
          <PopOver
            content={a}

            trigger="click"
            child={
              <div
                className={`${hssRiskDisplayStyle.maxRiskLevelDiv} ${max?.["className"]}`}
              >
                <p className={hssRiskDisplayStyle.maxRiskLevelText}>
                  {translation[max?.["maxRiskLevel"]]}
                </p>
              </div>
            }
          />
        </Row>
      </Row>
    );
  }, [translation, detailedRecommendation])



  const renderNextDaysForecast = useMemo(() => {

    return loading ? (
      <LoadingCard />
    ) : (
      <div>
        {/* <Divider orientation="left">{this.state.translation.ForecastsForNextDaysLabel}</Divider> */}
        {forcasts.map((forecast, key) => {

const a = collapseHeader(
  forecast,
  maxLevelForecast.slice(1)[key]
)
          return (
            <Collapse
              key={key + "collspa"}
              className={hssRiskDisplayStyle.collapseForecast}
            >
              <Panel
                header={a}
                key={key + "panel"}
              >
                <Col key={key + "col"}>
                  <Chart
                    maxLevel={maxLevelForecast.slice(1)[key]}
                    parameters={parameters}
                    data={data.slice(1)[key]}
                    loading={loading}
                    chartType={chartType}
                  />
                </Col>
              </Panel>
            </Collapse>
          );
        })}
      </div>
    );
  }, [loading, forcasts, maxLevelForecast, parameters, data, chartType, collapseHeader])

  // const renderMap = useMemo(() => {
  //   return loading ? (
  //     <LoadingCard />
  //   ) : (
  //     <CustomizedMap
  //       centerCoordinates={[
  //         parameters.latitude,
  //         parameters.longitude,
  //       ]}
  //       markerCoordinates={[
  //         parameters.latitude,
  //         parameters.longitude,
  //       ]}
  //       content={
  //         detailedRecommendationTips
  //           ? detailedRecommendation(riskLevel)
  //           : null
  //       }
  //     />
  //   );
  // }, [loading, parameters, detailedRecommendationTips, detailedRecommendation])

//map lazyloading  
  useEffect(() => {
    if (inView && parameters) {
      setShouldRenderMap(true);
    }
  }, [inView, parameters]);

  const renderMap = useMemo(() => {
    return loading ? (
      <LoadingCard />
    ) : shouldRenderMap ? (
      <CustomizedMap
        centerCoordinates={[parameters.latitude, parameters.longitude]}
        markerCoordinates={[parameters.latitude, parameters.longitude]}
        content={detailedRecommendationTips ? detailedRecommendation(riskLevel) : null}
      />
    ) : (
      11
    );
  }, [loading, shouldRenderMap, parameters, detailedRecommendationTips, detailedRecommendation]);


  const renderTodayForecastCollapsePublicDisplay = useMemo(() => {
    return loading ? (
      <LoadingCard />
    ) : (
      <div>
        <Collapse
          className={hssRiskDisplayStyle.collapseForecast}
          defaultActiveKey={["1"]}
        >
          <Panel header={todayForecastDividerHeader} key="1">
            <Col>
              <ChartForPublicDisplay
                parameters={parameters}
                dataForPublicDisplay={dataForPublicDisplay}
                loading={loading}
              />
            </Col>
          </Panel>
        </Collapse>
      </div>
    );
  }, [loading, parameters, dataForPublicDisplay, todayForecastDividerHeader])

  const publicDisplayMainView = useMemo(() => {
    return (
      <div id={hssRiskDisplayStyle.publicDisplayContainer}>
        <div id={hssRiskDisplayStyle.publicDisplayInnerContainer}>
          {renderRiskValueDisplay}

          {/* {this.renderAgeGroupRiskDisplay()} */}

          {renderTodayForecastCollapsePublicDisplay}
        </div>
      </div>
    );
  }, [renderRiskValueDisplay, renderTodayForecastCollapsePublicDisplay])

  // const publicDisplayMainView = useMemo(() => {
  //   return (
  //     <div id={hssRiskDisplayStyle.publicDisplayContainer}>
  //       <div id={hssRiskDisplayStyle.publicDisplayInnerContainer}>
  //         {renderRiskValueDisplay}

  //         {/* {this.renderAgeGroupRiskDisplay()} */}

  //         {renderTodayForecastCollapsePublicDisplay}
  //       </div>
  //     </div>
  //   );
  // }, [renderRiskValueDisplay, renderTodayForecastCollapsePublicDisplay])

  return isPublicDisplay
    ? publicDisplayMainView
    :
    <div id={hssRiskDisplayStyle.container}>
      {renderRiskValueDisplay}
      {/* 注释这一行是原有的三个人群 */}
      {/* {renderAgeGroupRiskDisplay} */}
      {renderButtonGroup}
      {renderPersonalizedSettingsButton}

      {renderDetailedRecommendationCollapse}

      {renderTodayForecastCollapse}

      {renderNextDaysForecast}
      <div ref={ref}>
        {renderMap}
      </div>

    </div>
    ;
}

export default withRouter(LanguageHelper(HssRiskDisplay));