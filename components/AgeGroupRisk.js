import React, { Component } from "react";
import { withRouter } from "next/router";
import { Col, Row } from "antd";
import { LanguageHelper } from "../helpers/languageHelper";
import Image from "next/image";

import LoadingCard from "./LoadingCard";
import PopOver from "./Popover";
import { loadDetailedRecommendationTips } from "../helpers/tipHelper";
import { InfoCircleOutlined } from "@ant-design/icons";
import { red, orange, yellow, green } from '@ant-design/colors';

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
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
    this.loadTranslation();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        loading: this.props.loading,
        data: this.props.data,
        currentRiskValue: this.props.currentRiskValue,
        maxLevelForecast: this.props.maxLevelForecast,
      });
    }
  }

  handleResize() {
    this.setState({ landscape: window.innerWidth > 770 });
  }

  async loadTranslation() {
    const { languageHelper } = this.props;

    let detailedRecommendationTips = await loadDetailedRecommendationTips();

    let res = await languageHelper.translation("CurrentHssRiskDisplay"); //The input will take the name of this class to get the corresponding translation for this page

    this.setState({
      translation: res,
      detailedRecommendationTips:
        detailedRecommendationTips.detailedRecommendationTips,
    });
  }

  detailedRecommendation(tip, riskLevel) {
    let data = this.state.detailedRecommendationTips[riskLevel]?.tips;

    let ageGroup = tip.label;

    if (data) {
      return (
        <div style={{ width: '100%' }}>
          <div>
            <p>
              {`${this.state.translation.TheCurrentHSSFor} `}
              <strong>{ageGroup}</strong>
              {` ${this.state.translation.Is} `}
              <strong>{this.state.translation[riskLevel]}</strong>.
            </p>
            <p>{this.state.translation.BelowIs}</p>
          </div>
          {data.map((tip, key) => {
            let label = tip.label;
            let text = this.state.translation.DetailedRecommendationTips[riskLevel][label];
            
            return (
              <Row key={key} style={{ width: '100%' }}>
                <Col style={{
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'right',
                  width: '15%',
                }}>
                  <Image src={basePath + tip.icon} alt="" width={35} height={35} />
                </Col>
                <Col style={{ width: '80%' }}>
                  <p style={{ marginLeft: '2%' }}>
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

calculateRiskLevel(riskValue) {
  let res = "Extreme";
  let style = { backgroundColor: red[5] };
  
  if (riskValue < 0.75) {
    res = "High";
    style = { backgroundColor: orange[5] };
  }
  if (riskValue < 0.5) {
    res = "Moderate";
    style = { backgroundColor: yellow[5] };
  }
  if (riskValue < 0.25) {
    res = "Low";
    style = { backgroundColor: green[5] };
  }
  
  return {
    riskLevel: res,
    style: style,
  };
}


generateData() {
  // let ageGroupTips = this.state.ageGroupTips[this.state.riskLevel];

  let divider = this.state.data[0][0].divider;

  let currentRiskValue = this.state.currentRiskValue * divider;

  let maxRiskValue = this.state.maxLevelForecast[0].maxRiskValue * divider;

  let healthAdultRes = this.calculateRiskLevel(currentRiskValue / 0.85);
  let healthAdultResMax = this.calculateRiskLevel(maxRiskValue / 0.85);
  let healthAdult = {
    iconLabel: this.state.translation.Healthy,
    riskValue: currentRiskValue / 0.85,
    style: healthAdultRes.style,
    riskLevel: healthAdultRes.riskLevel,
    maxRiskLevel: healthAdultResMax.riskLevel,
    maxRiskStyle: healthAdultResMax.style,
    icon: "/icons/healthy-adults.png",
    key: "helatAdult",
    label: this.state.translation.HealthAdultLabel,
  };

  let elderAdultRes = this.calculateRiskLevel(currentRiskValue / 0.85 / 0.8);
  let elderAdultResMax = this.calculateRiskLevel(maxRiskValue / 0.85 / 0.8);
  let elderAdult = {
    iconLabel: this.state.translation.Vulnerable,
    riskValue: currentRiskValue / 0.85 / 0.8,
    style: elderAdultRes.style,
    riskLevel: elderAdultRes.riskLevel,
    maxRiskLevel: elderAdultResMax.riskLevel,
    maxRiskStyle: elderAdultResMax.style,
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
    style: withMedicationRes.style,
    riskLevel: withMedicationRes.riskLevel,
    maxRiskLevel: withMedicationResMax.riskLevel,
    maxRiskStyle: withMedicationResMax.style,
    icon: "/icons/people-with-chronic-illnesses.png",
    key: "withMed",
    label: this.state.translation.PeopleWithIllnessesLabel,
  };

  let data = [healthAdult, elderAdult, withMedication];

  return data;
}

riskLevelDiv(text, style) {
  return (
    <div
      style={{
        ...style, // 将 calculateRiskLevel 返回的 style 对象加入到 div 的样式中
        borderRadius: '5px',
        width: this.state.landscape ? '120px' : (window.innerWidth <= 733 ? '70px' : '100px'),
        height: '25px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: '10px',
        marginLeft: !this.state.landscape ? '5px' : undefined,
        fontSize: !this.state.landscape ? 'smaller' : undefined
      }}
    >
      <p>{text}</p>
      <InfoCircleOutlined style={{ marginLeft: '5px' }} />
    </div>
  );
}

  // popOverContent(tip) {
  //   return (
  //     <div className={ageGroupRiskStyle.iconPopoverDiv}>
  //       <div className={ageGroupRiskStyle.ageGroupLabelDiv}>
  //         <p>{tip.label}</p>
  //       </div>
  //       <div className={ageGroupRiskStyle.parentDiv}>
  //         <div className={ageGroupRiskStyle.riskLabelDiv}>
  //           <p>{this.state.translation.CurrentHssLabel}</p>
  //         </div>
  //         <PopOver
  //           content={this.detailedRecommendation(tip.riskLevel)}
  //           trigger="click"
  //           child={this.riskLevelDiv(
  //             this.state.translation[tip.riskLevel],
  //             tip.className
  //           )}
  //         />
  //       </div>
  //       <div className={ageGroupRiskStyle.parentDiv}>
  //         <div className={ageGroupRiskStyle.riskLabelDiv}>
  //           <p>{this.state.translation.TodayMaxHssLabel}</p>
  //         </div>
  //         <PopOver
  //           content={this.detailedRecommendation(tip.maxRiskLevel)}
  //           trigger="click"
  //           child={this.riskLevelDiv(
  //             this.state.translation[tip.maxRiskLevel],
  //             tip.maxRiskClassName
  //           )}
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  landscapeView(tip) {
    return (
      <Col style={{ width: '60%' }}>
        <Row style={{
          width: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly'
        }}>
          <PopOver
            content={this.detailedRecommendation(tip, tip.riskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.current,
              tip.style
            )}
          />
        </Row>
        <Row style={{
          width: '70%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-evenly'
        }}>
          <PopOver
            content={this.detailedRecommendation(tip, tip.maxRiskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.max,
              tip.maxRiskStyle
            )}
          />
        </Row>
      </Col>
    );
  }

  mobileView(tip) {
    return (
      <Col style={{ width: '100%' }}>
        <Row style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PopOver
            content={this.detailedRecommendation(tip, tip.riskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.current,
              tip.style
            )}
          />
        </Row>
        <Row style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <PopOver
            content={this.detailedRecommendation(tip, tip.maxRiskLevel)}
            trigger="click"
            child={this.riskLevelDiv(
              this.state.translation.max,
              tip.maxRiskStyle
            )}
          />
        </Row>
      </Col>
    );
  }

  riskTipForAgeGroup() {
    let data = this.generateData();
  
    return (
      <div style={{ width: '100%', marginBottom: '2%', marginTop: '1%' }}>
        <Row style={{ width: '95%' }}>
          {data.map((tip, key) => {
            return (
              <Col span={8} key={tip.key}>
                <Row
                  style={{
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '15px',
                  }}
                >
                  <p>{tip.iconLabel}</p>
                </Row>
                <Row style={{ display: 'flex', alignItems: 'center' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: this.state.landscape ? 'right' : 'center',
                      alignItems: 'flex-end',
                      width: this.state.landscape ? '40%' : '100%',
                      marginTop: this.state.landscape ? '0' : '2%',
                    }}
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