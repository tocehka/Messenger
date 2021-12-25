import React, {useEffect, useReducer, useRef, useState} from "react";
import io from "socket.io-client";
import {useAuth} from "../hooks/AuthHook";

const reducer = (state, action) => {
    switch (action.type) {
        case "append_message":
            return [...state, action.value]
            
        default:
            return state;
    }
}

const Chat = () => {
    const socketRef = useRef(null);
    const {user} = useAuth();

    const [users, setUsers] = useState([]);
    const [messages, dispatch] = useReducer(reducer, []);
    console.log(user)

    useEffect(() => {
        const client = io(process.env.REACT_APP_API_ROOT, {
            withCredentials: true
        })

        client.emit("join", {
            user_name: user.user_name, 
            user_color: user.user_color
        })

        client.on("users_online", (data) => {
            setUsers(data)
        })

        client.on("broadcast_message", (data) => {
            dispatch({type: "append_message", value: data})
        })
        

        socketRef.current = client;

        return () => {
            socketRef.current.close();
        }
    }, [])

    return (
        <div>
            
        </div>
    )
}

export default Chat