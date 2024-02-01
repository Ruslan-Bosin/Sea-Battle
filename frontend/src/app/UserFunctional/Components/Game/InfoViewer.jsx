import React from "react";
import { useState } from "react";
import { UnorderedListOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Segmented, Card, Progress, Typography } from "antd";
import AllPrizesList from "./Lists/AllPrizesList"
import MyPrizesList from "./Lists/MyPrizesList";


const { Text } = Typography;

// Styles
const body_div = {
  background: "white",
  minWidth: "250px",
  maxWidth: "400px",
  flexGrow: 1,
  height: "100%",
  boxShadow: "0 0px 30px 3px rgba(0, 0, 0, 0.05)",
  borderRadius: "20px",
  overflowY: "scroll"

}

const alert = { margin: "5%" };
const progress = { marginBottom: "0px" };
const progress_title = { fontSize: "10px" };
const two_sides = { display: "flex", justifyContent: "space-between", flexWrap: "wrap" }
const shoots_count = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#F5F5F5FF",
  borderRadius: "10px",
  padding: "10px",
  marginTop: "15px"
}

function InfoViewer(props) {

  // const fieldID = props.fieldID;

  const [tab, setTab] = useState("all");

  return (
    <div style={body_div}>

      <Card title="Поле" style={alert}>

        <div style={two_sides}>
          <Text>Название: </Text>
          <Text strong>Название поля</Text>
        </div>

        <div style={two_sides}>
          <Text type="secondary">Принадлежит: </Text>
          <Text type="secondary" strong>Название</Text>
        </div>

        <div style={shoots_count}>
          <Text>Выстрелов: <Text keyboard>21</Text></Text>
        </div>

      </Card>

      <Card title="Статистика" style={alert}>
        <Progress style={progress} strokeColor="#52c41a" percent={10} status="active" />
        <Text type="secondary" style={progress_title}>Вы выиграли: 3</Text>
        <Progress style={progress} percent={80} status="active" />
        <Text type="secondary" style={progress_title}>Целых: 7</Text>
      </Card>

      <Card title="Призы" style={alert}>
        <Segmented onChange={(value) => setTab(value)} block options={[{ label: 'Все', value: 'all', icon: <UnorderedListOutlined /> }, { label: 'Мои', value: 'mine', icon: <ShoppingOutlined /> },]} />
        {(tab === "all") ? <AllPrizesList /> : <MyPrizesList />}

      </Card>

    </div>
  );
}

export default InfoViewer;