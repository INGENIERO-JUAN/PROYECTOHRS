import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ArcadeDidactico from '../components/games/ArcadeDidactico';
import { sounds } from '../utils/audio';
import { useAppTheme } from '../utils/theme';

export default function JuegosHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { tema } = useAppTheme();
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
    { grado: 1, label: '1.°', desc: 'Fonética, vocales y letras con voz', badge: 'Lectoescritura' },
    { grado: 2, label: '2.°', desc: 'Sílabas sonoras y palabras', badge: 'Primeras lecturas' },
    { grado: 3, label: '3.°', desc: 'Fábulas, rimas y memoria', badge: 'Rimas y fábulas' },
    { grado: 4, label: '4.°', desc: 'Mitos, trivia y detective', badge: 'Tradición y mitos' },
    { grado: 5, label: '5.°', desc: 'Sintaxis, ahorcado y concursos', badge: 'Cuentos y novelas' },
    { grado: 6, label: '6.°', desc: 'Duelos, crucigramas y tradición oral', badge: 'Secundaria' },
    { grado: 7, label: '7.°', desc: 'Argumentación, figuras y detectives', badge: 'Secundaria' },
    { grado: 8, label: '8.°', desc: 'Literatura precolombina y crónicas', badge: 'Secundaria' },
    { grado: 9, label: '9.°', desc: 'Realismo mágico, oratoria y sintaxis', badge: 'Secundaria' }
  ];

  const handleCambiarGrado = (g) => {
    sounds.playClick();
    setGradoSeleccionado(g);
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set('grado', String(g));
      p.delete('juego');
      return p;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ══════════ ENCABEZADO: SALA DE 15 MINIJUEGOS ══════════ */}
      <section className={`${tema.headerBg} rounded-3xl p-5 sm:p-6 text-white ${tema.headerShadow} border ${tema.headerBorder} text-center relative overflow-hidden transition-all duration-300`}>
        <div className="relative z-10 max-w-2xl mx-auto space-y-1.5">
          <span className={`inline-block ${tema.headerBadge} font-title font-black text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs`}>
            ZONA ARCADE DIDÁCTICA • 100% OFFLINE
          </span>
          <h1 className="font-title font-black text-2xl sm:text-4xl uppercase tracking-wide drop-shadow-sm">
            SALA DE 15 MINIJUEGOS
          </h1>
          <p className={`text-xs sm:text-sm ${tema.headerSubtext} font-medium`}>
            Selecciona tu grado para filtrar los juegos didácticos interactivos adaptados pedagógicamente.
          </p>
        </div>
      </section>

      {/* ══════════ SELECTOR TÁCTIL DE GRADO ══════════ */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/90">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-title font-black uppercase tracking-wider text-slate-400">
            Filtro de Grado Escolar:
          </span>
          <span className={`text-xs font-title font-black px-3 py-1 rounded-full border ${tema.cardBadge}`}>
            Grado Activo: {gradoSeleccionado}.° Grado
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {niveles.map((n) => {
            const activo = gradoSeleccionado === n.grado;
            return (
              <button
                key={n.grado}
                onClick={() => handleCambiarGrado(n.grado)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  activo
                    ? `${tema.btnDock} font-black`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 font-bold'
                }`}
              >
                <span className="text-xl font-title font-black leading-none">{n.label}</span>
                <span className={`text-[10px] mt-1 font-bold truncate max-w-full ${activo ? 'text-white/90' : 'text-slate-400'}`}>
                  {n.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ SALA DE JUEGOS EMBEBIDA DIRECTAMENTE ══════════ */}
      <ArcadeDidactico gradoNumero={gradoSeleccionado} juegoInicial={juegoParam} />
    </div>
  );
}
