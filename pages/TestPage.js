import React, { useState, useEffect } from 'react';
import { getHSSData } from '../helpers/hssHelper';
import dynamic from 'next/dynamic';
import Layout from './layout';
import { Collapse } from 'antd';
const { Panel } = Collapse;
import Chart from '../components/Chart';
import hssRiskDisplayStyle from '../components/HssRiskDisplay';

const MapComponent = dynamic(() => import('../components/map1'), {
  ssr: false,
});

const WeatherData = (props) => {
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
    return <Layout>Loading</Layout>;
  }

  const { data, maxLevelForecast } = state.data;

  return (
    <Layout>
         <div style={{ height: '50vh', width: '70%' }}>
          <MapComponent onMapClick={handleMapClick} initialCenter={state.geoData} />
        </div>
      <div style={{ height: '350%', width: '100%' }}>
       

        <div style={{ height: '50%', overflow: 'auto' }}>
          <Collapse className={hssRiskDisplayStyle.collapseForecast} defaultActiveKey={['0', '1']}>
            {data.map((item, index) => (
              <Panel header={`Day ${index}: Max Level Forecast Chart`} key={index}>
                <p>Day {index}: Max Risk Value {maxLevelForecast[index].maxRiskValue}</p>
                <Chart data={item} chartType={state.chartType} />
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </Layout>
  );
}

export default WeatherData;
