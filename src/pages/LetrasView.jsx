import React, { useState } from 'react';
import VisorLetraInteractiva from '../components/interactive/VisorLetraInteractiva';
import { ABECEDARIO } from '../components/games/AbecedarioSonoro';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { useAppTheme } from '../utils/theme';

/**
 * LetrasView — Módulo interactivo de Abecedario y Fonética (Diapositivas 4 y 5 del profesor).
 * Táctil, sonoro y con split-screen de apoyo docente y pizarra.
 */
export default function LetrasView() {
  const { tema } = useAppTheme();
  const [letraSeleccionada, setLetraSeleccionada] = useState(ABECEDARIO[0]);

  const seleccionarLetra = (l) => {
    sounds.playPop();
    voiceReader.speak(`Letra ${l.letra}. ${l.palabra}.`);
    setLetraSeleccionada(l);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* ══════════ ENCABEZADO TIPO APP: ABECEDARIO (DIAPOSITIVA 4) ══════════ */}
      <section className={`${tema.headerBg} rounded-3xl p-5 sm:p-6 text-white ${tema.headerShadow} border ${tema.headerBorder} flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300`}>
        <div className="text-center sm:text-left">
          <span className={`text-[10px] sm:text-xs font-title font-black uppercase tracking-wider px-3 py-1 rounded-full ${tema.headerBadge}`}>
            Diapositiva 4 • Abecedario Fonético
          </span>
          <h1 className="font-title font-black text-2xl sm:text-4xl uppercase tracking-wide drop-shadow-sm mt-1">
            Aa - ABECEDARIO INTERACTIVO
          </h1>
          <p className={`text-xs sm:text-sm ${tema.headerSubtext} font-medium`}>
            Toca cualquier letra para escuchar su pronunciación, ejemplos sonoros y practicar el trazo en la pizarra.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            voiceReader.speak("Toca cualquier letra del abecedario para escuchar su sonido, fonética y practicar su trazo.");
          }}
          className="px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-title font-bold text-xs border border-white/30 transition-all cursor-pointer shadow-xs shrink-0"
        >
          <span>Instrucciones con voz</span>
        </button>
      </section>

      {/* ══════════ PARRILlA DE LAS 27 LETRAS ══════════ */}
      <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-title font-black text-slate-900 text-base sm:text-lg uppercase">
              Selecciona una Letra
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Lectoescritura interactiva con voz humana y apoyo docente oficial.
            </p>
          </div>

          <span className={`text-xs font-title font-bold px-3 py-1 rounded-full border ${tema.cardBadge}`}>
            27 Letras con Audio
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2">
          {ABECEDARIO.map((l) => {
            const esActiva = letraSeleccionada.letra === l.letra;
            return (
              <button
                key={l.letra}
                onClick={() => seleccionarLetra(l)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  esActiva
                    ? `${tema.btnDock} font-black`
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-bold'
                }`}
              >
                <span className="text-2xl font-title font-black leading-none">{l.letra}</span>
                <span className={`text-[10px] leading-tight font-medium ${esActiva ? 'text-white/90' : 'text-slate-500'}`}>{l.min}</span>
                <span className="text-[10px] mt-1 font-bold text-slate-400 truncate max-w-full">{l.palabra}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ══════════ VISOR SPLIT-SCREEN DE LA LETRA SELECCIONADA ══════════ */}
      <VisorLetraInteractiva
        letraData={letraSeleccionada}
        onCambiarLetra={(nueva) => setLetraSeleccionada(nueva)}
        onVolverAbecedario={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      />
    </div>
  );
}
