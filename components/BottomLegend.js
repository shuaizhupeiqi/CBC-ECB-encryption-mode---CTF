import React, { Component } from "react";
import { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceArea,
  ResponsiveContainer,
  LabelList,
  Rectangle,
} from "recharts";  //创建散点图和其他图表元素
import LoadingCard from "./../components/LoadingCard"; //用于显示加载状态的显示
import { Popover } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';


const dataLow = [{ x: 0.1, y: 0.5 }]; //表示散点图上的点

const dataMedium = [{ x: 0.35, y: 0.5 }];

const dataHigh = [{ x: 0.61, y: 0.5 }];

const dataExtreme = [{ x: 0.85, y: 0.5 }];

const dataLowPort = [{ x: 0.05, y: 0.5 }];

const dataMediumPort = [{ x: 0.27, y: 0.5 }];

const dataHighPort = [{ x: 0.55, y: 0.5 }];

const dataExtremePort = [{ x: 0.78, y: 0.5 }];

const renderCustomizedNowLabel = (props, label) => {  //设置散点图的标签渲染，如界面的位置，横屏竖屏
  let { x, y, value } = props;
  if (window.innerWidth > 1100 && window.innerWidth - x > 900) {
    x = x + 28;
  } else if (window.innerWidth <= 1100 && window.innerWidth + x < 1150) {
    x = x + 28;
  } else {
    x = x - 17;
  }
  return (
    <text
      x={x}
      y={y + 20}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const renderCustomizedMaxLabel = (props, label) => { //散点图的渲染
  let { x, y, value } = props;
  if (value == "Now is Max") {
    if (x < 80) {
      x = x + 45;
    } else {
      x = x - 40;
    }
  } else if (value == "当前为最高") {
    if (x < 80) {
      x = x + 45;
    } else {
      x = x - 40;
    }
  } else {
    if (window.innerWidth > 1100 && window.innerWidth - x < 300) {
      x = x - 18;
    } else if (window.innerWidth <= 1100 && window.innerWidth - x < 200) {
      x = x - 18;
    } else {
      x = x + 23;
    }
  }

  return (
    <text
      x={x}
      y={y - 10}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const renderLegendLowLabel = (props, label) => {
  const { x, y } = props;

  return (
    <text
      x={x + 40}
      y={y + 5}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const renderLegendMediumLabel = (props, label) => {
  const { x, y } = props;

  return (
    <text
      x={x + 50}
      y={y + 5}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const renderLegendHighLabel = (props, label) => {
  const { x, y } = props;

  return (
    <text
      x={x + 40}
      y={y + 5}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const renderLegendExtremeLabel = (props, label) => {
  const { x, y } = props;

  return (
    <text
      x={x + 50}
      y={y + 5}
      fill="black"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {label}
    </text>
  );
};

const CustomReferenceShape = (props) => {
  return (
    <Rectangle
      width={2}
      height={55}
      x={props.x + 5}
      y={props.y - 23}
      fill="black"
    />
  );
};

const CustomReferenceShapeMax = (props) => {
  return (
    <>
      <Rectangle
        width={2}
        height={12}
        x={props.x + 2}
        y={props.y - 22}
        fill="black"
      />
      <Rectangle
        width={2}
        height={12}
        x={props.x + 2}
        y={props.y - 5}
        fill="black"
      />
      <Rectangle
        width={2}
        height={9}
        x={props.x + 2}
        y={props.y + 25}
        fill="black"
      />
      <Rectangle
        width={2}
        height={12}
        x={props.x + 2}
        y={props.y + 10}
        fill="black"
      />
    </>
  );
};

const CustomReferenceShapePort = (props) => {
  return (
    <Rectangle
      width={2}
      height={55}
      x={props.x + 8}
      y={props.y - 21}
      fill="black"
    />
  );
};

const CustomReferenceShapeMaxPort = (props) => {
  return (
    <>
      <Rectangle
        width={2}
        height={12}
        x={props.x + 5}
        y={props.y - 22}
        fill="black"
      />
      <Rectangle
        width={2}
        height={12}
        x={props.x + 5}
        y={props.y - 5}
        fill="black"
      />
      <Rectangle
        width={2}
        height={9}
        x={props.x + 5}
        y={props.y + 25}
        fill="black"
      />
      <Rectangle
        width={2}
        height={12}
        x={props.x + 5}
        y={props.y + 10}
        fill="black"
      />
    </>
  );
};

class BottomLegend extends Component {
  constructor(props) {
    super(props);
    this.handleResize = this.handleResize.bind(this);
  }

  state = {
    componentSize: "middle",
    legendNow: this.props.legendNow,
    legendMax: this.props.legendMax,
    portialLegendNow: this.props.portialLegendNow,
    portialLegendMax: this.props.portialLegendMax,
    loading: this.props.loading,
    translation: {
      Low: "Low",
      Medium: "Medium",
      High: "High",
      Extreme: "Extreme",
      NowLabel: "Now",
      MaxLabel: "Max",
      NowIsMaxLabel: "Now Is Max",
    },
    fillColors: {
      low: "#4caf50",
      medium: "#FDDA0D",
      high: "orange",
      extreme: "#D72323",
    },
    landscape: false,
    showModal: false, // 控制弹窗显示的状态
  };

  componentDidMount() {  //调用生命周期方法，将一些组件初始化
    this.loadTranslation();
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  async loadTranslation() {
    const { languageHelper } = this.props;

    let res = await languageHelper.translation("BottomLegend");

    this.setState({
      translation: res,
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        loading: this.props.loading,
        legendNow: this.props.legendNow,
        legendMax: this.props.legendMax,
      });
    }
  }

  handleResize() {
    this.setState({ landscape: window.innerWidth > 770 });
  }

  mainView = () => {
    if (this.state.landscape) {
      return this.landScapeView();
    } else {
      return this.portialView();
    }
  };

  toggleModal = () => {
    this.setState(prevState => ({
      showModal: !prevState.showModal
    }));
  };
  landScapeView = () => { //用于横屏试图的散点图
    return (
      <>
        {/* 这是问号图标和模态框的代码部分 */}
        <div style={{ position: 'relative', width: '100%', height: '10px' }}>
          <Popover
            content={
              <div>
                This is explain of HssRisk
              </div>
            }
            title="Explain"
            trigger="click"
            placement="topRight"
            getPopupContainer={trigger => trigger.parentNode}  // 指定容器为父元素
          >
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <QuestionCircleOutlined />
            </div>
          </Popover>
        </div>

        <ResponsiveContainer width="100%" height={100}>
          <ScatterChart margin={{ top: 20, right: 0, left: -60, bottom: -10 }}>
            <XAxis
              type="number"
              dataKey="riskValue"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <ReferenceArea
              x1={0}
              x2={0.25}
              fill={this.state.fillColors.low}
              fillOpacity={0.9}
            />
            <ReferenceArea
              x1={0.25}
              x2={0.5}
              fill={this.state.fillColors.medium}
              fillOpacity={0.8}
            />
            <ReferenceArea
              x1={0.5}
              x2={0.75}
              fill={this.state.fillColors.high}
              fillOpacity={0.8}
            />
            <ReferenceArea
              x1={0.75}
              x2={1}
              fill={this.state.fillColors.extreme}
              fillOpacity={0.8}
            />

            <Scatter
              name="Now"
              data={this.state.legendNow}
              fill="black"
              shape={CustomReferenceShape}
            >
              <LabelList
                dataKey={"label"}
                position={"right"}
                content={(props) =>
                  renderCustomizedNowLabel(
                    props,
                    this.state.translation.NowLabel
                  )
                }
              />
            </Scatter>
            <Scatter
              name="Today's Max"
              data={this.state.legendMax}
              fill="black"
              shape={CustomReferenceShapeMax}
            >
              <LabelList
                dataKey={"label"}
                position={"right"}
                content={(props) => {
                  let length = this.state.legendNow.length;
                  return renderCustomizedMaxLabel(
                    props,
                    length == 0
                      ? this.state.translation.NowIsMaxLabel
                      : this.state.translation.MaxLabel
                  );
                }}
                //content={(props) => renderCustomizedMaxLabel(props, this.state.legendNow && this.state.legendMax.length!=0?this.state.translation.MaxLabel:this.state.translation.NowIsMaxLabel)}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        <ResponsiveContainer width="100%" height={20}>
          <ScatterChart margin={{ top: 10, right: 0, left: -60, bottom: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <YAxis type="number" dataKey="y" axisLine={false} tick={false} />

            <Scatter
              data={dataLow}
              name={this.state.translation.Low}
              fill={this.state.fillColors.low}
            >
              <LabelList
                position={"right"}
                content={(props) =>
                  renderLegendLowLabel(props, this.state.translation.Low)
                }
              />
            </Scatter>
            <Scatter
              data={dataMedium}
              name={this.state.translation.Medium}
              fill={this.state.fillColors.medium}
            >
              <LabelList
                position={"right"}
                content={(props) =>
                  renderLegendMediumLabel(props, this.state.translation.Medium)
                }
              />
            </Scatter>
            <Scatter
              data={dataHigh}
              name={this.state.translation.High}
              fill={this.state.fillColors.high}
            >
              <LabelList
                position={"right"}
                content={(props) =>
                  renderLegendHighLabel(props, this.state.translation.High)
                }
              />
            </Scatter>
            <Scatter
              data={dataExtreme}
              name={this.state.translation.Extreme}
              fill={this.state.fillColors.extreme}
            >
              <LabelList
                position={"right"}
                content={(props) =>
                  renderLegendExtremeLabel(
                    props,
                    this.state.translation.Extreme
                  )
                }
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </>
    );
  };

  portialView = () => {  //定义竖屏显示的散点图
    return (
      <>
        {/* 这是问号图标和模态框的代码部分 */}
        <div style={{ position: 'relative', width: '100%', height: '10px' }}>
          <Popover
            content={
              <div>
                This is explain of HssRisk
              </div>
            }
            title="Explain"
            trigger="click"
            placement="topRight"
            getPopupContainer={trigger => trigger.parentNode}  // 指定容器为父元素
          >
            <div style={{ position: 'absolute', top: 0, right: 0 }}>
              <QuestionCircleOutlined />
            </div>
          </Popover>
        </div>

        <ResponsiveContainer width="100%" height={100}>
          <ScatterChart margin={{ top: 10, right: 0, left: -60, bottom: -10 }}>
            <XAxis
              type="number"
              dataKey="riskValue"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <ZAxis type="number" range={[200, 201]} />
            <ReferenceArea
              x1={0}
              x2={0.25}
              fill={this.state.fillColors.low}
              fillOpacity={0.9}
            />
            <ReferenceArea
              x1={0.25}
              x2={0.5}
              fill={this.state.fillColors.medium}
              fillOpacity={0.8}
            />
            <ReferenceArea
              x1={0.5}
              x2={0.75}
              fill={this.state.fillColors.high}
              fillOpacity={0.8}
            />
            <ReferenceArea
              x1={0.75}
              x2={1}
              fill={this.state.fillColors.extreme}
              fillOpacity={0.8}
            />

            <Scatter
              name="Now"
              data={this.state.portialLegendNow}
              fill="black"
              shape={CustomReferenceShapePort}
            >
              <LabelList
                dataKey={"label"}
                position={"right"}
                content={(props) =>
                  renderCustomizedNowLabel(
                    props,
                    this.state.translation.NowLabel
                  )
                }
              />
            </Scatter>
            <Scatter
              name="Today's Max"
              data={this.state.portialLegendMax}
              fill="black"
              shape={CustomReferenceShapeMaxPort}
            >
              <LabelList
                dataKey={"label"}
                position={"right"}
                content={(props) => {
                  let length = this.state.portialLegendNow.length;
                  return renderCustomizedMaxLabel(
                    props,
                    length == 0
                      ? this.state.translation.NowIsMaxLabel
                      : this.state.translation.MaxLabel
                  );
                }}
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={20}>
          <ScatterChart margin={{ top: 10, right: 0, left: -60, bottom: 0 }}>
            <XAxis
              type="number"
              dataKey="x"
              domain={[0, 1]}
              axisLine={false}
              tick={false}
            />
            <YAxis type="number" dataKey="y" axisLine={false} tick={false} />

            <Scatter
              data={dataLowPort}
              name={this.state.translation.Low}
              fill={this.state.fillColors.low}
            >
              <LabelList
                position={"insideRight"}
                content={(props) =>
                  renderLegendLowLabel(props, this.state.translation.Low)
                }
              />
            </Scatter>
            <Scatter
              data={dataMediumPort}
              name={this.state.translation.Medium}
              fill={this.state.fillColors.medium}
            >
              <LabelList
                position={"insideRight"}
                content={(props) =>
                  renderLegendMediumLabel(props, this.state.translation.Medium)
                }
              />
            </Scatter>
            <Scatter
              data={dataHighPort}
              name={this.state.translation.High}
              fill={this.state.fillColors.high}
            >
              <LabelList
                position={"insideRight"}
                content={(props) =>
                  renderLegendHighLabel(props, this.state.translation.High)
                }
              />
            </Scatter>
            <Scatter
              data={dataExtremePort}
              name={this.state.translation.Extreme}
              fill={this.state.fillColors.extreme}
            >
              <LabelList
                position={"insideRight"}
                content={(props) =>
                  renderLegendExtremeLabel(
                    props,
                    this.state.translation.Extreme
                  )
                }
              />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </>
    );
  };

  render() {
    return <div>{this.state.loading ? <LoadingCard /> : this.mainView()}</div>;
  }
}

export default withRouter(LanguageHelper(BottomLegend));