import axios from "axios";

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_ROOT,
    timeout: 130000,
    withCredentials: true
});

export default axiosInstance