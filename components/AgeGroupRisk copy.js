import React, { Component } from "react";
import { withRouter } from "next/router"; //获取路由信息
import { Col, Row } from "antd";
import { LanguageHelper } from "../helpers/languageHelper";
import Image from "next/image";
import generalStyle from "../styles/GeneralComponent.module.css";
import ageGroupRiskStyle from "./../styles/AgeGroupRisk.module.css";
import hssRiskDisplayStyle from "./../styles/HssRiskDisplay.module.css";
import LoadingCard from "./../components/LoadingCard";//展示加载数据状态
import PopOver from "./../components/Popover";//悬停或点击之后的信息
import { loadDetailedRecommendationTips } from "../helpers/tipHelper";
import { InfoCircleOutlined } from "@ant-design/icons";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

class AgeGroupRisk extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  state = {
    landscape: false,
    translation: {},
    detailedRecommendationTips: {},
    loading: this.props.loading,
    data: this.props.data,
    currentRiskValue: this.props.currentRiskValue,
    maxLevelForecast: this.props.maxLevelForecast,
  };//状态初始化

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();//初始化窗口
    this.loadTranslation();//调用该函数
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }//在组件卸载时，删掉之前的监视器，与addressdropdown部分联动

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        loading: this.props.loading,
        data: this.props.data,
        currentRiskValue: this.props.currentRiskValue,
        maxLevelForecast: this.props.maxLevelForecast,
      });
    }//检查状态是否更新
  }

  handleResize() {
    this.setState({ landscape: window.innerWidth > 770 });
  }//响应窗口尺寸变化，横屏或者竖屏

  async loadTranslation() {
    const { languageHelper } = this.props;

    let detailedRecommendationTips = await loadDetailedRecommendationTips();//异步加载建议

    let res = await languageHelper.translation("CurrentHssRiskDisplay"); //The input will take the name of this class to get the corresponding translation for this page
                                                                   
    this.setState({
      translation: res,
      detailedRecommendationTips:
        detailedRecommendationTips.detailedRecommendationTips,
    }); //根据翻译过后的对状态进行更新
  }

  detailedRecommendation(tip, riskLevel) {
    let data = this.state.detailedRecommendationTips[riskLevel]?.tips;//使用risklevel获取相应的tips数据

    let ageGroup = tip.label;//设置年龄组

    if (data) {
      return (
        <div className={hssRiskDisplayStyle.detailedRecommendatonMainDiv}>
          <div>
            <p>
              {this.state.translation.TheCurrentHSSFor}
              <strong>{ageGroup}</strong>
              {this.state.translation.Is}{" "}
              <strong>{this.state.translation[riskLevel]}</strong>.
            </p>
            <p>{this.state.translation.BelowIs}</p>
          </div>
          {data.map((tip, key) => {
            let label = tip.label;

            let text =
              this.state.translation.DetailedRecommendationTips[riskLevel][
                label
              ];
            return (
              <Row
                key={key}
                className={hssRiskDisplayStyle.detailedRecommendatonRow}
              >
                <Col
                  className={hssRiskDisplayStyle.detailedRecommendatonImageCol}
                >
                  <Image
                    src={basePath + tip.icon}
                    alt=""
                    width={35}
                    height={35}
                  />
                </Col>
                <Col
                  className={hssRiskDisplayStyle.detailedRecommendatonTextCol}
                >
                  <p className={hssRiskDisplayStyle.detailedRecommendationText}>
                    {text ? text : "Unable to read string"}
                  </p>
                </Col>
              </Row>
            );
          })}
        </div>
      );
    }
    return null;
  }

  calculateRiskLevel(riskValue) {   //根据输入的riskvalue计算风险等级
    let res = "Extreme";

    let className = generalStyle.ExtremeLevel;
    if (riskValue < 0.75) {
      res = "High";
      className = generalStyle.HighLevel;
    }
    if (riskValue < 0.5) {
      res = "Moderate";
      className = generalStyle.ModerateLevel;
    }
    if (riskValue < 0.25) {
      res = "Low";
      className = generalStyle.LowLevel;
    }

    return {
      riskLevel: res,
      className: className,
    };
  }

  generateData() {   //计算不同人群的风险等级
    // let ageGroupTips = this.state.ageGroupTips[this.state.riskLevel];

    let divider = this.state.data?.[0]?.[0]?.divider;

    let currentRiskValue = this.state.currentRiskValue * divider;

    let maxRiskValue = this.state.maxLevelForecast[0].maxRiskValue * divider;

    let healthAdultRes = this.calculateRiskLevel(currentRiskValue / 0.85);
    let healthAdultResMax = this.calculateRiskLevel(maxRiskValue / 0.85);
    let healthAdult = {
      iconLabel: this.state.translation.Healthy,
      riskValue: currentRiskValue / 0.85,
      className: healthAdultRes.className,
      riskLevel: healthAdultRes.riskLevel,
      maxRiskLevel: healthAdultResMax.riskLevel,
      maxRiskClassName: healthAdultResMax.className,
      icon: "/icons/healthy-adults.png",
      key: "helatAdult",
      label: this.state.translation.HealthAdultLabel,
    };

    let elderAdultRes = this.calculateRiskLevel(currentRiskValue / 0.85 / 0.8);
    let elderAdultResMax = this.calculateRiskLevel(maxRiskValue / 0.85 / 0.8);
    let elderAdult = {
      iconLabel: this.state.translation.Vulnerable,
      riskValue: currentRiskValue / 0.85 / 0.8,
      className: elderAdultRes.className,
      riskLevel: elderAdultRes.riskLevel,
      maxRiskLevel: elderAdultResMax.riskLevel,
      maxRiskClassName: elderAdultResMax.className,
      icon: "/icons/vulnerable_alter.png",
      key: "elderAdult",
      label: this.state.translation.HealtherOlderLabel,
    };

    let withMedicationRes = this.calculateRiskLevel(
      currentRiskValue / 0.85 / 0.7
    );
    let withMedicationResMax = this.calculateRiskLevel(
      maxRiskValue / 0.85 / 0.7
    );
    let withMedication = {
      iconLabel: this.state.translation.Comorbidity,
      riskValue: currentRiskValue / 0.85 / 0.7,
      className: withMedicationRes.className,
      riskLevel: withMedicationRes.riskLevel,
      maxRiskLevel: withMedicationResMax.riskLevel,
      maxRiskClassName: withMedicationResMax.className,
      icon: "/icons/people-with-chronic-illnesses.png",
      key: "withMed",
      label: this.state.translation.PeopleWithIllnessesLabel,
    };

    let data = [healthAdult, elderAdult, withMedication];

    return data;
  }

  riskLevelDiv(text, className) {  //包含风险等级和信息图标元素
    return (
      <div
        className={`${
          this.state.landscape
            ? ageGroupRiskStyle.ageGroupRiskLevelInnerDiv
            : ageGroupRiskStyle.ageGroupRiskLevelInnerDivMobile
        } ${className}`}
      >
        <p>{text}</p>
        <InfoCircleOutlined className={ageGroupRiskStyle.infoIcon} />
      </div>
    );
  }

  popOverContent(tip) {
    return (
      <div className={ageGroupRiskStyle.iconPopoverDiv}>
        <div className={ageGroupRiskStyle.ageGroupLabelDiv}>
          <p>{tip.label}</p>
        </div>
        <div className={ageGroupRiskStyle.parentDiv}>
          <div className={ageGroupRiskStyle.riskLabelDiv}>
            <p>{this.state.translation.CurrentHssLabel}</p>
          </div>
          <PopOver
            content={this.detailedRecommendation(tip.riskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation[tip.riskLevel],
              tip.className
            )}
          />
        </div>
        <div className={ageGroupRiskStyle.parentDiv}>
          <div className={ageGroupRiskStyle.riskLabelDiv}>
            <p>{this.state.translation.TodayMaxHssLabel}</p>
          </div>
          <PopOver
            content={this.detailedRecommendation(tip.maxRiskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation[tip.maxRiskLevel],
              tip.maxRiskClassName
            )}
          />
        </div>
      </div>
    );
  }

  landscapeView(tip) {  //显示风险等级的详细建议，，显示最大风险等级的建议
    return (
      <Col className={ageGroupRiskStyle.Col}>
        <Row className={ageGroupRiskStyle.ageRiskColRowLandScape}>
          {/* <div>
            <p>{this.state.translation.current}</p>
          </div> */}
          <PopOver
            content={this.detailedRecommendation(tip, tip.riskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.current,
              // this.state.translation[tip.riskLevel],
              tip.className
            )}
          />
        </Row>
        <Row className={ageGroupRiskStyle.ageRiskColRowLandScape}>
          {/* <div>
            <p>{this.state.translation.max}</p>
          </div> */}
          <PopOver
            content={this.detailedRecommendation(tip, tip.maxRiskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.max,
              tip.maxRiskClassName
            )}
          />
        </Row>
      </Col>
    );
  }

  mobileView(tip) { //用户点击时，通过popover组件显示风险等级的详细建议
    return (
      <Col className={ageGroupRiskStyle.mobileMainRow}>
        <Row className={ageGroupRiskStyle.ageRiskColRowMobile}>
          {/* <div>
            <p>{this.state.translation.current}</p>
          </div> */}
          <PopOver
            content={this.detailedRecommendation(tip, tip.riskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.current,
              tip.className
            )}
          />
        </Row>

        <Row className={ageGroupRiskStyle.ageRiskColRowMobile}>
          {/* <div>
            <p>{this.state.translation.max}</p>
          </div> */}
          <PopOver
            content={this.detailedRecommendation(tip, tip.maxRiskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.max,
              tip.maxRiskClassName
            )}
          />
        </Row>
      </Col>
    );
  }

  riskTipForAgeGroup() {   //主要是包含不同年龄组和健康状况的风险提示，包括图标，标签，风险等级
    let data = this.generateData();

    return (
      <div id={ageGroupRiskStyle.mainDiv}>
        <Row id={ageGroupRiskStyle.mainRow}>
          {data.map((tip, key) => {
            return (
              <Col span={8} key={tip.key}>
                <Row className={ageGroupRiskStyle.ageGroupLabelRow}>
                  <p>{tip.iconLabel}</p>
                </Row>
                <Row className={ageGroupRiskStyle.rowCenter}>
                  <div
                    className={
                      this.state.landscape
                        ? ageGroupRiskStyle.iconDiv
                        : ageGroupRiskStyle.iconDivMobile
                    }
                  >
                    <Image
                      src={basePath + tip.icon}
                      alt=""
                      width={60}
                      height={60}
                    />
                  </div>
                  {this.state.landscape
                    ? this.landscapeView(tip)
                    : this.mobileView(tip)}
                </Row>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading ? <LoadingCard /> : this.riskTipForAgeGroup()}
      </div>
    );
  }
}

export default withRouter(LanguageHelper(AgeGroupRisk));
