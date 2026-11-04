import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const ABECEDARIO = [
  { letra: 'A', min: 'a', palabra: 'Árbol', icono: '🌳', color: 'from-amber-400 to-orange-500', tipo: 'vocal' },
  { letra: 'B', min: 'b', palabra: 'Barco', icono: '⛵', color: 'from-sky-400 to-blue-600', tipo: 'consonante' },
  { letra: 'C', min: 'c', palabra: 'Casa', icono: '🏠', color: 'from-emerald-400 to-teal-600', tipo: 'consonante' },
  { letra: 'D', min: 'd', palabra: 'Delfín', icono: '🐬', color: 'from-cyan-400 to-blue-500', tipo: 'consonante' },
  { letra: 'E', min: 'e', palabra: 'Estrella', icono: '⭐', color: 'from-yellow-400 to-amber-500', tipo: 'vocal' },
  { letra: 'F', min: 'f', palabra: 'Flor', icono: '🌸', color: 'from-pink-400 to-rose-500', tipo: 'consonante' },
  { letra: 'G', min: 'g', palabra: 'Gato', icono: '🐱', color: 'from-amber-500 to-orange-600', tipo: 'consonante' },
  { letra: 'H', min: 'h', palabra: 'Hoja', icono: '🍃', color: 'from-lime-400 to-green-600', tipo: 'consonante' },
  { letra: 'I', min: 'i', palabra: 'Isla', icono: '🏝️', color: 'from-teal-400 to-emerald-600', tipo: 'vocal' },
  { letra: 'J', min: 'j', palabra: 'Jirafa', icono: '🦒', color: 'from-yellow-500 to-amber-600', tipo: 'consonante' },
  { letra: 'K', min: 'k', palabra: 'Koala', icono: '🐨', color: 'from-slate-400 to-slate-600', tipo: 'consonante' },
  { letra: 'L', min: 'l', palabra: 'Luna', icono: '🌙', color: 'from-indigo-400 to-violet-600', tipo: 'consonante' },
  { letra: 'M', min: 'm', palabra: 'Mariposa', icono: '🦋', color: 'from-purple-400 to-fuchsia-600', tipo: 'consonante' },
  { letra: 'N', min: 'n', palabra: 'Nido', icono: '🪺', color: 'from-amber-600 to-yellow-700', tipo: 'consonante' },
  { letra: 'Ñ', min: 'ñ', palabra: 'Ñandú', icono: '🦤', color: 'from-rose-400 to-red-600', tipo: 'consonante' },
  { letra: 'O', min: 'o', palabra: 'Oso', icono: '🐻', color: 'from-orange-400 to-amber-600', tipo: 'vocal' },
  { letra: 'P', min: 'p', palabra: 'Perro', icono: '🐶', color: 'from-blue-400 to-indigo-600', tipo: 'consonante' },
  { letra: 'Q', min: 'q', palabra: 'Queso', icono: '🧀', color: 'from-yellow-400 to-amber-500', tipo: 'consonante' },
  { letra: 'R', min: 'r', palabra: 'Rana', icono: '🐸', color: 'from-emerald-400 to-green-600', tipo: 'consonante' },
  { letra: 'S', min: 's', palabra: 'Sol', icono: '☀️', color: 'from-amber-400 to-orange-500', tipo: 'consonante' },
  { letra: 'T', min: 't', palabra: 'Tortuga', icono: '🐢', color: 'from-teal-500 to-emerald-700', tipo: 'consonante' },
  { letra: 'U', min: 'u', palabra: 'Uva', icono: '🍇', color: 'from-violet-500 to-purple-700', tipo: 'vocal' },
  { letra: 'V', min: 'v', palabra: 'Vaca', icono: '🐄', color: 'from-sky-500 to-blue-700', tipo: 'consonante' },
  { letra: 'W', min: 'w', palabra: 'Wafle', icono: '🧇', color: 'from-amber-500 to-yellow-600', tipo: 'consonante' },
  { letra: 'X', min: 'x', palabra: 'Xilófono', icono: '🎵', color: 'from-fuchsia-400 to-pink-600', tipo: 'consonante' },
  { letra: 'Y', min: 'y', palabra: 'Yoyó', icono: '🪀', color: 'from-red-400 to-rose-600', tipo: 'consonante' },
  { letra: 'Z', min: 'z', palabra: 'Zanahoria', icono: '🥕', color: 'from-orange-500 to-amber-600', tipo: 'consonante' }
];

const FAMILIAS_SILABAS = [
  { consonante: 'M', nombre: 'Familia M', silabas: ['MA', 'ME', 'MI', 'MO', 'MU'], icono: '🍞', palabras: ['Mamá', 'Mesa', 'Miel', 'Mono', 'Mula'] },
  { consonante: 'P', nombre: 'Familia P', silabas: ['PA', 'PE', 'PI', 'PO', 'PU'], icono: '🦆', palabras: ['Papá', 'Pelota', 'Pipa', 'Pollo', 'Puente'] },
  { consonante: 'S', nombre: 'Familia S', silabas: ['SA', 'SE', 'SI', 'SO', 'SU'], icono: '🐸', palabras: ['Sapo', 'Semilla', 'Silla', 'Sopa', 'Suma'] },
  { consonante: 'L', nombre: 'Familia L', silabas: ['LA', 'LE', 'LI', 'LO', 'LU'], icono: '🌙', palabras: ['Lápiz', 'Leche', 'Limón', 'Loro', 'Luna'] },
  { consonante: 'T', nombre: 'Familia T', silabas: ['TA', 'TE', 'TI', 'TO', 'TU'], icono: '🍅', palabras: ['Taza', 'Tenedor', 'Tigre', 'Tomate', 'Tucán'] },
  { consonante: 'N', nombre: 'Familia N', silabas: ['NA', 'NE', 'NI', 'NO', 'NU'], icono: '🪺', palabras: ['Naranja', 'Nene', 'Nido', 'Noche', 'Nube'] },
  { consonante: 'D', nombre: 'Familia D', silabas: ['DA', 'DE', 'DI', 'DO', 'DU'], icono: '🎲', palabras: ['Dado', 'Dedo', 'Diente', 'Dona', 'Duende'] },
  { consonante: 'B', nombre: 'Familia B', silabas: ['BA', 'BE', 'BI', 'BO', 'BU'], icono: '⛵', palabras: ['Barco', 'Bebé', 'Bicicleta', 'Bota', 'Burro'] },
  { consonante: 'C', nombre: 'Familia C', silabas: ['CA', 'CE', 'CI', 'CO', 'CU'], icono: '🏠', palabras: ['Casa', 'Cereal', 'Circo', 'Conejo', 'Cuna'] },
  { consonante: 'R', nombre: 'Familia R', silabas: ['RA', 'RE', 'RI', 'RO', 'RU'], icono: '🐸', palabras: ['Ratón', 'Regalo', 'Risa', 'Rosa', 'Rueda'] },
  { consonante: 'G', nombre: 'Familia G', silabas: ['GA', 'GE', 'GI', 'GO', 'GU'], icono: '🐱', palabras: ['Gato', 'Gelatina', 'Girasol', 'Gota', 'Gusano'] },
  { consonante: 'F', nombre: 'Familia F', silabas: ['FA', 'FE', 'FI', 'FO', 'FU'], icono: '🌸', palabras: ['Familia', 'Feliz', 'Fiesta', 'Foca', 'Fuego'] },
  { consonante: 'J', nombre: 'Familia J', silabas: ['JA', 'JE', 'JI', 'JO', 'JU'], icono: '🦒', palabras: ['Jabón', 'Jefe', 'Jirafa', 'Joya', 'Jugo'] },
  { consonante: 'V', nombre: 'Familia V', silabas: ['VA', 'VE', 'VI', 'VO', 'VU'], icono: '🐄', palabras: ['Vaca', 'Vela', 'Viento', 'Volcán', 'Vuelo'] }
];

export default function AbecedarioSonoro() {
  const [modo, setModo] = useState('letras'); // 'letras', 'silabas', 'escucha'
  const [letraSeleccionada, setLetraSeleccionada] = useState(ABECEDARIO[0]);
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState(FAMILIAS_SILABAS[0]);

  // Estado para el juego auditivo "Escucha y Atrapa"
  const [preguntaAuditiva, setPreguntaAuditiva] = useState(null);
  const [opcionesAuditivas, setOpcionesAuditivas] = useState([]);
  const [mensajeAudicion, setMensajeAudicion] = useState('');
  const [puntosOido, setPuntosOido] = useState(0);

  // Iniciar nueva ronda de escucha
  const nuevaRondaEscucha = () => {
    const correcta = ABECEDARIO[Math.floor(Math.random() * ABECEDARIO.length)];
    // Elegir 3 distractores
    const distractores = ABECEDARIO.filter((item) => item.letra !== correcta.letra)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const opciones = [correcta, ...distractores].sort(() => Math.random() - 0.5);

    setPreguntaAuditiva(correcta);
    setOpcionesAuditivas(opciones);
    setMensajeAudicion(`Toca la letra ${correcta.letra} de ${correcta.palabra}`);

    // Decir en voz alta la instrucción
    setTimeout(() => {
      voiceReader.speak(
        `¿Dónde está la letra ${correcta.letra}? Como en ${correcta.palabra}. ¡Tócala!`,
        () => {},
        0.88,
        1.0
      );
    }, 200);
  };

  useEffect(() => {
    if (modo === 'escucha') {
      nuevaRondaEscucha();
    }
  }, [modo]);

  const tocarLetra = (item) => {
    sounds.playPop();
    setLetraSeleccionada(item);
    // Pronunciación de voz alta
    voiceReader.speakLetter(item.letra, item.palabra);
  };

  const tocarSilaba = (silaba, palabraEjemplo) => {
    sounds.playPop();
    voiceReader.speak(`${silaba}... como en ${palabraEjemplo}`, () => {}, 0.88, 1.0);
  };

  const responderAuditivo = (opcion) => {
    if (!preguntaAuditiva) return;

    if (opcion.letra === preguntaAuditiva.letra) {
      sounds.playCorrect();
      lanzarConfeti();
      setPuntosOido((p) => p + 100);
      GameProgress.addXP(100, 'oido_oro');
      setMensajeAudicion(`¡Excelente! ¡Esa es la letra ${opcion.letra} de ${opcion.palabra}!`);
      voiceReader.speak(`¡Muy bien! ¡Encontraste la letra ${opcion.letra} de ${opcion.palabra}!`, () => {
        setTimeout(nuevaRondaEscucha, 1200);
      });
    } else {
      sounds.playWrong();
      setMensajeAudicion(`Esa es la letra ${opcion.letra}. ¡Sigue buscando la letra ${preguntaAuditiva.letra}!`);
      voiceReader.speak(`Esa es la letra ${opcion.letra}. Busca la letra ${preguntaAuditiva.letra} de ${preguntaAuditiva.palabra}.`, () => {});
    }
  };

  const repetirInstruccionAudio = () => {
    if (!preguntaAuditiva) return;
    sounds.playClick();
    voiceReader.speak(
      `Escucha bien: ¿Dónde está la letra ${preguntaAuditiva.letra} de ${preguntaAuditiva.palabra}?`,
      () => {},
      0.9,
      1.1
    );
  };

  return (
    <div className="bg-gradient-to-b from-amber-50 via-white to-orange-50 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-amber-300 space-y-6">
      {/* Cabecera con selector de modos */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-amber-200 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-1.5 shadow-sm">
            <span>🗣️</span> Fonética y Sonidos Reales con Voz
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <span>🔤</span> El Abecedario Parlante
          </h3>
          <p className="text-xs sm:text-sm font-bold text-amber-800">
            ¡Toca cualquier letra o sílaba para escuchar cómo suena con voz humana!
          </p>
        </div>

        {/* Botones de Modo */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setModo('letras');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 ${
              modo === 'letras'
                ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-amber-100'
            }`}
          >
            <span>🔠</span> Letras y Vocales
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setModo('silabas');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 ${
              modo === 'silabas'
                ? 'bg-emerald-500 text-white border-emerald-700 shadow-md scale-105'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-emerald-100'
            }`}
          >
            <span>🧩</span> Sílabas Parlantes
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setModo('escucha');
            }}
            className={`px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 ${
              modo === 'escucha'
                ? 'bg-rose-500 text-white border-rose-700 shadow-md scale-105 animate-pulse'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-rose-100'
            }`}
          >
            <span>👂</span> ¡Juego: Escucha y Toca!
          </button>
        </div>
      </div>

      {/* ══════════ MODO 1: EXPLORADOR DE LETRAS Y VOCALES ══════════ */}
      {modo === 'letras' && (
        <div className="space-y-6 animate-fade-in">
          {/* Tarjeta Gigante de la Letra Activa */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white font-black text-5xl sm:text-6xl flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
                {letraSeleccionada.letra}
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                  {letraSeleccionada.tipo === 'vocal' ? '🌟 Vocal Sagrada' : '🔷 Consonante'}
                </span>
                <h4 className="text-3xl sm:text-4xl font-black text-slate-800 mt-1">
                  {letraSeleccionada.letra} {letraSeleccionada.min} • {letraSeleccionada.palabra}
                </h4>
                <p className="text-sm font-bold text-slate-500 mt-1">
                  Toca el botón parlante para escuchar el sonido de la letra:
                </p>
              </div>
            </div>

            <button
              onClick={() => voiceReader.speakLetter(letraSeleccionada.letra, letraSeleccionada.palabra)}
              className="px-6 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-base sm:text-lg shadow-xl border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-3 cursor-pointer shrink-0"
            >
              <span className="text-3xl">🔊</span>
              <span>¡Escuchar {letraSeleccionada.letra}!</span>
            </button>
          </div>

          {/* Cuadrícula de Todo el Abecedario */}
          <div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 text-center">
              Toca cualquier letra del abecedario para que hable en voz alta:
            </span>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2.5 sm:gap-3">
              {ABECEDARIO.map((item) => {
                const activa = letraSeleccionada.letra === item.letra;
                return (
                  <button
                    key={item.letra}
                    onClick={() => tocarLetra(item)}
                    className={`h-24 sm:h-28 rounded-2xl p-2 flex flex-col items-center justify-center border-b-4 transition-all duration-150 cursor-pointer select-none active:border-b-0 active:translate-y-1 ${
                      activa
                        ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-xl scale-105 ring-4 ring-amber-300'
                        : item.tipo === 'vocal'
                        ? 'bg-gradient-to-b from-yellow-300 to-amber-400 text-amber-950 border-amber-500 shadow-md hover:scale-105'
                        : 'bg-white hover:bg-amber-50 text-slate-800 border-slate-300 hover:border-amber-400 shadow-sm hover:scale-105'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl font-black leading-none mb-1">
                      {item.letra} <span className="text-xs font-bold text-slate-500">{item.min}</span>
                    </span>
                    <span className="text-2xl sm:text-3xl mb-0.5">{item.icono}</span>
                    <span className="text-[10px] font-black uppercase tracking-tight text-center truncate max-w-full">
                      {item.palabra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODO 2: SÍLABAS PARLANTES ══════════ */}
      {modo === 'silabas' && (
        <div className="space-y-6 animate-fade-in">
          {/* Selector de Consonante */}
          <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-emerald-300">
            <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block mb-3">
              Elige una familia de consonante para escuchar sus sílabas con las vocales:
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {FAMILIAS_SILABAS.map((fam) => (
                <button
                  key={fam.consonante}
                  onClick={() => {
                    sounds.playClick();
                    setFamiliaSeleccionada(fam);
                    voiceReader.speak(`Familia de la letra ${fam.consonante}`);
                  }}
                  className={`px-4 py-2.5 rounded-2xl font-black text-sm transition-all flex items-center gap-2 cursor-pointer border-b-4 active:border-b-0 active:translate-y-1 ${
                    familiaSeleccionada.consonante === fam.consonante
                      ? 'bg-emerald-500 text-white border-emerald-700 shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-white'
                  }`}
                >
                  <span className="text-xl">{fam.icono}</span>
                  <span>Letra {fam.consonante}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tarjetas Gigantes de Sílabas Sonoras */}
          <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-xl border-4 border-emerald-400 space-y-4">
            <div className="text-center">
              <span className="text-xs font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                {familiaSeleccionada.nombre}
              </span>
              <h4 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                ¡Toca cada sílaba para escuchar cómo suena!
              </h4>
              <p className="text-sm font-bold text-slate-500">
                La consonante {familiaSeleccionada.consonante} se junta con A, E, I, O, U:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2">
              {familiaSeleccionada.silabas.map((silaba, idx) => {
                const palabra = familiaSeleccionada.palabras[idx];
                return (
                  <button
                    key={silaba}
                    onClick={() => tocarSilaba(silaba, palabra)}
                    className="h-36 sm:h-44 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600 hover:from-emerald-500 hover:to-teal-700 text-white border-b-6 border-teal-800 flex flex-col items-center justify-center p-3 shadow-xl transition-all cursor-pointer active:scale-95 active:border-b-0 hover:scale-105"
                  >
                    <span className="text-4xl sm:text-5xl font-black tracking-tight mb-2">
                      {silaba}
                    </span>
                    <span className="text-2xl mb-1">🔊</span>
                    <span className="text-xs font-black bg-white/20 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Como en {palabra}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODO 3: JUEGO AUDITIVO "ESCUCHA Y TOCA" ══════════ */}
      {modo === 'escucha' && (
        <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-2xl border-4 border-rose-300 space-y-6 text-center animate-fade-in">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-4">
            <div className="flex items-center gap-3 text-left">
              <span className="text-4xl">👂</span>
              <div>
                <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  Desafío Auditivo para Quienes Están Aprendiendo a Leer
                </span>
                <h4 className="text-2xl font-black text-slate-800 mt-1">
                  ¡Abre bien tus oídos y toca la tarjeta correcta!
                </h4>
              </div>
            </div>

            <div className="bg-amber-100 border-2 border-amber-300 px-4 py-2 rounded-2xl flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="font-black text-amber-950 text-base">{puntosOido} pts</span>
            </div>
          </div>

          {/* Botón para volver a escuchar la voz */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={repetirInstruccionAudio}
              className="px-6 py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-lg transition-all flex items-center gap-2 cursor-pointer active:scale-95 animate-pulse"
            >
              <span>🔊</span> ¡Volver a Escuchar la Pregunta!
            </button>
            <p className="text-base font-extrabold text-slate-700">{mensajeAudicion}</p>
          </div>

          {/* Opciones Gigantes para Tocar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-4">
            {opcionesAuditivas.map((opcion) => (
              <button
                key={opcion.letra}
                onClick={() => responderAuditivo(opcion)}
                className="h-44 sm:h-52 rounded-3xl bg-gradient-to-b from-white to-slate-50 hover:bg-amber-50 text-slate-800 border-b-6 border-slate-300 hover:border-amber-500 flex flex-col items-center justify-center p-4 shadow-xl transition-all cursor-pointer active:scale-90 active:border-b-0 hover:scale-105"
              >
                <span className="text-5xl sm:text-6xl font-black text-slate-800 mb-2">
                  {opcion.letra}
                </span>
                <span className="text-4xl mb-1">{opcion.icono}</span>
                <span className="text-xs font-black text-slate-600 uppercase tracking-wider">
                  {opcion.palabra}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
