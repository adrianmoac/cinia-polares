import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'   
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/Login" element={<div>Login</div>} />
        <Route path="/Inicio" element={<div>Inicio</div>} />
        <Route path="/Eficiencia" element={<div>Eficiencia</div>} />
        <Route path="/AgregarColaborador" element={<div>Agregar Colaborador</div>} />

        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
