import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import GradoView from './pages/GradoView';
import JuegosHub from './pages/JuegosHub';
import LetrasView from './pages/LetrasView';
import AdminView from './pages/AdminView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Pantalla Principal: Selector de Grados o Curso */}
          <Route index element={<Home />} />

          {/* Gran Arcade de Juegos Educativos */}
          <Route path="juegos" element={<JuegosHub />} />

          {/* Abecedario Fonético Interactivo */}
          <Route path="letras" element={<LetrasView />} />

          {/* Vistas de Aprendizaje de Curso */}
          <Route path="grado/:gradoId" element={<GradoView />} />

          {/* Flujo de Administración Docente */}
          <Route path="admin" element={<AdminView />} />

          {/* Rutas con prefijo /espanol para compatibilidad total */}
          <Route path="espanol">
            <Route index element={<Home />} />
            <Route path="juegos" element={<JuegosHub />} />
            <Route path="letras" element={<LetrasView />} />
            <Route path="grado/:gradoId" element={<GradoView />} />
            <Route path="admin" element={<AdminView />} />
          </Route>

          {/* Redirección ante rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
