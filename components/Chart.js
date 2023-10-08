import React, { useState, useEffect, Component } from "react";
import { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import { Space } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  ReferenceArea,
  AreaChart,
  ResponsiveContainer,
} from "recharts";
import LoadingCard from "./LoadingCard";
import { atom, useRecoilState } from 'recoil';
//chartstate us an atom, which is a initial state with some default values
const chartState = atom({
  key: 'chartState',
  default: {
    componentSize: "middle",
    loading: false,
    data: [],
    parameters: {},
    chartType: "",
    maxRiskLevel: "",
    backgroundColor: "",
    maxLevel: "",
    fillColors: {
      low: "#4caf50",
      medium: "#FDDA0D",
      high: "orange",
      extreme: "#D72323",
    },
  }
});

class CustomDot extends Component {
  render() {
    const { cx, cy, payload, maxValue, width, index, firstMaxIndex } = this.props;

    // 检查cy值是否小于20
    const isNearTop = cy < 29;

    // 判断数据点位置
    let textX = cx;
    if (cx < width * 0.05) {  // 如果数据点在图表的最左端5%以内
      textX = cx + 10;  // 标签向右偏移
    } else if (cx > width * 0.95) {  // 如果数据点在图表的最右端5%以内
      textX = cx - 10;  // 标签向左偏移
    }

    if (payload.riskValue === maxValue) {
      if (index === firstMaxIndex) {  // 只在第一个最大值点上显示"Max"的文字
        return (
          <g>
            <circle cx={cx} cy={cy} r={5} strokeWidth={2} fill="#990000" />
            {/* 根据cy值动态调整文字位置 */}
            <text x={textX} y={isNearTop ? cy + 20 : cy - 20} textAnchor="middle" fill="black">Max</text>
            {/* 根据cy值动态调整路径位置 */}
            <path d={`M${cx},${isNearTop ? cy + 10 : cy - 10} L${cx - 5},${isNearTop ? cy + 15 : cy - 15} L${cx + 5},${isNearTop ? cy + 15 : cy - 15} Z`} fill="black" />
          </g>
        );
      } else {  // 其他最大值点只进行加粗，不显示文字
        return <circle cx={cx} cy={cy} r={5} strokeWidth={2} fill="#990000" />;
      }
    }

    return <circle cx={cx} cy={cy} r={3} stroke="black" strokeWidth={1} fill="black" />;
  }
}


const Chart = (props) => {
  //chart is the current value of the atom
  //useRecoilState to read and set the value of the atom
  const [chart, setChart] = useRecoilState(chartState);
  const [state, setState] = useState({
    componentSize: "middle",
    loading: props.loading,
    data: props.data,
    parameters: props.parameters,
    chartType: props.chartType,
    maxRiskLevel: "",
    backgroundColor: "",
    maxLevel: props.maxLevel,
  });

  // 修改：新添加的方法，用来找到第一个最大值的索引
  const findFirstMaxIndex = (data, maxValue) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i].riskValue === maxValue) {
        return i;
      }
    }
    return -1;
  };

  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      parameters: props.parameters,
      loading: props.loading,
      data: props.data,
      chartType: props.chartType,
      maxLevel: props.maxLevel,
    }));
  }, [props]);

  const findMaxValue = (data) => {
  let maxVal = -Infinity;
  data.forEach((item) => {
    if (item.riskValue > maxVal) {
      maxVal = item.riskValue;
    }
  });
  return maxVal;
  };

  const areaChart = () => {
    return (
      <AreaChart data={state.data} margin={{ top: 0, right: 0, left: -50, bottom: 0 }}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 1]} axisLine={false} tick={false} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="riskValue"
          stroke="black"
          fillOpacity={1}
          fill="blue"
        />
        {['low', 'medium', 'high', 'extreme'].map((level, index) => (
          <ReferenceArea
            y1={index * 0.25}
            y2={(index + 1) * 0.25}
            fill={chart.fillColors[level]}
            fillOpacity={0.8}
            key={level}
          />
        ))}
      </AreaChart>
    );
  };

  const lineChart = () => {
    const { data } = state;
    const maxValue = findMaxValue(data);
    const firstMaxIdx = findFirstMaxIndex(data, maxValue);  // 计算第一个最大值的索引

    return (
      <LineChart data={state.data} margin={{ top: 0, right: 10, left: -50, bottom: 0 }}>
        <XAxis dataKey="time" interval={1} />
        <YAxis domain={[0, 1]} axisLine={false} tick={false} />
        {['low', 'medium', 'high', 'extreme'].map((level, index) => (
          <ReferenceArea
            y1={index * 0.25}
            y2={(index + 1) * 0.25}
            fill={chart.fillColors[level]}
            fillOpacity={0.8}
            key={level}
          />
        ))}
        <Line
          type="monotone"
          dataKey="riskValue"
          stroke="black"
          dot={<CustomDot maxValue={maxValue} firstMaxIndex={firstMaxIdx} />}  // 增加firstMaxIndex属性
          strokeWidth={3}
        />
        <Tooltip />
      </LineChart>
    );
  };
  
  return (
    <div>
      {state.loading ? (
        <LoadingCard />
      ) : (
        <Space
          direction="vertical"
          size="middle"
          style={{
            display: "flex",
          }}
        >
          <ResponsiveContainer width="100%" height={250}>
            {state.chartType === "AreaChart"
              ? areaChart()
              : lineChart()}
          </ResponsiveContainer>
        </Space>
      )}
    </div>
  );
}

export default withRouter(LanguageHelper(Chart));