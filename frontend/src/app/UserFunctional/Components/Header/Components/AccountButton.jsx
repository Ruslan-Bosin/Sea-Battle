import React, {useEffect} from "react";
import { useState } from "react";
import { Avatar, Typography, Space, Dropdown } from "antd"
import { UserOutlined, IdcardOutlined, MessageOutlined, LogoutOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
import axios from "../../../../Services/axios-config"
const { Text } = Typography;

//Styles
const icon = {
  backgroundColor: '#91caff',
  color: '#003eb3',
  borderRadius: "5px",
}

function AccountButton() {

  const navigate = useNavigate();

  const get_user_url = "http://127.0.0.1:8000/api/get_user";
  const [username, setUsername] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  useEffect (() => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    axios.get(get_user_url, {headers}).then(response => {
      const response_data = response.data;
      setUsername(response_data.username);
      setImageUrl(response.data.avatar);
      console.log(response.data);
    }).catch(error => {
      if (error.message === "refresh failed") {
        navigate(error.loginUrl);
      } else {
        console.error("Error: ", error);
      }
    })
  })
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
      navigate("/user/settings");
    } else if (key === '2') {
      navigate("/user/support");
    } else if (key == '3') {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role")
      navigate("/userauth/login");
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

  const limitText = (text) => {
    if (text.length >= 15) {
      return text.substr(0, 15) + "...";
    } else { return text }
  }

  return (
    <Dropdown menu={{ items, onClick, }} trigger={['click']}>
      <div style={body_div} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} >
        <Space>
            {(imageUrl === "") ? (<Avatar icon={<UserOutlined/>} style={icon}/>): (<Avatar src={<img src={imageUrl} alt="avatar" />} style={icon}/>)}
              {<Text>{ limitText(username) }</Text>}
          </Space>
      </div>
    </Dropdown>
  );
}

export default AccountButton;