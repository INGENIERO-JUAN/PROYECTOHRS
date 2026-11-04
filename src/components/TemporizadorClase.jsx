import React, { useState, useEffect } from 'react';
import { sounds } from '../utils/audio';

export default function TemporizadorClase() {
  const [segundosRestantes, setSegundosRestantes] = useState(120); // 2 minutos por defecto
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    let intervalo = null;
    if (activo && segundosRestantes > 0) {
      intervalo = setInterval(() => {
        setSegundosRestantes((prev) => prev - 1);
      }, 1000);
    } else if (segundosRestantes === 0 && activo) {
      sounds.playFanfare();
      setActivo(false);
      clearInterval(intervalo);
    }
    return () => clearInterval(intervalo);
  }, [activo, segundosRestantes]);

  const iniciarPausar = () => {
    sounds.playClick();
    setActivo(!activo);
  };

  const reiniciar = (tiempoSegundos) => {
    sounds.playClick();
    setActivo(false);
    setSegundosRestantes(tiempoSegundos);
  };

  const formatearTiempo = (segundos) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}:${segs < 10 ? '0' : ''}${segs}`;
  };

  return (
    <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border-2 border-amber-300">
      <div className="flex items-center gap-3">
        <span className="text-3xl animate-bounce">⏱️</span>
        <div>
          <h4 className="font-black text-sm uppercase tracking-wider text-amber-100">
            Reloj de Retos para el Salón
          </h4>
          <span className="text-3xl sm:text-4xl font-black font-mono tracking-wider drop-shadow-sm">
            {formatearTiempo(segundosRestantes)}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={iniciarPausar}
          className="px-4 py-2 bg-white text-slate-800 hover:bg-amber-100 font-black text-xs sm:text-sm rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
        >
          {activo ? '⏸️ Pausar' : '▶️ Iniciar Reto'}
        </button>

        <button
          onClick={() => reiniciar(60)}
          className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          1 Min
        </button>
        <button
          onClick={() => reiniciar(180)}
          className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          3 Min
        </button>
        <button
          onClick={() => reiniciar(300)}
          className="px-3 py-1.5 bg-amber-600/80 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
        >
          5 Min
        </button>
      </div>
    </div>
  );
}
