import React from "react";
import { useState } from "react";
import { Alert, Card, Progress, Typography, Collapse, Button, Modal, Input } from "antd"
import ClientList from "./Lists/ClientsList";
import PrizesList from "./Lists/PrizesList";

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
const button = { width: "90%", margin: "0% 5%", marginBottom: "5%" }

function InfoViewer(props) {

  const editable = true;
  const fieldID = props.fieldID;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const showModal = () => { setIsModalOpen(true); };
  const handleCancel = () => { setIsModalOpen(false); };
  const handleOk = () => {

    console.log("Попробовать добавить пользователя и вывести message о результате");
    console.log(inputValue);

    setIsModalOpen(false);
    setInputValue("");
  };


  const collapse_items = useState([
    {
      key: '1',
      label: 'Пользователи',
      children: <ClientList fieldID={fieldID} />,
    },
    {
      key: '2',
      label: 'Призы',
      children: <PrizesList fieldID={fieldID} />,
    },
  ]);
  

  return (
    <div style={body_div}>
      {editable ?
        <Alert style={alert} message="Редактируйте!" description="Вы можете редактировать это поле. Пока не было произведено абсолютно никаких выстрелов." type="success" showIcon /> :
        <Alert style={alert} message="Игра идёт..." description="Пользователи уже производили выстрелы по полю. Поле больше нельзя редактировать" type="warning" showIcon />}
      <Card title="Статистика" style={alert}>
        <Progress style={progress} strokeColor="#ffc53d" percent={50} status="active" />
        <Text type="secondary" style={progress_title}>Промахов: 12</Text>
        <Progress style={progress} strokeColor="#ff4d4f" percent={10} status="active" />
        <Text type="secondary" style={progress_title}>Выиграно: 3</Text>
        <Progress style={progress} percent={80} status="active" />
        <Text type="secondary" style={progress_title}>Осталось: 7</Text>
      </Card>
      <Collapse style={alert} accordion items={collapse_items} />
      <Button style={button} type="dashed" onClick={showModal}>Добавить пользователя</Button>
      <Modal title="Добавление пользователя" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} cancelText="Отмена" okText="Добавить на поле">
        <Input addonBefore="@" placeholder="Идентификатор пользователя" value={inputValue} onChange={(event) => setInputValue(event.target.value)} />
      </Modal>
    </div>
  );
}

export default InfoViewer;