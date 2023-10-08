import React, { useState, useEffect } from 'react';
import { getHSSData } from '../helpers/hssHelper';
import dynamic from 'next/dynamic';
import Layout from './layout';
const { Panel } = Collapse;
import Chart from '../components/Chart';
import hssRiskDisplayStyle from '../components/HssRiskDisplay';
import { Card, Tabs, Collapse, List, Typography } from 'antd';
import { Spin } from 'antd';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;
import { Input,Button } from 'antd';


const MapComponent = dynamic(() => import('../components/map1'), {
  ssr: false,
});


const WeatherData = (props) => {
    const contentLists = {
        "Option1": ["Content 1A", "Content 1B", "Content 1C"],
        "Option2": ["Content 2A", "Content 2B", "Content 2C"],
        "Option3": ["Content 3A", "Content 3B", "Content 3C"],
        "Option4": ["Content 4A", "Content 4B", "Content 4C"]
      };

  const [state, setState] = useState({
    isPublicDisplay: props.isPublicDisplay,
    publicDisplayGeoData: props.publicDisplayGeoData,
    data: null,
    geoData: {
      latitude: -33.8,
      longitude: 151.01,
      hourly: "temperature_2m,relativehumidity_2m,cloudcover,windspeed_10m",
      timezone: "Australia/Sydney",
    },
    loading: true,
    translation: {},
    addressDefaultValue: "Parramatta Westfield, NSW, 2150",
    hour: 0,
    week: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    forcasts: [],
    maxLevelForecast: [],
    chartType: "LineChart",
    currentRiskValue: 0,
    legendNow: [],
    legendMax: [],
    portialLegendNow: [],
    portialLegendMax: [],
  });

  const currentHour = 10;
  const translation = {};

  const handleMapClick = (coordinates) => {
    const newGeoData = {
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    };
    setState(prevState => ({ ...prevState, geoData: newGeoData }));
  };

  useEffect(() => {
    const fetchData = () => {
      setState(prevState => ({ ...prevState, loading: true }));
      getHSSData(state.geoData, currentHour, translation)
        .then((result) => {
          setState(prevState => ({ ...prevState, data: result, loading: false }));
        })
        .catch((error) => {
          console.error('An error occurred:', error);
          setState(prevState => ({ ...prevState, loading: false }));
        });
    };

    fetchData();
}, [state.geoData]);


if (state.loading) {
    return (
        <Layout>
            <Card style={{ textAlign: 'center', marginTop: '20vh' }}>
                <Spin tip="Loading..." />
            </Card>
        </Layout>
    );
}

  const { data, maxLevelForecast } = state.data;

  return (
    <Layout>
        {/* 添加大标题部分 */}
        <div style={{ height: '15vh', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <h1 style={{ fontSize: '2em', color: 'white' }}>Test new func</h1>
        </div>
  
        <Card style={{ background: '#E8F5FA', width: '100%', borderRadius: '30px' }}>
            <Paragraph style={{ color: '#767676', fontSize: '16px', textAlign: 'justify' }}>
               选择你要查看的功能
            </Paragraph>
            <Tabs defaultActiveKey="1">
                <TabPane tab={"Hss for today"} key="1">
                    <Collapse className={hssRiskDisplayStyle.collapseForecast} >
                        {data.slice(0, 1).map((item, index) => (
                            <Panel header={`Day ${index}: Max Level Forecast Chart`} key={index}>
                                <p>Day {index}: Max Risk Value {maxLevelForecast[index].maxRiskValue}</p>
                                <Chart data={item} chartType={state.chartType} />
                            </Panel>
                        ))}
                    </Collapse>
                </TabPane>

                {/* 其他的 TabPane 保持不变 */}
                <TabPane tab={"View local specific information"} key="2">
                    <Collapse >
                       
                    <Panel header={`test`}>
    {state.data ? JSON.stringify(state.data) : "Loading..."}
</Panel>
                    
                    </Collapse>
                </TabPane>

     <TabPane tab={"Calculate HSS value manually"} key="3">
    <Collapse>
        <Panel header={`Calculator`}>
            <div>
                <p>请输入你想要计算的：</p>
                <div style={{ margin: '10px 0' }}>
                    <label>湿度：</label>
                    <Input style={{ width: '150px' }} placeholder="湿度值" />
                </div>
                <div style={{ margin: '10px 0' }}>
                    <label>风度：</label>
                    <Input style={{ width: '150px' }} placeholder="风度值" />
                </div>
                <div style={{ margin: '10px 0' }}>
                    <label>云层：</label>
                    <Input style={{ width: '150px' }} placeholder="云层值" />
                </div>
                <Button type="primary" onClick={() => console.log("数据已提交!")}>提交</Button>
            </div>
            </Panel>
        </Collapse>
    </TabPane>

            </Tabs>
        </Card>
  
        <div style={{ height: '50vh', width: '70%' }}>
            <MapComponent onMapClick={handleMapClick} initialCenter={state.geoData} />
        </div>
    </Layout>
);
}

export default WeatherData;
