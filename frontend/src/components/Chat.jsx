import React, {useEffect, useReducer, useRef, useState} from "react";
import io from "socket.io-client";
import {useAuth} from "../hooks/AuthHook";

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';

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
    const messagesEndRef = useRef(null);
    const {user} = useAuth();

    const [users, setUsers] = useState([]);
    const [myMessage, setMyMessage] = useState("");
    const [messages, dispatch] = useReducer(reducer, []);
    console.log(user)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages]);

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

    const sendMessage = () => {
        if (myMessage === "") {
            return
        }
        socketRef.current.emit("send_message", {message: myMessage})
        setMyMessage("");
    }

    const onPressSend = e => {
        if (e.key === "Enter") {
            sendMessage();
        }
        
    }

    return (
        <div className="chat-window">
            <div style={{borderBottom: "1px solid black", position: "fixed", top: 0, right: 0, width: "100%", fontSize: "24px"}}>Users in chat: {users.length}</div>
            <div style={{marginTop: "20px", height: "88vh", overflowY: "auto", overflowX: "hidden", width: "90vw"}}>
            <Stack spacing={2}>
                {messages.map((message_info, inx) => {
                    let meIndicator = (message_info.user_color === user.user_color && message_info.user_name === user.user_name);
                    return <div style={{border: "1px solid black", width: "90%"}} key={inx}>
                        <span style={{color: message_info.user_color}}><b>{message_info.user_name}</b>{meIndicator && "(It is you)"}</span>
                        <p>{message_info.message}</p>
                    </div>
                })}
                <div ref={messagesEndRef} />
            </Stack>
            </div>
            <div style={{borderTop: "1px solid black", position: "fixed", bottom: 0, right: 0, width: "100%"}}>
                <Stack style={{padding: "10px"}} direction="row" spacing={2}>
                    <TextField fullWidth value={myMessage} variant="outlined"
                        onChange={e => setMyMessage(e.target.value)}
                        onKeyPress={e => onPressSend(e)}
                    />
                    <Button style={{borderRadius: "50%"}} variant="contained" 
                    onClick={() => sendMessage()}><SendIcon /></Button>
                </Stack>
            </div>
        </div>
    )
}

export default Chat