import React from "react";
import {useAuth} from "./hooks/AuthHook";

// import Loading from "./components/Loading";
import Chat from "./components/Chat";
import LoginForm from "./components/LoginForm";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import "./components/index.css"

const App = () => {
  const {user, authLoading} = useAuth();

  return (
    <div className="main-container">
      {user ? 
        <Chat />
      :
        <LoginForm />
      }
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={authLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  )
}

export default App