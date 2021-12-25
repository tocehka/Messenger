import json

from aiohttp.web import json_response

from server.utils import create_hex_color
from server.consts import DOMAIN

async def login(request):
    data = await request.json()
    user_name = data["user_name"]

    user_info = {
        "user_name": user_name,
        "user_color": create_hex_color()
    }
    payload = json.dumps(user_info)

    resp = json_response(user_info)
    resp.set_cookie(
        name="user",
        value=payload,
        httponly=True,
        domain=DOMAIN,
        max_age=3600
    )

    return resp

async def auth(request):
    user_info = request.cookies["user"]
    payload = json.loads(user_info)

    return json_response(payload)