import React, { useState } from "react";
import {useAuth} from "../hooks/AuthHook";
import {login} from "../api/Auth";

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';


const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [validationError, setValidationError] = useState(false);
    const {setUser, setAuthLoading} = useAuth();
    console.log(username)

    const loginApp = () => {
        if (username === "") {
            setValidationError(true);
            return
        }
        setAuthLoading(true);
        login({user_name: username}, setUser, () => {
            setAuthLoading(false);
        })
    }

    const onPressSend = e => {
        if (e.key === "Enter") {
            loginApp();
        }
        
    }

    return (
        <div className="login-container">
            <Box
            component="form"
            sx={{
                // width: "100%",
                // height: 300,
                padding: 3,
                border: "1px solid black",
                borderRadius: "10px",
            }}
            noValidate
            autoComplete="off"
            >
                <Stack spacing={3}>
                    <p className="login-header">Input your nickname for continue</p>
                    {validationError && <Alert severity="error">Your nickname can not be empty</Alert>}
                    <TextField  fullWidth value={username} label="Username" variant="outlined"
                        onChange={e => setUsername(e.target.value)}
                        onKeyPress={e => onPressSend(e)}
                    />
                    <Button style={{width: "150px"}} variant="contained" onClick={() => loginApp()}>
                        Let me in!
                    </Button>
                </Stack>
            </Box>
    </div>
    )
}

export default LoginForm