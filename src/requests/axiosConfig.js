import useAuthStore from "@/store/authStore";
import axios from "axios";
const Bae_URL = import.meta.env.VITE_BASE_URL

const axiosInstance = axios.create({
    baseURL: Bae_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Agregar un interceptor para actualizar el token dinámicamente
axiosInstance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token; // Obtiene el token directamente del store
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

export default axiosInstance;