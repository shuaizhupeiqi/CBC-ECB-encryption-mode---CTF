import React, { Component } from "react";
import { withRouter } from "next/router";
import { LanguageHelper } from "../helpers/languageHelper";
import {
  Button,
  Popconfirm,
  Divider,
  Row,
  message,
  Input,
  Space,
  Select,
  Col,
  Tooltip,Typography,Card, Icon
} from "antd";
import {
  LoginOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { green,gray, volcano,blue } from '@ant-design/colors';


import LoadingCard from "./LoadingCard";
import { getUserInfo } from "../helpers/authHelper";
import showAlert from "./Notification";
import { createOrUpdateData, readData } from "../helpers/dataHelper";

const {Text} =Typography;
const {Option} = Select;

class Profile extends Component {
  constructor(props) {
    super(props);
  }

  
  state = {
    openEditPhone: false,
    startPhoneNumberToBeSubmit: "61",
    showUnsubscribeDisplay: false,
    showSubscribeDisplay: false,
    loading: true,
    user: null,
    editPhoneNumber: false,
    phoneSubscription: false,
  };

  async componentDidMount() {
    await this.loadTranslation();
    await this.loadData();
  }

  async loadTranslation() {
    const { languageHelper } = this.props;

    let res = await languageHelper.translation("Profile", true);

    this.setState({
      translation: res.translation,
    });
  }

  async loadData() {
    let user = await getUserInfo();

    if (user) {
      const dataFromFirebase = await readData(`users/${user.uid}`);
      let subscriped = dataFromFirebase?.emailSubscription;
      let phoneNumber = dataFromFirebase?.phoneNumber;
      let phoneSubscription = dataFromFirebase?.phoneSubscription;
      if (subscriped == undefined) {
        subscriped = false;
      }
      this.setState({
        user: user,
        emailSubscription: subscriped,
        loading: false,
        emailVerified: user.emailVerified,
        phoneNumber: phoneNumber,
        phoneSubscription: phoneSubscription,
      });
    } else {
      showAlert(
        "error",
        this.state.translation.Alert.Error.SomethingWentWrongTitle,
        this.state.translation.Alert.Error.FetchingProfile
      );
    }
  }

  doSignOut = (e) => {
    this.props.doSignOut();
  };

  closeProfilePage = (e) => {
    if (e.target === e.currentTarget) {
      this.props.closeProfilePage();
    }
  };

  closeProfilePageFromIcon = (e) => {
    this.props.closeProfilePage();
  };

  renderSignOutButton() {
    return (
      <Divider orientation="right">
        <Popconfirm
          title={this.state.translation.SignOutConfirmTitle}
          description={this.state.translation.SignOutConfirmDescription}
          okText={this.state.translation.SignOutOkText}
          cancelText={this.state.translation.SignOutCancelText}
          onConfirm={this.doSignOut}
        >
          <Button
            style={{
              backgroundColor: gray[6],
              color: gray[1],
              fontWeight: 'bold',
            }}
            icon={<LoginOutlined />}
          >
            {this.state.translation.SignOut}
          </Button>
        </Popconfirm>
      </Divider>
    );
  }

  renderUserNameDisplay() {
    let user = this.state.user;
    if (user) {
      return (
        <div>
          <p style={{ fontSize: '18px' }}>
            <strong>{this.state.translation.UserName}:</strong> {user.displayName}
          </p>
        </div>
      );
    } else {
      return null;
    }
  }

  infoWhetherIsVerified = () => {
    this.state.emailVerified
      ? message.success(this.state.translation.EmailHaveBeenVerified)
      : message.error(this.state.translation.YouHaventVerifiedYet);
  };

  renderEmailDisplay() {
    return (
      <Row
        style={{
          width: '100%',
          display: 'flex',
          textAlign: 'center',
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        <p style={{ fontSize: '18px' }}>
          <strong>{this.state.translation.Email}:</strong> {this.state.user.email}{" "}
        </p>
        <Tooltip title={this.state.translation.VerificationStatus}>
          <div
            onClick={this.infoWhetherIsVerified}
            style={{
              marginLeft: '2%',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: gray[1],
              backgroundColor: this.state.emailVerified ? green[7] : volcano[7],
              cursor: 'pointer',
            }}
          >
            {this.state.emailVerified ? (
              <CheckOutlined style={{ fontSize: '10px' }} />
            ) : (
              <CloseOutlined style={{ fontSize: '10px' }} />
            )}
          </div>
        </Tooltip>
      </Row>
    );
  }

  showUnSubscribeDisplay = (e) => {
    let current = this.state.showUnsubscribeDisplay;
    this.setState({ showUnsubscribeDisplay: !current });
  };

  showSubscribeDisplay = (e) => {
    let current = this.state.showSubscribeDisplay;
    this.setState({ showSubscribeDisplay: !current });
  };

  cancelShowUnSubscribeDisplay = (e) => {
    this.setState({ showUnsubscribeDisplay: false });
  };

  cancelShowSubscribeDisplay = (e) => {
    this.setState({ showSubscribeDisplay: false });
  };

  doUnSubscribe = async () => {
    let user = await getUserInfo();
    if (user) {
      createOrUpdateData(`users/${user.uid}`, { emailSubscription: false })
        .then(() => {
          console.log("Operation successful");
          showAlert(
            "success",
            this.state.translation.Alert.Success.UnsubscribeTitle,
            this.state.translation.Alert.Success.UnsubscribeDescription +
              user.email
          );
          this.setState({
            showUnsubscribeDisplay: false,
          });
          this.loadData();
        })
        //save the data into the local storage when save to cloud is failed
        .catch((error) => {
          console.error("Operation failed:", error);
          this.setState({
            showUnsubscribeDisplay: false,
          });
          showAlert(
            "error",
            this.state.translation.Alert.Error.SomethingWentWrongTitle,
            this.state.translation.Alert.Error.SaveDataErrorDescription
          );
        });
    }
  };

  doSubscribe = async () => {
    console.log("do subscribe");
    let user = await getUserInfo();
    if (user) {
      createOrUpdateData(`users/${user.uid}`, { emailSubscription: true })
        .then(() => {
          console.log("Operation successful");
          showAlert(
            "success",
            this.state.translation.Alert.Success.SubscribeTitle,
            this.state.translation.Alert.Success.SubsribeDescription +
              user.email
          );
          this.setState({
            showSubscribeDisplay: false,
          });
          this.loadData();
        })
        //save the data into the local storage when save to cloud is failed
        .catch((error) => {
          console.error("Operation failed:", error);
          this.setState({
            showSubscribeDisplay: false,
          });
          showAlert(
            "error",
            this.state.translation.Alert.Error.SomethingWentWrongTitle,
            this.state.translation.Alert.Error.SaveDataErrorDescription
          );
        });
    }
  };

  renderManageSubscriptionsDisplay() {
    let emailSubscription = this.state.emailSubscription;
    
    const textStyles = {
      fontSize: '18px',
    };
    
    const linkStyles = {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: blue[6],
    };
    
    return !this.state.emailVerified ? (
      <div>
        <p>{this.state.translation.HaventVerifyAccountYet}</p>
      </div>
    ) : (
      <div>
        {emailSubscription ? (
          <p style={{ ...textStyles, fontSize: '15px' }}>
            {this.state.translation.YouAreSubscibed} &emsp;{" "}
            <Popconfirm
              title={this.state.translation.Unsubscribe}
              okText={this.state.translation.Confirm}
              cancelText={this.state.translation.Cancel}
              onConfirm={this.doUnSubscribe}
            >
              <Text style={linkStyles}>
                {this.state.translation.Unsubscribe}
              </Text>
            </Popconfirm>
          </p>
        ) : (
          <p style={{ ...textStyles, fontSize: '15px' }}>
            {this.state.translation.WouldYouLikeToSubscribe} &emsp;{" "}
            <Popconfirm
              title={this.state.translation.Subscribe}
              okText={this.state.translation.Confirm}
              cancelText={this.state.translation.Cancel}
              onConfirm={this.doSubscribe}
            >
              <Text style={linkStyles}>
                {this.state.translation.Subscribe}
              </Text>
            </Popconfirm>
          </p>
        )}
      </div>
    );
  }

  infoWhetherInputPhone = () => {
    this.state.phoneNumber
      ? message.success("You have successfully logged your phone.")
      : message.error("You haven't log your phone number yet.");
  };

  doPhoneSubscribe = async () => {
    console.log("do phone subscribe");
    let user = await getUserInfo();
    if (user) {
      createOrUpdateData(`users/${user.uid}`, { phoneSubscription: true })
        .then(() => {
          console.log("Operation successful");
          showAlert(
            "success",
            this.state.translation.Alert.Success.SubscribeTitle,
            this.state.translation.Alert.Success.SubscribePhoneDesctiption +
              this.state.phoneNumber
          );
          this.loadData();
        })
        //save the data into the local storage when save to cloud is failed
        .catch((error) => {
          console.error("Operation failed:", error);
          this.setState({
            showSubscribeDisplay: false,
          });
          showAlert(
            "error",
            this.state.translation.Alert.Error.SomethingWentWrongTitle,
            this.state.translation.Alert.Error.SaveDataErrorDescription
          );
        });
    }
  };

  unDoPhoneSubscribe = async () => {
    console.log("undo phone subscribe");
    let user = await getUserInfo();
    if (user) {
      createOrUpdateData(`users/${user.uid}`, { phoneSubscription: false })
        .then(() => {
          console.log("Operation successful");
          showAlert(
            "success",
            this.state.translation.Alert.Success.UnsubscribeTitle,
            this.state.translation.Alert.Success.UnsubscribePhoneDesctiption +
              this.state.phoneNumber
          );
          this.loadData();
        })
        //save the data into the local storage when save to cloud is failed
        .catch((error) => {
          console.error("Operation failed:", error);
          this.setState({
            showSubscribeDisplay: false,
          });
          showAlert(
            "error",
            this.state.translation.Alert.Error.SomethingWentWrongTitle,
            this.state.translation.Alert.Error.SaveDataErrorDescription
          );
        });
    }
  };

  renderManagePhoneSubscriptionDisplay() {
  
    const textStyles = {
      fontSize: '18px',
    };
    
    const linkStyles = {
      cursor: 'pointer',
      textDecoration: 'underline',
      color: blue[6],
    };
    
    return (
      <div>
        {this.state.phoneSubscription ? (
          <div>
            <p style={{ ...textStyles, fontSize: '15px' }}>
              {this.state.translation.YouAreSubscribedForPhone}&emsp;{" "}
              <Popconfirm
                title={this.state.translation.Unsubscribe}
                okText={this.state.translation.Confirm}
                cancelText={this.state.translation.Cancel}
                onConfirm={this.unDoPhoneSubscribe}
              >
                <Text style={linkStyles}>
                  {this.state.translation.Unsubscribe}
                </Text>
              </Popconfirm>
            </p>
          </div>
        ) : (
          <div>
            <p style={{ ...textStyles, fontSize: '15px' }}>
              {this.state.translation.WouldYouLikeSMSNotification}&emsp;{" "}
              <Popconfirm
                title={this.state.translation.Subscribe}
                okText={this.state.translation.Confirm}
                cancelText={this.state.translation.Cancel}
                onConfirm={this.doPhoneSubscribe}
              >
                <Text style={linkStyles}>
                  {this.state.translation.Subscribe}
                </Text>
              </Popconfirm>
            </p>
          </div>
        )}
      </div>
    );
  }

  updatePhoneNumber = async (e) => {
    if (
      this.state.startPhoneNumberToBeSubmit &&
      this.state.phoneNumberToBeSubmit
    ) {
      let phoneNumber =
        this.state.startPhoneNumberToBeSubmit +
        this.state.phoneNumberToBeSubmit;
      const isValidPhoneNumber = /^\d{11}$/.test(phoneNumber);
      if (isValidPhoneNumber) {
        if (!(this.state.phoneNumber === "+" + phoneNumber)) {
          console.log("Phone number is valid.");
          let user = await getUserInfo();
          if (user) {
            createOrUpdateData(`users/${user.uid}`, {
              phoneNumber: "+" + phoneNumber,
            })
              .then(() => {
                console.log("Operation successful");
                showAlert(
                  "success",
                  this.state.translation.Alert.Success.UpdatePhoneSuccessTitle,
                  this.state.translation.Alert.Success.UpdatePhoneSuccessTitle +
                    ": " +
                    phoneNumber
                );
                this.setState({ openEditPhone: false });
                this.loadData();
              })
              //save the data into the local storage when save to cloud is failed
              .catch((error) => {
                console.error("Operation failed:", error);
                showAlert(
                  "error",
                  this.state.translation.Alert.Error.SomethingWentWrongTitle,
                  this.state.translation.Alert.Error.SaveDataErrorDescription
                );
              });
          } else {
            showAlert(
              "error",
              this.state.translation.Alert.Error.SomethingWentWrongTitle,
              this.state.translation.Alert.Error.SomethingWentWrongTitle
            );
          }
        } else {
          console.log("Duplicate phone number");
          showAlert(
            "error",
            this.state.translation.Alert.Error.DuplicatePhoneNumberTitle,
            this.state.translation.Alert.Error.DuplicatePhoneNumberDescription
          );
        }
      } else {
        console.log("Phone number is invalid.");
        showAlert(
          "error",
          this.state.translation.Alert.Error.SomethingWentWrongTitle,
          this.state.translation.Alert.Error.InvalidPhoneNumber
        );
      }
    }
  };

  handlePhoneNumberInputKeyPress(e) {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (!/\d/.test(keyValue)) e.preventDefault();
  }

  // 渲染添加手机号显示
  renderAddPhoneNumberDisplay(placeHolder = this.state.translation.NoPhoneFound) {
  
    return (
      <Space
        style={{
          width: '100%',
        }}
      >
        <Input
          placeholder={placeHolder}
          addonBefore={
            <Select
              style={{
                width: 70,
              }}
              defaultValue={this.state.startPhoneNumberToBeSubmit}
              onChange={(value) =>
                this.setState({ startPhoneNumberToBeSubmit: value })
              }
            >
              <Option value="61">+61</Option>
            </Select>
          }
          style={{
            width: '55%',
          }}
          onKeyPress={this.handlePhoneNumberInputKeyPress}
          onChange={(event) => {
            this.setState({ phoneNumberToBeSubmit: event.target.value });
          }}
        />
        <Popconfirm
          title={this.state.translation.UpdatePhoneNumber}
          okText={this.state.translation.Confirm}
          cancelText={this.state.translation.Cancel}
          onConfirm={this.updatePhoneNumber}
        >
          <Button 
            style={{
              backgroundColor: gray[6],
              color: gray[1],
              borderColor: gray[6],
            }}
          >
            {this.state.translation.Save}
          </Button>
        </Popconfirm>
      </Space>
    );
  }
  
  renderManagePhoneDisplay() {
    return this.state.phoneNumber
      ? this.renderManagePhoneSubscriptionDisplay()
      : this.renderAddPhoneNumberDisplay();
  }

  // 手机号未输入显示
  noPhoneDisplay() {
    return (
      <Row style={{ alignItems: 'center' }}>
        <div>
          <Typography.Text strong style={{ fontSize: 18 }}>
            {this.state.translation.PhoneNumber}
          </Typography.Text>
        </div>
        <div
          onClick={this.infoWhetherInputPhone}
          style={{
            marginLeft: '2%',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: volcano[6],
            color: gray[1],
            cursor: 'pointer'
          }}
        >
          <CloseOutlined style={{ fontSize: '10px' }} />
        </div>
        {!this.state.emailVerified ? (
          <Space style={{ width: '100%' }}>
            <div style={{ textAlign: 'left' }}>
              <Typography.Text type="warning">
                {this.state.translation.HaventVerifyAccountYetPhoneWarning}
              </Typography.Text>
            </div>
          </Space>
        ) : (
          this.renderManagePhoneDisplay()
        )}
      </Row>
    );
  }
  
  

  // 编辑手机号
  openEditPhone = () => {
    let current = this.state.openEditPhone;
    this.setState({
      openEditPhone: !current,
    });
  };

  // 手机号显示
  hasPhoneDisplay() {
    return (
      <Col style={{ width: '100%', marginBottom: '10px' }}>
        <Row style={{ alignItems: 'center', marginBottom: '10px' }}>
          <div>
            <Typography.Text strong style={{ fontSize: 18 }}>
              {this.state.translation.PhoneNumber} {this.state.phoneNumber}
            </Typography.Text>
          </div>
  
          <div
            onClick={this.infoWhetherInputPhone}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: green[6],
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              marginLeft: '10px'
            }}
          >
            <CheckOutlined style={{ color: gray[1], fontSize: '12px' }} />
          </div>
  
          <EditOutlined style={{ cursor: 'pointer', fontSize: '20px', marginLeft: '10px', color: gray[13] }} />
        </Row>
        {this.state.openEditPhone
          ? this.renderAddPhoneNumberDisplay(this.state.phoneNumber.substring(3))
          : null}
        {this.renderManagePhoneDisplay()}
      </Col>
    );
  }
  

  // 渲染手机号显示
  renderPhoneDisplay() {
    return this.state.phoneNumber
      ? this.hasPhoneDisplay()
      : this.noPhoneDisplay();
  }

  // profile的主要内容渲染
  renderMainView() {
    return (
      <Card 
        style={{ width: '100%', borderRadius: '10px' }}
        loading={this.state.loading}
      >
        {this.state.user && (
          <div>
            <Row style={{ justifyContent: 'flex-end', marginBottom: '10px' }}>
              <div 
                onClick={this.closeProfilePageFromIcon}
                style={{ cursor: 'pointer' }}
              >
                <CloseOutlined style={{ fontSize: '20px', color: gray[13] }} />
              </div>
            </Row>
            <Row style={{ marginBottom: '20px', textAlign: 'center' }}>
              <Typography.Title level={4}>
                {this.state.translation.ManageProfile}
              </Typography.Title>
            </Row>
            <div style={{ padding: '0 20px' }}>
              {this.renderUserNameDisplay()}
              {this.renderEmailDisplay()}
              {this.renderManageSubscriptionsDisplay()}
              {this.renderPhoneDisplay()}
            </div>
            {this.renderSignOutButton()}
          </div>
        )}
      </Card>
    );
  }
  
  
  render() {
    return (
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(3px)',
          
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex:1000
        }} 
        onClick={this.closeProfilePage}
      >
        {this.renderMainView()}
      </div>
    );
  }
 
 /* render() {
    return (
      <div className={profileStyle.cover} onClick={this.closeProfilePage}>
        {this.renderMainView()}
      </div>
    );
  }*/

}

export default withRouter(LanguageHelper(Profile));