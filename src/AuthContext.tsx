import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
    username: string;
    password: string;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <AuthContext.Provider value={{ username, password, setUsername, setPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};