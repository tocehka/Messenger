import axiosInstance from "./APIClient";
import axios from "axios";

let cancel;

const auth = (setUser, callback) => {
    axiosInstance.get("/auth", 
    {
        cancelToken: new axios.CancelToken(function executor(c) {
            cancel = c;
        })
    })
    .then(({data}) => {
        setUser(data);
        callback();
    })
    .catch(({response}) => {
        console.log(response);
        callback();
    })
};

const login = (loginData, setUser, callback) => {
    console.log("kek")
    axiosInstance.post("/login", loginData)
    .then(({data}) => {
        setUser(data);
        callback();
    })
    .catch(({response}) => {
        console.log(response);
        callback();
    })
};

export {auth, login, cancel}