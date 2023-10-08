import React from 'react';
import { Carousel,Button, Tabs,Card, Typography,Modal, Divider, Row, Col, List,Tooltip, Collapse, Image as AntdImage} from 'antd';
import { useRouter,withRouter } from 'next/router';
import Layout from "./layout";
import  { useState, useEffect } from 'react';
import { loadDetailedRecommendationTips } from '../helpers/tipHelper';
import { SmileOutlined, MehOutlined, FrownOutlined } from '@ant-design/icons';
import { LanguageHelper } from '../helpers/languageHelper';
// import styles from '../styles/1.module.css';

const { Title, Text,Paragraph,Link} = Typography;
const {Panel}=Collapse;


  const IntroductionPage = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { TabPane } = Tabs;
    const contentList = {
      tab1: (
        <div style={{ display: 'flex', alignItems: 'justify' }}>
          <img src="/icons/healthy-adults.png" alt="Healthy"
               style={{ width: '30%', height: '30%' }} />
          {/* 在这里添加你的说明内容 */}
          <span style={{ textAlign: 'left' }}>Healthy adults and young adults</span>
        </div>
      ),
      tab2: (
        <div style={{ display: 'flex', alignItems: 'justify' }}>
          <img src="/icons/Vulnerable.png" alt="Vulnerable"
               style={{ width: '30%', height: '30%' }} />
          {/* 在这里添加你的说明内容 */}
          <span style={{ textAlign: 'left' }}>People 65 years of age and older, pregnant women, infants, and children</span>
        </div>
      ),
      tab3: (
        <div style={{ display: 'flex', alignItems: 'justify' }}>
          <img src="/icons/comorbidity.png" alt="Comorbidity"
               style={{ width: '30%', height: '30%' }} />
          {/* 在这里添加你的说明内容 */}
          <span style={{ textAlign: 'left' }}>People with chronic or acute illness, taking medications, overweight and obese</span>
        </div>
      )
    };


  // 这部分是对建议的内容进行翻译
  const [translations, setTranslations] = React.useState({});
  const [detailedRecommendationTips, setDetailedRecommendationTips] = React.useState({});
  const { languageHelper } = props;
  React.useEffect(() => {
    async function fetchData() {
      const data = await loadDetailedRecommendationTips();
      setDetailedRecommendationTips(data.detailedRecommendationTips);

      const translationData = await languageHelper.translation('CurrentHssRiskDisplay');
      setTranslations(translationData);
    }

    fetchData();
  }, []);



  // 这部分是对总建议的弹窗进行状态处理：
const [isModalVisible, setIsModalVisible] = useState(false);
const [currentRecommendation, setCurrentRecommendation] = useState('');
const showRecommendation = (recommendation) => {
  setCurrentRecommendation(recommendation);
   setIsModalVisible(true);
 };





const handleModalClose = () => {
  setIsModalVisible(false);
};
// 自定义截断文本



  // 使用 next/router 的 useRouter 钩子
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/HomePage');
  };

  const goToSettingPage = () => {
    router.push('/SettingPage');
  };
  const goToNewfucPage = () => {
    router.push('/Newfuc');
  };
  const gointroductionPage = () => {
    router.push('/TestPage');
  };
  const [fontSizes, setFontSizes] = useState({
    title: '24px', // 默认桌面端的标题大小
    text: '16px'  // 默认桌面端的文本大小
  });

  useEffect(() => {
    const adjustFontSizes = () => {
      if (window.innerWidth <= 768) {
        // 手机端
        setFontSizes({
          title: '20px',
          text: '15px',
          but: '65px'
        });
      } else {
        // 桌面端
        setFontSizes({
          title: '30px',
          text: '20px',
          but: '265px'
        });
      }
    };

    adjustFontSizes(); // 初始化字体大小

    window.addEventListener('resize', adjustFontSizes);

    return () => {
      window.removeEventListener('resize', adjustFontSizes);
    };
  }, []);



  return (
      <Layout>
        <div>
          {/*Titles and buttons*/}
          {/* 包含标题和按钮的卡片 */}
          <Card bordered={false} style={{ textAlign: 'center' }}>
      <Row gutter={[16, 16]} align="middle">
        {/* For the image */}
        <Col xs={12} sm={8} md={6} lg={6} xl={6}>
          <img
            src="/icons/android-chrome-512x512.png"
            alt="Website Icon"
            style={{
                width: '80%',
                height: 'auto',
                objectFit: 'contain'
            }}
          />
        </Col>

        {/* For the text */}
        <Col xs={12} sm={16} md={18} lg={18} xl={18}>
          <Title style={{ fontSize: '62px', fontWeight: 'bold', color: 'Black' }}>
            HSS
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center" style={{ marginTop: '20px' }}>
        {/* For the button */}
        <Col xs={24} sm={20} md={16} lg={12} xl={10}>
          <Button
            type="primary"
            size="large"
            icon={
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 12H3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            }
            style={{
              width: '100%',
              height: '10vh',
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(to right, #E64626, #FCA111)',
              border: 'none',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            }}
            onClick={() => {
              // 跳转到核心主页面的代码
              window.location.href = "/HomePage";
            }}
          >
            Searching
          </Button>
        </Col>
      </Row>
    </Card>

  {/* ---------------------------------------------------------- */}
          <Row justify="center">

          <Col xs={24} sm={24} md={16} lg={12} xl={24}>
    <Divider style={{margin: '0px 0 0px 0'}}>
            <Title level={2} style={{color: '#000', fontWeight: 'bold',fontSize: fontSizes.title}}>
              What is HSS？</Title>
          </Divider>
          <Card
                    bordered={false}
                  style={{
                background: '#F5F5F5',

                    }}
                >

    <Paragraph style={{color: '#767676', fontWeight: 'normal', fontSize: '18px', textAlign: 'justify'}}>
        The Heat Stress Scale (HSS) aims at enhancing community resilience to heatwave disasters.
    </Paragraph>
    </Card>
</Col>
</Row>

  {/* ---------------------------------------------------------- */}
          {/*Split line, and card 1 title*/}
          {/* 分割线1 & 块1标题 */}
          <Divider style={{margin: '0px 0 0px 0'}}>
            <Title level={2} style={{color: '#000', fontWeight: 'bold',fontSize: fontSizes.title}}>HSS calculation</Title>
          </Divider>

          {/* Card 1, displaying HSS information */}
          {/* 内容卡片1，显示 HSS 信息 */}


            <Row justify="center">
            <Card
            bordered={false}
            style={{
                background: '#E7EEF6',
                borderRadius: '30px',
                width: '100%',
                padding: '0px'
            }}
        >
            <Col xs={24} sm={24} md={16} lg={12} xl={21}>
                {!isExpanded ? (
                    <>
                        <Paragraph
                            ellipsis={{ rows: 3 }}
                            style={{
                                color: '#767676',
                                fontWeight: 'normal',
                                fontSize: '18px',
                                textAlign: 'center'
                            }}
                        >
                            The HSS assesses heat stress risk using outdoor temperature, humidity, solar radiation, and wind speed from{" "}
                            <Link
                                href="https://www.met.no/"
                                target="_blank"
                                style={{
                                    color: 'black',
                                    fontWeight: 'normal',
                                    textDecoration: 'underline'
                                }}
                            >
                                Norwegian Meteorological Institute,
                            </Link>
                        </Paragraph>
                        <Link onClick={() => setIsExpanded(true)} style={{ color: 'blue' }}>Read more</Link>
                    </>
                ) : (
                    <>
                        <Paragraph
                            style={{
                                color: '#767676',
                                fontWeight: 'normal',
                                fontSize: '18px',
                                textAlign: 'center'
                            }}
                        >
                            The HSS assesses heat stress risk using outdoor temperature, humidity, solar radiation, and wind speed from{" "}
                            <Link
                                href="https://www.met.no/"
                                target="_blank"
                                style={{
                                    color: 'black',
                                    fontWeight: 'normal',
                                    textDecoration: 'underline'
                                }}
                            >
                                Norwegian Meteorological Institute,
                            </Link>
                            These factors are combined with personal data in a thermoregulation model, resulting in four risk categories: low, moderate, high, and extreme.
                        </Paragraph>
                        <Link onClick={() => setIsExpanded(false)} style={{ color: 'blue' }}>Read less</Link>

                    </>
                )}
            </Col>

                {/* 子块1.1，背景色为 #A8E5C7 */}



                    <div style={{ display: 'flex', flexDirection: 'row', marginTop: '20px' }}>
                    <div style={{ width: '25%', height: '100px', backgroundColor: '#4CAF50' }}></div>
                    <div style={{ width: '25%', height: '100px', backgroundColor: '#FDDA0D' }}></div>
                   <div style={{ width: '25%', height: '100px', backgroundColor: 'orange' }}></div>
                     <div style={{ width: '25%', height: '100px', backgroundColor: '#D72323' }}></div>
                   </div>
                    {/* 字体: Low, Medium, High, Extreme */}
                    <Row justify="space-between">
                      <Col><Text type="success">Low</Text></Col>
                      <Col><Text type="warning">Medium</Text></Col>
                      <Col><Text style={{color: '#C87B0A'}}>High</Text></Col>
                      <Col><Text type="danger">Extreme</Text></Col>
                    </Row>

                    {/*Insert link*/}
                    {/* 插入链接 */}

                    <Row justify="center" gutter={[{ xs: 8, sm: 16, md: 24, lg: 32 }, 20]}>
                  <Col xs={24} sm={24} md={16} lg={12} xl={10}>
                     </Col>
                  </Row>


                </Card>

            </Row>


          {/* Dividing Line & Subtitle 2 */}
          {/* 分割线 & 副标题2 */}
          <Divider style={{margin: '0px 0 0px 0'}}>
            <Title level={2} style={{color: '#000', fontWeight: 'bold',fontSize: fontSizes.title}}>Different Groups</Title>
          </Divider>

          {/* ---------------------------------------------------------- */}

          <Col style={{ display: 'flex', justifyContent: 'center' }}>

          <div className="container">
          <Card
        style={{ background: '#E8F5FA',
        width: '100%', // 设置为页面或容器的90%
        padding: '0px' ,
         textAlign: 'center',    borderRadius: '30px', }}
        activeTabKey="tab1"
        onTabChange={key => {
          console.log(key);
        }}
      >
          <Paragraph style={{color: '#767676', fontWeight: 'normal', fontSize: '16px', textAlign: 'justify'}}>
           On HSS, you can locate which group of people you belong to. You can also check for your family and friends.

             </Paragraph>

    <Tabs
        defaultActiveKey="tab1"
        size="small"
        tabBarStyle={{ display: 'flex', justifyContent: 'space-between' }}
    >
    <TabPane
        tab={<span style={{ width: '33.33%', display: 'inline-block', textAlign: 'center'}}>Healthy</span>}
        key="tab1"
    >
        {contentList.tab1}
    </TabPane>
    <TabPane
        tab={<span style={{ width: '33.33%', display: 'inline-block', textAlign: 'center' }}>Vulnerable</span>}
        key="tab2"
    >
        {contentList.tab2}
    </TabPane>
    <TabPane
        tab={<span style={{ width: '33.33%', display: 'inline-block', textAlign: 'center' }}>Comorbidity</span>}
        key="tab3"
    >
        {contentList.tab3}
    </TabPane>
</Tabs>
<Button
  type="primary"
  style={{backgroundColor: '#1677FF',  width: '100%', overflow: 'hidden'}}
  onClick={goToSettingPage}
>
  <Text style={{fontSize: '16px', whiteSpace: 'normal', color: 'white'}}>
  Set profile
  </Text>
</Button>


      </Card>
    </div>
    </Col>

          {/* 建议卡片 */}
          <Divider style={{margin: '0px 0 0px 0'}}>
          <Title level={2} style={{color: '#000', fontWeight: 'bold',fontSize: fontSizes.title}}>HSS Recommendation</Title>
          </Divider>
        <Card style={{ background: '#E8F5FA',
        width: '100%',
        padding: '0px' ,
         textAlign: 'center',    borderRadius: '30px', }}
        activeTabKey="tab1"
        onTabChange={key => {
          console.log(key);
        }}>
          <Paragraph style={{color: '#767676', fontWeight: 'normal', fontSize: fontSizes.text, textAlign: 'justify'}}>
            Please use or be aware of the belowing recommendations, and follow them as possible as you can for your heat stress safety.
          </Paragraph>
          <Tabs defaultActiveKey="1">
    {["Low", "Moderate", "High", "Extreme"].map((riskLevel, index) => (
       <Tabs.TabPane tab={riskLevel} key={index + 1}>
       {/* 总建议 */}


      {/* 详细建议列表，可折叠 */}

      <Collapse ghost>
         <Panel header={<span style={{ fontSize: '18px' }}>Detailed Recommendations</span>} key="2">
            <List
                dataSource={detailedRecommendationTips[riskLevel]?.tips || []}
                renderItem={item => (
                    <List.Item>
                        <AntdImage width={64} src={item.icon} alt={item.label} />
                        <div style={{ float: 'right', textAlign: 'justify', maxWidth: '75%' }}>
                            {translations.DetailedRecommendationTips[riskLevel][item.label]}
                        </div>
                    </List.Item>
                )}
            />
        </Panel>
    </Collapse>
      </Tabs.TabPane>
    ))}
  </Tabs>

        </Card>
          {/* ---------------------------------------------------------- */}

          <Divider style={{margin: '0px 0 0px 0'}}>
            <Title level={2} style={{color: '#000', fontWeight: 'bold',fontSize: fontSizes.title}}>Additional function</Title>
          </Divider>
          {/* 内容卡片3 */}
     <Card   style={{
              background: '#E8FAF1',

          }}>
          <Row gutter={[24,24]} justify="space-between">
    {/* Sub-card-1 */}

    <Col span={8}>

    <Card bordered={false}
          style={{
              background: '#A8E5C7',
              borderRadius: '30px',
              textAlign: 'center',
              margin: '0 0px',
              width: '100%',
              position: 'relative', // Add relative positioning here
              paddingBottom: '100%', // This makes the card always square
              height: 0 // Since we're using paddingBottom to set height
          }}
          onClick={goToNewfucPage}>

        {/* Positioned Image */}
        <img src="/icons/HomePage.webp" alt="Healthy"
             style={{
                 position: 'absolute', // Image is absolutely positioned
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',  // Use contain to ensure the image fits inside
                 borderRadius: '30px' // Ensure the image also has the border radius
             }} />
    </Card>
    <Typography.Text style={{ marginTop: '10px', color: '#000', fontSize: '16px', fontWeight: 'bold',paddingLeft: '0px'}}>
                Calculator
        </Typography.Text>
</Col>

    <Col span={8}>
    <Card bordered={false}
          style={{
              background: '#A8E5C7',
              borderRadius: '30px',
              textAlign: 'center',
              margin: '0 0px',
              width: '100%',
              position: 'relative', // Add relative positioning here
              paddingBottom: '100%', // This makes the card always square
              height: 0 // Since we're using paddingBottom to set height
          }}
          onClick={goToSettingPage}>

        {/* Positioned Image */}
        <img src="/icons/Setting.webp" alt="Healthy"
             style={{
                 position: 'absolute', // Image is absolutely positioned
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',  // Use contain to ensure the image fits inside
                 borderRadius: '30px' // Ensure the image also has the border radius
             }} />
    </Card>
    <Typography.Text style={{  color: '#000', fontSize: '16px', fontWeight: 'bold',paddingLeft: '15px'}}>
            Setting
        </Typography.Text>
</Col>



    <Col span={8}>
    <Card bordered={false}
          style={{
              background: '#A8E5C7',
              borderRadius: '30px',
              textAlign: 'center',
              margin: '0 0px',
              width: '100%',
              position: 'relative', // Add relative positioning here
              paddingBottom: '100%', // This makes the card always square
              height: 0 // Since we're using paddingBottom to set height
          }}
          onClick={gointroductionPage}>
        
        {/* Positioned Image */}
        <img src="/icons/Map.webp" alt="Healthy"
             style={{ 
                 position: 'absolute', // Image is absolutely positioned
                 top: 0,
                 left: 0,
                 width: '100%',
                 height: '100%',
                 objectFit: 'contain',  // Use contain to ensure the image fits inside
                 borderRadius: '30px' // Ensure the image also has the border radius
             }} />
    </Card>
    <Typography.Text style={{ marginTop: '10px', color: '#000', fontSize: '16px', fontWeight: 'bold',paddingLeft: '15px' }}>
Map        </Typography.Text>
</Col>

</Row>

</Card>
        </div>
      
        </Layout>      
  );
};

export default LanguageHelper(IntroductionPage);