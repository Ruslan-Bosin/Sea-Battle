import React, { useState, useEffect } from "react";
import { List, Avatar } from "antd"
import { CheckOutlined } from "@ant-design/icons"

function PrizesList(props) {

  const fieldID = props.fieldID;

  return (
    <List itemLayout="horizontal" dataSource={props.data.prizes} renderItem={(item, index) => (
      <List.Item actions={[item.won ? <CheckOutlined /> : <></>]}>
        <List.Item.Meta
          avatar={<Avatar shape="square" src={item.image_url} />}
          title={item.title}
        />
      </List.Item>
    )} />
  );
}

export default PrizesList;
