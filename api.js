//src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

// attach token automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;

// eslint-disable-next-line react-hooks/exhaustive-deps

