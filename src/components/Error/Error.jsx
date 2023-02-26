import React from "react";
import { Alert } from "antd";

function ErrorIndicator() {
  return (
    <Alert message="Что-то пошло не так, но мы уже работаем над этим!" type="error" showIcon />
  );
}

export default ErrorIndicator;
