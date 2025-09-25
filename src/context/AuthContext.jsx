// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async (email, password, role) => {
        const res = await api.post("/teacher/login", { email, password, role });
        // Only set user if backend returns the correct role
        if (!res.data.role || res.data.role !== role) {
            throw new Error("Invalid credentials or role");
        }
        const userData = {
            _id: res.data._id,
            name: res.data.name,
            email: res.data.email,
            role: res.data.role,
            token: res.data.token
        };
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
