import React, {useEffect, useReducer, useRef, useState} from "react";
import io from "socket.io-client";
import {useAuth} from "../hooks/AuthHook";

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// import BottomNavigation from '@mui/material/BottomNavigation';
import Paper from '@mui/material/Paper';

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
        // <div className="chat-window">
        <Box sx={{ flexGrow: 1, maxWidth: "auto" }}>
            {/* <div style={{borderBottom: "1px solid black", position: "fixed", top: 0, right: 0, width: "100%", fontSize: "24px"}}>Users in chat: {users.length}</div> */}
            <Grid container spacing={0}>
                <Grid item xs={6} md={3}>
                    <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
                        Users online ({users.length})
                    </Typography>
                    <List style={{overflow: 'auto', maxHeight: "75vh"}}>
                        {users.map((_user, inx) => {
                            let meIndicator = (_user.user_color === user.user_color && _user.user_name === user.user_name);
                            return <ListItem key={inx}>
                                <ListItemAvatar>
                                    <div style={{backgroundColor: _user.user_color, width: "50px", height: "50px"}}></div>
                                </ListItemAvatar>
                                <ListItemText style={{color: _user.user_color}}
                                    primary={_user.user_name + (meIndicator ? " (You)" : "")}
                                />
                            </ListItem>
                        })}
                    </List>
                </Grid>
            
            {/* <div style={{marginTop: "20px", overflowY: "auto", overflowX: "none", display: "flex",
            flexDirection: "row", justifyContent: "center"}}> */}
                <Grid item xs={24} md={8} pb={7}>
                    <Typography sx={{ mt: 1, mb: 4 }} variant="h6" component="div">
                        Messenger
                    </Typography>
                    <List style={{overflow: 'auto', maxHeight: "75vh"}}>
                        {messages.map((message_info, inx) => {
                            let meIndicator = (message_info.user_color === user.user_color && message_info.user_name === user.user_name);
                            return <ListItem key={inx}>
                                {/* <ListItemAvatar>
                                    <span style={{color: message_info.user_color}}><b>{message_info.user_name}</b> {meIndicator && "(You)"}</span>
                                </ListItemAvatar> */}
                                <ListItemText
                                align={meIndicator ? "right" : "left"}
                                    primary={
                                        <React.Fragment>
                                          <Typography
                                            sx={{ display: 'inline'}}
                                            component="span"
                                            variant="body2"
                                            
                                            color={message_info.user_color}
                                          >
                                            <b>{message_info.user_name}</b> {meIndicator && "(You)"}
                                          </Typography>
                                        </React.Fragment>
                                      }
                                    secondary={<React.Fragment>
                                        <Typography
                                          sx={{ display: 'block', wordBreak: "break-word" }}
                                          component="span"
                                          variant="body2"
                                          
                                        >
                                          {message_info.message}
                                        </Typography>
                                      </React.Fragment>}
                                />
                            </ListItem>
                            // return <div style={{border: "1px solid black", padding: "15px", marginLeft: meIndicator ? "auto": "none"}} key={inx}>
                            //     <span style={{color: message_info.user_color}}><b>{message_info.user_name}</b> {meIndicator && "(It is you)"}</span>
                            //     <p>{message_info.message}</p>
                            // </div>
                        })}
                        <div ref={messagesEndRef} />
                    </List>
                    {/* <Paper sx={{ position: 'fixed', bottom: 0}} elevation={3}> */}
                    <Stack direction="row" spacing={2}>
                        <TextField multiline fullWidth value={myMessage} variant="outlined"
                            onChange={e => setMyMessage(e.target.value)}
                            // onKeyPress={e => onPressSend(e)}
                        />
                        <Button style={{borderRadius: "50%", width: "50px", height: "50px"}}  variant="contained" 
                        onClick={() => sendMessage()}><SendIcon /></Button>
                    </Stack>
                    {/* </Paper> */}
                </Grid>
            </Grid>
            {/* </div> */}
            {/* <div style={{borderTop: "1px solid black", position: "fixed", bottom: 0, right: 0, width: "100%"}}> */}
            
            {/* </div> */}
        </Box>
        // </div>
    )
}

export default Chat