import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from "./AuthContext"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Books from './pages/Books.tsx'
import Cart from './pages/Cart.tsx'
import Register from './pages/Register.tsx'
import Login from './pages/Login.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <AuthProvider>
        <App />
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/books" element={<Books />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
          </Routes>
      </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
)
