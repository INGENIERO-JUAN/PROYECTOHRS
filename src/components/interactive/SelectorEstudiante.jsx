import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';

export default function SelectorEstudiante() {
  const [estudiantes, setEstudiantes] = useState([
    'Camilo', 'Sofía', 'Mateo', 'Lucía', 'Carmen', 'Samuel', 'Valentina', 'Juan'
  ]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [animando, setAnimando] = useState(false);

  const agregarEstudiante = (e) => {
    e.preventDefault();
    if (nuevoNombre.trim() === '') return;
    setEstudiantes([...estudiantes, nuevoNombre.trim()]);
    setNuevoNombre('');
  };

  const eliminarEstudiante = (index) => {
    setEstudiantes(estudiantes.filter((_, i) => i !== index));
  };

  const sortearEstudiante = () => {
    if (estudiantes.length === 0 || animando) return;
    sounds.playClick();
    setAnimando(true);
    setSeleccionado(null);

    let pasadas = 0;
    const maxPasadas = 20;

    const interval = setInterval(() => {
      sounds.playClick();
      const randomIdx = Math.floor(Math.random() * estudiantes.length);
      setSeleccionado(estudiantes[randomIdx]);
      pasadas++;

      if (pasadas >= maxPasadas) {
        clearInterval(interval);
        setAnimando(false);
        sounds.playFanfare();
        lanzarConfeti();
      }
    }, 120);
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-xl border-4 border-indigo-300 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          
          <div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Herramienta de Participación en Clase
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              ¿Quién Pasa al Tablero Hoy?
            </h3>
          </div>
        </div>

        <button
          onClick={sortearEstudiante}
          disabled={animando || estudiantes.length === 0}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-black text-base rounded-2xl shadow-lg border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
        >
          {animando ? ' Sorteando...' : ' ¡Sortear Estudiante!'}
        </button>
      </div>

      {/* Pantalla del Estudiante Seleccionado */}
      <div className="bg-indigo-50 border-3 border-indigo-200 p-8 rounded-3xl text-center shadow-inner min-h-[140px] flex flex-col items-center justify-center">
        {seleccionado ? (
          <div className="space-y-1 animate-fade-in">
            <span className="text-xs font-black text-indigo-700 uppercase tracking-widest">
              ¡El Explorador Elegido es:!
            </span>
            <h4 className="text-4xl sm:text-5xl font-black text-indigo-950 animate-bounce">
               {seleccionado} 
            </h4>
          </div>
        ) : (
          <p className="text-slate-400 font-bold text-base">
            Pulsa el botón "Sortear Estudiante" para elegir a quién le toca leer o pasar a la pizarra.
          </p>
        )}
      </div>

      {/* Lista de Estudiantes de la Clase */}
      <div>
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-2">
          Estudiantes del Salón ({estudiantes.length}):
        </label>
        <div className="flex flex-wrap gap-2">
          {estudiantes.map((nombre, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-xl font-bold text-xs"
            >
              <span>{nombre}</span>
              <button
                onClick={() => eliminarEstudiante(idx)}
                className="text-slate-400 hover:text-rose-500 font-black cursor-pointer ml-1"
                title="Eliminar de la lista"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* Formulario para agregar estudiantes rápido */}
        <form onSubmit={agregarEstudiante} className="flex gap-2 mt-3">
          <input
            type="text"
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            placeholder="Agregar nombre de estudiante..."
            className="flex-1 py-2 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-black cursor-pointer"
          >
            + Agregar
          </button>
        </form>
      </div>
    </div>
  );
}
