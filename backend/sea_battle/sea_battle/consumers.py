import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
import game.models
import auth_users.models


@sync_to_async
def get_prize(cell_id, user_id):
    print("get_prize")
    cell = game.models.Cell.objects.select_related("prize").get(id=cell_id)
    cell.used = True
    user = auth_users.models.User.objects.get(id=user_id)
    prize = cell.prize
    user.prizes.add(prize)
    user.save()
    cell.save()


@sync_to_async
def update_cell_in_database(cell_id):
    print("update_cell")
    cell = game.models.Cell.objects.get(id=cell_id)
    cell.used = True
    cell.save()


class CellConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connect")
        await self.accept()
        print(self.channel_layer)
        await self.channel_layer.group_add("group", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("group", self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("message") == "update_info" or data.get("message") == "modal_closed":
            data_to_send = {"sender_id": data["user_id"], "message": data["message"]}
        else:
            data_to_send = {"message": data["message"]}
        await self.send_group_message(data_to_send)

        # cell_id = message["cellId"]
        # if message["type"] == "update_cell":
        #     await self.update_cell_in_database(cell_id)
        #     await self.send_group_message()

        # elif message["type"] == "get_prize":
        #     await get_prize(cell_id, self.scope.get("user").id)


    async def update_cell_in_database(self, cell_id):
        await update_cell_in_database(cell_id)

    # async def update_clients(self, event=None):
    #     await self.channel_layer.group_send(
    #         "group",
    #         {
    #             "type": "update_clients",
    #         },
    #     )


    async def send_group_message(self, data_to_send):
        # Отправляем сообщение об обновлении всей группе
        print("SEND GROUP MESSAGE")
        await self.channel_layer.group_send(
            "group",
            {
                "type": "update_field",
                "data_to_send": data_to_send
            },
        )

    async def update_field(self, event):
        # Отправляем обновление всей группе
        data_to_send = event["data_to_send"]
        data_to_send["type"] = "update_field"
        await self.send(
            text_data=json.dumps(
                data_to_send
            )
        )


class NewGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print("connect")
        await self.accept()
        print(self.channel_layer)
        await self.channel_layer.group_add("group", self.channel_name)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("group", self.channel_name)

    async def receive(self, text_data):
        print("receive")
        data = json.loads(text_data)
        data_to_send = {"message": data["message"]}
        # if data.get("message") == "update_info" or data.get("message") == "modal_closed":
        #     data_to_send = {"sender_id": data["user_id"], "message": data["message"]}
        # else:
        #     data_to_send = {"message": data["message"]}
        await self.send_group_message(data_to_send)

        # cell_id = message["cellId"]
        # if message["type"] == "update_cell":
        #     await self.update_cell_in_database(cell_id)
        #     await self.send_group_message()

        # elif message["type"] == "get_prize":
        #     await get_prize(cell_id, self.scope.get("user").id)


    async def update_cell_in_database(self, cell_id):
        await update_cell_in_database(cell_id)

    # async def update_clients(self, event=None):
    #     await self.channel_layer.group_send(
    #         "group",
    #         {
    #             "type": "update_clients",
    #         },
    #     )


    async def send_group_message(self, data_to_send):
        # Отправляем сообщение об обновлении всей группе
        print("SEND GROUP MESSAGE")
        await self.channel_layer.group_send(
            "group",
            {
                "type": "update_field",
                "data_to_send": data_to_send
            },
        )

    async def update_field(self, event):
        # Отправляем обновление всей группе
        data_to_send = event["data_to_send"]
        data_to_send["type"] = "update_field"
        await self.send(
            text_data=json.dumps(
                data_to_send
            )
        )