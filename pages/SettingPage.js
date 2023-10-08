import React, { Component,useState, useEffect, useCallback } from "react";
import Router, { withRouter } from "next/router";
import { Form, Tabs,Popover, Select, Button, Divider, Row, Col,Alert, Card,Breadcrumb } from "antd";
import Layout from "./layout";
import { LanguageHelper } from "../helpers/languageHelper";
import LoadingCard from "../components/LoadingCard";
import PopOver from "../components/Popover";
import Profile from "../components/Profile";
import {
  LoginOutlined,
  CloseCircleOutlined,
  SaveOutlined,
  ProfileOutlined,
  TranslationOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from "@ant-design/icons";

import { blue,gray, green } from '@ant-design/colors';
import LanguageSelect from "../components/LanguageSelect";
import { trackInputChange } from "../helpers/withGoogleAnalytics";
import { checkUserLoggedIn, getUserInfo } from "../helpers/authHelper";
import showAlert from "../components/Notification";
import {
  createOrUpdateData,
  deleteData,
  readData,
} from "../helpers/dataHelper";
import { parseJSONValues, getAllValuesGivenKey } from "../helpers/jsonHelper";

import firebase from "firebase/compat/app";
import "firebaseui/dist/firebaseui.css";

import {
  trackInputChangeViaFirebase,
  app,
} from "../helpers/firebaseClient.js";

const {Meta} = Card;
const {TabPane} = Tabs;
// 从环境变量获取基础路径，用于登录Login使用
const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

// 移动端判定
const isMobile = typeof window !== 'undefined' ? window.innerWidth <= 768 : false;

// 构造
class SettingPage extends Component {
  constructor(props) {
    super(props);
  }
// 创建表单引用，用于访问和操作Form组件
  formRef = React.createRef();
// 组件的初始状态
  state = {
    componentSize: "middle",//用于UI, 渲染
    // 加载身份验证
    loading: true,

    isLoggedIn: false,

    isEmailVerified: false,
// 定义空的data
    data: {},
    showAlert:true,
    // 翻译的文本内容
    translation: {
      FormLabel: "Personalize your setting:",
      LanguageSelector: "Change Language:",
      BackToHomePageButton: "Home Page",
      LoginButton: "Login/Signin",
      FormSizeLabel: "Form Size",
      FormSizeButtonSmall: "Small",
      FormSizeButtonMiddle: "Middle",
      FormSizeButtonLarge: "Large",
      FormAgeSelectionLabel: "Select your age group:",
      FormIsIllnessLabel: "Do you have any chronic illness?",
      FormRiskGroupLabel: "Are you in any this groups at greater risk?",
      FormIsTakingMedLabel: "Are you taking any medications?",
      yes: "yes",
      no: "no",
      LoggedInText:"Your information will get protection",
      NotLoginText:"You haven't log in, please login to unlock the function of multiple profile",
      CardContentOne:"Set individual data",
      CardContentOneText:"Setting your personal information and get your personalised HSS data.",
      CardContentTwo:"Set Language",
      CardContentTwoText:"Change the language for your own, Chinese or English",
      CardContentThree:"Manage multiple profiles",
      CardContentThreeTextDisabled:"Please login/signin to activate this function, compare your family's HSS data.",
      riskGroupOptions: [
        {
          label: "people who are overweight",
          value: "gold",
        },
        {
          label: "pregnant women and breastfeeding mothers",
          value: "cyan",
        },
      ],
    },
    breadcrumbs:[],
    content:'cards',
    showForm: false,
    activeCard:'',
    // profiles: [{name: '', ...this.state.data}],
    settingOptions: [],
    openProfile: false,
  };
// 组件添加到DOM调用
  componentDidMount() {
    this.loadTranslation(); //加载翻译
  }
// 组件即将卸载前调用的生命周期方法
  componentWillUnmount() {
    // 如果用户没有点击保存按钮，保存最新的表单值
    if (this.state.latestFormValues && !this.state.saveButtonClicked) {
      this.onSaveData(this.state.latestFormValues, false);
    }
  }
// 加载翻译
  async loadTranslation() {
    const { languageHelper } = this.props;
// 从languageHelper获取翻译
    let res = await languageHelper.translation("SettingPage", true);
    // 检查用户登录状态和邮箱是否验证
    checkUserLoggedIn(async (isLoggedIn, user) => {
      this.setState({ user: user });
      if (isLoggedIn) {
        this.setState({
          isLoggedIn: true,
        });
      }
      if (user && user.emailVerified) {
        this.setState({
          isEmailVerified: true,
        });
      }
      // 用户已登录且验证邮箱，从firebase读取数据
      if (isLoggedIn && user && user.emailVerified) {
        try {
          const dataFromFirebase = await readData(`users/${user.uid}`);//调用datahelper中的读取数据

          // const parsedData = parseJSONValues(dataFromFirebase.settings);

          this.setState({
            data: dataFromFirebase.settings,
            translation: res.translation,
            settingOptions: res.data,
            isLoggedIn: isLoggedIn,
            loading: false,
          });
        } catch (error) {//从firebase获取数据失败则从localStorage读取数据
          console.error("Operation failed:", error);

          let data = {};
          if (localStorage.getItem("allValue")) {
            data = JSON.parse(localStorage.getItem("allValue"));
          }

          this.setState({
            data: data,
            translation: res.translation,
            settingOptions: res.data,
            isLoggedIn: isLoggedIn,
            loading: false,
          });
        }
      } else {
        if (localStorage.getItem("allValue")) {
          let data = JSON.parse(localStorage.getItem("allValue"));
          this.setState({
            data: data,
            translation: res.translation,
            settingOptions: res.data,
            isLoggedIn: isLoggedIn,
            loading: false,
          });
        } else {
          this.setState({
            data: {},
            translation: res.translation,
            settingOptions: res.data,
            isLoggedIn: isLoggedIn,
            loading: false,
          });
        }
      }
    });
  }
// 生成表单的函数, option对象为SettingPage.json中的data
  generateFormElements(option, index) {
    if (option.optionType === "multiple") {
      return this.generateMultipleOption(option, index);//多选
    }
    return this.generateSingleOption(option, index);//单选
  }
// 生成单选选择框, 接受option和index返回的参数，返回Form.Item
  generateSingleOption(option, index) {
    return (
      <Form.Item key={index} label={option.label} name={option.name}>
        {/* AntDesign */}
        <Select>
          {option.options.map((value, i) => {//遍历选项生成单项选择表单
            return (
              <Select.Option
                key={i + index}
                value={JSON.stringify(value.value)}//JSON字符串化值
              >
                {value.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
// 多选框
  generateMultipleOption(option, index) {
    // 传入option所有选项
    let allOps = option.options;
    // 将每个选项转化成有label和value的对象，其中value是json字符串化后的值
    let ops = allOps.map((item) => {
      return {
        label: item.label,
        value: JSON.stringify(item.value),
      };
    });

    return (//Antdesign
      <Form.Item key={index} label={option.label} name={option.name}>
        <Select
          mode="multiple"
          showArrow//下拉箭头
          // tagRender={this.tagRender}
          style={{
            width: "100%",
          }}
          options={ops}//传入处理后的选项数组
          // defaultValue={this.state.riskGroup}
        ></Select>
      </Form.Item>
    );
  }

  // onFormLayoutChange = ({size}) => {
  //     this.setState({componentSize: size})
  // }

  
  onFormValueChange = (changedValue, allValue) => {// 表单发生改变时会进行调用
    // const fieldName = Object.keys(changedValue)[0];
    // const fieldValue = changedValue[fieldName];

    // Send event to Google Analytics
    // trackInputChange(fieldName, fieldValue);

    // localStorage.setItem("allValue", JSON.stringify(allValue));

    //this.onFormLayoutChange(allValue)

    // 更新组件的state,将最新的表单值设置为allValue
    this.setState({ latestFormValues: allValue });
  };
// 处理返回到主页的操作
  handleBackToHomePage = (e) => {
    this.setState({//更新状态，如果要返回主页，loading改为true
      loading: true,
    });
    // 使用router导航
    Router.push({
      pathname: "/",
    });
  };

// 处理选择框打开或关闭的状态变化, 传入的参数open（popover中Modal的属性open）
  handleOpenChange = (open) => {
    // 检查传入的open值，false说明选择框是关闭状态
    if (!open) {
      this.setState({ open: false });//被关闭就更新open
    } else {
      this.setState({ open: true }, () => {//选择框被打开则更新状态，并调用doLogin
        this.doLogin();
      });
    }
  };
// 处理popover关闭的函数
  handlePopoverClose = () => {
    this.setState({ open: false });
  };
// 登录逻辑
  doLogin = () => {
    // 根据环境变量确定重定向的路径
    let redirectPath = process.env.NODE_ENV === "production" ? basePath : "/";
    // 导入firebaseui库，支持身份验证等，提供自带ui组件
    let firebaseui = require("firebaseui");
    // 获取firebaseui的auth实例 or 创建新的实例
    let ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    // 使用指定配置启动 firebaseui auth 流
    ui.start("#firebaseui", {//呈现firebaseui身份验证界面
      callbacks: {//登录成功时的回调函数
        signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
          // 关闭popover
          this.setState({ open: false });
          //检查是否是新用户
          const isNewUser = authResult.additionalUserInfo.isNewUser;
          // 检查用户邮箱是否验证过
          if (!authResult.user.emailVerified) {
            this.setState({ isEmailVerified: false });
          }

          // 如果新用户验证过邮箱，在数据库中自动设置邮件订阅
          if (isNewUser) {
            if (authResult.user.emailVerified) {
              createOrUpdateData(`users/${authResult.user.uid}`, {
                emailSubscription: true,
              })
                .then(() => {
                  console.log("Operation successful");
                })
                //save the data into the local storage when save to cloud is failed
                .catch((error) => {
                  console.error("Operation failed:", error);
                  showAlert(
                    "error",
                    this.state.translation.Alert.Error.SomethingWentWrongTitle,
                    this.state.translation.Alert.Error.SaveDataErrorDescription
                  );
                  return false;
                });
            } else {
              // 邮箱未验证
              showAlert(
                "success",
                this.state.translation.Alert.Success.LoginSuccessTitle,
                this.state.translation.Alert.Success.LoginSuccessDescription
              );
              // 发送邮箱验证邮件
              authResult.user.sendEmailVerification().then(() => {
                // Show alert to inform the user
                showAlert(
                  "info",
                  this.state.translation.Alert.Info.EmailverficationTitle,
                  this.state.translation.Alert.Info.EmailverficationDescription
                );
              });
              // 设置加载状态为true
              this.setState({ loading: true });
              // 加载翻译
              await this.loadTranslation();
            }
          }
          // 显示成功登录
          showAlert(
            "success",
            this.state.translation.Alert.Success.LoginSuccessTitle,
            this.state.translation.Alert.Success.LoginSuccessDescription
          );
          // 设置加载状态
          this.setState({ loading: true });
          await this.loadTranslation();

          return true;
        },
      },
      // 登陆方式为弹窗
      signInFlow: "popup",
      // 登陆选项为邮箱和google
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],
      //signInSuccessUrl:redirectPath,
      // Terms of service url.
      tosUrl: "<your-tos-url>",
      // Privacy policy url.
      privacyPolicyUrl: "<your-privacy-policy-url>",
    });
  };

  // 登出逻辑
  doSignOut = () => {
    // firebase的auth方法执行登出
    firebase
      .auth()
      .signOut()
      .then(() => {
        // 登出成功，更新组件状态，关闭profile, 设置user为null（没有用户登录）
        this.setState({ user: null, openProfile: false });
        // 显示成功登出
        showAlert(
          "success",
          this.state.translation.Alert.Success.SignOutSuccessTitle,
          this.state.translation.Alert.Success.SignOutSuccessDescription
        );

        // 获取当前表单的值,antDesign
        const formData = this.formRef.current.getFieldsValue();
        // 将当前表单的值存到 localstorage(web storage的API)
        localStorage.setItem("allValue", JSON.stringify(formData));
      })
      .catch((error) => {
        console.error("Error logging out:", error);
        showAlert(
          "error",
          this.state.translation.Alert.Error.SignOutErrorTitle,
          this.state.translation.Alert.Error.SignOutErrorDescription
        );
      });
  };

  // 保存数据，接受两个参数，value是要保存到值，redirect是一个可选的重定向标志（保存按钮）
  onSaveData = async (values, redirect = true) => {
    // 获取当前用户信息（authHelper中的getUserInfo）
    let user = await getUserInfo();
    // 重定向为真，将保存按钮点击状态设置为真
    if (redirect) {
      this.setState({ saveButtonClicked: true });
    }
    // 获取到用户信息后
    if (user) {
      if (user.emailVerified) {
        // 邮箱已验证则在云端为用户创建或更新数据，存储设置值（createOrUpdate--dataHelper）
        createOrUpdateData(`users/${user.uid}`, { settings: values })
          .then(() => {
            // 操作成功
            console.log("Operation successful");
          })
          //如果数据保存到云端失败，就保存到LocalStorage
          .catch((error) => {
            console.error("Operation failed:", error);
            showAlert(
              "error",
              this.state.translation.Alert.Error.SomethingWentWrongTitle,
              this.state.translation.Alert.Error.SaveDataErrorDescription
            );
            localStorage.setItem("allValue", JSON.stringify(values));
          });
      } else {
        // 用户邮件未验证， 显示一个提示消息并将设置保存到LocalStorage
        showAlert(
          "info",
          this.state.translation.Alert.Info.SettingSavedTitle,
          this.state.translation.Alert.Info.SettingSavedAskToVeriftyDescription
        );
        localStorage.setItem("allValue", JSON.stringify(values));
      }
    } else {
      // 如果没有获取到用户信息（例如，用户未登录），显示提示消息并将设置保存到localStorage
      showAlert(
        "info",
        this.state.translation.Alert.Info.SettingSavedTitle,
        this.state.translation.Alert.Info.LoginToSaveYourDataDescription
      );
      localStorage.setItem("allValue", JSON.stringify(values));
    }

    // 发送事件到Google Analytics，跟踪用户的输入变化
    trackInputChange(values);
    // 向Firebase Analytics发送事件，跟踪用户的输入变化
    trackInputChangeViaFirebase(values);
    // 显示设置已成功保存的提示消息
    showAlert(
      "success",
      this.state.translation.Alert.Success.SettingSavedTitle,
      this.state.translation.Alert.Success.SettingSavedDescription
    );
    // 如果需要重定向，返回到主页
    if (redirect) {
      this.handleBackToHomePage();
    }
  };

  // 保存数据失败的处理函数
  onSaveDataFailed = (errorInfo) => {
    // 在控制台打印出错信息
    console.log(errorInfo);
    // 显示一个错误提示框，标题和描述都从组件的state的translation字段中取得
    showAlert(
      "error",
      this.state.translation.Alert.Error.SaveFailedTitle,
      this.state.translation.Alert.Error.SomethingWentWrongTitle
    );
  };
// 重新发送验证邮件的方法
  resendVerificationEmail = () => {
    // 从firebase获取当前登录的用户
    const user = firebase.auth().currentUser;
     // 如果用户存在
    if (user) {
      // 尝试发送验证邮件
      user
        .sendEmailVerification()
        .then(() => {
          showAlert(// 如果发送成功，显示一个提示信息
            "info",
            this.state.translation.Alert.Info.EmailverficationTitle,
            this.state.translation.Alert.Info.EmailverficationDescription
          );
        })
        .catch((error) => {// 如果发送成功，显示一个提示信息
          console.error("Error sending email verification:", error);
        });
    }
  };

// 未验证用户的标题渲染
NotVerfiedHeader() {

  const notVerifiedHeaderStyle = {
    width: '97%',
    backgroundColor: 'salmon',
    marginTop: '1%',
    borderRadius: '10px',
    paddingLeft: '3%',
    color: 'white',
  };
  const resendLinkStyle = {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: 'blue',
  };

  return (
    <div>
      {isMobile ? null :(
      <div style={notVerifiedHeaderStyle}>
        <p>
          {this.state.translation.NotVerifiedNote} &emsp; 
          <span onClick={this.resendVerificationEmail} style={resendLinkStyle}>
            {this.state.translation.ResendLink}
          </span>
        </p>
      </div>
      )}
    </div>
  );
}


// 用户名标题渲染函数(登陆后)
  UserNameHeader() {
    // 从组件的state中获取用户信息
    let user = this.state.user;
    // 如果用户存在
    if (user) {
      return (
        <p>
          {/* 从组件的state中获取并显示问候语，并附加用户的名字 */}
          {this.state.translation.Hello}: {user.displayName}
        </p>
      );
    } else {
      return null;
    }
  }
// 打开个人资料页的方法
  openProfilePage() {
    this.setState({ openProfile: true });
  }
// 关闭个人资料页的方法
  closeProfilePage = () => {
    this.setState({ openProfile: false });
  };
// 渲染登录按钮的方法
  renderLoggedInButton() {
    return (
      <Button
        style={{
          backgroundColor: gray[5],
          color: 'white',
          fontWeight: 'bold'
        }}
        onClick={this.openProfilePage.bind(this)}
      >
        {this.state.translation.ManageYourProfile}
      </Button>
    );
}

// 无视关闭消息框的操作
handleCloseAlert = () => {
  this.setState({
    showAlert: false, // 关闭Alert
  });
};
// 个人信息卡片
handleIndividualCardClick = () => {
  this.setState({ showForm: true, activeCard: 'individual' });
}

// 对于“语言”卡片
handleLanguageCardClick = () => {
  this.setState({ showForm: true, activeCard: 'language' });
}

// 对于“多人档案”卡片
handleMultipleProfileCardClick = () => {
  this.setState({ showForm: true, activeCard: 'multiple' });
}

// 表单
renderForm = () => {
  if (this.state.showForm){
    if(this.state.activeCard === 'individual'){
      return(<Form
        ref={this.formRef}
        labelCol={{ span: 24, }}
        wrapperCol={{ span: 24, }}
        layout="vertical"
        initialValues={this.state.data}
        onValuesChange={this.onFormValueChange}
        size={this.state.componentSize}
        style={{ maxWidth: "100%", }}
        onFinish={this.onSaveData}
        onFinishFailed={this.onSaveDataFailed}
      >
        
            <Divider orientation="left">
              {this.state.translation.FormLabel}
            </Divider>
            {this.state.settingOptions.map((option, index) => {
              return this.generateFormElements(option, index + "FormOption");
            })}
            <Form.Item>
            <Button
              style={{
                backgroundColor: gray[5],
                color: 'white',
                fontWeight: 'bold',
                width: '100%',
              }}
              htmlType="submit"
              onClick={this.handleSwitchBackToCards}
              icon={<SaveOutlined />}
            >
                Sace and back
              </Button>
              {/* <Button onClick={this.handleBackToHomePage.bind(this)} id={settingPageStyle.homePageButton} icon={<HomeOutlined />}>{this.state.translation.BackToHomePageButton}</Button> */}
            </Form.Item>
        {/* ... 其他表单内容 ... */}
      </Form>);
    }else if (this.state.activeCard ==='language'){
      return(
        <Form>
          {/* ...表单字段等... */}
          <Divider orientation="left">
                {this.state.translation.LanguageSelector}
              </Divider>
              <Form.Item>
                <LanguageSelect />
              </Form.Item>
          <Button
              style={{
                backgroundColor: gray[5],
                color: 'white',
                fontWeight: 'bold',
                width: '100%',
              }}
              htmlType="submit"
              onClick={this.handleSwitchBackToCards}
              icon={<SaveOutlined />}
            >
                Sace and back
              </Button>
        </Form>
      );}
    // }else if (this.state.activeCard ==='multiple'){
    //   return(
    //     <Tabs onChange={this.onProfileTabChange} type="editable-card" onEdit={this.onProfileTabEdit}>
    //         {this.state.profiles.map((profile, index) => (
    //           <TabPane tab={profile.name || `Profile ${index + 1}`} key={index}>
    //             <Form
    //               // ...将profile的数据传递给表单...
    //             >
    //               {/* ...表单字段等... */}
    //               <Form.Item label="Name">
    //                 <Input value={profile.name} onChange={e => this.updateProfileName(index, e.target.value)} />
    //               </Form.Item>
    //               {/* ...其他的表单元素... */}
    //             </Form>
    //           </TabPane>
    //         ))}
    //       </Tabs>
    //   );
    // }
  }
};

handleCardClick = (cardType) => {
  if (!this.state.isLoggedIn) return;
  this.setState({
    showForm: true,
    activeCard: cardType,
  });
};

onProfileTabChange = activeKey => {
  // 处理用户切换选项卡
};

onProfileTabEdit = (targetKey, action) => {
  // 处理用户编辑选项卡，例如添加或删除配置文件
  if (action === 'add') this.addProfile();
  if (action === 'delete') this.removeProfile(targetKey);
};

handleSwitchBackToCards = () => {
  this.setState({ showForm: false });
}

// 个人信息下面卡片内容渲染
renderCards = () => {
  switch (this.state.content){
    case 'cards':
  
        return(
          <div>
                <Card 
                  hoverable
                  style={{ width: 300, marginBottom:'10px' }}
                  onClick={() => {
                    if(!this.state.isLoggedIn) {
                      this.setState({ 
                        showForm: true, 
                        breadcrumbs: ['Setting', 'Individual HSS'],
                        activeCard:'individual',
                      });
                    }
                  }}
                  cover={
                    <div style={{ backgroundColor: blue[2], display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <ProfileOutlined style={{ fontSize: '50px', color: "black", paddingTop:"30px",paddingBottom:"30px"}} />
                    </div>
                  }
                
                >
                  {/* 你可以在此添加卡片的内容 */}
                  <Meta title={this.state.translation.CardContentOne} 
                  description = {this.state.translation.CardContentOneText}/>
                
                </Card>
                <Card 
                  hoverable
                  style={{ width: 300, marginBottom:'10px' }}
                  onClick={() => {
                    if(!this.state.isLoggedIn) {
                      this.setState({ 
                        showForm: true, 
                        breadcrumbs: ['Setting', 'Language'],
                        activeCard: 'language',
                      });
                    }
                  }}
                  cover={
                    <div style={{ backgroundColor: gray[2], display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <TranslationOutlined style={{ fontSize: '50px', color: "black", paddingTop:"30px",paddingBottom:"30px"}} />
                    </div>
                  }
                
                >
                  {/* 你可以在此添加卡片的内容 */}
                  <Meta title={this.state.translation.CardContentTwo} 
                  description = {this.state.translation.CardContentTwoText}/>
                
                </Card>
                <Card 
                  style={{ width: 300, marginBottom:'10px',
                  opacity: this.state.isLoggedIn ? 1 : 0.5, // 1 为完全不透明，0.5 为半透明
                  pointerEvents: this.state.isLoggedIn ? 'auto' : 'none'
                }}
                  onClick={() => {
                    if(!this.state.isLoggedIn) {
                      return;
                      }
                      this.setState({ 
                        showForm: true, 
                        breadcrumbs: ['Setting', 'Profiles Management'],
                        activeCard: 'multiple',
                  });
                    
                  }}
                  cover={
                    <div style={{ backgroundColor: green[2], display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <UsergroupAddOutlined style={{ fontSize: '50px', color: "black", paddingTop:"30px",paddingBottom:"30px"}} />
                    </div>
                  }
                  disabled={!this.state.isLoggedIn}
                >
                  {/* 你可以在此添加卡片的内容 */}
                  <Meta title={this.state.translation.CardContentThree} 
                  description = {this.state.translation.CardContentThreeTextDisabled}/>
                
                </Card>
                <Button
                  style={{
                    backgroundColor: gray[5],
                    color: 'white',
                    fontWeight: 'bold',
                    width: '100%',
                    marginBottom:'10px',
                  }}
                  htmlType="submit"
                  onClick={this.handleBackToHomePage}
                  icon={<SaveOutlined />}
                >
                    Sace and back
                  </Button>
              </div>
            );
            break;
      case 'form':
        
          return this.renderForm;
        
        default:
          return <LoadingCard/>;
    
    }
  
  
};

  render() {

    return (
      <div style={this.state.openProfile ? { width: '100vw', position: 'fixed' } : null}>
        {this.state.openProfile ? (
          <Profile
            doSignOut={this.doSignOut}
            closeProfilePage={this.closeProfilePage}
          />
        ) : null}
        <Layout>
          {/* 提示信息 */}
          <Row style = {{marginTop: '10px'}}>
            <Col  span={24}>
            <Alert 
              message ="Notice"
              description={
                <div style={{padding:"0 0px"}}>
                  <span style ={{color: gray[3]}}>
                    {this.state.isLoggedIn ? 
                  this.state.translation.LoggedInText : 
                  this.state.translation.NotLoginText}
                  </span>
                </div>
              } 
              type="info" 
              showIcon
              action={
                this.state.isLoggedIn?
                (
                  <Button size="small" type="primary" onClick={this.handleCloseAlert}>
                    Accept
                  </Button>
                ):null                
              }
              closable
            />
            </Col>
          </Row>
          <Divider orientation="left" 
                style={{
                  color: blue[6], 
                  // 在此处添加其他必要的样式属性，例如 fontSize、margin 等
                }}></Divider>
          <Row style={{ marginTop: '20px',marginBottom:"20px", alignItems: 'center' }}> {/* 新增的Row */}
            <Col span={8} style={{textAlign:"center"}}>
              <UserOutlined style={{ fontSize: '50px', color: "black"}} />
            </Col>
            <Col span={16}>
              {this.state.isLoggedIn ? (
                <div>
                  <div>{this.state.user.name}</div>
                  <div>{this.state.user.email}</div>
                  <div>{this.state.user.phone}</div>
                 <div style={{marginTop:"5px"}}>
                 {this.renderLoggedInButton()}
                 </div>
                </div>
              ) : (
                <div>
                  <Popover
                    content={<div id={"firebaseui"} />}
                    title={
                      <div>
                        <LoginOutlined />
                        <CloseCircleOutlined
                          style={{ float: "right" }}
                          onClick={this.handlePopoverClose}
                        />
                      </div>
                    }
                    trigger="click"
                    open={this.state.open}
                    onOpenChange={this.handleOpenChange}
                    autoAdjustOverflow
                    getPopupContainer={(trigger) => trigger.parentNode}
                  >
                    <Button style={{
                          backgroundColor: gray[5],
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                        icon={<LoginOutlined />}
                        >
                    {this.state.translation.LoginButton}
                    </Button>
                  </Popover>
                </div>
              )}
            </Col>
          </Row>

          {/* 如果已登录，邮箱未验证 */}
          {this.state.isLoggedIn && !this.state.isEmailVerified
            ? this.NotVerfiedHeader()
            : null}
          {this.state.loading ? (
            <LoadingCard />
          ) : (
            <>
            
            <Divider orientation="left" 
                style={{
                  color: blue[6], 
                  // 在此处添加其他必要的样式属性，例如 fontSize、margin 等
                }}/>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  {this.state.breadcrumbs.map((crumb, index) => (
                    <Breadcrumb.Item key={index}>{crumb}</Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              <div>
              {this.state.showForm ? this.renderForm() : this.renderCards()}
              </div>
          
          </>
          
          )}
        </Layout>
      </div>
    );
  }
}

export default withRouter(LanguageHelper(SettingPage));