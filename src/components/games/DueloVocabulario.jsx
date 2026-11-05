import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

// ─── Question Bank (30+ questions) ──────────────────────────────────────────
const BANCO_PREGUNTAS = [
  // ── Literary Terms ──
  { palabra: 'Metáfora', opciones: ['Comparación implícita entre dos elementos', 'Repetición de sonidos consonánticos', 'Exageración intencional', 'Atribución de cualidades humanas'], correcta: 0, categoria: 'Figuras Literarias' },
  { palabra: 'Hipérbole', opciones: ['Contradicción aparente', 'Exageración intencional para enfatizar', 'Repetición de una palabra al inicio', 'Imitación de sonidos naturales'], correcta: 1, categoria: 'Figuras Literarias' },
  { palabra: 'Onomatopeya', opciones: ['Atribución de cualidades humanas', 'Comparación usando "como"', 'Palabra que imita un sonido real', 'Figura que expresa lo contrario'], correcta: 2, categoria: 'Figuras Literarias' },
  { palabra: 'Aliteración', opciones: ['Exageración retórica', 'Comparación directa', 'Contradicción de términos', 'Repetición de sonidos consonánticos similares'], correcta: 3, categoria: 'Figuras Literarias' },
  { palabra: 'Prosopopeya', opciones: ['Atribuir cualidades humanas a seres no humanos', 'Juego de palabras con doble sentido', 'Repetición al final de versos', 'Enumeración de elementos'], correcta: 0, categoria: 'Figuras Literarias' },
  { palabra: 'Símil', opciones: ['Exageración de un defecto', 'Comparación explícita usando "como" o "cual"', 'Inversión del orden gramatical', 'Omisión de palabras'], correcta: 1, categoria: 'Figuras Literarias' },
  { palabra: 'Antítesis', opciones: ['Repetición de vocales', 'Omisión intencional', 'Contraposición de ideas opuestas', 'Atribución de cualidades humanas'], correcta: 2, categoria: 'Figuras Literarias' },
  { palabra: 'Ironía', opciones: ['Repetición de consonantes', 'Comparación implícita', 'Exageración extrema', 'Expresar lo contrario de lo que se quiere decir'], correcta: 3, categoria: 'Figuras Literarias' },
  { palabra: 'Anáfora', opciones: ['Repetición de palabras al inicio de versos sucesivos', 'Omisión de conjunciones', 'Alteración del orden lógico', 'Sustitución de un nombre por una cualidad'], correcta: 0, categoria: 'Figuras Literarias' },
  { palabra: 'Oxímoron', opciones: ['Exageración intencional', 'Unión de dos conceptos contradictorios', 'Repetición de sonidos vocálicos', 'Descripción detallada de un lugar'], correcta: 1, categoria: 'Figuras Literarias' },

  // ── Grammar ──
  { palabra: 'Sujeto', opciones: ['Complemento del verbo', 'Modificador del adjetivo', 'Quien realiza la acción en la oración', 'Palabra que conecta oraciones'], correcta: 2, categoria: 'Gramática' },
  { palabra: 'Predicado', opciones: ['Nombre propio en la oración', 'Artículo que acompaña al sustantivo', 'Palabra que modifica al verbo', 'Lo que se dice del sujeto, incluye el verbo'], correcta: 3, categoria: 'Gramática' },
  { palabra: 'Adverbio', opciones: ['Palabra que modifica al verbo, adjetivo u otro adverbio', 'Sustantivo abstracto', 'Pronombre demostrativo', 'Conjunción coordinante'], correcta: 0, categoria: 'Gramática' },
  { palabra: 'Pronombre', opciones: ['Palabra que une oraciones', 'Palabra que sustituye al nombre', 'Palabra que indica acción', 'Palabra que califica al sustantivo'], correcta: 1, categoria: 'Gramática' },
  { palabra: 'Conjunción', opciones: ['Modifica al sustantivo', 'Expresa una acción', 'Palabra que une palabras u oraciones', 'Indica el género del sustantivo'], correcta: 2, categoria: 'Gramática' },
  { palabra: 'Preposición', opciones: ['Palabra que expresa acción', 'Palabra que califica', 'Palabra que sustituye al nombre', 'Palabra invariable que une elementos subordinados'], correcta: 3, categoria: 'Gramática' },
  { palabra: 'Oración Compuesta', opciones: ['Oración con dos o más verbos conjugados', 'Oración sin verbo', 'Oración con un solo sujeto simple', 'Oración que solo tiene predicado'], correcta: 0, categoria: 'Gramática' },
  { palabra: 'Complemento Directo', opciones: ['Indica circunstancia de la acción', 'Recibe directamente la acción del verbo', 'Modifica al adjetivo', 'Indica el lugar de la acción'], correcta: 1, categoria: 'Gramática' },
  { palabra: 'Verbo Copulativo', opciones: ['Expresa acción física', 'Indica movimiento', 'Une el sujeto con un atributo (ser, estar, parecer)', 'Siempre es transitivo'], correcta: 2, categoria: 'Gramática' },
  { palabra: 'Oración Subordinada', opciones: ['No tiene verbo conjugado', 'Es siempre la oración principal', 'Tiene significado completo por sí sola', 'Depende de otra oración principal'], correcta: 3, categoria: 'Gramática' },

  // ── Vocabulary ──
  { palabra: 'Sinónimo de "efímero"', opciones: ['Pasajero, fugaz', 'Eterno, permanente', 'Brillante, luminoso', 'Oscuro, sombrío'], correcta: 0, categoria: 'Vocabulario' },
  { palabra: 'Antónimo de "prolijo"', opciones: ['Extenso, detallado', 'Breve, conciso', 'Elegante, refinado', 'Antiguo, vetusto'], correcta: 1, categoria: 'Vocabulario' },
  { palabra: 'Significado de "ubicuo"', opciones: ['Que es muy antiguo', 'Que está en desuso', 'Que está presente en todas partes', 'Que es difícil de encontrar'], correcta: 2, categoria: 'Vocabulario' },
  { palabra: 'Sinónimo de "lacónico"', opciones: ['Extenso y detallado', 'Alegre y festivo', 'Triste y melancólico', 'Breve, conciso, de pocas palabras'], correcta: 3, categoria: 'Vocabulario' },
  { palabra: 'Significado de "acervo"', opciones: ['Conjunto de bienes o valores culturales', 'Sentimiento de amargura', 'Tipo de árbol tropical', 'Instrumento musical antiguo'], correcta: 0, categoria: 'Vocabulario' },
  { palabra: 'Antónimo de "elocuente"', opciones: ['Persuasivo y fluido', 'Torpe para expresarse, inarticulate', 'Elegante y sofisticado', 'Ruidoso y estridente'], correcta: 1, categoria: 'Vocabulario' },

  // ── Colombian / Latin American Literature ──
  { palabra: '¿Quién escribió "Cien Años de Soledad"?', opciones: ['Pablo Neruda', 'Jorge Luis Borges', 'Gabriel García Márquez', 'Julio Cortázar'], correcta: 2, categoria: 'Literatura' },
  { palabra: 'El Realismo Mágico es...', opciones: ['Un movimiento solo de pintura', 'Una técnica de teatro griego', 'Un género de ciencia ficción', 'Una corriente que mezcla lo real con lo fantástico'], correcta: 3, categoria: 'Literatura' },
  { palabra: '¿Qué obra escribió José Asunción Silva?', opciones: ['"Nocturno III"', '"La Vorágine"', '"María"', '"El Túnel"'], correcta: 0, categoria: 'Literatura' },
  { palabra: '"La Vorágine" fue escrita por...', opciones: ['Gabriel García Márquez', 'José Eustasio Rivera', 'Jorge Isaacs', 'Andrés Bello'], correcta: 1, categoria: 'Literatura' },
  { palabra: '"María" es una novela de...', opciones: ['Rafael Pombo', 'Tomás Carrasquilla', 'Jorge Isaacs', 'José Asunción Silva'], correcta: 2, categoria: 'Literatura' },
  { palabra: 'El "Boom Latinoamericano" incluyó a...', opciones: ['Solo poetas españoles', 'Solo dramaturgos brasileños', 'Escritores del siglo XVIII', 'García Márquez, Cortázar, Vargas Llosa y Fuentes'], correcta: 3, categoria: 'Literatura' },
];

const TOTAL_RONDAS = 10;
const TIEMPO_POR_PREGUNTA = 15;
const PUNTOS_BASE = 100;
const PUNTOS_MAX_SPEED = 200;
const MULTIPLICADOR_MAX = 5;
const SCORE_CONFETI = 1500;

// ─── Utility: shuffle array ─────────────────────────────────────────────────
function barajar(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

// ─── Circular Timer SVG ─────────────────────────────────────────────────────
function CircularTimer({ tiempoRestante, tiempoTotal }) {
  const radio = 40;
  const circunferencia = 2 * Math.PI * radio;
  const progreso = (tiempoRestante / tiempoTotal) * circunferencia;
  const porcentaje = tiempoRestante / tiempoTotal;

  const color = porcentaje > 0.5 ? '#22c55e' : porcentaje > 0.25 ? '#eab308' : '#ef4444';
  const glowColor = porcentaje > 0.5 ? 'drop-shadow(0 0 8px #22c55e)' : porcentaje > 0.25 ? 'drop-shadow(0 0 8px #eab308)' : 'drop-shadow(0 0 8px #ef4444)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 100, height: 100 }}>
      <svg width="100" height="100" className="transform -rotate-90" style={{ filter: glowColor }}>
        <circle cx="50" cy="50" r={radio} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radio}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          strokeDashoffset={circunferencia - progreso}
          style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="absolute text-2xl font-black tabular-nums"
        style={{ color, transition: 'color 0.3s ease' }}
      >
        {Math.ceil(tiempoRestante)}
      </span>
    </div>
  );
}

// ─── Streak Badge ────────────────────────────────────────────────────────────
function RachaInsignia({ racha, multiplicador }) {
  if (racha < 2) return null;
  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/40 animate-pulse">
      
      <div className="flex flex-col leading-tight">
        <span className="text-orange-300 text-xs font-semibold tracking-widest uppercase">Racha</span>
        <span className="text-white font-black text-lg">{racha} <span className="text-orange-400 text-sm">×{multiplicador}</span></span>
      </div>
    </div>
  );
}

// ─── Option Card ─────────────────────────────────────────────────────────────
const LETRAS = ['A', 'B', 'C', 'D'];
const COLORES_OPCION = [
  { border: 'border-cyan-400/40', hoverBg: 'hover:bg-cyan-500/15', glow: 'hover:shadow-cyan-500/20', activeBg: 'bg-cyan-500/20', letter: 'bg-cyan-500/30 text-cyan-300' },
  { border: 'border-violet-400/40', hoverBg: 'hover:bg-violet-500/15', glow: 'hover:shadow-violet-500/20', activeBg: 'bg-violet-500/20', letter: 'bg-violet-500/30 text-violet-300' },
  { border: 'border-amber-400/40', hoverBg: 'hover:bg-amber-500/15', glow: 'hover:shadow-amber-500/20', activeBg: 'bg-amber-500/20', letter: 'bg-amber-500/30 text-amber-300' },
  { border: 'border-emerald-400/40', hoverBg: 'hover:bg-emerald-500/15', glow: 'hover:shadow-emerald-500/20', activeBg: 'bg-emerald-500/20', letter: 'bg-emerald-500/30 text-emerald-300' },
];

function TarjetaOpcion({ indice, texto, onClick, estado, esCorrecta, deshabilitada }) {
  const col = COLORES_OPCION[indice];

  let clasesExtra = '';
  if (estado === 'correcta') {
    clasesExtra = 'ring-2 ring-emerald-400 bg-emerald-500/25 scale-[1.03]';
  } else if (estado === 'incorrecta') {
    clasesExtra = 'ring-2 ring-red-400 bg-red-500/25 opacity-70 scale-95';
  } else if (estado === 'revelada') {
    clasesExtra = 'ring-2 ring-emerald-400/50 bg-emerald-500/10';
  }

  return (
    <button
      onClick={onClick}
      disabled={deshabilitada}
      className={`
        relative group w-full text-left p-4 rounded-2xl border transition-all duration-300
        bg-white/5 backdrop-blur-sm
        ${col.border} ${!deshabilitada ? `${col.hoverBg} ${col.glow} hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]` : ''}
        ${clasesExtra}
        ${deshabilitada && !estado ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="flex items-start gap-3">
        <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${col.letter}`}>
          {LETRAS[indice]}
        </span>
        <span className="text-white/90 text-sm sm:text-base font-medium leading-snug pt-1">{texto}</span>
      </div>
    </button>
  );
}

// ─── Score Counter with Animation ────────────────────────────────────────────
function ContadorPuntaje({ puntaje }) {
  const [mostrado, setMostrado] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const inicio = mostrado;
    const diff = puntaje - inicio;
    if (diff === 0) return;
    const duracion = 400;
    const tInicio = performance.now();

    function animar(t) {
      const progreso = Math.min((t - tInicio) / duracion, 1);
      const ease = 1 - Math.pow(1 - progreso, 3);
      setMostrado(Math.round(inicio + diff * ease));
      if (progreso < 1) ref.current = requestAnimationFrame(animar);
    }
    ref.current = requestAnimationFrame(animar);
    return () => cancelAnimationFrame(ref.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puntaje]);

  return (
    <div className="text-center">
      <div className="text-xs font-semibold tracking-widest uppercase text-indigo-300">Puntaje</div>
      <div className="text-3xl sm:text-4xl font-black text-white tabular-nums">{mostrado.toLocaleString()}</div>
    </div>
  );
}

// ─── Points Popup ────────────────────────────────────────────────────────────
function PopupPuntos({ puntos, visible }) {
  if (!visible) return null;
  return (
    <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-emerald-400 font-black text-xl pointer-events-none">
      +{puntos}
    </div>
  );
}

// ─── Final Score Screen ──────────────────────────────────────────────────────
function PantallaFinal({ puntaje, correctas, totalRondas, mejorRacha, tiempoPromedio, onReiniciar }) {
  const porcentaje = Math.round((correctas / totalRondas) * 100);

  let mensaje, emoji;
  if (porcentaje >= 90) { mensaje = '¡Rendimiento Excepcional!'; emoji = ''; }
  else if (porcentaje >= 70) { mensaje = '¡Muy Bien Hecho!'; emoji = ''; }
  else if (porcentaje >= 50) { mensaje = '¡Buen Esfuerzo!'; emoji = ''; }
  else { mensaje = 'Sigue Practicando'; emoji = ''; }

  return (
    <div className="flex flex-col items-center gap-6 py-4 animate-in fade-in duration-700">
      <div className="text-6xl">{emoji}</div>
      <h2 className="text-2xl sm:text-3xl font-black text-white text-center">{mensaje}</h2>

      <div className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-violet-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
        {puntaje.toLocaleString()}
      </div>
      <span className="text-indigo-300 text-sm font-semibold tracking-widest uppercase -mt-4">Puntos Totales</span>

      <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-2">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <div className="text-2xl font-black text-emerald-400">{correctas}/{totalRondas}</div>
          <div className="text-xs text-indigo-300 mt-1">Correctas</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
            {mejorRacha} 
          </div>
          <div className="text-xs text-indigo-300 mt-1">Mejor Racha</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/10">
          <div className="text-2xl font-black text-cyan-400">{tiempoPromedio}s</div>
          <div className="text-xs text-indigo-300 mt-1">Tiempo Prom.</div>
        </div>
      </div>

      <button
        onClick={onReiniciar}
        className="mt-4 px-8 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg
          hover:from-violet-500 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200
          shadow-lg shadow-violet-500/30"
      >
        Jugar de Nuevo
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ─── Main Component ──────────────────────────────────────────────────────────
// ═════════════════════════════════════════════════════════════════════════════
export default function DueloVocabulario({ gradoNumero = 7 }) {
  // ── Game state ──
  const [fase, setFase] = useState('intro'); // 'intro' | 'jugando' | 'resultado'
  const [preguntas, setPreguntas] = useState([]);
  const [rondaActual, setRondaActual] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [correctas, setCorrectas] = useState(0);
  const [tiemposRespuesta, setTiemposRespuesta] = useState([]);

  // ── Round state ──
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_POR_PREGUNTA);
  const [seleccion, setSeleccion] = useState(null); // index selected
  const [estadoRespuesta, setEstadoRespuesta] = useState(null); // 'correcta' | 'incorrecta' | 'timeout'
  const [puntosGanados, setPuntosGanados] = useState(0);
  const [mostrarPuntos, setMostrarPuntos] = useState(false);

  const timerRef = useRef(null);
  const inicioRondaRef = useRef(null);

  // ── Initialize game ──
  const iniciarJuego = useCallback(() => {
    const seleccionadas = barajar(BANCO_PREGUNTAS).slice(0, TOTAL_RONDAS);
    setPreguntas(seleccionadas);
    setRondaActual(0);
    setPuntaje(0);
    setRacha(0);
    setMejorRacha(0);
    setCorrectas(0);
    setTiemposRespuesta([]);
    setSeleccion(null);
    setEstadoRespuesta(null);
    setPuntosGanados(0);
    setMostrarPuntos(false);
    setFase('jugando');
  }, []);

  // ── Timer logic ──
  useEffect(() => {
    if (fase !== 'jugando' || estadoRespuesta) return;

    inicioRondaRef.current = Date.now();
    setTiempoRestante(TIEMPO_POR_PREGUNTA);

    timerRef.current = setInterval(() => {
      setTiempoRestante((prev) => {
        const nuevo = prev - 0.1;
        if (nuevo <= 0) {
          clearInterval(timerRef.current);
          return 0;
        }
        return nuevo;
      });
    }, 100);

    return () => clearInterval(timerRef.current);
  }, [fase, rondaActual, estadoRespuesta]);

  // ── Advance to next round ──
  const avanzarRonda = useCallback(() => {
    const siguiente = rondaActual + 1;
    if (siguiente >= TOTAL_RONDAS) {
      setFase('resultado');

      // Use a small timeout so state has settled
      setTimeout(() => {
        // Read latest puntaje from ref-like pattern via functional state
        setPuntaje((currentPuntaje) => {
          if (currentPuntaje >= SCORE_CONFETI) {
            try { lanzarConfeti(); } catch (_) { /* noop */ }
            try { sounds.playFanfare(); } catch (_) { /* noop */ }
          }
          try {
            GameProgress.addXP(currentPuntaje);
            GameProgress.registrarVictoria(mejorRacha);
          } catch (_) {}
          return currentPuntaje;
        });
      }, 300);
    } else {
      setRondaActual(siguiente);
      setSeleccion(null);
      setEstadoRespuesta(null);
      setPuntosGanados(0);
      setMostrarPuntos(false);
    }
  }, [rondaActual, mejorRacha]);

  // ── Handle timeout ──
  useEffect(() => {
    if (tiempoRestante <= 0 && fase === 'jugando' && !estadoRespuesta) {
      setEstadoRespuesta('timeout');
      setRacha(0);
      try { sounds.playWrong(); } catch (_) { /* noop */ }

      setTimeout(() => avanzarRonda(), 1800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiempoRestante, fase, estadoRespuesta, avanzarRonda]);

  // ── Handle answer selection ──
  const manejarRespuesta = useCallback((indice) => {
    if (estadoRespuesta || seleccion !== null) return;
    clearInterval(timerRef.current);

    const tiempoUsado = (Date.now() - inicioRondaRef.current) / 1000;
    const pregunta = preguntas[rondaActual];
    const esCorrecta = indice === pregunta.correcta;

    setSeleccion(indice);
    try { sounds.playClick(); } catch (_) { /* noop */ }

    if (esCorrecta) {
      setEstadoRespuesta('correcta');

      // Speed bonus: linear interpolation from max (instant) to base (at time limit)
      const fraccionTiempo = Math.max(0, 1 - tiempoUsado / TIEMPO_POR_PREGUNTA);
      const bonusVelocidad = Math.round(PUNTOS_BASE + (PUNTOS_MAX_SPEED - PUNTOS_BASE) * fraccionTiempo);

      const nuevaRacha = racha + 1;
      const multiplicador = Math.min(nuevaRacha, MULTIPLICADOR_MAX);
      const puntosRonda = bonusVelocidad * multiplicador;

      setRacha(nuevaRacha);
      setMejorRacha((prev) => Math.max(prev, nuevaRacha));
      setCorrectas((prev) => prev + 1);
      setPuntaje((prev) => prev + puntosRonda);
      setPuntosGanados(puntosRonda);
      setMostrarPuntos(true);
      setTiemposRespuesta((prev) => [...prev, tiempoUsado]);

      try { sounds.playCorrect(); } catch (_) { /* noop */ }
      setTimeout(() => setMostrarPuntos(false), 900);
    } else {
      setEstadoRespuesta('incorrecta');
      setRacha(0);
      setTiemposRespuesta((prev) => [...prev, tiempoUsado]);
      try { sounds.playWrong(); } catch (_) { /* noop */ }
    }

    setTimeout(() => avanzarRonda(), 1800);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estadoRespuesta, seleccion, preguntas, rondaActual, racha, avanzarRonda]);

  // ── Derived values ──
  const multiplicadorActual = Math.min(racha, MULTIPLICADOR_MAX);
  const preguntaActual = preguntas[rondaActual];
  const tiempoPromedio = tiemposRespuesta.length > 0
    ? (tiemposRespuesta.reduce((a, b) => a + b, 0) / tiemposRespuesta.length).toFixed(1)
    : '0.0';

  // ── Render helpers ──
  const getEstadoOpcion = (indice) => {
    if (!estadoRespuesta) return null;
    if (indice === preguntaActual?.correcta) {
      return 'correcta';
    }
    if (indice === seleccion && estadoRespuesta === 'incorrecta') {
      return 'incorrecta';
    }
    if (estadoRespuesta === 'timeout' && indice === preguntaActual?.correcta) {
      return 'revelada';
    }
    return null;
  };

  // ═════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-violet-500/30 w-full max-w-2xl mx-auto min-h-[520px] flex flex-col">

      {/* ── Intro Screen ── */}
      {fase === 'intro' && (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 animate-in fade-in duration-500">
          <div className="text-6xl"></div>
          <h1 className="text-3xl sm:text-4xl font-black text-white text-center">
            Duelo de <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Vocabulario</span>
          </h1>
          <p className="text-indigo-300 text-center max-w-sm text-sm sm:text-base">
            {TOTAL_RONDAS} rondas · {TIEMPO_POR_PREGUNTA}s por pregunta · Grado {gradoNumero}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs text-indigo-400">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10"> Figuras Literarias</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10"> Gramática</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10"> Vocabulario</span>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10"> Literatura</span>
          </div>
          <button
            onClick={iniciarJuego}
            className="mt-4 px-10 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-lg
              hover:from-violet-500 hover:to-indigo-500 hover:scale-105 active:scale-95 transition-all duration-200
              shadow-lg shadow-violet-500/30 relative overflow-hidden group"
          >
            <span className="relative z-10">Iniciar Duelo</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>
      )}

      {/* ── Playing Screen ── */}
      {fase === 'jugando' && preguntaActual && (
        <div className="flex-1 flex flex-col gap-5 animate-in fade-in duration-300">
          {/* Header: progress + score + streak */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
                {rondaActual + 1}<span className="text-indigo-600">/{TOTAL_RONDAS}</span>
              </div>
              <div className="w-24 sm:w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
                  style={{ width: `${((rondaActual + 1) / TOTAL_RONDAS) * 100}%` }}
                />
              </div>
            </div>
            <RachaInsignia racha={racha} multiplicador={multiplicadorActual} />
          </div>

          {/* Score + Timer row */}
          <div className="flex items-center justify-between">
            <div className="relative">
              <ContadorPuntaje puntaje={puntaje} />
              <PopupPuntos puntos={puntosGanados} visible={mostrarPuntos} />
            </div>
            <CircularTimer tiempoRestante={tiempoRestante} tiempoTotal={TIEMPO_POR_PREGUNTA} />
          </div>

          {/* Question Card */}
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold tracking-wider uppercase mb-3">
              {preguntaActual.categoria}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-snug">
              {preguntaActual.palabra}
            </h2>
          </div>

          {/* Options 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {preguntaActual.opciones.map((opcion, i) => (
              <TarjetaOpcion
                key={`${rondaActual}-${i}`}
                indice={i}
                texto={opcion}
                onClick={() => manejarRespuesta(i)}
                estado={getEstadoOpcion(i)}
                esCorrecta={i === preguntaActual.correcta}
                deshabilitada={!!estadoRespuesta}
              />
            ))}
          </div>

          {/* Feedback message */}
          {estadoRespuesta && (
            <div className={`text-center text-sm font-bold animate-in fade-in duration-200 ${
              estadoRespuesta === 'correcta' ? 'text-emerald-400' :
              estadoRespuesta === 'incorrecta' ? 'text-red-400' : 'text-amber-400'
            }`}>
              {estadoRespuesta === 'correcta' && `¡Correcto! +${puntosGanados} pts`}
              {estadoRespuesta === 'incorrecta' && '¡Incorrecto! La respuesta correcta está resaltada.'}
              {estadoRespuesta === 'timeout' && ' ¡Se acabó el tiempo!'}
            </div>
          )}

          {/* Multiplier indicator */}
          {racha >= 2 && !estadoRespuesta && (
            <div className="text-center text-xs text-orange-400 font-semibold animate-pulse">
              Multiplicador activo: ×{multiplicadorActual}
            </div>
          )}
        </div>
      )}

      {/* ── Result Screen ── */}
      {fase === 'resultado' && (
        <div className="flex-1 flex flex-col justify-center">
          <PantallaFinal
            puntaje={puntaje}
            correctas={correctas}
            totalRondas={TOTAL_RONDAS}
            mejorRacha={mejorRacha}
            tiempoPromedio={tiempoPromedio}
            onReiniciar={iniciarJuego}
          />
        </div>
      )}
    </div>
  );
}
