import React, { Component } from "react";
import { withRouter } from "next/router";
import HomePage from "./HomePage";
import LoadingCard from "./../components/LoadingCard";
import { reverseGeocode } from "../helpers/locationHelper";
import cookie from "react-cookies";

class PublicDisplayPage extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    loading: true,
  };

  componentDidMount() {
    // Update the risk level when hit new day
    const now = new Date();
    const millisTillNextDay =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;

    this.dayTimeout = setTimeout(() => {
      window.location.reload(true);
    }, millisTillNextDay);

    // Update the data when the next hour's risk level is changed
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millisTillNextHour = (60 - minutes) * 60 * 1000 - seconds * 1000;

    this.hourTimeout = setTimeout(() => {
      let data = this.state.data.dataForPublicDisplay;
      let currentHour = this.state.data.hour;

      let currentRiskValue = data[currentHour].riskValue;
      let nextRiskValue = data[currentHour + 1].riskValue;

      let difference = Math.abs(currentRiskValue - nextRiskValue);
      if (difference >= 0.25) {
        window.location.reload(true);
      }
    }, millisTillNextHour);
  }

  componentWillUnmount() {
    clearTimeout(this.dayTimeout);
    clearTimeout(this.hourTimeout);
  }

  getHssDataCallBack = (d) => {
    this.setState({ data: d });
  };

  render() {
    return (
      <HomePage
        isPublicDisplay={true}
        getHssDataCallBack={this.getHssDataCallBack}
      />
    );
  }
}

export default withRouter(PublicDisplayPage);
