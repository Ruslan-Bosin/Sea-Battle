import React from "react";
import { useState, useEffect } from "react";
import { Avatar, Typography, Space, Dropdown, message } from "antd"
import { UserOutlined, IdcardOutlined, MessageOutlined, LogoutOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import axios from 'axios';
const { Text } = Typography;

//Styles
const icon = {
  backgroundColor: '#91caff',
  color: '#003eb3',
  borderRadius: "5px",
}

function AccountButton() {

  /*
  Запрос GET (c token-ом)
  -> { title, avatar }
  */
  // 

  const navigate = useNavigate();

  const get_user_url = "http://127.0.0.1:8000/api/get_user";
  const [username, setUsername] = useState("");
  useEffect (() => {
    const access_token = (localStorage.getItem("accessToken") || "nothing");
    console.log(access_token);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    console.log(headers);
    axios.get(get_user_url, {headers}).then(response => {
      const response_data = response.data;
      console.log(response);
      console.log(response_data);
      setUsername(response_data.username);
    }).catch(error => {
      console.log(error);
    })
  }, [])
  const [isHover, setIsHover] = useState(false);
  const handleMouseEnter = () => { setIsHover(true); };
  const handleMouseLeave = () => { setIsHover(false); };

  const items = [
    {
      key: '1',
      label: "Настройки",
      icon: <IdcardOutlined />
    },
    {
      key: '2',
      label: "Поддержка",
      icon: <MessageOutlined />,
      disabled: false,
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: "Выход",
      icon: <LogoutOutlined />,
      danger: true,
    },
  ];

  const onClick = ({ key }) => {
    if (key === '1') {
      navigate("/admin/settings");
    } else if (key === '2') {
      navigate("/admin/support");
    }
  };

  //Styles with State
  const body_div = {
    margin: "8px",
    padding: "10px 20px",
    marginLeft: "auto",
    background: "#0505050F",
    opacity: isHover ? "80%" : "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
    msUserSelect: "none",
    MozUserSelect: "none",
    WebkitUserSelect: "none",
    msTouchSelect: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }

  // src={<img src={url} alt="avatar" />} for Avatar icon

  return (
    <Dropdown menu={{ items, onClick, }} trigger={['click']}>
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
        <Space>
            <Avatar icon={<UserOutlined/>} style={icon}/>
              {<Text>{ username }</Text>}
          </Space>
      </div>
    </Dropdown>
  );
}

export default AccountButton;