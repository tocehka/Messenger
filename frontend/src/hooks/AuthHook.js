import React, {createContext, useContext, useEffect, useState} from "react";
import {auth, cancel} from "@API/Auth";

const authContext = createContext();

const AuthWrapper = ({children}) => {
    const auth = useProvideAuth();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>
};

const useAuth = () => {
    return useContext(authContext)
};

const useProvideAuth = () => {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        setAuthLoading(true);
        auth(setUser, () => {setAuthLoading(false)});

        return () => {
            cancel && cancel();
        }
    }, [])

    return {
        user,
        setUser,
        authLoading
    }
}

export {AuthWrapper, useAuth}
