import React, {useState, useEffect} from "react";
import { List, Avatar } from "antd"
import { CheckOutlined } from "@ant-design/icons"
import axios from "axios"

function PrizesList(props) {

  const fieldID = props.fieldID;
  console.log(fieldID);

  const [prizes_data, setPrizes_data] = useState([
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
  ]);

  const game_info_url = "http://127.0.0.1:8000/api/get_prizes_from_game";
  useEffect(() => {
    const access_token = (localStorage.getItem("accessToken") || "");
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + access_token,
    };
    const params = {
      'game': fieldID
    }
    axios.get(game_info_url, {params, headers})
    .then((response) => {
      const data = response.data;
      setPrizes_data(data)
      console.log(data);
    })
    .catch((error) => console.error('Error fetching data:', error));
    }, [])

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