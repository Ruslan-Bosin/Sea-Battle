import React from "react";
import { useState } from "react";
import { Avatar, Typography, Space, Dropdown } from "antd"
import { UserOutlined, IdcardOutlined, MessageOutlined, LogoutOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router-dom";
const { Text } = Typography;

//Styles
const icon = {
  backgroundColor: '#91caff',
  color: '#003eb3',
  borderRadius: "5px",
}

function AccountButton() {

  const navigate = useNavigate();

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
      disabled: true,
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
          <Avatar icon={<UserOutlined />} style={icon} />
          <Text>Название</Text>
        </Space>
      </div>
    </Dropdown>
  );
}

export default AccountButton;