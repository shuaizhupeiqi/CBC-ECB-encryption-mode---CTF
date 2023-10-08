import { notification } from "antd";

const showAlert = (type, title, message) => {
  notification[type]({
    message: title,
    description: message,
  });
};

export default showAlert;
