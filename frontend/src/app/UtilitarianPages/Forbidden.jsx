import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function Forbidden() {

  const navigate = useNavigate();

  return (
    <Result
      status="403"
      title="403"
      subTitle="К сожалению, у вас нет прав для доступа к этой странице."
      extra={<Button onClick={() => { navigate("/") }} type="primary">На главную</Button>}
    />
  );
};

export default Forbidden;
