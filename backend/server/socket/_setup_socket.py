from socketio import AsyncServer

from server.consts import ORIGINS


ROOM_NAME = "chat"

class UserStorage(dict):
    def get_list(self):
        return list(self.values())

async def configure_socket():
    user_storage = UserStorage()
    sio = AsyncServer(async_mode='aiohttp', 
                    cors_allowed_origins=[origin for origin in ORIGINS.split(",")])

    @sio.event
    async def connect(sid, environ):
        pass

    @sio.event
    async def join(sid, data):
        user_name = data["user_name"]
        user_color = data["user_color"]
        user_storage[sid] = data
        print(f"User {user_name} joined to chat")

        sio.enter_room(sid, ROOM_NAME)
        await sio.save_session(sid, {"user_name": user_name, "user_color": user_color})

        await sio.emit("users_online", data=user_storage.get_list(), room=ROOM_NAME,
                        broadcast=True, include_self=True)

    @sio.event
    async def send_message(sid, data):
        message = data["message"]
        async with sio.session(sid) as session:
            user_name = session["user_name"]
            user_color = session["user_color"]
            print(f"User {user_name} sent message {message}")

            await sio.emit(
                "broadcast_message", 
                data={"user_name": user_name, "user_color": user_color, "message": message},
                room=ROOM_NAME,
                broadcast=True, include_self=True
            )

    @sio.event
    async def disconnect(sid):
        async with sio.session(sid) as session:
            user_name = session["user_name"]
            print(f"User {user_name} disconnected")
            sio.leave_room(sid, ROOM_NAME)
            user_storage.pop(sid)

            await sio.emit("users_online", data=user_storage.get_list(), room=ROOM_NAME,
                        broadcast=True, include_self=True)

    return sio