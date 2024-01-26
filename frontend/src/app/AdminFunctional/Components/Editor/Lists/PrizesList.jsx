import React from "react";
import { List, Avatar } from "antd"
import { CheckOutlined } from "@ant-design/icons"

function PrizesList(props) {

  // const fieldID = props.fieldID;

  const prizes_data = [
    {
      id: "id",
      title: 'Название приза',
      image_url: "",
      won: true
    },
    {
      id: "id",
      title: 'Название приза',
      image_url: "",
      won: false
    },
    {
      id: "id",
      title: 'Название приза',
      image_url: "",
      won: true
    },
    {
      id: "id",
      title: 'Название приза',
      image_url: "",
      won: true
    },
  ];

  return (
    <List itemLayout="horizontal" dataSource={prizes_data} renderItem={(item, index) => (
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