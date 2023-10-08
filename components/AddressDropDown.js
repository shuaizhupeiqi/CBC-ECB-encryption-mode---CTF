
import { Col, Row, Button, Select, Tag } from "antd"; //UI视觉库
import { withRouter } from "next/router";
import { DownOutlined } from "@ant-design/icons";
import { LanguageHelper } from "../helpers/languageHelper";
import cookie from "react-cookies";
import LoadingCard from "./LoadingCard";
import Image from "next/image";
import { readData } from "../helpers/dataHelper";
import { parseJSONValues } from "../helpers/jsonHelper";
import { getUserInfo } from "../helpers/authHelper";
import { atom, useRecoilState } from 'recoil';
import React, { useState, useEffect } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

const geoDataState = atom({
  key: 'geoDataState',
  default: null,
});

const defaultValueState = atom({
  key: 'defaultValueState',
  default: null,
});

const AddressDropdown = (props) => {
  const [landscape, setLandscape] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [translation, setTranslation] = useState({
    LocateMeButtonLabel: "Locate Me",
    LocationText: "Location",
    LocationDropdown: "Choose your location",
  });
  const [geoData, setGeoData] = useRecoilState(geoDataState);
  const [defaultValue, setDefaultValue] = useRecoilState(defaultValueState);

  useEffect(() => {
    loadAddressData();
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleResize = () => {
    setLandscape(window.innerWidth > 864);
  };

  const setGeoDataFromCookie = async (res, trans) => {
    let geoDataCookie = cookie.load("geoData");
    if (geoDataCookie) {
      setData(res);
      setLoading(false);
      setTranslation(trans);
      setDefaultValue(geoDataCookie.suburb + ", " + geoDataCookie.state + ", " + geoDataCookie.postcode);
    } else {
      setData(res);
      setLoading(false);
      setTranslation(trans);
    }
  };

  const loadAddressData = async () => {
    let trans = await props.languageHelper.translation("AddressDropdown");
    let resGeo = await import("../public/postcodes.json");
    let res = [];

    for (let i = 0; i < resGeo.length; i++) {
      let json = resGeo[i];
      json.value = json.postcode + "//" + json.suburb + "//" + json.latitude + "//" + json.longitude + "//" + json.state;
      json.label = json.suburb + ", " + json.state + ", " + json.postcode;
      res.push(json);
    }

    let user = await getUserInfo();

    if (user && user.emailVerified) {
      try {
        const dataFromFirebase = await readData(`users/${user.uid}`);
        let geoDataFirebase = parseJSONValues(dataFromFirebase.geoData);
        setData(res);
        setLoading(false);
        setTranslation(trans);
        setDefaultValue(geoDataFirebase.suburb + ", " + geoDataFirebase.state + ", " + geoDataFirebase.postcode);
      } catch (error) {
        console.error("Operation failed:", error);
        setGeoDataFromCookie(res, trans);
      }
    } else {
      setGeoDataFromCookie(res, trans);
    }
  };

  const onChangeAddress = (value) => {
    let values = value.split("//");
    let jsonVal = {
      postcode: values[0],
      suburb: values[1],
      latitude: values[2],
      longitude: values[3],
      state: values[4],
    };
    setDefaultValue(jsonVal);
    props.handleAddressCallBack(values);
  };

  const locateMe = () => {
    props.handleLocateMeCallBack();
  };

  return (
    <Row
    style={{
      width: '100%',
      marginTop: landscape ? '1%' : '3%',
      marginBottom: landscape ? '1%' : '3%'
    }}
    >
      {loading ? (
        <LoadingCard />
      ) : (
        <Row style={{ width: '100%', justifyContent: 'space-between' }}>
          <Col span={4}>
            <Tag style={{
              width: '98%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000000',
              backgroundColor: '#ffffff',
              borderRadius: '6px',
              fontSize: 'smaller',
              fontWeight: 'bold',
              height:'100%'
            }
            }>
              {translation.LocationText}
            </Tag>
            </Col>
          <Col span={18} style={{ textAlign: "center" }}>
            <Select
              suffixIcon={<DownOutlined />}
              showSearch
              style={{ width: "100%" }}
              defaultValue={defaultValue}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={data}
              onChange={onChangeAddress.bind(this)}
            />
          </Col>
          <Col span={2} style={{ textAlign: "center" }}>
            <Button
              style={{
                margin: 'auto',
                width: '90%',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={locateMe.bind(this)}
            >
              {landscape ? (
                <p>{translation.LocateMeButtonLabel}</p>
              ) : (
                <Image
                  src={basePath + "/icons/maps-and-flags.png"}
                  alt=""
                  width={15}
                  height={15}
                />
              )}
            </Button>
          </Col>
        </Row>
      )}
    </Row>   
  );
};

export default withRouter(LanguageHelper(AddressDropdown));