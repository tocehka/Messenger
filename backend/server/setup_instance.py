from os import environ
from dotenv import load_dotenv
load_dotenv()

from aiohttp import web
import aiohttp_cors

from server.middlewares import auth_middleware
from server.routes import auth
from server.consts import ORIGINS
from server.socket import configure_socket

async def attaching_cofigure_socket(app):
    socket = await configure_socket()
    socket.attach(app)
    print("socketio application was configured successfully")

def setup_server_instance():
    app = web.Application(middlewares=[auth_middleware])
    app.add_routes([
        web.post("/login", auth.login),
        web.get("/auth", auth.auth)
    ])
    app.on_startup.append(attaching_cofigure_socket)

    cors_accept = aiohttp_cors.ResourceOptions(
                    allow_credentials=True,
                    expose_headers="*",
                    allow_methods="*",
                    allow_headers="*",
                )
    defaults = {origin: cors_accept for origin in ORIGINS.split(",")}
    cors = aiohttp_cors.setup(app, defaults=defaults)
    for route in list(app.router.routes()):
        cors.add(route)
    print("aiohttp application was configured successfully")
    return app
