import React, { useState } from 'react'
import './App.css'
import { useAuth } from "./AuthContext";

function App() {
    const { username, setUsername, setPassword } = useAuth();

    const handleLogout = () => {
        setUsername('');
        setPassword('');
    };

        return (
    <>
        <header>
            {username ? (
                <div>
                <span>Logged in as: {username}</span>
                <button onClick={handleLogout} style={{ marginLeft: '1em' }}>
                    Logout
                </button>
                </div>
            ) : (
                <span>Not logged in</span>
            )}
        </header>
      <h1>The store</h1>
    </>
  )
}

export default App
