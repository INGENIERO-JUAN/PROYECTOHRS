import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import GradoView from './pages/GradoView';
import JuegosHub from './pages/JuegosHub';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Dashboard General con selector de grados 1° a 9° */}
          <Route index element={<Home />} />

          {/* Gran Arcade Central de Juegos (1° a 9°) */}
          <Route path="juegos" element={<JuegosHub />} />

          {/* Vista de Malla Curricular y Módulo Interactivo por Grado */}
          <Route path="grado/:gradoId" element={<GradoView />} />

          {/* Redirección ante rutas inexistentes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
