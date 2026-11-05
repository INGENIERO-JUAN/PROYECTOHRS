import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';

export default function CofreTesoros() {
  const [abierto, setAbierto] = useState(false);

  const medallas = [
    { nombre: 'Guardián de las Vocales', icono: 'A', grado: '1°', desc: 'Maestría en letras mágicas', desbloqueada: true },
    { nombre: 'Detective de Rimas', icono: '', grado: '2°', desc: 'Ritmo y rima campesina', desbloqueada: true },
    { nombre: 'Sabio de las Fábulas', icono: '', grado: '3°', desc: 'Descifró la moraleja', desbloqueada: true },
    { nombre: 'Protector de Mitos', icono: '', grado: '4°', desc: 'Respeto a la Madremonte', desbloqueada: true },
    { nombre: 'Maestro Cuentacuentos', icono: '', grado: '5°', desc: 'Inicio, nudo y desenlace', desbloqueada: true },
    { nombre: 'Cronista de la Tradición', icono: '', grado: '6°', desc: 'Voz viva de los abuelos', desbloqueada: true },
    { nombre: 'Héroe de la Palabra', icono: '', grado: '7°', desc: 'Polisemia y argumentos', desbloqueada: true },
    { nombre: 'Arqueólogo Precolombino', icono: '', grado: '8°', desc: 'Raíces muiscas y taironas', desbloqueada: true },
    { nombre: 'Hijo del Maíz y Macondo', icono: '', grado: '9°', desc: 'Popol Vuh y Gabo', desbloqueada: true }
  ];

  const interactuarCofre = () => {
    if (!abierto) {
      sounds.playChestOpen();
      lanzarConfeti();
      setAbierto(true);
    } else {
      sounds.playClick();
      setAbierto(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 to-orange-100 rounded-4xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 text-center space-y-6">
      <div>
        <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-200 px-3 py-1 rounded-full border border-amber-400">
          Tesoro de Logros del Salón
        </span>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
          El Cofre de las Medallas Doradas
        </h3>
        <p className="text-slate-600 font-bold text-sm mt-1">
          Toca el cofre para abrirlo y ver las medallas que ha ganado el aula con sus clases.
        </p>
      </div>

      {/* Cofre Animado */}
      <div className="my-6">
        <button
          onClick={interactuarCofre}
          className="text-8xl sm:text-9xl transform hover:scale-110 active:scale-95 transition-transform cursor-pointer drop-shadow-2xl"
          title="Toca para abrir o cerrar"
        >
          {abierto ? '' : ''}
        </button>
        <span className="block text-xs font-black text-amber-900 mt-2 uppercase tracking-wider">
          {abierto ? ' ¡Cofre Abierto! ' : ' Toca el cofre para desbloquear'}
        </span>
      </div>

      {/* Medallero Desbloqueado */}
      {abierto && (
        <div className="animate-fade-in space-y-4 pt-4 border-t-2 border-amber-300">
          <h4 className="text-lg font-black text-amber-950">
             Medallas Desbloqueadas por los Estudiantes:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {medallas.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-4 border-2 border-amber-200 shadow-md flex items-center gap-3.5 text-left hover:scale-105 transition-transform"
              >
                <span className="text-3xl p-2 bg-amber-50 rounded-2xl border border-amber-200 shrink-0">
                  {m.icono}
                </span>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    Grado {m.grado}
                  </span>
                  <h5 className="font-black text-slate-800 text-sm truncate mt-0.5">
                    {m.nombre}
                  </h5>
                  <p className="text-[11px] text-slate-500 font-semibold truncate">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
