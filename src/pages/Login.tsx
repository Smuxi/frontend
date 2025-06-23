import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Login: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [message, setMessage] = useState("");
    const { setUsername, setPassword } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("username", usernameInput);
        params.append("password", passwordInput);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                setMessage(`Login failed: ${errorMsg}`);
            } else {
                const text = await response.text();
                setMessage(text);
                setUsername(usernameInput);
                setPassword(passwordInput);
            }
        } catch (error: any) {
            setMessage(`An error occurred: ${error.message || error}`);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={usernameInput}
                    onChange={e => setUsernameInput(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && <div>{message}</div>}
            <Link to="/books">Go to Books</Link>
        </div>
    );
};

export default Login;