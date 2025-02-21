import axios from "axios";
const Bae_URL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
    baseURL: Bae_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;