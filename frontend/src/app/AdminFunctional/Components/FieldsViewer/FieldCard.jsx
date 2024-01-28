import React from "react";
import { Card, Typography } from "antd";
// import { Image } from "antd";
import { GiftOutlined } from "@ant-design/icons"
import MiniField from "./MiniField";
const { Title, Text } = Typography;

//Styles
const body_div = {
  maxWidth: "248px"
}
const card_body_style = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: "20px"
}
const title = {
  textAlign: "center",
  marginTop: "15px",
  marginBottom: 0
}
const text = {
  textAlign: "center",
  fontSize: "10px"
}

const additional_info = {
  background: "#F5F5F5FF",
  padding: "10px 5px",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "5px",
  marginTop: "15px",
  borderRadius: "5px",
  fontSize: "10px"
}


function FieldCard({FieldName, Players, GiftOut, GiftMax}) {

  /*
  Запрос POST (c token-ом)
  { fieldId }
  -> (пример)
  {
      size: 4,
      editable: true,
      placements: [
        {
          coordinate: 1,
          status: "Empty"
        },
        {
          coordinate: 2,
          status: "Forbidden"
        },
        {
          coordinate: 3,
          status: "Empty"
        },
        {
          coordinate: 4,
          status: "Empty"
        },
        {
          coordinate: 5,
          status: "Forbidden"
        },
        {
          coordinate: 6,
          status: "Prize"
        },
        {
          coordinate: 7,
          status: "Forbidden"
        },
        {
          coordinate: 8,
          status: "Empty"
        },
        {
          coordinate: 9,
          status: "Prize"
        },
        {
          coordinate: 10,
          status: "Forbidden"
        },
        {
          coordinate: 11,
          status: "Empty"
        },
        {
          coordinate: 12,
          status: "Empty"
        },
        {
          coordinate: 13,
          status: "Empty"
        },
        {
          coordinate: 14,
          status: "Prize"
        },
        {
          coordinate: 15,
          status: "Prize"
        },
        {
          coordinate: 16,
          status: "Prize"
        },
      ]
    }
  */

  return (
    <div style={body_div}>
      <Card hoverable bodyStyle={card_body_style}>
        <MiniField/>
        <Title style={title} level={5} maxLength="2">{ FieldName }</Title>
        <Text type="secondary" style={text}>Количество игроков: { Players }</Text>
        <div style={additional_info}>
          Выбито: {GiftOut} из {GiftMax}<GiftOutlined />
        </div>
      </Card>
    </div>
  );
}

//   return (
//       <div style={body_div}>
//         <Card hoverable bodyStyle={card_body_style}>
//           <Image style={image} preview={false} src="" width="200px" height="200px" fallback={img_fallback}/>
//           <Title style={title} level={5} maxLength="2">{ FieldName }</Title>
//           <Text type="secondary" style={text} >Количество игроков: { Players }</Text>
//           <div style={additional_info}>
//             Выбито: {GiftOut} из {GiftMax}<GiftOutlined/>
//           </div>
//         </Card>
//       </div>
//   );
// }

export default FieldCard;
