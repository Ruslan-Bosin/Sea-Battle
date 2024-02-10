import React from "react";
import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

function Unauthorised() {

  const navigate = useNavigate();

  return (
    <Result
      status="401"
      title="401"
      subTitle="К сожалению, у вас нет прав для доступа к этой странице."
      extra={<Button onClick={() => { navigate("/") }} type="primary">На главную</Button>}
    />
  );
};

export default Unauthorised;
