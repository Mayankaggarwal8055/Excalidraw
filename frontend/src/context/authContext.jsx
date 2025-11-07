import { useEffect } from "react";
import { createContext } from "react";
import { loginData, signUpData } from "../api/authapi";
import { useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`http://localhost:4444/api/auth/me`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Auth check failed:", error);
            } finally {
                setLoading(false);
            }
        }
        checkAuth();
    }, [])

    const signup = async (userData) => {
        const response = await signUpData(userData);
        if (response.error) throw new Error(response.error);
        setUser(response.user);
        return response;
    };

    // 🔹 Login wrapper using your existing API file
    const login = async (userData) => {
        const response = await loginData(userData);
        if (response.error) throw new Error(response.error);
        setUser(response.user);
        return response;
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, signup, login }}>
            {children}
        </AuthContext.Provider>
    );


}