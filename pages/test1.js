import React, { Component } from "react";
import { Collapse, Row, Col } from 'antd'
import { withRouter } from "next/router";
import Layout from "./layout";
import { LanguageHelper } from "../helpers/languageHelper";
import ReactMarkdown from "react-markdown";
import LoadingCard from "../components/LoadingCard";
import hssRiskDisplayStyle from "../styles/HssRiskDisplay.module.css";
import CustomizedMap from "../components/CustomizedMap";
import PopOver from "./../components/Popover";
import { checkUserLoggedIn, getUserInfo } from "../helpers/authHelper";
import cookie from "react-cookies";
import { reverseGeocode, getTimezone, } from "../helpers/locationHelper";
import { getHSSData } from "../helpers/hssHelper";
import AddressDropDown from "../components/AddressDropDown";
import {
  createOrUpdateData,
  readData,
} from "../helpers/dataHelper";

const { Panel } = Collapse

class AboutPage extends Component {
  constructor(props) {
    super(props);
    //TODO: put necessary init process here
  }

  state = {
    loading: true,
    hour: 0,
    week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    forcasts: [],
    reloadAddress: false,
    addressDefaultValue: "Parramatta Westfield,NSW, 2150",
    detailedRecommendationTips: {},
    parameters: {
      latitude: -33.8,
      longitude: 151.01,
      //variable needed, unchanged
      hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
      timezone: "Australia/Sydney",
    },
    translation: {
      MaxRiskLabel: '最大风险值',
    },
  };

  componentDidMount() {
    this.loadData();
    this.setDay();
  }
  async setDay() {
    //today
    let today = new Date();

    //tomorrow
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    let tomorrowNum = tomorrow.getDay();

    let tomorrowDate =
      ("0" + tomorrow.getDate()).slice(-2) +
      "/" +
      ("0" + (tomorrow.getMonth() + 1)).slice(-2);

    //the day after tomorrow
    let after = new Date(tomorrow);
    after.setDate(after.getDate() + 1);
    let afterNum = after.getDay();

    let afterDate =
      ("0" + after.getDate()).slice(-2) +
      "/" +
      ("0" + (after.getMonth() + 1)).slice(-2);

    //the day after after tomorrow
    let after2 = new Date(after);
    after2.setDate(after2.getDate() + 1);
    let after2Num = after2.getDay();

    let after2Date =
      ("0" + after2.getDate()).slice(-2) +
      "/" +
      ("0" + (after2.getMonth() + 1)).slice(-2);

    //week day list
    let tomorrowDay = this.state.week[tomorrowNum];
    let afterDay = this.state.week[afterNum];
    let after2Day = this.state.week[after2Num];
    let forcastWeekday = [];

    forcastWeekday.push(
      { label: tomorrowDay, date: tomorrowDate },
      { label: afterDay, date: afterDate },
      { label: after2Day, date: after2Date }
    );

    //current hour
    let hour = today.getHours();
    //next hour number
    if (hour == 23) {
      hour = 0;
    }
    this.setState({
      hour: hour,
      forcasts: forcastWeekday,
    });
  }
  async loadData() {
    this.setState({ loading: true });

    let user = await getUserInfo();

    if (user && user.emailVerified) {
      try {
        const dataFromFirebase = await readData(`users/${user.uid}`);
        let geoData = parseJSONValues(dataFromFirebase.geoData);

        let timeZone = getTimezone(geoData.latitude, geoData.longitude);

        this.setState({
          parameters: {
            latitude: geoData.latitude,
            longitude: geoData.longitude,
            //variable needed, unchanged
            hourly:
              "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
            timezone: timeZone,
          },
        });

        await this.setLoadedData(geoData);
      } catch (error) {
        console.error(
          "Get user geo data from firebase operation failed:",
          error
        );

        await this.loadGeodataFromCookie();
      }
    } else {
      await this.loadGeodataFromCookie();
    }
  }

  async loadGeodataFromCookie() {
    let geoData = cookie.load("geoData");
    if (geoData) {
      let timeZone = getTimezone(geoData.latitude, geoData.longitude);
      this.setState({
        parameters: {
          latitude: geoData.latitude,
          longitude: geoData.longitude,
          //variable needed, unchanged
          hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
          timezone: timeZone,
        },
      });
    } else {
      geoData = this.state.parameters;
    }

    await this.setLoadedData(geoData);
  }

  async setLoadedData(geoData) {
    let hssRiskData = await getHSSData(
      geoData,
      this.state.hour,
      this.state.translation
    );
    if (this.state.isPublicDisplay) {
      this.props.getHssDataCallBack({
        dataForPublicDisplay: hssRiskData.dataForPublicDisplay,
        hour: this.state.hour,
      });
    }
    this.setState({
      addressDefaultValue:
        geoData.suburb + ", " + geoData.state + ", " + geoData.postcode,
      geoData: geoData,
      currentRiskValue: hssRiskData.currentRiskValue,
      data: hssRiskData.data,
      loading: false,
      maxLevelForecast: hssRiskData.maxLevelForecast,
      legendNow: hssRiskData.now,
      legendMax: hssRiskData.max,
      portialLegendNow: hssRiskData.portialNow,
      portialLegendMax: hssRiskData.portialMax,
      dataForPublicDisplay: hssRiskData.dataForPublicDisplay,
    });
  }
  handleAddressCallBack = async (values) => {
    let jsonVal = {
      postcode: values[0],
      suburb: values[1],
      latitude: values[2],
      longitude: values[3],
      state: values[4],
    };

    let lat = values[2];
    let lon = values[3];

    let user = await getUserInfo();

    if (user && user.emailVerified) {
      createOrUpdateData(`users/${user.uid}`, { geoData: jsonVal })
        .then(() => {
          this.setDataWhenHandleAddressCallBack(values, lat, lon, jsonVal);
        })
        //save the data into the local storage when save to cloud is failed
        .catch((error) => {
          console.error("Update user geo location operation failed:", error);
          cookie.save("geoData", JSON.stringify(jsonVal));

          this.setDataWhenHandleAddressCallBack(values, lat, lon, jsonVal);
        });
    } else {
      cookie.save("geoData", JSON.stringify(jsonVal));

      this.setDataWhenHandleAddressCallBack(values, lat, lon, jsonVal);
    }
  };
  setDataWhenHandleAddressCallBack(values, lat, lon, jsonVal) {
    let timeZone = getTimezone(lat, lon);
    this.setState({
      loading: true,
      // addressDefaultValue: jsonVal,
      parameters: {
        latitude: lat,
        longitude: lon,
        suburb: values[1],
        postcode: values[0],
        //variable needed, unchanged
        hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
        timezone: timeZone,
      },
    });
    this.loadData();
  }
  renderAddressDropdown() {
    return this.state.reloadAddress || this.state.loading ? (
      <LoadingCard />
    ) : (
      <AddressDropDown
        handleLocateMeCallBack={this.handleLocateMeCallBack}
        handleAddressCallBack={this.handleAddressCallBack}
        defaultValue={this.state.addressDefaultValue}
        geoData={this.state.geoData}
      />
    );
  }
  handleLocateMeCallBack = async () => {
    this.setState({
      loading: true,
      reloadAddress: true,
    });
    navigator.geolocation.getCurrentPosition(async (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;

      let data = await reverseGeocode(lat, lon);

      if (data) {
        let jsonVal = {
          postcode: data.postcode,
          suburb: data.suburb,
          latitude: lat,
          longitude: lon,
          state: data.state,
        };

        let user = await getUserInfo();

        let newAddress = data.suburb + ", " + data.state + ", " + data.postcode;

        let timeZone = getTimezone(lat, lon);

        if (user && user.emailVerified) {
          createOrUpdateData(`users/${user.uid}`, { geoData: jsonVal })
            .then(() => {
              console.log(
                "Operation successful to update address via locate me"
              );

              this.setState({
                reloadAddress: false,
                addressDefaultValue: newAddress,
                loading: false,
                parameters: {
                  latitude: lat,
                  longitude: lon,
                  suburb: data.suburb,
                  postcode: data.postcode,
                  //variable needed, unchanged
                  hourly:
                    "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
                  timezone: timeZone,
                },
              });

              this.loadData();
            })
            //save the data into the local storage when save to cloud is failed
            .catch((error) => {
              console.error("Operation failed:", error);
              cookie.save("geoData", JSON.stringify(jsonVal));
            });
        } else {
          cookie.save("geoData", JSON.stringify(jsonVal));

          this.setState({
            reloadAddress: false,
            addressDefaultValue: newAddress,
            loading: false,
            parameters: {
              latitude: lat,
              longitude: lon,
              suburb: data.suburb,
              postcode: data.postcode,
              //variable needed, unchanged
              hourly:
                "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
              timezone: timeZone,
            },
          });

          this.loadData();
        }
      } else {
        showAlert("error", "Location Error", "Unable to get your location.");
        this.setState({
          reloadAddress: false,
          loading: false,
        });
      }
    });
  };



  
  collapseHeader(forecast, max) {
    return (
      <Row className={hssRiskDisplayStyle.forcastRow}>
        <Row>{forecast.label + "-" + forecast.date}</Row>
        <Row className={hssRiskDisplayStyle.forcastLevelMainRow}>
          <div className={hssRiskDisplayStyle.forcastLevelMainRowLabel}>
            <p>{this.state.translation.MaxRiskLabel}</p>
          </div>
          <PopOver
            content={'111'}
            // content={this.detailedRecommendation(max.maxRiskLevel)}
            trigger="click"
            child={
              <div
                className={`${hssRiskDisplayStyle.maxRiskLevelDiv} ${max["className"]}`}
              >
                <p className={hssRiskDisplayStyle.maxRiskLevelText}>
                  {this.state.translation[max["maxRiskLevel"]]}
                </p>
              </div>
            }
          />
        </Row>
      </Row>
    );
  }

  render() {
    return (
      <div>
        <Layout>
          {this.state.isPublicDisplay ? null : this.renderAddressDropdown()}
          {!this.state.loading && <CustomizedMap
            centerCoordinates={[
              this.state.parameters.latitude,
              this.state.parameters.longitude,
            ]}
            markerCoordinates={[
              this.state.parameters.latitude,
              this.state.parameters.longitude,
            ]}
          // content={
          //   this.state.detailedRecommendationTips
          //     ? this.detailedRecommendation(this.state.riskLevel)
          //     : null
          // }
          />}



          {this.state.loading || (
            <div>
              {this.state.forcasts.map((forecast, key) => {
                return (
                  <Collapse
                    key={key + "collspa"}
                    className={hssRiskDisplayStyle.collapseForecast}
                  >
                    <Panel
                      header={this.collapseHeader(
                        forecast,
                        this.state.maxLevelForecast.slice(1)[key]
                      )}
                      key={key + "panel"}
                    >
                      <Col key={key + "col"}>
                        {/* <Chart
                          maxLevel={this.state.maxLevelForecast.slice(1)[key]}
                          parameters={this.state.parameters}
                          data={this.state.data.slice(1)[key]}
                          loading={this.state.loading}
                          chartType={this.state.chartType}
                        /> */}
                      </Col>
                    </Panel>
                  </Collapse>
                );
              })}
            </div>
          )
          }
        </Layout>
      </div>
    );
  }
}

export default withRouter(LanguageHelper(AboutPage));
