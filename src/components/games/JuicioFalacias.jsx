import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const CASOS_TRIBUNAL = [
  {
    id: 1,
    acusador: 'Fiscal Retórico',
    avatar: '👨‍⚖️',
    caso: 'Debate Escolar sobre Reciclaje',
    argumento: '"No debemos escuchar la propuesta de Mateo sobre reciclar en el colegio; ¡todos sabemos que a Mateo le va mal en matemáticas y no se peina bien!"',
    tipoCorrecto: 'Ad Hominem',
    opciones: [
      { id: 'Ad Hominem', label: 'Falacia Ad Hominem', desc: 'Ataca a la persona en lugar de refutar su idea.', correcta: true },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Caricaturiza o distorsiona el argumento rival.', correcta: false },
      { id: 'Falsa Causa', label: 'Falsa Causa', desc: 'Asume que porque algo pasó antes, causó lo siguiente.', correcta: false },
      { id: 'Valido', label: 'Argumento Válido', desc: 'Premisa lógica y coherente bien demostrada.', correcta: false }
    ],
    explicacion: '¡Objeción a lugar! Descalifica a Mateo por su apariencia y notas, evadiendo debatir la propuesta de reciclaje.'
  },
  {
    id: 2,
    acusador: 'Senador de la Hipérbole',
    avatar: '🧐',
    caso: 'Presupuesto de la Biblioteca',
    argumento: '"Los estudiantes que piden comprar más novelas y poemas para la biblioteca quieren que cerremos la cancha deportiva para siempre y que nadie vuelva a hacer ejercicio."',
    tipoCorrecto: 'Hombre de Paja',
    opciones: [
      { id: 'Falso Dilema', label: 'Falso Dilema', desc: 'Reduce todo a solo dos opciones extremas.', correcta: false },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Exagera e inventa una postura extrema que el rival nunca dijo.', correcta: true },
      { id: 'Ad Populum', label: 'Apelación a la Mayoría', desc: 'Dice que algo es verdad porque todos lo hacen.', correcta: false },
      { id: 'Valido', label: 'Argumento Sólido', desc: 'Conclusión derivada rigurosamente de hechos.', correcta: false }
    ],
    explicacion: '¡Objeción contundente! Nadie pidió cerrar la cancha; inventó un enemigo absurdo y fácil de atacar.'
  },
  {
    id: 3,
    acusador: 'Testigo Supersticioso',
    avatar: '🧙‍♂️',
    caso: 'El Clima de la Vereda',
    argumento: '"Ayer cantó un gallo negro a medianoche en la loma y hoy cayó una tormenta terrible. Por lo tanto, el canto del gallo desató la tempestad."',
    tipoCorrecto: 'Falsa Causa',
    opciones: [
      { id: 'Ad Baculum', label: 'Apelación al Miedo', desc: 'Amenaza con la fuerza o castigo.', correcta: false },
      { id: 'Falsa Causa', label: 'Falsa Causa (Post Hoc)', desc: 'Confunde simple coincidencia temporal con relación de causa y efecto.', correcta: true },
      { id: 'Ad Hominem', label: 'Ad Hominem', desc: 'Ataque contra el mensajero.', correcta: false },
      { id: 'Tu Quoque', label: 'Tu Quoque', desc: 'Acusa al otro de hacer lo mismo.', correcta: false }
    ],
    explicacion: '¡Objeción fundada! La coincidencia de dos eventos en el tiempo no significa que uno cause al otro.'
  },
  {
    id: 4,
    acusador: 'Influencer Publicitario',
    avatar: '📱',
    caso: 'Salud y Remedios Mágicos',
    argumento: '"Este jarabe de hierbas cura todas las enfermedades pulmonares sin excepción, porque lo recomendó en un video un cantante famosísimo de reguetón."',
    tipoCorrecto: 'Apelacion Autoridad',
    opciones: [
      { id: 'Apelacion Autoridad', label: 'Apelación a la Falsa Autoridad', desc: 'Cita a una celebridad fuera de su campo de conocimiento como prueba.', correcta: true },
      { id: 'Generalizacion', label: 'Generalización Apresurada', desc: 'Saca conclusiones universales de un solo caso.', correcta: false },
      { id: 'Circular', label: 'Petición de Principio', desc: 'La conclusión repite la premisa.', correcta: false },
      { id: 'Valido', label: 'Argumento Científico Válido', desc: 'Respaldado por estudios clínicos.', correcta: false }
    ],
    explicacion: '¡Objeción admitida! Un cantante no es una autoridad médica ni científica calificada.'
  },
  {
    id: 5,
    acusador: 'Capitán del Absolutismo',
    avatar: '💂',
    caso: 'Convivencia Ciudadana',
    argumento: '"O estás 100% de acuerdo con todas y cada una de mis reglas de convivencia, o estás a favor del desorden total y la anarquía en la escuela."',
    tipoCorrecto: 'Falso Dilema',
    opciones: [
      { id: 'Falso Dilema', label: 'Falso Dilema (Blanco o Negro)', desc: 'Obliga a elegir entre dos extremos ignorando puntos medios o acuerdos.', correcta: true },
      { id: 'Ad Hominem', label: 'Ad Hominem', desc: 'Insulta a quien opina distinto.', correcta: false },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Deforma las palabras de la contraparte.', correcta: false },
      { id: 'Pendiente Resbaladiza', label: 'Pendiente Resbaladiza', desc: 'Cadena exagerada de tragedias.', correcta: false }
    ],
    explicacion: '¡Objeción a lugar! Existen múltiples opciones intermedias, debates constructivos y acuerdos pedagógicos.'
  },
  {
    id: 6,
    acusador: 'Estudiante Dramático',
    avatar: '🥺',
    caso: 'Evaluación de Ortografía',
    argumento: '"Profesor, usted no puede calificarme mal por no poner tildes ni comas, porque si repruebo mi perrito se va a poner muy triste y llorará toda la tarde."',
    tipoCorrecto: 'Apelacion Emocion',
    opciones: [
      { id: 'Apelacion Emocion', label: 'Apelación a la Piedad / Emoción', desc: 'Manipula sentimientos de lástima para evadir las reglas o evidencias.', correcta: true },
      { id: 'Falsa Causa', label: 'Falsa Causa', desc: 'Confusión causal.', correcta: false },
      { id: 'Ad Populum', label: 'Ad Populum', desc: 'Apelar a la moda de la masa.', correcta: false },
      { id: 'Valido', label: 'Premisa Rigurosa', desc: 'Criterio evaluativo coherente.', correcta: false }
    ],
    explicacion: '¡Objeción aceptada! El estado de ánimo de una mascota no refuta los criterios gramaticales de la lengua.'
  },
  {
    id: 7,
    acusador: 'Turista Acelerado',
    avatar: '🤠',
    caso: 'Caracterización de Pueblos',
    argumento: '"Ayer llegué al pueblo vecino y el primer vendedor que vi me cobró de más. ¡Por lo tanto, todos los habitantes de ese departamento son tramposos!"',
    tipoCorrecto: 'Generalizacion Apresurada',
    opciones: [
      { id: 'Generalizacion Apresurada', label: 'Generalización Apresurada', desc: 'Aplica una conclusión universal a miles de personas basándose en una sola muestra.', correcta: true },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Distorsión de argumento ajeno.', correcta: false },
      { id: 'Ad Baculum', label: 'Apelación a la Fuerza', desc: 'Uso de la intimidación.', correcta: false },
      { id: 'Valido', label: 'Muestreo Estadístico Válido', desc: 'Muestra representativa de datos.', correcta: false }
    ],
    explicacion: '¡Objeción a lugar! Una sola experiencia aislada no permite juzgar a toda una comunidad.'
  },
  {
    id: 8,
    acusador: 'Profesor de Lógica',
    avatar: '👩‍🏫',
    caso: 'Estructura del Texto Argumentativo',
    argumento: '"Todos los textos de opinión rigurosos presentan una tesis clara apoyada en evidencias empíricas. Este editorial presenta una tesis clara y tres fuentes de investigación empírica. Por lo tanto, cumple con la estructura requerida."',
    tipoCorrecto: 'Valido',
    opciones: [
      { id: 'Valido', label: '¡Argumento Válido y Bien Fundamentado!', desc: 'Las premisas son verdaderas y la conclusión se desprende de forma lógica.', correcta: true },
      { id: 'Ad Hominem', label: 'Falacia Ad Hominem', desc: 'Ataque personal.', correcta: false },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Deformación de ideas.', correcta: false },
      { id: 'Falsa Causa', label: 'Falsa Causa', desc: 'Error causal.', correcta: false }
    ],
    explicacion: '¡Veredicto impecable! No contiene falacias: es un silogismo deductivo válido con premisas demostradas.'
  },
  {
    id: 9,
    acusador: 'Compañero Evasivo',
    avatar: '😏',
    caso: 'Puntualidad en la Asamblea',
    argumento: '"Tú me dices que no llegue tarde a la reunión de personería escolar, pero tú llegaste tarde al recreo el martes pasado, así que no tienes derecho a decirme nada."',
    tipoCorrecto: 'Tu Quoque',
    opciones: [
      { id: 'Tu Quoque', label: 'Falacia Tu Quoque (Y tú también)', desc: 'Evade la crítica acusando al otro de haber cometido una falta similar.', correcta: true },
      { id: 'Falso Dilema', label: 'Falso Dilema', desc: 'Dos opciones forzadas.', correcta: false },
      { id: 'Apelacion Autoridad', label: 'Apelación a la Autoridad', desc: 'Citar famosos.', correcta: false },
      { id: 'Valido', label: 'Argumento Válido', desc: 'Razonamiento lógico.', correcta: false }
    ],
    explicacion: '¡Objeción fundada! Que la otra persona haya cometido un error no invalida que la puntualidad sea un deber.'
  },
  {
    id: 10,
    acusador: 'Profeta Catastrófico',
    avatar: '😱',
    caso: 'Uso de Cuadernos con Dibujos',
    argumento: '"Si permitimos que los estudiantes dibujen en las márgenes de su cuaderno hoy, mañana nadie tomará apuntes, el próximo año reprobarán el colegio y el país terminará en la ruina absoluta."',
    tipoCorrecto: 'Pendiente Resbaladiza',
    opciones: [
      { id: 'Pendiente Resbaladiza', label: 'Pendiente Resbaladiza (Slippery Slope)', desc: 'Encadena consecuencias trágicas y exageradas sin demostración real.', correcta: true },
      { id: 'Ad Hominem', label: 'Ad Hominem', desc: 'Ataque personal.', correcta: false },
      { id: 'Ad Populum', label: 'Ad Populum', desc: 'Apelar a la mayoría.', correcta: false },
      { id: 'Falsa Causa', label: 'Falsa Causa', desc: 'Causa errada.', correcta: false }
    ],
    explicacion: '¡Objeción admitida! Conectar un dibujo en la margen con la ruina del país es una cadena especulativa sin fundamento.'
  },
  {
    id: 11,
    acusador: 'Voz de la Muchedumbre',
    avatar: '🗣️',
    caso: 'Copia en Exámenes',
    argumento: '"Copiar las respuestas de la evaluación no puede estar mal, porque todos los estudiantes de los tres salones lo están haciendo hoy."',
    tipoCorrecto: 'Ad Populum',
    opciones: [
      { id: 'Ad Populum', label: 'Falacia Ad Populum (Apelación a la Mayoría)', desc: 'Afirma que algo es correcto o verdadero solo porque mucha gente lo hace.', correcta: true },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Deformar al rival.', correcta: false },
      { id: 'Tu Quoque', label: 'Tu Quoque', desc: 'Devolver acusación.', correcta: false },
      { id: 'Valido', label: 'Criterio Ético Válido', desc: 'Principio ético universal.', correcta: false }
    ],
    explicacion: '¡Objeción rotunda! Que una mayoría cometa una falta ética no convierte la falta en algo correcto.'
  },
  {
    id: 12,
    acusador: 'Capitán Intimidador',
    avatar: '🥊',
    caso: 'Elección del Representante',
    argumento: '"Mi propuesta de torneo de fútbol debe ganar la votación del curso, porque el que vote en contra se las verá conmigo a la salida."',
    tipoCorrecto: 'Ad Baculum',
    opciones: [
      { id: 'Ad Baculum', label: 'Falacia Ad Baculum (Apelación a la Fuerza o Miedo)', desc: 'Sustituye la razón por amenazas o coerción para imponer una postura.', correcta: true },
      { id: 'Ad Hominem', label: 'Ad Hominem', desc: 'Insulto verbal.', correcta: false },
      { id: 'Circular', label: 'Petición de Principio', desc: 'Circularidad lógica.', correcta: false },
      { id: 'Falso Dilema', label: 'Falso Dilema', desc: 'Opciones polares.', correcta: false }
    ],
    explicacion: '¡Objeción a lugar! La amenaza y la violencia anulan el debate democrático y no son argumentos válidos.'
  },
  {
    id: 13,
    acusador: 'Filósofo Circular',
    avatar: '🔄',
    caso: 'Autoridad de un Manuscrito',
    argumento: '"Este libro histórico dice la verdad absoluta porque fue dictado por el sabio supremo, y sabemos que es el sabio supremo porque este mismo libro lo afirma en su prólogo."',
    tipoCorrecto: 'Circular',
    opciones: [
      { id: 'Circular', label: 'Petición de Principio (Razonamiento Circular)', desc: 'Usa la misma conclusión que intenta probar como si fuera la prueba.', correcta: true },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Caricatura del oponente.', correcta: false },
      { id: 'Ad Baculum', label: 'Apelación a la Fuerza', desc: 'Uso de amenazas.', correcta: false },
      { id: 'Valido', label: 'Demostración Científica', desc: 'Comprobación externa.', correcta: false }
    ],
    explicacion: '¡Objeción concedida! Es un círculo vicioso: el libro valida al sabio y el sabio valida al libro sin pruebas externas.'
  },
  {
    id: 14,
    acusador: 'Investigadora Científica',
    avatar: '🔬',
    caso: 'Hábito de Lectura Diaria',
    argumento: '"Dedicar 20 minutos diarios a la lectura incrementa el vocabulario activo y la comprensión en estudiantes, según evidenció un estudio longitudinal de tres años con más de mil alumnos en Colombia."',
    tipoCorrecto: 'Valido',
    opciones: [
      { id: 'Valido', label: '¡Argumento Científico Válido y Demostrado!', desc: 'Se sustenta en evidencias empíricas comprobables y razonamiento lógico.', correcta: true },
      { id: 'Ad Populum', label: 'Ad Populum', desc: 'Moda colectiva.', correcta: false },
      { id: 'Hombre de Paja', label: 'Hombre de Paja', desc: 'Deformación de ideas.', correcta: false },
      { id: 'Falsa Causa', label: 'Falsa Causa', desc: 'Coincidencia casual.', correcta: false }
    ],
    explicacion: '¡Veredicto impecable! Las afirmaciones apoyadas en metodologías rigurosas y evidencias son argumentos legítimos.'
  }
];

export default function JuicioFalacias() {
  const [indiceCaso, setIndiceCaso] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [racha, setRacha] = useState(0);
  const [tiempo, setTiempo] = useState(25);
  const [seleccion, setSeleccion] = useState(null);
  const [estadoVeredicto, setEstadoVeredicto] = useState(null); // 'acierto', 'fallo'
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const casoActual = CASOS_TRIBUNAL[indiceCaso % CASOS_TRIBUNAL.length];

  const martillarJuez = () => {
    sounds.playPop();
    setTimeout(() => sounds.playPop(), 140);
  };

  useEffect(() => {
    if (juegoTerminado || seleccion !== null) return;

    if (tiempo <= 0) {
      sounds.playWrong();
      setEstadoVeredicto('fallo');
      setSeleccion('TIMEOUT');
      setRacha(0);
      voiceReader.speak('¡Tiempo vencido en el tribunal! El caso quedó sin objeción.');
      return;
    }

    const timer = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempo, seleccion, juegoTerminado]);

  const leerCasoVoz = () => {
    sounds.playClick();
    voiceReader.speak(
      `Caso en el tribunal: ${casoActual.caso}. Dice el orador: ${casoActual.argumento}`
    );
  };

  const dictarVeredicto = (opcion) => {
    if (seleccion !== null) return;
    martillarJuez();
    setSeleccion(opcion.id);

    if (opcion.correcta) {
      sounds.playCorrect();
      lanzarConfeti();
      setEstadoVeredicto('acierto');
      const bonusTiempo = Math.max(10, tiempo * 6);
      const puntosGanados = 180 + bonusTiempo + racha * 40;
      setPuntaje((p) => p + puntosGanados);
      const nuevaRacha = racha + 1;
      setRacha(nuevaRacha);
      GameProgress.addXP(puntosGanados, 'tribunal_falacia');

      setTimeout(() => {
        voiceReader.speak(`¡Objeción procedente, Su Señoría! ${casoActual.explicacion}`);
      }, 300);
    } else {
      sounds.playWrong();
      setEstadoVeredicto('fallo');
      setRacha(0);

      setTimeout(() => {
        voiceReader.speak(`Objeción desestimada. ${casoActual.explicacion}`);
      }, 300);
    }
  };

  const siguienteCaso = () => {
    sounds.playClick();
    if (indiceCaso + 1 < CASOS_TRIBUNAL.length) {
      setIndiceCaso((i) => i + 1);
      setSeleccion(null);
      setEstadoVeredicto(null);
      setTiempo(25);
    } else {
      setJuegoTerminado(true);
      sounds.playFanfare();
      lanzarConfeti();
      GameProgress.registrarVictoria(racha);
      voiceReader.speak('¡Juicio concluido! Has demostrado ser un magistrado supremo de la lógica y la argumentación.');
    }
  };

  const reiniciarTribunal = () => {
    sounds.playClick();
    setIndiceCaso(0);
    setPuntaje(0);
    setRacha(0);
    setTiempo(25);
    setSeleccion(null);
    setEstadoVeredicto(null);
    setJuegoTerminado(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-amber-950/40 to-slate-950 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-amber-500/80 text-white space-y-6">
      {/* Barra de Título del Tribunal */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-700/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-400/50 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
            <span>⚖️</span> Sala de Debate, Oratoria y Falacias (6° a 9°)
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center gap-2">
            <span>🔨</span> El Tribunal de las Falacias
          </h3>
          <p className="text-xs sm:text-sm text-amber-200/90 font-medium">
            Caso {indiceCaso + 1} de {CASOS_TRIBUNAL.length} • Analiza el discurso y ¡estampa tu objeción antes de que caiga el martillo!
          </p>
        </div>

        {/* Marcadores */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-2xl border-2 border-amber-400 text-center">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block">Puntos</span>
            <span className="text-xl sm:text-2xl font-black text-white">⭐ {puntaje}</span>
          </div>

          <div className="bg-slate-950 px-3 py-2 rounded-2xl border-2 border-orange-500 text-center">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block">Racha</span>
            <span className="text-xl font-black text-orange-300">🔥 x{racha}</span>
          </div>

          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-inner ${
              tiempo <= 7
                ? 'bg-rose-600 text-white border-rose-300 animate-pulse'
                : 'bg-slate-900 text-amber-300 border-amber-600'
            }`}
          >
            {tiempo}s
          </div>
        </div>
      </div>

      {/* Pantalla Final de Sentencia */}
      {juegoTerminado ? (
        <div className="bg-slate-900/90 border-4 border-amber-400 rounded-3xl p-8 text-center space-y-5 animate-fade-in max-w-xl mx-auto shadow-2xl">
          <span className="text-7xl block animate-bounce">⚖️👑</span>
          <h4 className="text-3xl font-black text-amber-400">¡VEREDICTO FINAL DICTADO!</h4>
          <p className="text-slate-200 font-semibold text-base">
            Has desenmascarado las falacias argumentativas con la destreza de un gran jurista y orador.
          </p>
          <div className="text-4xl font-black text-emerald-400">
            {puntaje} PUNTOS DE HONOR ⭐
          </div>
          <button
            onClick={reiniciarTribunal}
            className="px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            🔄 Iniciar Nuevo Juicio
          </button>
        </div>
      ) : (
        <>
          {/* El Estrado del Acusador */}
          <div className="bg-gradient-to-b from-slate-900 to-amber-950/60 rounded-3xl p-5 sm:p-7 border-3 border-amber-600/70 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 border-b border-amber-800/60 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-amber-950/80 rounded-2xl border border-amber-500">
                  {casoActual.avatar}
                </span>
                <div>
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                    Caso #{indiceCaso + 1}: {casoActual.caso}
                  </span>
                  <h4 className="text-lg font-black text-white">{casoActual.acusador} en el estrado</h4>
                </div>
              </div>

              <button
                onClick={leerCasoVoz}
                className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border border-amber-400/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>🔊</span> Leer Argumento
              </button>
            </div>

            {/* Cita del Discurso */}
            <div className="p-4 sm:p-6 bg-slate-950/80 rounded-2xl border-l-6 border-amber-500 italic text-amber-100 text-base sm:text-xl font-bold leading-relaxed shadow-inner">
              {casoActual.argumento}
            </div>

            {/* Sello de Veredicto si ya respondió */}
            {estadoVeredicto && (
              <div
                className={`mt-4 p-4 rounded-2xl border-2 flex items-center justify-between gap-3 animate-slide-down ${
                  estadoVeredicto === 'acierto'
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
                    : 'bg-rose-950/90 text-rose-200 border-rose-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{estadoVeredicto === 'acierto' ? '✅' : '❌'}</span>
                  <div>
                    <h5 className="font-black text-base">
                      {estadoVeredicto === 'acierto' ? '¡OBJECIÓN A LUGAR! (+180 XP)' : '¡OBJECIÓN DENEGADA!'}
                    </h5>
                    <p className="text-xs font-semibold">{casoActual.explicacion}</p>
                  </div>
                </div>

                <button
                  onClick={siguienteCaso}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  Siguiente Caso ➔
                </button>
              </div>
            )}
          </div>

          {/* Opciones de Falacia para Estampar Objeción */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-300 block">
              Selecciona tu Objeción Legal y Lógica:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {casoActual.opciones.map((op) => {
                const seleccionada = seleccion === op.id;
                let estiloBoton = 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700';

                if (seleccion !== null) {
                  if (op.correcta) {
                    estiloBoton = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/50 scale-102';
                  } else if (seleccionada) {
                    estiloBoton = 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/50';
                  } else {
                    estiloBoton = 'bg-slate-900/50 text-slate-400 border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={op.id}
                    disabled={seleccion !== null}
                    onClick={() => dictarVeredicto(op)}
                    className={`p-4 rounded-2xl border-3 text-left transition-all duration-150 flex items-start gap-3 select-none active:scale-98 cursor-pointer ${estiloBoton}`}
                  >
                    <span className="text-2xl mt-0.5">🔨</span>
                    <div>
                      <span className="font-black text-sm sm:text-base block">{op.label}</span>
                      <p className="text-xs opacity-80 mt-0.5 font-medium leading-tight">{op.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
