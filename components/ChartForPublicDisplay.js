import React, { Component } from "react";
import { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import { Space, Row } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceArea,
  ResponsiveContainer,
  Label,
} from "recharts";
import LoadingCard from "./LoadingCard";
import { red, orange, yellow, green,gray } from '@ant-design/colors';


class ChartForPublicDisplay extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    componentSize: "middle",

    loading: true,

    dataForPublicDisplay: this.props.dataForPublicDisplay,

    maxRiskLevel: "",

    backgroundColor: "",

    week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    fillColors: {
      low: green[5],
      medium: yellow[5],
      high: orange[5],
      extreme: red[5],
    },
  };

  componentDidMount() {
    this.loadData();
    this.updateCountDown();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        dataForPublicDisplay: this.props.dataForPublicDisplay,
      });
    }
  }

  //reload the data to update the date time every hour

  updateCountDown() {
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millisTillNextHour = (60 - minutes) * 60 * 1000 - seconds * 1000;

    this.timeout = setTimeout(() => {
      this.loadData();
      this.updateCountDown(); // to reschedule the next data load
    }, millisTillNextHour);
  }

  getDate(day) {
    let date =
      ("0" + day.getDate()).slice(-2) +
      "/" +
      ("0" + (day.getMonth() + 1)).slice(-2);

    let weekDay = this.state.week[day.getDay()];

    return {
      date: date,
      weekDay: weekDay,
    };
  }

  loadData() {
    //today
    let today = new Date();

    let todayData = this.getDate(today);

    let todayDate = todayData.date;
    let todayWeekDay = todayData.weekDay;

    //tomorrow
    let tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let tomorrowData = this.getDate(tomorrow);

    let tomorrowDate = tomorrowData.date;
    let tomorrowWeekDay = tomorrowData.weekDay;

    let hour = today.getHours();

    this.setState({
      loading: false,
      currentTime: hour,
      dateData: {
        todayDate: todayDate,
        todayWeekDay: todayWeekDay,
        tomorrowDate: tomorrowDate,
        tomorrowWeekDay: tomorrowWeekDay,
      },
    });
  }

  lineChart() {
    return (
      <LineChart
        data={this.state.dataForPublicDisplay}
        margin={{ top: 20, right: 40, left: -50, bottom: 0 }}
      >
        <XAxis dataKey="time" interval={0} />
        <YAxis domain={[0, 1]} axisLine={false} tick={false} />
        <ReferenceArea
          y1={0}
          y2={0.25}
          fill={this.state.fillColors.low}
          fillOpacity={0.8}
        />
        <ReferenceArea
          y1={0.25}
          y2={0.5}
          fill={this.state.fillColors.medium}
          fillOpacity={0.8}
        />
        <ReferenceArea
          y1={0.5}
          y2={0.75}
          fill={this.state.fillColors.high}
          fillOpacity={0.8}
        />
        <ReferenceArea
          y1={0.75}
          y2={1}
          fill={this.state.fillColors.extreme}
          fillOpacity={0.8}
        />
        <ReferenceArea
          x1={this.state.currentTime}
          x2={this.state.currentTime + 1}
          fill={gray[13]}
          fillOpacity={0.2}
        >
          <Label
            value="Current Time Period"
            position="top"
            fill={grau[13]}
            fillOpacity={0.8}
            fontSize={17}
          />
        </ReferenceArea>
        <Line
          type="monotone"
          dataKey="riskValue"
          stroke={gray[13]}
          fill={gray[13]}
          strokeWidth={3}
        />
        <Tooltip />
      </LineChart>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading ? (
          <LoadingCard />
        ) : (
          <Space
            style={{
              display: 'flex',
              flexDirection: 'vertical', // assuming that size="middle" corresponds to a vertical direction
            }}
            size="middle"
          >
            <ResponsiveContainer
              width="103%"
              height={250}
              style={{
                // If there are any styles applied to ResponsiveContainer, place them here as well
              }}
            >
              {this.lineChart()}
            </ResponsiveContainer>
            <div
              style={{
                width: '100%',
                height: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  width: '50%',
                }}
              >
                <p>
                  {this.state.dateData.todayDate} -{" "}
                  {this.state.dateData.todayWeekDay}
                </p>
              </div>
              <div
                style={{
                  width: '50%',
                  textAlign: 'right',
                }}
              >
                <p>
                  {this.state.dateData.tomorrowDate} -{" "}
                  {this.state.dateData.tomorrowWeekDay}
                </p>
              </div>
            </div>
          </Space>
        )}
      </div>
    );
  }
}

export default withRouter(LanguageHelper(ChartForPublicDisplay));