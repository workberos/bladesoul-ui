import axios from "axios";
import envHelper from "../utils/envHelper";

axios.defaults.baseURL = envHelper.read(`VITE_API_URL`);

const registerUser = async (param) => {
    try {
        const response = await axios.post("/data", param);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi gửi request:", error);
        return null;
    }
}

export {
    registerUser
}