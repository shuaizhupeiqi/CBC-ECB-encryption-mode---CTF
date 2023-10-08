import React, { Component } from "react";
import Router, { withRouter } from "next/router";
import { Form, Select, Button, Divider, Popover, Popconfirm } from "antd";
import Layout from "./layout";
import { LanguageHelper } from "../helpers/languageHelper";
import LoadingCard from "./../components/LoadingCard";
import Profile from "../components/Profile";
import settingPageStyle from "../styles/SettingPage.module.css";
import {
  LoginOutlined,
  CloseCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import LanguageSelect from "./../components/LanguageSelect";
import { trackInputChange } from "../helpers/withGoogleAnalytics";
import { checkUserLoggedIn, getUserInfo } from "../helpers/authHelper";
import showAlert from "./../components/Notification";
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
} from "./../helpers/firebaseClient.js";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH;

class SettingPage extends Component {
  constructor(props) {
    super(props);
  }
  formRef = React.createRef();

  state = {
    componentSize: "middle",

    loading: true,
    isLoggedIn: false,
    isEmailVerified: false,

    data: {},

    translation: {
      FormLabel: "Personalize your setting: ",
      LanguageSelector: "Change Language:",
      BackToHomePageButton: "Home Page",
      LoginButton: "Login to enable email notification",
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
    settingOptions: [],
    openProfile: false,
  };

  componentDidMount() {
    this.loadTranslation();
  }

  componentWillUnmount() {
    // This function will be called when the component is about to be unmounted
    if (this.state.latestFormValues && !this.state.saveButtonClicked) {
      this.onSaveData(this.state.latestFormValues, false);
    }
  }

  async loadTranslation() {
    const { languageHelper } = this.props;

    let res = await languageHelper.translation("SettingPage", true);

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

      if (isLoggedIn && user && user.emailVerified) {
        try {
          const dataFromFirebase = await readData(`users/${user.uid}`);

          // const parsedData = parseJSONValues(dataFromFirebase.settings);

          this.setState({
            data: dataFromFirebase.settings,
            translation: res.translation,
            settingOptions: res.data,
            isLoggedIn: isLoggedIn,
            loading: false,
          });
        } catch (error) {
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
  // 根据选项类型生成表单元素

  generateFormElements(option, index) {
    if (option.optionType === "multiple") {
      return this.generateMultipleOption(option, index);
    }
    return this.generateSingleOption(option, index);
  }
  // 生成单选项

  generateSingleOption(option, index) {
    return (
      <Form.Item key={index} label={option.label} name={option.name}>
        <Select>
          {option.options.map((value, i) => {
            return (
              <Select.Option
                key={i + index}
                value={JSON.stringify(value.value)}
              >
                {value.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    );
  }
  // 生成多选项

  generateMultipleOption(option, index) {
    let allOps = option.options;

    let ops = allOps.map((item) => {
      return {
        label: item.label,
        value: JSON.stringify(item.value),
      };
    });

    return (
      <Form.Item key={index} label={option.label} name={option.name}>
        <Select
          mode="multiple"
          showArrow
          // tagRender={this.tagRender}
          style={{
            width: "100%",
          }}
          options={ops}
          // defaultValue={this.state.riskGroup}
        ></Select>
      </Form.Item>
    );
  }

  // onFormLayoutChange = ({size}) => {
  //     this.setState({componentSize: size})
  // }
  // 当表单值变化时的处理函数

  onFormValueChange = (changedValue, allValue) => {
    // const fieldName = Object.keys(changedValue)[0];
    // const fieldValue = changedValue[fieldName];

    // Send event to Google Analytics
    // trackInputChange(fieldName, fieldValue);

    // localStorage.setItem("allValue", JSON.stringify(allValue));

    //this.onFormLayoutChange(allValue)
    this.setState({ latestFormValues: allValue });
  };
  // 处理返回首页的事件

  handleBackToHomePage = (e) => {
    this.setState({
      loading: true,
    });
    Router.push({
      pathname: "/",
    });
  };
  // 处理开关变化的事件

  handleOpenChange = (open) => {
    if (!open) {
      this.setState({ open: false });
    } else {
      this.setState({ open: true }, () => {
        this.doLogin();
      });
    }
  };
  // 关闭弹窗

  handlePopoverClose = () => {
    this.setState({ open: false });
  };
  // 执行登录操作

  doLogin = () => {
    let redirectPath = process.env.NODE_ENV === "production" ? basePath : "/";
    let firebaseui = require("firebaseui");
    let ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());
    ui.start("#firebaseui", {
      callbacks: {
        signInSuccessWithAuthResult: async (authResult, redirectUrl) => {
          this.setState({ open: false });

          const isNewUser = authResult.additionalUserInfo.isNewUser;

          if (!authResult.user.emailVerified) {
            this.setState({ isEmailVerified: false });
          }

          // if is new user and is email verfied this means logged in via gmail, auto add a email subcritpion true into the database
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
              // Check if user's email has been verified
              showAlert(
                "success",
                this.state.translation.Alert.Success.LoginSuccessTitle,
                this.state.translation.Alert.Success.LoginSuccessDescription
              );
              // Send email verification
              authResult.user.sendEmailVerification().then(() => {
                // Show alert to inform the user
                showAlert(
                  "info",
                  this.state.translation.Alert.Info.EmailverficationTitle,
                  this.state.translation.Alert.Info.EmailverficationDescription
                );
              });

              this.setState({ loading: true });
              await this.loadTranslation();
            }
          }

          showAlert(
            "success",
            this.state.translation.Alert.Success.LoginSuccessTitle,
            this.state.translation.Alert.Success.LoginSuccessDescription
          );

          this.setState({ loading: true });
          await this.loadTranslation();

          return true;
        },
      },
      signInFlow: "popup",
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
  // 执行登出操作

  doSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.setState({ user: null, openProfile: false });
        showAlert(
          "success",
          this.state.translation.Alert.Success.SignOutSuccessTitle,
          this.state.translation.Alert.Success.SignOutSuccessDescription
        );
        // save the current form value into the localstroage
        const formData = this.formRef.current.getFieldsValue();
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

  //核心功能用于保存setting设置，如果登陆了就会保存到firebase，没登陆保存在cookie里
  // 保存数据操作

  onSaveData = async (values, redirect = true) => {
    let user = await getUserInfo();

    if (redirect) {
      this.setState({ saveButtonClicked: true });
    }

    if (user) {
      if (user.emailVerified) {
        createOrUpdateData(`users/${user.uid}`, { settings: values })
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
            localStorage.setItem("allValue", JSON.stringify(values));

          });
      } else {
        showAlert(
          "info",
          this.state.translation.Alert.Info.SettingSavedTitle,
          this.state.translation.Alert.Info.SettingSavedAskToVeriftyDescription
        );
        localStorage.setItem("allValue", JSON.stringify(values));
      }
    } else {
      showAlert(
        "info",
        this.state.translation.Alert.Info.SettingSavedTitle,
        this.state.translation.Alert.Info.LoginToSaveYourDataDescription
      );
      localStorage.setItem("allValue", JSON.stringify(values));
    }

    // Send event to Google Analytics，实际好像并没用到
    //trackInputChange(values);
    // send event to firebase analytics
    //trackInputChangeViaFirebase(values);
    showAlert(
      "success",
      this.state.translation.Alert.Success.SettingSavedTitle,
      this.state.translation.Alert.Success.SettingSavedDescription
    );
    if (redirect) {
      this.handleBackToHomePage();
    }
  };
  // 保存数据失败时的处理函数

  onSaveDataFailed = (errorInfo) => {
    console.log(errorInfo);
    showAlert(
      "error",
      this.state.translation.Alert.Error.SaveFailedTitle,
      this.state.translation.Alert.Error.SomethingWentWrongTitle
    );
  };
  // 重新发送验证邮件

  resendVerificationEmail = () => {
    const user = firebase.auth().currentUser;
    if (user) {
      user
        .sendEmailVerification()
        .then(() => {
          showAlert(
            "info",
            this.state.translation.Alert.Info.EmailverficationTitle,
            this.state.translation.Alert.Info.EmailverficationDescription
          );
        })
        .catch((error) => {
          console.error("Error sending email verification:", error);
        });
    }
  };
  // 渲染未验证头部

  NotVerfiedHeader() {
    return (
      <div id={settingPageStyle.NotVerfiedHeader}>
        <p>
          {this.state.translation.NotVerifiedNote}
          &emsp;{" "}
          <span
            onClick={this.resendVerificationEmail}
            id={settingPageStyle.resendLink}
          >
            {this.state.translation.ResendLink}
          </span>
        </p>
      </div>
    );
  }
  // 渲染用户名头部

  UserNameHeader() {
    let user = this.state.user;
    if (user) {
      return (
        <p>
          {this.state.translation.Hello}: {user.displayName}
        </p>
      );
    } else {
      return null;
    }
  }
  // 打开个人资料页面

  openProfilePage() {
    this.setState({ openProfile: true });
  }
  // 关闭个人资料页面

  closeProfilePage = () => {
    this.setState({ openProfile: false });
  };
  // 渲染已登录按钮

  renderLoggedInButton() {
    return (
      <Button
        id={settingPageStyle.profilebutton}
        onClick={this.openProfilePage.bind(this)}
      >
        {this.state.translation.ManageYourProfile}
      </Button>
    );
  }
  // 渲染组件

  render() {
    return (
      <div className={this.state.openProfile ? settingPageStyle.fixed : null}>
      
      {/*判断用户是否打开了profile */}
        {this.state.openProfile ? (
          <Profile
            doSignOut={this.doSignOut}
            closeProfilePage={this.closeProfilePage}
          />

        ) : null}
        <Layout>
          {this.state.isLoggedIn && !this.state.isEmailVerified
            ? this.NotVerfiedHeader()
            : null}
          {this.state.loading ? (
            <LoadingCard />
          ) : (
            <Form
              ref={this.formRef}
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              layout="vertical"
              initialValues={this.state.data}
              onValuesChange={this.onFormValueChange}
              size={this.state.componentSize}
              style={{
                maxWidth: "100%",
              }}
              onFinish={this.onSaveData}
              onFinishFailed={this.onSaveDataFailed}
            >
              <Divider orientation="left" id={settingPageStyle.userNameDivider}>
                {this.state.isLoggedIn ? this.UserNameHeader() : null}
              </Divider>
              <Form.Item>
                {this.state.isLoggedIn ? (
                  this.renderLoggedInButton()
                ) : (
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
                    <Button
                      id={settingPageStyle.loginSignUpbutton}
                      icon={<LoginOutlined />}
                    >
                      {this.state.translation.LoginButton}
                    </Button>
                  </Popover>
                )}
              </Form.Item>
              <Divider orientation="left">
                {this.state.translation.LanguageSelector}
              </Divider>
              <Form.Item>
                <LanguageSelect />
              </Form.Item>
              <Divider orientation="left">
                {this.state.translation.FormLabel}
              </Divider>

            
              {this.state.settingOptions.map((option, index) => {
                return this.generateFormElements(option, index + "FormOption");
              })}
              <Form.Item>
                <Button
                  id={settingPageStyle.homePageButton}
                  htmlType="submit"
                  icon={<SaveOutlined />}
                >
                  {this.state.translation.SaveYourChanges}
                </Button>
                {/* <Button onClick={this.handleBackToHomePage.bind(this)} id={settingPageStyle.homePageButton} icon={<HomeOutlined />}>{this.state.translation.BackToHomePageButton}</Button> */}
              </Form.Item>
            </Form>
          )}
        </Layout>
      </div>
    );
  }
}

export default withRouter(LanguageHelper(SettingPage));
