import React, { useState } from "react";
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        params.append("username", username);
        params.append("password", password);

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: params.toString(),
            });

            if (!response.ok) {
                // Try to parse error message from response
                const errorMsg = await response.text();
                setMessage(`Login failed: ${errorMsg}`);
            } else {
                const text = await response.text();
                setMessage(text);
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
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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