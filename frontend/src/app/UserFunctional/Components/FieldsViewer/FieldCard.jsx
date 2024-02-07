import React from "react";
import { Card, Typography } from "antd";
import { GiftOutlined } from "@ant-design/icons"
import MiniField from "./MiniField";
const { Title, Text } = Typography;

//Styles
const body_div = {
  maxWidth: "248px"
}
const card_body_style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "20px"
}
const title = {
  textAlign: "center",
  marginTop: "15px",
  marginBottom: 0
}
const text = {
  textAlign: "center",
  fontSize: "10px"
}

const additional_info = {
  background: "#F5F5F5FF",
  padding: "10px 5px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  marginTop: "15px",
  borderRadius: "5px",
  fontSize: "10px"
}


function FieldCard({FieldName, Shots, PrizesMax, PrizesOut}) {

  return (
    <div style={body_div}>
      <Card hoverable bodyStyle={card_body_style}>
        <MiniField/>
        <Title style={title} level={5} maxLength="2">{ FieldName }</Title>
        <Text type="secondary" style={text} > Осталось шотов: { Shots } </Text>
        <div style={additional_info}>
          Осталось призов: { PrizesMax - PrizesOut } из { PrizesMax }<GiftOutlined />
        </div>
      </Card>
    </div>
  );
}

export default FieldCard;
