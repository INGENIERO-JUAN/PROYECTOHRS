import React, { useState, useEffect } from 'react';
import AbecedarioSonoro from './AbecedarioSonoro';
import LluviaSilabasNinja from './LluviaSilabasNinja';
import BatallaDeRimas from './BatallaDeRimas';
import TriviaLiteraria from './TriviaLiteraria';
import AhorcadoLiterario from './AhorcadoLiterario';
import CrucigramaLiterario from './CrucigramaLiterario';
import DueloVocabulario from './DueloVocabulario';
import DetectiveGramatical from './DetectiveGramatical';
import CompletarTexto from './CompletarTexto';
import ConstructorPalabras from './ConstructorPalabras';
import JuegoMemoriaParejas from './JuegoMemoriaParejas';
import RuletaRetos from './RuletaRetos';
import OrganizadorOraciones from './OrganizadorOraciones';
import JuicioFalacias from './JuicioFalacias';
import EscapeRoomMacondo from './EscapeRoomMacondo';
import { sounds } from '../../utils/audio';
import { GameProgress } from '../../utils/gamification';

export default function ArcadeDidactico({ gradoNumero, gradoFiltro, juegoInicial = null }) {
  const numGrado = Number(gradoNumero || gradoFiltro || 1);
  const esSecundaria = numGrado >= 6;
  const esPrimerosGrados = numGrado <= 2;

  const [progreso, setProgreso] = useState(() => GameProgress.getProgress());

  // Actualizar datos de gamificación en tiempo real
  useEffect(() => {
    const handleProgreso = () => setProgreso(GameProgress.getProgress());
    window.addEventListener('storage', handleProgreso);
    window.addEventListener('lengua_viva_progreso_actualizado', handleProgreso);
    return () => {
      window.removeEventListener('storage', handleProgreso);
      window.removeEventListener('lengua_viva_progreso_actualizado', handleProgreso);
    };
  }, []);

  const rangoActual = GameProgress.getRangoPorXP(progreso.xpTotal);
  const siguienteRango = GameProgress.getSiguienteRango(progreso.xpTotal);
  const xpParaSiguiente = siguienteRango ? siguienteRango.xpMin - progreso.xpTotal : 0;

  // Juegos para Grados 1° y 2° (Lectoescritura, fonética y primeras palabras)
  const juegosPrimeros = [
    { id: 'abecedario', nombre: 'Abecedario Parlante', desc: 'Fonética, letras y sílabas con voz humana' },
    { id: 'ninja', nombre: 'Sílabas Ninja a Ráfaga', desc: 'Corta sílabas voladoras antes de que caigan' },
    { id: 'constructor', nombre: 'Arma-Palabras con Voz', desc: 'Une sílabas sonoras para formar palabras' },
    { id: 'memoria', nombre: 'Parejas de Memoria', desc: 'Asocia palabras y figuras que riman' },
    { id: 'trivia', nombre: 'Trivia Infantil', desc: 'Preguntas con audio y opciones ilustradas' },
    { id: 'ahorcado', nombre: 'Palabra Secreta', desc: 'Adivina la palabra con teclado sonoro' },
    { id: 'oraciones', nombre: 'Ordena la Frase', desc: 'Arma oraciones que se escuchan en voz alta' },
    { id: 'ruleta', nombre: 'Ruleta de Retos', desc: 'Coplas, trabalenguas y dinámicas de clase' }
  ];

  // Juegos para Grados 3° a 5° (Primaria intermedia y avanzada)
  const juegosPrimariaMedia = [
    { id: 'ninja', nombre: 'Cazador de Verbos', desc: 'Corta verbos y palabras a toda velocidad' },
    { id: 'batalla', nombre: 'Batalla de Rimas y Coplas', desc: 'Sigue el ritmo métrico y rima versos' },
    { id: 'trivia', nombre: 'Trivia del Saber', desc: 'Concurso con comodines 50/50 y tiempo' },
    { id: 'escape', nombre: 'Escape Room de Cuentos', desc: 'Misterios y enigmas de la tradición viva' },
    { id: 'ahorcado', nombre: 'El Ahorcado Literario', desc: 'Descifra palabras secretas con pistas' },
    { id: 'constructor', nombre: 'Constructor Silábico', desc: 'Palabras de 3 y 4 sílabas con voz' },
    { id: 'oraciones', nombre: 'Sintaxis y Frases', desc: 'Estructuración de oraciones con coherencia' },
    { id: 'memoria', nombre: 'Sinónimos y Antónimos', desc: 'Memoria de conceptos y figuras' },
    { id: 'detective', nombre: 'Detective de Ortografía', desc: 'Encuentra faltas y tildes en el texto' },
    { id: 'ruleta', nombre: 'Ruleta de Retos', desc: 'Retos de actuación, oratoria y canto' }
  ];

  // Juegos para Grados 6° a 9° (Secundaria)
  const juegosSecundaria = [
    { id: 'juicio', nombre: 'Tribunal de Falacias', desc: 'Juez de debates, argumentos y oratoria' },
    { id: 'escape', nombre: 'Escape Room Macondo', desc: 'Aventura de enigmas del Realismo Mágico' },
    { id: 'duelo', nombre: 'Duelo de Vocabulario', desc: 'Contrarreloj de 15s con racha y multiplicadores' },
    { id: 'crucigrama', nombre: 'Crucigrama Literario', desc: 'Pistas de métrica, sonetos y figuras retóricas' },
    { id: 'batalla', nombre: 'Duelo de Rimas y Flow', desc: 'Batalla de versos y métrica sobre el compás' },
    { id: 'ninja', nombre: 'Corte de Esdrújulas', desc: 'Ráfaga de reflejos cortando tildes' },
    { id: 'detective', nombre: 'Detective Gramatical', desc: 'Caza de tildes diacríticas y concordancia en textos' },
    { id: 'completar', nombre: 'Completar Textos', desc: 'Pasajes de García Márquez, crónicas y poemas' },
    { id: 'trivia', nombre: 'Trivia de Literatura', desc: 'Preguntas curriculares, comodines 50/50 y podio' },
    { id: 'ahorcado', nombre: 'Términos Críticos', desc: 'Descubre conceptos literarios avanzados' },
    { id: 'oraciones', nombre: 'Sintaxis Compleja', desc: 'Oraciones compuestas y subordinadas' },
    { id: 'ruleta', nombre: 'Ruleta de Debate', desc: 'Argumentación en 30 segundos e improvisación' }
  ];

  // Selección inicial inteligente según el grado
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(() => {
    if (juegoInicial) return juegoInicial;
    if (esPrimerosGrados) return 'abecedario';
    if (numGrado <= 5) return 'ninja';
    return 'juicio';
  });

  // Reaccionar inmediatamente cuando cambia el grado escolar o el juego solicitado
  useEffect(() => {
    if (juegoInicial) {
      setJuegoSeleccionado(juegoInicial);
      return;
    }
    const catalogo = esPrimerosGrados
      ? juegosPrimeros
      : esSecundaria
      ? juegosSecundaria
      : juegosPrimariaMedia;

    const existe = catalogo.some((j) => j.id === juegoSeleccionado);
    if (!existe && catalogo.length > 0) {
      if (esPrimerosGrados) setJuegoSeleccionado('abecedario');
      else if (esSecundaria) setJuegoSeleccionado('juicio');
      else setJuegoSeleccionado('ninja');
    }
  }, [numGrado, juegoInicial, esPrimerosGrados, esSecundaria]);

  const cambiarJuego = (juegoId) => {
    sounds.playClick();
    setJuegoSeleccionado(juegoId);
    setProgreso(GameProgress.getProgress());
  };

  const catalogoActual = esPrimerosGrados
    ? juegosPrimeros
    : esSecundaria
    ? juegosSecundaria
    : juegosPrimariaMedia;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ══════════ SALA DE JUEGOS Y BARRA SUPERIOR ══════════ */}
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 block">
              {esPrimerosGrados
                ? 'Arcade de Fonética y Primeras Lecturas'
                : esSecundaria
                ? `Arcade Literario de Secundaria (${numGrado}.° Grado)`
                : `Arcade Pedagógico de Primaria (${numGrado}.° Grado)`}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
              {esPrimerosGrados
                ? 'Fonética Interactiva y Letras Parlantes'
                : esSecundaria
                ? 'Retos Intelectuales, Falacias y Debate'
                : 'Desafíos de Lenguaje, Rimas y Concursos'}
            </h3>
          </div>

          {/* Insignia de Nivel y Rango del Jugador */}
          <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase text-amber-400">Rango:</span>
              <span className="text-xs font-bold text-white">{rangoActual.titulo}</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 block">
              {progreso.xpTotal} XP {siguienteRango && `• Faltan ${xpParaSiguiente} XP`}
            </span>
          </div>
        </div>

        {/* Parrilla de Selección de Juegos (Píldoras limpias sin iconos) */}
        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          {catalogoActual.map((j) => {
            const activo = juegoSeleccionado === j.id;
            return (
              <button
                key={j.id}
                onClick={() => cambiarJuego(j.id)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer select-none ${
                  activo
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 font-black ring-2 ring-blue-400'
                    : 'bg-slate-800/80 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="leading-tight">{j.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ RENDERIZADO DEL JUEGO SELECCIONADO ══════════ */}
      <div className="animate-fade-in">
        {juegoSeleccionado === 'abecedario' && <AbecedarioSonoro />}
        {juegoSeleccionado === 'ninja' && <LluviaSilabasNinja gradoNumero={numGrado} />}
        {juegoSeleccionado === 'juicio' && <JuicioFalacias />}
        {juegoSeleccionado === 'escape' && <EscapeRoomMacondo />}
        {juegoSeleccionado === 'batalla' && <BatallaDeRimas />}
        {juegoSeleccionado === 'trivia' && <TriviaLiteraria gradoNumero={numGrado} />}
        {juegoSeleccionado === 'ahorcado' && <AhorcadoLiterario gradoNumero={numGrado} />}
        {juegoSeleccionado === 'duelo' && <DueloVocabulario gradoNumero={numGrado} />}
        {juegoSeleccionado === 'crucigrama' && <CrucigramaLiterario gradoNumero={numGrado} />}
        {juegoSeleccionado === 'detective' && <DetectiveGramatical gradoNumero={numGrado} />}
        {juegoSeleccionado === 'completar' && <CompletarTexto gradoNumero={numGrado} />}
        {juegoSeleccionado === 'constructor' && <ConstructorPalabras />}
        {juegoSeleccionado === 'memoria' && <JuegoMemoriaParejas tema={esSecundaria ? 'figuras' : 'rimas'} />}
        {juegoSeleccionado === 'oraciones' && <OrganizadorOraciones />}
        {juegoSeleccionado === 'ruleta' && <RuletaRetos />}
      </div>
    </div>
  );
}
