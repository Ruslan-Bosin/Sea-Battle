import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function NotFound() {

  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="К сожалению, страница, которую вы посетили, не существует."
      extra={<Button onClick={() => { navigate("/") }} type="primary">На главную</Button>}
    />
  );
};

export default NotFound;
