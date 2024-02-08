import React from "react";
import { useEffect, useState } from "react";
import { AimOutlined, } from "@ant-design/icons";
import { Tooltip, Modal, Typography, Progress, Image, message } from "antd";
import axios from "axios";
const { Text, Paragraph } = Typography;

const img_fallback = "data:image/png;base64,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"

// Styles
const timer_modal = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px"
}

function UnknownCell(props) {

  const [modal, contextHolder] = Modal.useModal();

  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };

  const get_shots_url = "http://127.0.0.1:8000/api/get_shots/";
  const updateQuantityUrl = "http://127.0.0.1:8000/api/update_quantity/";
  const get_prize_url = "http://127.0.0.1:8000/api/get_prize/";

  const access_token = localStorage.getItem("accessToken") || "";
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + access_token,
  };


  // Styles with state
  const body_div = {
    background: (isHover ? "#F5F5F5FF" : "#0505050F"),
    borderRadius: "10px",
    padding: "5px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }

  const aim_icon = {
    transform: (isHover ? "scale(1.2)" : "scale(1)"),
    transition: "all 0.2s ease-in-out"
  }


  const shootClicked = () => {
    console.log(props.fieldID)
    console.log(props.coordinate)
    axios.get(get_shots_url, {
      headers: headers,
      params: {
        game_id: props.fieldID,
      },
    })
    .then(response => {
      if (response.data.total_shots === 0) {
        message.error("У вас закончились выстрелы...");
      return;
    }

      let secondsToGo_initial = 5;
      let secondsToGo = secondsToGo_initial;
      const instance = modal.info({
        centered: true,
        footer: null,
        icon: null,
        title: 'Заряжаем выстрел!',
        closeIcon: true,
        closable: true,
        destroyOnClose: true,
        afterClose: () => { if (secondsToGo === -1) { check_prize() } },
        content: <div style={timer_modal}>
          <Progress type="circle" percent={100 * ((secondsToGo_initial - secondsToGo) / secondsToGo_initial)} />
          <Text>Выстрел будет произведён через {secondsToGo} сек.</Text>
        </div>,
      });
      const timer = setInterval(() => {
        secondsToGo -= 1;
        instance.update({
          content: <div style={timer_modal}>
            <Progress type="circle" percent={100 * ((secondsToGo_initial - secondsToGo) / secondsToGo_initial)} />
            <Text>Выстрел будет произведён через {secondsToGo} сек.</Text>
          </div>,
        });
      }, 1000);
      setTimeout(() => {
        clearInterval(timer);
        instance.destroy();
      }, (secondsToGo + 1) * 1000);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });


  };

  const check_prize = () => {
      axios.post(
        updateQuantityUrl,
        { game_id: props.fieldID, coord: props.coordinate},
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token,
          },
        }
      )
      .then(response => {
      const { prize_name, prize_title, error } = response.data;
      console.log(prize_name);
      console.log(prize_title);

      if (prize_name && prize_title) {
        modal.success({
          centered: true,
          title: 'Победа!',
          width: "50%",
          closeIcon: true,
          closable: true,
          destroyOnClose: true,
          content: <div style={{ display: "flex", flexDirection: "column" }}>
            <Text>Вы выиграли: <Text strong>{prize_name}</Text></Text>
            <Image style={{ objectFit: "cover", aspectRatio: "3 / 2" }} preview={true} src="https://kinonews.ru/insimgs/2022/shotimg/shotimg110875_24.jpg" width="100%" fallback={img_fallback} />
            <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'покказать всё' }} type="secondary"><Text type="default">Описание: </Text>{prize_title}</Paragraph>
          </div>,
        });
      } else {
        modal.error({
          centered: true,
          title: 'Промах!',
          width: "50%",
          closeIcon: true,
          closable: true,
          destroyOnClose: true,
          content: <div style={{ display: "flex", flexDirection: "column" }}>
            <Text>В этот раз вам не повезло 😔...<br />Попробуйте ещё раз!</Text>
          </div>,
        });
      }})
  .catch(error => {
    console.error('Error updating quantity:', error);
  });
  };

  return (
    <>
      <Tooltip title="Нажмите чтобы сделать выстрел">
        <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={shootClicked}>
          <AimOutlined style={aim_icon} />
        </div>
      </Tooltip>
      {contextHolder}
    </>
  );
}

export default UnknownCell;