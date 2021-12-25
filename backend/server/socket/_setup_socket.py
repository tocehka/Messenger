from socketio import AsyncServer

from server.consts import ORIGINS


ROOM_NAME = "chat"

class UserStorage(list):
    pass

async def configure_socket():
    user_storage = UserStorage()
    sio = AsyncServer(async_mode='aiohttp', 
                    cors_allowed_origins=[origin for origin in ORIGINS.split(",")])

    @sio.event
    async def connect(sid, environ, auth):
        print('New user connection', sid, environ, auth)

    @sio.event
    async def join(sid, data):
        user_name = data["user_name"]
        user_storage.append(user_name)
        print(f"User {user_name} joined to chat")

        sio.enter_room(sid, ROOM_NAME)
        await sio.save_session(sid, {"user_name": user_name})

        await sio.emit("users_online", data=user_storage, room=ROOM_NAME,
                        broadcast=True, include_self=True)

    @sio.event
    async def send_message(sid, data):
        message = data["message"]
        async with sio.session(sid) as session:
            user_name = session["user_name"]
            print(f"User {user_name} sent message {message}")

            await sio.emit(
                "broadcast_message", 
                data={"user_name": user_name, "message": message},
                room=ROOM_NAME,
                broadcast=True, include_self=True
            )

    @sio.event
    async def disconnect(sid):
        async with sio.session(sid) as session:
            user_name = session["user_name"]
            print(f"User {user_name} disconnected")
            sio.leave_room(sid, ROOM_NAME)
            user_storage.remove(user_name)

            await sio.emit("users_online", data=user_storage, room=ROOM_NAME,
                        broadcast=True, include_self=True)

    return sio