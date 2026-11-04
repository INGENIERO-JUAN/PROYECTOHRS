import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArcadeDidactico from '../components/games/ArcadeDidactico';
import { sounds } from '../utils/audio';

export default function JuegosHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gradoParam = parseInt(searchParams.get('grado') || '1', 10);
  const juegoParam = searchParams.get('juego');

  const [gradoSeleccionado, setGradoSeleccionado] = useState(
    !isNaN(gradoParam) && gradoParam >= 1 && gradoParam <= 9 ? gradoParam : 1
  );

  useEffect(() => {
    const g = parseInt(searchParams.get('grado') || '', 10);
    if (!isNaN(g) && g >= 1 && g <= 9 && g !== gradoSeleccionado) {
      setGradoSeleccionado(g);
    }
  }, [searchParams]);

  const niveles = [
    { grado: 1, label: '1° Grado', desc: 'Fonética, vocales y letras parlantes con voz', icono: '🐥', badge: 'Aprendiendo a leer' },
    { grado: 2, label: '2° Grado', desc: 'Sílabas sonoras y palabras iniciales', icono: '🐰', badge: 'Primeras lecturas' },
    { grado: 3, label: '3° Grado', desc: 'Fábulas, rimas y memoria sonora', icono: '🦊', badge: 'Rimas y fábulas' },
    { grado: 4, label: '4° Grado', desc: 'Mitos, trivia y detective de ortografía', icono: '🦉', badge: 'Tradición y mitos' },
    { grado: 5, label: '5° Grado', desc: 'Sintaxis, ahorcado y concursos', icono: '🦁', badge: 'Cuentos y novelas' },
    { grado: 6, label: '6° Grado', desc: 'Duelos, crucigramas y tradición oral', icono: '🐺', badge: 'Secundaria' },
    { grado: 7, label: '7° Grado', desc: 'Argumentación, figuras y detectives', icono: '🦅', badge: 'Secundaria' },
    { grado: 8, label: '8° Grado', desc: 'Literatura precolombina y crónicas', icono: '🐆', badge: 'Secundaria' },
    { grado: 9, label: '9° Grado', desc: 'Realismo mágico, oratoria y sintaxis', icono: '🦋', badge: 'Secundaria' }
  ];

  const handleCambiarGrado = (g) => {
    sounds.playClick();
    setGradoSeleccionado(g);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('grado', String(g));
      p.delete('juego'); // Al cambiar de grado, permitir que cargue el juego insignia de ese grado
      return p;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ══════════ HERO DE LA SALA DE JUEGOS ══════════ */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-4xl p-6 sm:p-10 text-white shadow-2xl border-4 border-yellow-200 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-yellow-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <span>🎮</span> Sala Central de Juegos • 100% Sin Internet
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm">
            ¡El Gran Arcade de Lengua Viva! 🕹️✨
          </h2>
          <p className="text-amber-100 text-sm sm:text-lg font-bold leading-relaxed">
            Elige el grado de tus estudiantes para cargar los 15 juegos interactivos adaptados a su nivel: desde fonética con voz para los niños de primero que están aprendiendo a leer, hasta el Tribunal de Falacias, Escape Room de Macondo y duelos contrarreloj para secundaria.
          </p>
        </div>

        <div className="absolute -right-6 -bottom-6 text-9xl opacity-25 select-none pointer-events-none">
          🎮
        </div>
      </div>

      {/* ══════════ SELECTOR TÁCTIL DE GRADO ══════════ */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-3 border-amber-300">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 block mb-3 text-center sm:text-left">
          Paso 1: Selecciona el Grado Escolar para Activar su Catálogo de Juegos:
        </span>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {niveles.map((n) => {
            const activo = gradoSeleccionado === n.grado;
            return (
              <button
                key={n.grado}
                onClick={() => handleCambiarGrado(n.grado)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border-b-4 select-none active:border-b-0 active:translate-y-1 ${
                  activo
                    ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white border-orange-700 shadow-xl scale-105 ring-4 ring-amber-300'
                    : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-300 hover:border-amber-400'
                }`}
              >
                <span className="text-2xl sm:text-3xl mb-1">{n.icono}</span>
                <span className="font-black text-xs sm:text-sm">{n.label}</span>
                <span className={`text-[9px] font-extrabold uppercase mt-0.5 px-1.5 py-0.5 rounded-full ${
                  activo ? 'bg-black/20 text-white' : 'text-slate-400'
                }`}>
                  {n.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ COMPONENTE ARCADE ACTIVO ══════════ */}
      <div className="space-y-4">
        <ArcadeDidactico gradoNumero={gradoSeleccionado} juegoInicial={juegoParam} />
      </div>
    </div>
  );
}
