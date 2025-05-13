import axios from "axios";
import envHelper from "../utils/envHelper";
import { getCookie, removeCookie } from "./cookies";

const baseURL = envHelper.read(`VITE_API_URL`);

const axiosInstance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use((config) => {
    const token = getCookie('token');

    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config
}, (error) => Promise.reject(error));

axiosInstance.interceptors.response.use((response) => {
    return response.data;
},
(error) => {
    if (error.response && error.response.status === 401) {
        removeCookie('token');
        removeCookie('user');

        window.location.href = 'login';
    }

    return Promise.reject(error.response?.data || { message: error.message || 'Đã có lỗi xảy rara'})
});

export default axiosInstance;