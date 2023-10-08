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
} from "antd";
import {
  LoginOutlined,
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
} from "@ant-design/icons";
import settingPageStyle from "../styles/SettingPage.module.css";
import profileStyle from "../styles/Profile.module.css";
import generalStyle from "../styles/GeneralComponent.module.css";

import LoadingCard from "./../components/LoadingCard";
import { getUserInfo } from "../helpers/authHelper";
import showAlert from "./../components/Notification";
import { createOrUpdateData, readData } from "../helpers/dataHelper";

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
            id={settingPageStyle.loginSignUpbutton}
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
          <p className={profileStyle.text}>
            <strong>{this.state.translation.UserName}:</strong>{" "}
            {user.displayName}
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
      <Row id={profileStyle.emailDiv}>
        <p className={profileStyle.text}>
          <strong>{this.state.translation.Email}:</strong>{" "}
          {this.state.user.email}{" "}
        </p>
        <div
          onClick={this.infoWhetherIsVerified}
          className={`${profileStyle.verifiedIconDiv} ${
            this.state.emailVerified
              ? profileStyle.verifiedDivClass
              : profileStyle.notVerifiedDivClass
          }`}
        >
          {this.state.emailVerified ? (
            <CheckOutlined className={profileStyle.icon} />
          ) : (
            <CloseOutlined className={profileStyle.icon} />
          )}
        </div>
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
    return !this.state.emailVerified ? (
      <div>
        <p>{this.state.translation.HaventVerifyAccountYet}</p>
      </div>
    ) : (
      <div>
        {emailSubscription ? (
          <p
            className={`${profileStyle.text} ${profileStyle.areSubsribedText}`}
          >
            {this.state.translation.YouAreSubscibed} &emsp;{" "}
            <Popconfirm
              title={this.state.translation.Unsubscribe}
              description={this.state.translation.AreYouSureToUnsubscribe}
              okText={this.state.translation.Confirm}
              cancelText={this.state.translation.Cancel}
              onConfirm={this.doUnSubscribe}
            >
              <span className={profileStyle.link}>
                {this.state.translation.Unsubscribe}
              </span>
            </Popconfirm>
          </p>
        ) : (
          <p
            className={`${profileStyle.text} ${profileStyle.areSubsribedText}`}
          >
            {this.state.translation.WouldYouLikeToSubscribe}&emsp;{" "}
            <Popconfirm
              title={this.state.translation.Subscribe}
              description={this.state.translation.AreYouSureToSubscribe}
              okText={this.state.translation.Confirm}
              cancelText={this.state.translation.Cancel}
              onConfirm={this.doSubscribe}
            >
              <span className={profileStyle.link}>
                {this.state.translation.Subscribe}
              </span>
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
    return (
      <div>
        {this.state.phoneSubscription ? (
          <div>
            <p
              className={`${profileStyle.text} ${profileStyle.areSubsribedText}`}
            >
              {this.state.translation.YouAreSubscribedForPhone}&emsp;{" "}
              <Popconfirm
                title={this.state.translation.Unsubscribe}
                description={this.state.translation.AreYouSureToUnsubscribeSMS}
                okText={this.state.translation.Confirm}
                cancelText={this.state.translation.Cancel}
                onConfirm={this.unDoPhoneSubscribe}
              >
                <span className={profileStyle.link}>
                  {this.state.translation.Unsubscribe}
                </span>
              </Popconfirm>
            </p>
          </div>
        ) : (
          <div>
            <p
              className={`${profileStyle.text} ${profileStyle.areSubsribedText}`}
            >
              {this.state.translation.WouldYouLikeSMSNotification}&emsp;{" "}
              <Popconfirm
                title={this.state.translation.Subscribe}
                description={this.state.translation.AreYouSureToSubscribeSMS}
                okText={this.state.translation.Confirm}
                cancelText={this.state.translation.Cancel}
                onConfirm={this.doPhoneSubscribe}
              >
                <span className={profileStyle.link}>
                  {this.state.translation.Subscribe}
                </span>
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

  renderAddPhoneNumberDisplay(
    placeHolder = this.state.translation.NoPhoneFound
  ) {
    return (
      <Space.Compact
        style={{
          width: "100%",
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
              {/* <Option value="86">+86</Option>
              <Option value="87">+87</Option> */}
            </Select>
          }
          style={{
            width: "55%",
          }}
          onKeyPress={this.handlePhoneNumberInputKeyPress}
          onChange={(event) => {
            this.setState({ phoneNumberToBeSubmit: event.target.value });
          }}
        />
        <Popconfirm
          title={this.state.translation.UpdatePhoneNumber}
          description={
            this.state.translation.AreYouSureToUpdatePhoneNumber +
            this.state.startPhoneNumberToBeSubmit +
            this.state.phoneNumberToBeSubmit +
            " ?"
          }
          okText={this.state.translation.Confirm}
          cancelText={this.state.translation.Cancel}
          onConfirm={this.updatePhoneNumber}
        >
          <Button className={generalStyle.greyButton}>
            {this.state.translation.Save}
          </Button>
        </Popconfirm>
      </Space.Compact>
    );
  }

  renderManagePhoneDisplay() {
    return this.state.phoneNumber
      ? this.renderManagePhoneSubscriptionDisplay()
      : this.renderAddPhoneNumberDisplay();
  }

  noPhoneDisplay() {
    return (
      <Row id={profileStyle.phoneDiv}>
        <div>
          <p className={profileStyle.text}>
            <strong>{this.state.translation.PhoneNumber}</strong>{" "}
          </p>
        </div>
        <div
          onClick={this.infoWhetherInputPhone}
          className={`${profileStyle.verifiedIconDiv} ${profileStyle.notVerifiedDivClass}`}
        >
          <CloseOutlined className={profileStyle.icon} />
        </div>
        {!this.state.emailVerified ? (
          <Space.Compact
            style={{
              width: "100%",
            }}
          >
            {" "}
            <div id={profileStyle.emailNotVerifiedPhoneWarningDiv}>
              <p>{this.state.translation.HaventVerifyAccountYetPhoneWarning}</p>
            </div>
          </Space.Compact>
        ) : (
          this.renderManagePhoneDisplay()
        )}
      </Row>
    );
  }

  openEditPhone = () => {
    let current = this.state.openEditPhone;
    this.setState({
      openEditPhone: !current,
    });
  };

  hasPhoneDisplay() {
    return (
      <Col>
        <Row id={profileStyle.phoneDiv}>
          <div>
            <p className={profileStyle.text}>
              <strong>{this.state.translation.PhoneNumber}</strong>{" "}
              {this.state.phoneNumber}
            </p>
          </div>

          <div
            onClick={this.infoWhetherInputPhone}
            className={`${profileStyle.verifiedIconDiv} ${profileStyle.verifiedDivClass}`}
          >
            <CheckOutlined className={profileStyle.icon} />
          </div>

          <EditOutlined
            onClick={this.openEditPhone}
            className={profileStyle.editIcon}
          />
        </Row>
        {this.state.openEditPhone
          ? this.renderAddPhoneNumberDisplay(
              this.state.phoneNumber.substring(3)
            )
          : null}
        {this.renderManagePhoneDisplay()}
      </Col>
    );
  }

  renderPhoneDisplay() {
    return this.state.phoneNumber
      ? this.hasPhoneDisplay()
      : this.noPhoneDisplay();
  }

  renderMainView() {
    return (
      <div className={profileStyle.validationCard}>
        {this.state.loading ? (
          <LoadingCard />
        ) : this.state.user ? (
          <div>
            <div id={profileStyle.closeProfilePageIconRow}>
              <div
                onClick={this.closeProfilePageFromIcon}
                id={profileStyle.closeProfilePageIconDiv}
              >
                <CloseOutlined
                  className={profileStyle.icon}
                  id={profileStyle.closeProfilePageIcon}
                />
              </div>
            </div>
            <Row id={profileStyle.manageProfileTitle}>
              <div>
                <p>{this.state.translation.ManageProfile}</p>
              </div>
            </Row>
            <div id={profileStyle.mainSubDiv}>
              {this.renderUserNameDisplay()}
              {this.renderEmailDisplay()}
              {this.renderManageSubscriptionsDisplay()}
              {this.renderPhoneDisplay()}
            </div>
            {this.renderSignOutButton()}
          </div>
        ) : null}
      </div>
    );
  }

  render() {
    return (
      <div className={profileStyle.cover} onClick={this.closeProfilePage}>
        {this.renderMainView()}
      </div>
    );
  }
}

export default withRouter(LanguageHelper(Profile));
