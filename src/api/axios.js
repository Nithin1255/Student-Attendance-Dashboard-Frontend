// src/api/axios.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://student-attendance-dashboard-backend.onrender.com/api", // 👈 backend URL
});

// Attach token to every request
api.interceptors.request.use(
    (config) => {
        // Try to get token from 'token' key
        let token = localStorage.getItem("token");
        // If not found, try to get from 'user' object
        if (!token) {
            const user = localStorage.getItem("user");
            if (user) {
                try {
                    const userObj = JSON.parse(user);
                    token = userObj.token;
                } catch (e) {
                    // ignore JSON parse error
                }
            }
        }
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
