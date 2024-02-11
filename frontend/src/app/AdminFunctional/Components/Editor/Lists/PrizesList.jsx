import React, { useState, useEffect } from "react";
import { List, Avatar } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import NoData from "../../FieldsViewer/NoData";

function PrizesList(props) {

  return (
    <>
      {(props.data.prizes.length === 0) ? (<NoData text="Нет призов" />) : (
        <List itemLayout="horizontal" dataSource={props.data.prizes} renderItem={(item, index) => (
          <List.Item actions={[item.won ? <CheckOutlined /> : <></>]}>
            <List.Item.Meta
              avatar={<Avatar shape="square" src={item.image_url} style={{ background: "#F5F5F5FF" }} />}
              title={item.title}
            />
          </List.Item>
        )} />
      )}
    </>
  );
}

export default PrizesList;
