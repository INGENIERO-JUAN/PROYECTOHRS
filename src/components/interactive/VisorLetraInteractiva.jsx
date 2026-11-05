import React, { useState } from 'react';
import PizarraDigital from '../PizarraDigital';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { ABECEDARIO, FAMILIAS_SILABAS } from '../games/AbecedarioSonoro';
import { useAppTheme } from '../../utils/theme';

export default function VisorLetraInteractiva({
  letraData,
  onCambiarLetra,
  onVolverAbecedario,
}) {
  const { tema } = useAppTheme();
  const [tabInteractivo, setTabInteractivo] = useState('multimedia'); // 'multimedia', 'pizarra', 'silabas'
  const [leyendoDocente, setLeyendoDocente] = useState(false);

  const familia = FAMILIAS_SILABAS.find((f) => f.consonante === letraData.letra);
  const indiceActual = ABECEDARIO.findIndex((l) => l.letra === letraData.letra);
  const letraAnterior = indiceActual > 0 ? ABECEDARIO[indiceActual - 1] : null;
  const letraSiguiente = indiceActual < ABECEDARIO.length - 1 ? ABECEDARIO[indiceActual + 1] : null;

  const reproducirSonidoLetra = () => {
    sounds.playPop();
    const texto = letraData.tipo === 'vocal'
      ? `La letra ${letraData.letra}. Sonido: ${letraData.letra}. Palabra asociada: ${letraData.palabra}.`
      : `La letra ${letraData.letra}, suena como ${letraData.palabra.slice(0, 2)}. ${letraData.palabra}.`;
    voiceReader.speak(texto);
  };

  const reproducirSilaba = (silaba, ejemplo) => {
    sounds.playPop();
    voiceReader.speak(`${silaba}. Como en ${ejemplo}.`);
  };

  const leerTextoDocente = () => {
    if (leyendoDocente) {
      voiceReader.stop();
      setLeyendoDocente(false);
    } else {
      sounds.playClick();
      setLeyendoDocente(true);
      const orientacion = `Apoyo docente para la letra ${letraData.letra}. Tipo: ${letraData.tipo}. Palabra modelo: ${letraData.palabra}. Objetivo: Reconocer el fonema y grafema.`;
      voiceReader.speak(orientacion, () => setLeyendoDocente(false));
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ══════════ BARRA DE NAVEGACIÓN ENTRE LETRAS ══════════ */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex items-center justify-between">
        <button
          onClick={onVolverAbecedario}
          className="text-xs font-title font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <span>← Volver al Abecedario</span>
        </button>

        <div className="flex items-center gap-2">
          {letraAnterior && (
            <button
              onClick={() => {
                sounds.playClick();
                onCambiarLetra(letraAnterior);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-title font-bold text-xs rounded-xl cursor-pointer"
            >
              <span>← Letra {letraAnterior.letra}</span>
            </button>
          )}

          <span className="font-title font-black text-slate-700 text-xs px-2">
            {indiceActual + 1} de {ABECEDARIO.length}
          </span>

          {letraSiguiente && (
            <button
              onClick={() => {
                sounds.playClick();
                onCambiarLetra(letraSiguiente);
              }}
              className={`px-3 py-1.5 ${tema.btnGradient} font-title font-black text-xs rounded-xl cursor-pointer shadow-xs`}
            >
              <span>Letra {letraSiguiente.letra} →</span>
            </button>
          )}
        </div>
      </div>

      {/* ══════════ ESTRUCTURA SPLIT-SCREEN ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── COLUMNA IZQUIERDA (4 COLS): RESUMEN + TEXTO APOYO DOCENTE ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Tarjeta superior: Letra grande seleccionada */}
          <div className={`${tema.headerBg} rounded-3xl p-6 text-white text-center ${tema.headerShadow} border ${tema.headerBorder} relative overflow-hidden transition-all duration-300`}>
            <span className={`text-[10px] ${tema.headerBadge} font-title font-black uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-2 shadow-xs`}>
              {letraData.tipo === 'vocal' ? 'Vocal' : 'Consonante'}
            </span>

            <div className="flex items-baseline justify-center gap-3">
              <span className="text-7xl sm:text-8xl font-title font-black tracking-tighter drop-shadow-md">
                {letraData.letra}
              </span>
              <span className="text-4xl sm:text-5xl font-title font-black text-white/80">
                {letraData.min}
              </span>
            </div>

            <div className="mt-3">
              <span className="text-xl font-title font-black uppercase tracking-wider block mt-1 drop-shadow-xs">
                {letraData.palabra}
              </span>
            </div>

            <button
              onClick={reproducirSonidoLetra}
              className="mt-4 w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 text-white rounded-xl font-title font-black text-xs cursor-pointer shadow-xs border border-white/20 transition-all active:scale-95"
            >
              <span>Pronunciar Letra</span>
            </button>
          </div>

          {/* Tarjeta inferior: Texto apoyo docente */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-title font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                TEXTO APOYO DOCENTE
              </h3>
              <button
                onClick={leerTextoDocente}
                title="Leer apoyo docente en voz alta"
                className={`px-3 py-1 rounded-xl text-xs font-title font-black transition-all cursor-pointer border ${
                  leyendoDocente
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <span>{leyendoDocente ? 'Detener' : 'Leer'}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              <div>
                <span className={`font-title font-black ${tema.accentText} block text-[11px] uppercase`}>
                  Objetivo Fonético:
                </span>
                <p className="font-medium text-slate-600 mt-1 leading-relaxed">
                  Reconocer el fonema /{letraData.letra}/ y grafema en palabras cotidianas ({letraData.palabra}).
                </p>
              </div>

              <div>
                <span className="font-title font-black text-slate-700 block text-[11px] uppercase">
                  Pregunta para el Aula:
                </span>
                <p className="font-bold text-slate-800 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 mt-1 leading-relaxed">
                  &quot;¿Quién puede encontrar en el salón o en la vereda algo que empiece por la letra {letraData.letra}?&quot;
                </p>
              </div>

              <div>
                <span className={`font-title font-black ${tema.accentText} block text-[11px] uppercase`}>
                  Actividad Sugerida en Cuaderno:
                </span>
                <p className="font-medium text-slate-600 mt-1 leading-relaxed">
                  Dibujar {letraData.palabra.toLowerCase()} grande, trazar 5 veces la letra {letraData.letra} con diferentes colores y practicar su forma.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ── COLUMNA DERECHA (8 COLS): ESCENARIO MULTIMEDIA INTERACTIVO ── */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Selector de pestañas interactivas */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex gap-2">
            <button
              onClick={() => {
                sounds.playClick();
                setTabInteractivo('multimedia');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                tabInteractivo === 'multimedia'
                  ? tema.btnGradient
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Multimedia y Fonética
            </button>

            {familia && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setTabInteractivo('silabas');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                  tabInteractivo === 'silabas'
                    ? tema.btnGradient
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Familia de Sílabas
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                setTabInteractivo('pizarra');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                tabInteractivo === 'pizarra'
                  ? tema.btnGradient
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pizarra de Trazo
            </button>
          </div>

          {/* TAB 1: MULTIMEDIA Y FONÉTICA */}
          {tabInteractivo === 'multimedia' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-center space-y-6 animate-fade-in">
              <div className="space-y-1">
                <span className={`text-xs font-title font-black uppercase tracking-wider ${tema.accentText}`}>
                  Visualizador de Fonética
                </span>
                <h3 className="text-2xl sm:text-3xl font-title font-black text-slate-900">
                  Palabra Asociada: {letraData.palabra}
                </h3>
              </div>

              {/* Caja Multimedia Gigante Tipográfica */}
              <div className="bg-slate-50/80 border-2 border-slate-200/80 rounded-3xl p-8 sm:p-12 max-w-lg mx-auto flex flex-col items-center justify-center space-y-5">
                <div className="w-28 h-28 rounded-3xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center shadow-xs">
                  <span className="text-6xl font-title font-black">{letraData.letra}</span>
                </div>

                <div className="text-center">
                  <span className="text-3xl sm:text-4xl font-title font-black text-slate-900 tracking-wide uppercase">
                    {letraData.letra}
                    <span className="text-slate-500 lowercase">{letraData.palabra.slice(1)}</span>
                  </span>
                </div>

                <button
                  onClick={reproducirSonidoLetra}
                  className={`px-6 py-3 ${tema.btnGradient} rounded-2xl font-title font-black text-sm cursor-pointer transition-all active:scale-95`}
                >
                  <span>Escuchar fonética con voz</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                Toca el botón para escuchar la pronunciación clara y asociar el sonido de la letra con la palabra.
              </p>
            </div>
          )}

          {/* TAB 2: FAMILIA DE SÍLABAS */}
          {tabInteractivo === 'silabas' && familia && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 animate-fade-in">
              <div className="text-center space-y-1">
                <span className={`text-xs font-title font-black uppercase tracking-wider ${tema.accentText}`}>
                  Construcción Silábica
                </span>
                <h3 className="text-2xl font-title font-black text-slate-900">
                  Familia de la Letra {familia.consonante}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Toca cada combinación para escuchar su sonido y una palabra de ejemplo.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {familia.combinaciones.map((c, i) => (
                  <button
                    key={i}
                    onClick={() => reproducirSilaba(c.silaba, c.palabra)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex flex-col items-center justify-center transition-all cursor-pointer group active:scale-95 shadow-xs"
                  >
                    <span className="text-3xl font-title font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {c.silaba}
                    </span>
                    <span className="text-xs font-bold text-slate-400 mt-1">
                      {c.palabra}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: PIZARRA DE TRAZO */}
          {tabInteractivo === 'pizarra' && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 animate-fade-in">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base sm:text-lg font-title font-black text-slate-900">
                  Pizarra de Trazo: Letra {letraData.letra}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Practica dibujando la letra en mayúscula ({letraData.letra}) y minúscula ({letraData.min}).
                </p>
              </div>

              <PizarraDigital />
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
