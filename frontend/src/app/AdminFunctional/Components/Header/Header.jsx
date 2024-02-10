import React from "react";
import HeaderTab from "./Components/HeaderTab";
import AccountButton from "./Components/AccountButton";
import LogoSpace from "./Components/LogoSpace";


//Styles
const body_div = {
  width: "100%",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  background: "white",
  boxShadow: "0 0px 20px 3px rgba(0, 0, 0, 0.15)",
  zIndex: 2
}

function Header(props) {

  return (
    <div style={body_div}>
      <LogoSpace />
      <HeaderTab tabIndex={1} selected={props.selectedTab === 1} title="Создать Поле" />
      <HeaderTab tabIndex={2} selected={props.selectedTab === 2} title="Все Поля" />
      {props.showEditorTab ? <HeaderTab tabIndex={3} selected={props.selectedTab === 3} title="Редактор" /> : <></>}
      <HeaderTab tabIndex={4} selected={props.selectedTab === 4} title="Призы" />
      <AccountButton />
    </div>
  );
}

export default Header;