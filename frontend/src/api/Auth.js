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

export {auth, cancel}