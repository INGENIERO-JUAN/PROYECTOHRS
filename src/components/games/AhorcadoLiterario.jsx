import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const PALABRAS_AHORCADO = [
  // Nivel 1: Grados 1° a 3° (Lectoescritura y tradición oral)
  { palabra: 'FABULA', pista: 'Historia con animales que nos enseña una moraleja.', icono: '🦊', nivel: 'Primaria' },
  { palabra: 'POEMA', pista: 'Texto con música, versos y rimas que conmueve el alma.', icono: '📜', nivel: 'Primaria' },
  { palabra: 'CUENTO', pista: 'Narración breve con inicio, nudo y desenlace.', icono: '📖', nivel: 'Primaria' },
  { palabra: 'MONTAÑA', pista: 'Elevación natural de la tierra donde nacen los ríos.', icono: '🏔️', nivel: 'Primaria' },
  { palabra: 'CANTO', pista: 'Melodía que hacen las aves y las personas con la voz.', icono: '🎶', nivel: 'Primaria' },
  { palabra: 'ESCUELA', pista: 'Lugar mágico donde aprendemos a leer, escribir y convivir.', icono: '🎒', nivel: 'Primaria' },
  { palabra: 'MADREMONTE', pista: 'Guardián mítico de los bosques y ríos en Colombia.', icono: '🌿', nivel: 'Primaria' },
  { palabra: 'COLIBRI', pista: 'Ave diminuta y veloz que liba el néctar de las flores.', icono: '🌸', nivel: 'Primaria' },
  { palabra: 'MARIPOSA', pista: 'Insecto alado de alas amarillas que revolotea en el jardín.', icono: '🦋', nivel: 'Primaria' },
  { palabra: 'BOCHICA', pista: 'Dios civilizador muisca que creó el Salto del Tequendama.', icono: '⚡', nivel: 'Primaria' },

  // Nivel 2: Grados 4° a 6° (Figuras retóricas y géneros literarios)
  { palabra: 'METAFORA', pista: 'Comparación poética directa entre dos realidades sin usar "como".', icono: '🎭', nivel: 'Intermedio' },
  { palabra: 'SIMIL', pista: 'Comparación explícita que usa palabras como "parece" o "como".', icono: '🔍', nivel: 'Intermedio' },
  { palabra: 'LEYENDA', pista: 'Relato tradicional que mezcla hechos históricos con fantasía popular.', icono: '✨', nivel: 'Intermedio' },
  { palabra: 'NARRADOR', pista: 'Voz que cuenta la historia en una novela o crónica.', icono: '🗣️', nivel: 'Intermedio' },
  { palabra: 'MORALEJA', pista: 'Lección o enseñanza moral al final de una fábula.', icono: '💡', nivel: 'Intermedio' },
  { palabra: 'ESTROFA', pista: 'Conjunto de versos agrupados en un poema.', icono: '📑', nivel: 'Intermedio' },
  { palabra: 'PROTAGONISTA', pista: 'Personaje principal alrededor del cual gira la trama.', icono: '🦸', nivel: 'Intermedio' },
  { palabra: 'ONOMATOPEYA', pista: 'Palabra que imita un sonido real (ej: ¡tic-tac!, ¡guau!).', icono: '💥', nivel: 'Intermedio' },
  { palabra: 'ANTITESIS', pista: 'Contraposición de dos ideas opuestas para enfatizar un sentido.', icono: '⚖️', nivel: 'Intermedio' },
  { palabra: 'DICCIONARIO', pista: 'Libro maestro que compila y define el vocabulario del idioma.', icono: '📚', nivel: 'Intermedio' },

  // Nivel 3: Grados 7° a 9° (Crítica, oratoria, Boom y ensayo)
  { palabra: 'HIPERBOLE', pista: 'Exageración intencional de la realidad para dar fuerza expresiva.', icono: '💥', nivel: 'Avanzado' },
  { palabra: 'MACONDO', pista: 'Pueblo mítico e inmortal creado por Gabriel García Márquez.', icono: '🦋', nivel: 'Avanzado' },
  { palabra: 'ARGUMENTO', pista: 'Razonamiento lógico que se emplea para probar o defender una tesis.', icono: '⚖️', nivel: 'Avanzado' },
  { palabra: 'CRONICA', pista: 'Género híbrido que narra hechos reales con técnicas literarias.', icono: '📰', nivel: 'Avanzado' },
  { palabra: 'PARADOJA', pista: 'Idea o hecho que parece contrario a la lógica pero encierra verdad.', icono: '🌀', nivel: 'Avanzado' },
  { palabra: 'SINTAXIS', pista: 'Parte de la gramática que estudia cómo se combinan las palabras.', icono: '📐', nivel: 'Avanzado' },
  { palabra: 'OXIMORON', pista: 'Unión de dos términos contradictorios como "silencio ensordecedor".', icono: '⚡', nivel: 'Avanzado' },
  { palabra: 'ANAFORA', pista: 'Repetición intencional de una o más palabras al inicio de versos.', icono: '🔁', nivel: 'Avanzado' },
  { palabra: 'VORAGINE', pista: 'Gran novela de la selva y las caucherías de José Eustasio Rivera.', icono: '🌳', nivel: 'Avanzado' },
  { palabra: 'SOLILOQUIO', pista: 'Discurso reflexivo que un personaje pronuncia a solas en voz alta.', icono: '🎙️', nivel: 'Avanzado' }
];

export default function AhorcadoLiterario({ gradoNumero = 1 }) {
  const filtroInicial = gradoNumero <= 3 ? 'Primaria' : gradoNumero <= 6 ? 'Intermedio' : 'Avanzado';
  const [nivelFiltro, setNivelFiltro] = useState(filtroInicial);
  const [indicePalabra, setIndicePalabra] = useState(0);
  const [letrasUsadas, setLetrasUsadas] = useState([]);
  const [errores, setErrores] = useState(0);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [ganado, setGanado] = useState(false);
  const [puntaje, setPuntaje] = useState(0);

  const palabrasFiltradas = PALABRAS_AHORCADO.filter((p) => p.nivel === nivelFiltro);
  const retoActual = palabrasFiltradas[indicePalabra % palabrasFiltradas.length];
  const maxErrores = 6;

  // Iniciar palabra
  const cargarPalabra = (idx, nivel = nivelFiltro) => {
    const lista = PALABRAS_AHORCADO.filter((p) => p.nivel === nivel);
    const item = lista[idx % lista.length];
    setLetrasUsadas([]);
    setErrores(0);
    setJuegoTerminado(false);
    setGanado(false);
  };

  useEffect(() => {
    cargarPalabra(indicePalabra, nivelFiltro);
  }, [indicePalabra, nivelFiltro]);

  const seleccionarLetra = (letra) => {
    if (letrasUsadas.includes(letra) || juegoTerminado) return;
    sounds.playClick();
    // Pronunciar letra en voz alta
    voiceReader.speakLetter(letra);

    const nuevasUsadas = [...letrasUsadas, letra];
    setLetrasUsadas(nuevasUsadas);

    const palabraLimpia = retoActual.palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    if (palabraLimpia.includes(letra)) {
      sounds.playCorrect();
      // Verificar si ya completó todas las letras
      const todasReveladas = palabraLimpia.split('').every((char) => nuevasUsadas.includes(char));
      if (todasReveladas) {
        sounds.playFanfare();
        lanzarConfeti();
        setGanado(true);
        setJuegoTerminado(true);
        const puntosGanados = Math.max(50, 150 - errores * 15);
        setPuntaje((p) => p + puntosGanados);
        GameProgress.addXP(puntosGanados);
        setTimeout(() => {
          voiceReader.speak(`¡Excelente trabajo! Descubriste la palabra secreta: ${retoActual.palabra}. ${retoActual.pista}`);
        }, 300);
      }
    } else {
      sounds.playWrong();
      const nuevosErrores = errores + 1;
      setErrores(nuevosErrores);
      if (nuevosErrores >= maxErrores) {
        setJuegoTerminado(true);
        setGanado(false);
        setTimeout(() => {
          voiceReader.speak(`¡Oh no! Se acabaron los intentos. La palabra misteriosa era: ${retoActual.palabra}.`);
        }, 300);
      }
    }
  };

  const escucharPista = () => {
    sounds.playClick();
    voiceReader.speak(`Pista de la palabra misteriosa: ${retoActual.pista}`);
  };

  const palabraLimpia = retoActual.palabra.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const letrasFilas = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
    ['J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q'],
    ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  ];

  // Gráfico visual del explorador según los errores (0 a 6)
  const etapasDibujo = [
    '🏕️ Campamento seguro',
    '🧭 El explorador busca el mapa',
    '🔦 Enciende la linterna secreta',
    '🎒 Revisa la brújula',
    '⚠️ ¡Cuidado, se nubla el camino!',
    '🚨 ¡Última oportunidad de rescate!',
    '❌ ¡El misterio se esfumó!'
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-indigo-400 text-white space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-800/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest bg-indigo-900 text-indigo-300 px-3 py-1 rounded-full border border-indigo-700">
              Juego de Letras y Adivinanza
            </span>
            <span className="text-xs font-bold text-slate-400">
              Palabra {indicePalabra + 1} de {palabrasFiltradas.length}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2">
            <span>🕵️</span> El Enigma de la Palabra Secreta
          </h3>
          <p className="text-xs sm:text-sm text-slate-300">
            Toca las letras para descifrar la palabra antes de que se agoten tus 6 oportunidades.
          </p>
        </div>

        {/* Selector de Nivel */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-indigo-800">
          {['Primaria', 'Intermedio', 'Avanzado'].map((niv) => (
            <button
              key={niv}
              onClick={() => {
                sounds.playClick();
                setNivelFiltro(niv);
                setIndicePalabra(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                nivelFiltro === niv
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {niv}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Superior: Pista y Estado del Explorador */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 bg-slate-950/70 border border-indigo-800/80 p-4 sm:p-5 rounded-3xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>💡</span> Pista del Profesor
            </span>
            <button
              onClick={escucharPista}
              className="px-3 py-1 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <span>🔊</span> Escuchar pista
            </button>
          </div>
          <p className="text-white font-extrabold text-base sm:text-lg leading-relaxed">
            "{retoActual.pista}"
          </p>
        </div>

        {/* Marcador de Vidas y Puntos */}
        <div className="md:col-span-4 bg-slate-950/70 border border-indigo-800/80 p-4 sm:p-5 rounded-3xl flex flex-col justify-center items-center text-center space-y-2">
          <div className="flex items-center gap-1">
            {Array.from({ length: maxErrores }).map((_, i) => (
              <span
                key={i}
                className={`text-2xl transition-transform ${
                  i < maxErrores - errores ? 'opacity-100 scale-100' : 'opacity-20 scale-75 grayscale'
                }`}
              >
                ❤️
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-indigo-300">
            {etapasDibujo[errores]}
          </span>
          <span className="text-xs font-black text-amber-400 bg-amber-400/20 px-3 py-0.5 rounded-full border border-amber-400/40">
            ⭐ {puntaje} Puntos
          </span>
        </div>
      </div>

      {/* Casillas de la Palabra Secreta */}
      <div className="py-4">
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5">
          {palabraLimpia.split('').map((char, i) => {
            const revelada = letrasUsadas.includes(char) || juegoTerminado;
            return (
              <div
                key={i}
                className={`w-12 h-16 sm:w-16 sm:h-20 rounded-2xl flex items-center justify-center font-black text-2xl sm:text-4xl shadow-xl transition-all border-b-4 ${
                  revelada
                    ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950 border-amber-600 animate-bounce'
                    : 'bg-slate-800 text-transparent border-indigo-800'
                }`}
              >
                {revelada ? char : '_'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Teclado de Letras Interactivas Parlantes */}
      <div className="space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-slate-400 text-center block mb-1">
          Toca una letra para probar si está en la palabra:
        </span>
        {letrasFilas.map((fila, fIdx) => (
          <div key={fIdx} className="flex justify-center gap-1.5 sm:gap-2">
            {fila.map((letra) => {
              const usada = letrasUsadas.includes(letra);
              const esCorrecta = usada && palabraLimpia.includes(letra);
              const esIncorrecta = usada && !palabraLimpia.includes(letra);

              return (
                <button
                  key={letra}
                  onClick={() => seleccionarLetra(letra)}
                  disabled={usada || juegoTerminado}
                  className={`w-9 h-11 sm:w-12 sm:h-14 rounded-xl font-black text-sm sm:text-lg transition-all flex items-center justify-center select-none cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 ${
                    esCorrecta
                      ? 'bg-emerald-500 text-white border-emerald-700 shadow-sm opacity-90'
                      : esIncorrecta
                      ? 'bg-rose-900/40 text-rose-300 border-rose-950 opacity-40 cursor-not-allowed'
                      : 'bg-slate-800 hover:bg-indigo-600 text-white border-slate-950 hover:border-indigo-800 shadow-md hover:scale-105'
                  }`}
                >
                  {letra}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Mensaje de Fin de Juego y Siguiente */}
      {juegoTerminado && (
        <div
          className={`p-6 rounded-3xl text-center space-y-3 animate-fade-in border-3 ${
            ganado
              ? 'bg-emerald-950/70 border-emerald-400 text-emerald-200'
              : 'bg-rose-950/70 border-rose-400 text-rose-200'
          }`}
        >
          <span className="text-5xl block animate-bounce">{ganado ? '🏆' : '💨'}</span>
          <h4 className="text-2xl font-black">
            {ganado ? '¡PALABRA DESCUBIERTA CON ÉXITO!' : '¡SE AGOTARON LOS INTENTOS!'}
          </h4>
          <p className="text-base font-bold text-white">
            La palabra era: <strong className="text-amber-400 text-xl">{retoActual.palabra}</strong>
          </p>
          <button
            onClick={() => setIndicePalabra((idx) => idx + 1)}
            className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
          >
            Siguiente Palabra Enigmática ➔
          </button>
        </div>
      )}
    </div>
  );
}
