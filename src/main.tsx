import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Books from './pages/Books.tsx'
import Cart from './pages/Cart.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Navigate to="/books" replace />} />
              <Route path="/books" element={<Books />} />
              <Route path="/cart" element={<Cart />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
