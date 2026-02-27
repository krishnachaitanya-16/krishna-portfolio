import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PlayWithMe from "./pages/PlayWithMe";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/play" element={<PlayWithMe />} />
    </Routes>
   </BrowserRouter>
  </StrictMode>,
)
