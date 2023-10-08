import { Layout, Row, Col, Image } from "antd";
import { LanguageHelper } from "../helpers/languageHelper";
import React, { useState, useCallback, useEffect } from "react";
import { withRouter } from "next/router";

import generalStyle from "../styles/GeneralComponent.module.css";
import footerStyle from "../styles/Footer.module.css";
import LoadingCard from "./LoadingCard";
import { useLanguage } from "../hooks/useLanguage";


const basePath = process.env.NEXT_PUBLIC_BASE_PATH;  //生命周期管理，页面格式设置
const landscapeWindowWidth = 768;
const phoneWindowWidth = 475;

const Footer = (props) => {
  const {
    languageHelper
  } = props

  const [landscape, setLandscape] = useState(false)

  const translation = useLanguage(languageHelper, 'Footer', {
    copyright: "© 2023 - Heat and Health Research Incubator, USYD.",
  })

  const handleResize = useCallback(() => {
    setLandscape(window.innerWidth > 770)
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])

  return (
    <Layout
      id={footerStyle.layout}
      style={{ padding: "1rem" }}
      className={generalStyle.WebsiteTheme}
    >
      <Row
        justify="space-between"
        align="middle"
        id={footerStyle.mainRow}
      >
        <Col span={12}>{translation.copyright}</Col>
        <Col>
          <Image
            src={`${basePath}/icons/usyd-logo.png`}
            alt="Univeristy of Sydney"
            width={120}
            preview={false}
          />
        </Col>
      </Row>
    </Layout>
  )
}

export default withRouter(LanguageHelper(Footer));
