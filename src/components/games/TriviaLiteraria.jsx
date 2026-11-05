import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const BANCO_TRIVIA = [
  // ═════════════════════════════════════════════════════════════════
  // ─── TIER 1-3: PRIMARIA INICIAL (Grados 1°, 2° y 3°) ───────────
  // ═════════════════════════════════════════════════════════════════
  {
    tier: '1-3',
    pregunta: '¿Cuál de las siguientes palabras rima musicalmente con "CORAZÓN"?',
    opciones: ['Ventana', 'Canción', 'Pelota', 'Pájaro'],
    correcta: 1,
    pista: 'Termina con el mismo sonido musical "-ón".',
    explicacion: 'Las palabras que riman comparten las mismas terminaciones sonoras en sus últimas sílabas acentuadas.'
  },
  {
    tier: '1-3',
    pregunta: '¿Con qué letra vocal comienza la palabra "ÁRBOL"?',
    opciones: ['Con la E', 'Con la I', 'Con la A', 'Con la O'],
    correcta: 2,
    pista: 'Abre bien tu boca para cantar: ¡Aaaaa!',
    explicacion: 'Árbol comienza con la vocal A mayúscula o minúscula.'
  },
  {
    tier: '1-3',
    pregunta: 'En las fábulas tradicionales, ¿qué dejan los animales al final de la historia?',
    opciones: ['Una moraleja o enseñanza ética', 'Un mapa del tesoro', 'Una canción de cuna', 'Una receta de cocina'],
    correcta: 0,
    pista: 'Es una lección sobre valores como la honestidad, la paciencia y el respeto.',
    explicacion: 'La moraleja es la gran enseñanza ética y moral que transmiten las fábulas de Esopo, La Fontaine y Rafael Pombo.'
  },
  {
    tier: '1-3',
    pregunta: '¿Cuáles son los tres momentos principales que componen un cuento?',
    opciones: ['Pregunta, respuesta y coro', 'Inicio, nudo y desenlace', 'Rima, verso y estrofa', 'Título, fecha y firma'],
    correcta: 1,
    pista: 'Primero empieza la historia, luego surge el problema o conflicto y al final se soluciona.',
    explicacion: 'La estructura narrativa universal consta de Inicio (presentación), Nudo (el desafío o problema) y Desenlace (la resolución).'
  },
  {
    tier: '1-3',
    pregunta: '¿Cuál es el poema infantil colombiano donde un renacuajo sale de paseo muy elegante?',
    opciones: ['El Renacuajo Paseador (Rinrín)', 'La Pobre Viejecita', 'Simón el Bobito', 'Pastorcita'],
    correcta: 0,
    pista: 'Escrito por Rafael Pombo: "El hijo de rana, Rinrín renacuajo, salió esta mañana muy tieso y muy majo...".',
    explicacion: 'Rafael Pombo escribió "El Renacuajo Paseador", una de las fábulas poéticas más famosas de la literatura infantil colombiana.'
  },
  {
    tier: '1-3',
    pregunta: '¿Qué signo ortográfico se coloca al final de una oración completa para cerrarla?',
    opciones: ['La coma (,)', 'El punto final (.)', 'El signo de interrogación (?)', 'Los dos puntos (:)'],
    correcta: 1,
    pista: 'Indica una pausa larga y que la idea ha concluido por completo.',
    explicacion: 'El punto (.) marca el cierre de una oración, un párrafo o un texto completo.'
  },
  {
    tier: '1-3',
    pregunta: '¿Cuántas sílabas tiene la palabra "MARIPOSA"?',
    opciones: ['2 sílabas', '3 sílabas', '4 sílabas (MA-RI-PO-SA)', '5 sílabas'],
    correcta: 2,
    pista: 'Da palmadas con tus manos: MA - RI - PO - SA.',
    explicacion: 'Mariposa es una palabra polisílaba de cuatro sílabas métricas: ma-ri-po-sa.'
  },
  {
    tier: '1-3',
    pregunta: '¿Cómo se le llama a un texto divertido y difícil de pronunciar rápido sin equivocarse?',
    opciones: ['Trabalenguas', 'Adivinanza', 'Carta formal', 'Noticia'],
    correcta: 0,
    pista: 'Ejemplo: "Pablito clavó un clavito, ¿qué clavito clavó Pablito?".',
    explicacion: 'Los trabalenguas son juegos verbales que ejercitan la dicción, la fonética y la agilidad de la lengua.'
  },

  // ═════════════════════════════════════════════════════════════════
  // ─── TIER 4-5: PRIMARIA MEDIA (Grados 4° y 5°) ──────────────────
  // ═════════════════════════════════════════════════════════════════
  {
    tier: '4-5',
    pregunta: '¿Qué figura literaria se utiliza al decir: "El viento susurraba secretos entre las ramas"?',
    opciones: ['Hipérbole', 'Personificación o Prosopopeya', 'Onomatopeya', 'Símil'],
    correcta: 1,
    pista: 'Se le atribuye una cualidad exclusivamente humana (susurrar secretos) a un elemento inanimado de la naturaleza.',
    explicacion: 'La personificación o prosopopeya consiste en atribuir propiedades, acciones o sentimientos humanos a objetos o animales.'
  },
  {
    tier: '4-5',
    pregunta: '¿Cuál es la función principal de los ADJETIVOS CALIFICATIVOS en una oración?',
    opciones: ['Expresar una acción física', 'Indicar tiempo y modo', 'Calificar y describir cualidades del sustantivo', 'Unir oraciones'],
    correcta: 2,
    pista: 'Nos dicen cómo es o cómo está una persona, lugar o cosa (ejemplo: cielo despejado, río cristalino).',
    explicacion: 'Los adjetivos calificativos modifican al sustantivo aportando cualidades, colores, tamaños y estados.'
  },
  {
    tier: '4-5',
    pregunta: 'En la mitología Muisca de Colombia, ¿quién fue la deidad civilizadora que enseñó a tejer y cultivar y creó el Salto del Tequendama?',
    opciones: ['Bochica', 'El Mohán', 'Huitaca', 'El Duende'],
    correcta: 0,
    pista: 'Un anciano sabio de túnica blanca y barba dorada que quebró la roca con su báculo para desaguar la sabana.',
    explicacion: 'Bochica es el gran dios civilizador muisca que rompió la roca para crear el Salto del Tequendama y salvar a la sabana de la inundación.'
  },
  {
    tier: '4-5',
    pregunta: '¿Qué tipo de palabra es "ÁRBOL" según la posición de su sílaba acentuada?',
    opciones: ['Palabra Aguda', 'Palabra Grave o Llana', 'Palabra Esdrújula', 'Palabra Sobreesdrújula'],
    correcta: 1,
    pista: 'Lleva el acento en la penúltima sílaba (ÁR-bol) y se tilda porque no termina en N, S ni vocal.',
    explicacion: 'Las palabras graves llevan el acento en la penúltima sílaba y se les marca tilde cuando terminan en cualquier consonante que no sea N ni S.'
  },
  {
    tier: '4-5',
    pregunta: '¿Cuál es la diferencia entre un texto informativo (como una noticia) y un texto literario (como un poema)?',
    opciones: [
      'La noticia relata hechos reales y objetivos; el poema usa lenguaje estético y figuras expresivas',
      'El poema siempre es falso y la noticia siempre es aburrida',
      'No hay ninguna diferencia',
      'La noticia solo usa dibujos'
    ],
    correcta: 0,
    pista: 'Uno busca informar con la verdad comprobable y el otro transmitir belleza, emoción y arte con las palabras.',
    explicacion: 'Los textos informativos tienen función referencial (datos objetivos), mientras que los literarios tienen función poética y estética.'
  },
  {
    tier: '4-5',
    pregunta: '¿Qué elemento poético se define como "cada una de las líneas que componen un poema"?',
    opciones: ['La Estrofa', 'El Verso', 'El Párrafo', 'El Capítulo'],
    correcta: 1,
    pista: 'Varios versos juntos forman una estrofa.',
    explicacion: 'El verso es la unidad rítmica básica de un poema, delimitada por una pausa métrica en cada renglón.'
  },
  {
    tier: '4-5',
    pregunta: '¿Qué palabra contiene un prefijo que significa "hacer lo contrario o quitar"?',
    opciones: ['Deshacer', 'Submarino', 'Prehistoria', 'Rehacer'],
    correcta: 0,
    pista: 'El prefijo "des-" indica negación o inversión de la acción (hacer  deshacer).',
    explicacion: 'El prefijo "des-" aporta sentido de oposición, privación o inversión al lexema base.'
  },
  {
    tier: '4-5',
    pregunta: 'En la tradición del río Magdalena, ¿qué personaje legendario es un pescador con cuerpo cubierto de escamas?',
    opciones: ['La Patasola', 'El Hombre Caimán', 'El Pollo Pelón', 'El Silbón'],
    correcta: 1,
    pista: 'Ocurrió en Plato, Magdalena, donde Saúl Montenegro fue transformado tras una pócima mágica.',
    explicacion: 'La leyenda del Hombre Caimán de Plato (Magdalena) es uno de los relatos anfibios más representativos del Caribe colombiano.'
  },

  // ═════════════════════════════════════════════════════════════════
  // ─── TIER 6-7: SECUNDARIA INICIAL (Grados 6° y 7°) ──────────────
  // ═════════════════════════════════════════════════════════════════
  {
    tier: '6-7',
    pregunta: '¿Qué libro sagrado de la civilización Maya narra la creación del universo y del hombre formado con masa de maíz?',
    opciones: ['El Cantar de Mío Cid', 'El Popol Vuh', 'La Ilíada', 'Las Mil y Una Noches'],
    correcta: 1,
    pista: 'Obra cumbre de la mitología maya k\'iche\', redactada en Guatemala en caracteres latinos.',
    explicacion: 'El Popol Vuh o "Libro del Consejo" es el texto cosmogónico maya que explica la creación del cosmos y el triunfo sobre Xibalbá.'
  },
  {
    tier: '6-7',
    pregunta: '¿Cuál es la diferencia conceptual fundamental entre un MITO y una LEYENDA?',
    opciones: [
      'El mito es siempre en verso rimado y la leyenda en prosa suelta',
      'El mito explica el origen sagrado del cosmos y dioses; la leyenda surge de tradiciones populares con raíz histórica local',
      'La leyenda no tiene personajes humanos',
      'No existe ninguna diferencia teórica'
    ],
    correcta: 1,
    pista: 'El mito es atemporal, cósmico y sagrado; la leyenda se sitúa en un lugar geográfico y época histórica concreta.',
    explicacion: 'Los mitos tienen carácter sagrado fundacional (origen del mundo y de la vida), mientras las leyendas son relatos populares enriquecidos por la tradición oral.'
  },
  {
    tier: '6-7',
    pregunta: '¿Qué figura retórica consiste en una comparación explícita entre dos términos empleando el nexo "como" o "cual"?',
    opciones: ['Metáfora pura', 'Antítesis', 'Símil o Comparación', 'Oxímoron'],
    correcta: 2,
    pista: 'Ejemplo: "Sus cabellos eran dorados como los rayos del sol naciente".',
    explicacion: 'El símil establece una relación analógica explícita mediante partículas de enlace comparativo (como, tal como, cual, parece).'
  },
  {
    tier: '6-7',
    pregunta: '¿Qué famosa crónica de la época virreinal en Santafé de Bogotá, escrita por Juan Rodríguez Freyle en 1636, mezcla historia, chismes y la conquista?',
    opciones: ['El Carnero', 'Elegías de Varones Ilustres', 'La Vorágine', 'María'],
    correcta: 0,
    pista: 'Su título original completo alude a las guerras civiles y descubrimientos del Nuevo Reino de Granada.',
    explicacion: '"El Carnero" es la crónica fundacional de la literatura colonial neogranadina, célebre por su estilo ameno y costumbrista.'
  },
  {
    tier: '6-7',
    pregunta: '¿Cuál es la diferencia entre el significado DENOTATIVO y el significado CONNOTATIVO de una palabra?',
    opciones: [
      'La denotación es el significado literal del diccionario; la connotación es el significado figurado o subjetivo',
      'La denotación solo se usa en poemas',
      'Son exactamente lo mismo',
      'La connotación es la etimología griega'
    ],
    correcta: 0,
    pista: 'Decir "perro" como animal doméstico es denotación; decir "ese examen estuvo perro" (difícil) es connotación.',
    explicacion: 'La denotación es el sentido unívoco y objetivo; la connotación abarca los valores expresivos, culturales y contextuales agregados.'
  },
  {
    tier: '6-7',
    pregunta: '¿Qué ocurre fonéticamente cuando se encuentran dos vocales abiertas (A, E, O) contiguas en una palabra, como en "TE-A-TRO"?',
    opciones: ['Se forma un Diptongo', 'Se forma un Hiato (se separan en sílabas distintas)', 'Se forma un Triptongo', 'Se destruye la sílaba'],
    correcta: 1,
    pista: 'Las vocales fuertes abiertas nunca pueden estar juntas en la misma sílaba; se produce una ruptura.',
    explicacion: 'Dos vocales abiertas contiguas (a, e, o) forman hiato y se dividen en sílabas independientes (te-a-tro, ca-o-ba).'
  },
  {
    tier: '6-7',
    pregunta: '¿Cuál es la estructura formal clásica de un SONETO poético?',
    opciones: [
      'Tres estrofas de cinco versos libres',
      'Catorce versos endecasílabos distribuidos en dos cuartetos y dos tercetos',
      'Una copla octosílaba de cuatro versos',
      'Diez versos con rima asonante'
    ],
    correcta: 1,
    pista: 'Forma estrófica renacentista introducida por Petrarca y cultivada por Garcilaso y Quevedo (4 + 4 + 3 + 3 = 14 versos).',
    explicacion: 'El soneto es una composición poética estricta de 14 versos de arte mayor (generalmente endecasílabos) organizados en dos cuartetos y dos tercetos.'
  },
  {
    tier: '6-7',
    pregunta: '¿Cuál es el propósito central de un TEXTO EXPOSITIVO?',
    opciones: [
      'Entretener inventando personajes mágicos',
      'Explicar y transmitir información objetiva y ordenada sobre un tema específico',
      'Convencer mediante falacias y emociones',
      'Dictar una ley judicial'
    ],
    correcta: 1,
    pista: 'Se usa en enciclopedias, manuales de ciencia y guías escolares para hacer comprensible un conocimiento.',
    explicacion: 'El texto expositivo tiene como finalidad informar, aclarar y divulgar conceptos con rigor, claridad y objetividad.'
  },

  // ═════════════════════════════════════════════════════════════════
  // ─── TIER 8-9: SECUNDARIA AVANZADA (Grados 8° y 9°) ────────────
  // ═════════════════════════════════════════════════════════════════
  {
    tier: '8-9',
    pregunta: '¿Qué novela cumbre de Gabriel García Márquez popularizó mundialmente el Realismo Mágico y le mereció el Premio Nobel en 1982?',
    opciones: ['La Vorágine', 'Cien Años de Soledad', 'María', 'El Coronel no tiene quien le escriba'],
    correcta: 1,
    pista: 'Relata las siete generaciones de la familia Buendía en el mítico pueblo caribeño de Macondo.',
    explicacion: 'Publicada en Buenos Aires en 1967, "Cien Años de Soledad" es la obra maestra del Boom y una de las cimas de la literatura universal.'
  },
  {
    tier: '8-9',
    pregunta: 'En un texto argumentativo riguroso, ¿qué es la TESIS?',
    opciones: [
      'Una descripción de los paisajes',
      'La postura o proposición central que el autor defiende o refuta mediante argumentos',
      'La biografía del autor al final del libro',
      'El listado de palabras desconocidas'
    ],
    correcta: 1,
    pista: 'Es el núcleo del debate: la idea principal que se busca demostrar con razones y evidencias válidas.',
    explicacion: 'La tesis es el juicio o postura asertiva que articula todo el ensayo argumentativo y se sostiene con premisas demostrables.'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué novela emblemática de 1924, escrita por José Eustasio Rivera, denuncia la explotación violenta de los caucheros en la Amazonía colombiana?',
    opciones: ['La Vorágine', 'María de Jorge Isaacs', 'Manuela de Eugenio Díaz', 'La Marquesa de Yolombó'],
    correcta: 0,
    pista: 'Comienza con la célebre frase: "Jugué mi corazón al azar y me lo ganó la violencia...".',
    explicacion: '"La Vorágine" de José Eustasio Rivera es la obra fundacional de la narrativa social de la selva y la barbarie de las caucherías en Colombia.'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué célebre novela romántica hispanoamericana fue escrita por el vallecaucano Jorge Isaacs en 1867?',
    opciones: ['María', 'La Vorágine', 'Amalia', 'Doña Bárbara'],
    correcta: 0,
    pista: 'Narra el idilio trágico entre Efraín y María en la hacienda El Paraíso en el Valle del Cauca.',
    explicacion: '"María" es la novela romántica más leída del siglo XIX en América Latina, destacada por su lirismo paisajístico del Valle del Cauca.'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué figura retórica consiste en la unión de dos palabras o conceptos de significado estrictamente contradictorio, como "fuego helado" o "silencio atronador"?',
    opciones: ['Hipérbole', 'Oxímoron', 'Metáfora pura', 'Sinécdoque'],
    correcta: 1,
    pista: 'Armoniza dos opuestos irreconciliables en un solo sintagma generando un nuevo significado poético profundo.',
    explicacion: 'El oxímoron combina dos ideas contrarias en una misma unidad de sentido (claroscuro, luz sombría, silencio ensordecedor).'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué fenómeno literario de los años 60 y 70 proyectó internacionalmente a autores como García Márquez, Julio Cortázar, Carlos Fuentes y Mario Vargas Llosa?',
    opciones: ['El Modernismo hispánico', 'El Boom Latinoamericano', 'El Costumbrismo colonial', 'La Ilustración'],
    correcta: 1,
    pista: 'Movimiento editorial y estético que rompió la cronología lineal e integró experimentación técnica y política.',
    explicacion: 'El Boom Latinoamericano situó a la novela hispanoamericana en la vanguardia universal con obras como Rayuela, La muerte de Artemio Cruz y Cien Años de Soledad.'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué falacia lógica comete quien descalifica una propuesta argumentativa diciendo: "No le crean porque es muy joven y no sabe vestir bien"?',
    opciones: ['Falacia de Falsa Causa', 'Falacia Ad Hominem (ataque a la persona)', 'Hombre de Paja', 'Apelación a la Ignorancia'],
    correcta: 1,
    pista: 'En lugar de refutar los argumentos o evidencias de la propuesta, ataca las características individuales de la persona.',
    explicacion: 'La falacia ad hominem intenta invalidar una idea atacando al emisor en lugar de rebatir sus premisas y razonamientos.'
  },
  {
    tier: '8-9',
    pregunta: '¿Qué figura literaria se utiliza en la exageración descomunal de: "Tanto dolor se agrupa en mi costado, que por doler me duele hasta el aliento"?',
    opciones: ['Hipérbole', 'Eufemismo', 'Pleonasmo', 'Aliteración'],
    correcta: 0,
    pista: 'Versos célebres de Miguel Hernández que aumentan la intensidad del dolor hasta límites sobrehumanos.',
    explicacion: 'La hipérbole es una alteración deliberada y magnificada de la realidad para enfatizar una emoción o idea estética.'
  }
];

export default function TriviaLiteraria({ gradoNumero = 1 }) {
  const tierInicial = gradoNumero <= 3 ? '1-3' : gradoNumero <= 5 ? '4-5' : gradoNumero <= 7 ? '6-7' : '8-9';
  const [tierActivo, setTierActivo] = useState(tierInicial);
  const [indicePregunta, setIndicePregunta] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [racha, setRacha] = useState(0);
  const [tiempo, setTiempo] = useState(25);
  const [seleccionada, setSeleccionada] = useState(null);
  const [respuestaEstado, setRespuestaEstado] = useState(null); // 'correcta', 'incorrecta'
  const [comodines, setComodines] = useState({ cincuenta: true, pista: true, tiempo: true });
  const [descartadas, setDescartadas] = useState([]);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const preguntasNivel = BANCO_TRIVIA.filter((p) => p.tier === tierActivo);
  const preguntaActual = preguntasNivel[indicePregunta % preguntasNivel.length];

  // Iniciar pregunta
  useEffect(() => {
    setTiempo(25);
    setSeleccionada(null);
    setRespuestaEstado(null);
    setDescartadas([]);
    setMostrarPista(false);
  }, [indicePregunta, tierActivo]);

  // Cronómetro
  useEffect(() => {
    if (juegoTerminado || seleccionada !== null) return;
    if (tiempo <= 0) {
      sounds.playWrong();
      setRespuestaEstado('incorrecta');
      setSeleccionada(-1);
      setRacha(0);
      voiceReader.speak("¡Se agotó el tiempo! Veamos la explicación pedagógica.");
      return;
    }

    const timer = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempo, seleccionada, juegoTerminado]);

  const escucharPregunta = () => {
    sounds.playClick();
    const textoOpciones = preguntaActual.opciones.map((op, i) => `Opción ${i + 1}: ${op}`).join('. ');
    voiceReader.speak(`${preguntaActual.pregunta}. ${textoOpciones}`);
  };

  const responder = (idx) => {
    if (seleccionada !== null) return;
    sounds.playClick();
    setSeleccionada(idx);

    if (idx === preguntaActual.correcta) {
      sounds.playCorrect();
      lanzarConfeti();
      setRespuestaEstado('correcta');
      const bonusTiempo = Math.max(10, tiempo * 4);
      const puntosGanados = 100 + bonusTiempo + racha * 30;
      setPuntaje((p) => p + puntosGanados);
      setRacha((r) => r + 1);

      voiceReader.speak(`¡Excelente! ${preguntaActual.explicacion}`);
    } else {
      sounds.playWrong();
      setRespuestaEstado('incorrecta');
      setRacha(0);
      voiceReader.speak(`La respuesta correcta era: ${preguntaActual.opciones[preguntaActual.correcta]}. ${preguntaActual.explicacion}`);
    }
  };

  const siguientePregunta = () => {
    sounds.playClick();
    if (indicePregunta + 1 < preguntasNivel.length) {
      setIndicePregunta((idx) => idx + 1);
    } else {
      setJuegoTerminado(true);
      sounds.playFanfare();
      lanzarConfeti();
      GameProgress.addXP(puntaje, 'trivia_oro');
      GameProgress.registrarVictoria(racha);
      voiceReader.speak("¡Felicitaciones! Has completado todas las preguntas de la Trivia con honores.");
    }
  };

  // Comodín 50/50
  const usarCincuenta = () => {
    if (!comodines.cincuenta || seleccionada !== null) return;
    sounds.playClick();
    const incorrectas = preguntaActual.opciones
      .map((_, i) => i)
      .filter((i) => i !== preguntaActual.correcta);
    const aDescartar = incorrectas.sort(() => Math.random() - 0.5).slice(0, 2);
    setDescartadas(aDescartar);
    setComodines((c) => ({ ...c, cincuenta: false }));
  };

  // Comodín Pista
  const usarPista = () => {
    if (!comodines.pista || seleccionada !== null) return;
    sounds.playClick();
    setMostrarPista(true);
    setComodines((c) => ({ ...c, pista: false }));
    voiceReader.speak(`Pista pedagógica: ${preguntaActual.pista}`);
  };

  // Comodín Tiempo
  const usarTiempoExtra = () => {
    if (!comodines.tiempo || seleccionada !== null) return;
    sounds.playClick();
    setTiempo((t) => t + 15);
    setComodines((c) => ({ ...c, tiempo: false }));
  };

  const reiniciarTrivia = () => {
    sounds.playClick();
    setIndicePregunta(0);
    setPuntaje(0);
    setRacha(0);
    setTiempo(25);
    setComodines({ cincuenta: true, pista: true, tiempo: true });
    setJuegoTerminado(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-yellow-400 text-white space-y-6">
      {/* Cabecera del Concurso */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-800/80 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
             Gran Concurso Televisivo de Saber y Literatura
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center gap-2">
             Trivia Literaria
          </h3>
          <p className="text-xs sm:text-sm text-amber-200">
            Pregunta {indicePregunta + 1} de {preguntasNivel.length} • Nivel escolar seleccionado
          </p>
        </div>

        {/* Selector de Nivel */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-indigo-800">
          {[
            { id: '1-3', label: '1° - 3° (Inicial)' },
            { id: '4-5', label: '4° - 5° (Mitos)' },
            { id: '6-7', label: '6° - 7° (Lírica)' },
            { id: '8-9', label: '8° - 9° (Boom y Gabo)' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => {
                sounds.playClick();
                setTierActivo(t.id);
                setIndicePregunta(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                tierActivo === t.id
                  ? 'bg-yellow-400 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Marcadores: Puntos, Racha y Comodines */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-3xl border-2 border-indigo-800">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-inner ${
              tiempo <= 7
                ? 'bg-rose-600 text-white border-rose-300 animate-pulse'
                : 'bg-indigo-950 text-yellow-300 border-indigo-700'
            }`}
          >
            {tiempo}s
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Puntuación:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-yellow-400">
               {puntaje}
            </span>
          </div>

          <div className="hidden sm:block pl-2 border-l border-indigo-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Racha:
            </span>
            <span className="text-xl font-black text-orange-400">
               x{racha}
            </span>
          </div>
        </div>

        {/* Comodines estilo Concurso */}
        <div className="flex items-center gap-2">
          <button
            onClick={usarCincuenta}
            disabled={!comodines.cincuenta || seleccionada !== null}
            title="Descartar 2 opciones incorrectas"
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all border ${
              comodines.cincuenta && seleccionada === null
                ? 'bg-indigo-900 hover:bg-indigo-800 text-white border-indigo-600 cursor-pointer active:scale-95'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 cursor-not-allowed'
            }`}
          >
            50:50
          </button>

          <button
            onClick={usarPista}
            disabled={!comodines.pista || seleccionada !== null}
            title="Pedir pista del profesor"
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all border ${
              comodines.pista && seleccionada === null
                ? 'bg-indigo-900 hover:bg-indigo-800 text-white border-indigo-600 cursor-pointer active:scale-95'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 cursor-not-allowed'
            }`}
          >
             Pista
          </button>

          <button
            onClick={usarTiempoExtra}
            disabled={!comodines.tiempo || seleccionada !== null}
            title="Añadir 15 segundos"
            className={`px-3 py-2 rounded-xl text-xs font-black transition-all border ${
              comodines.tiempo && seleccionada === null
                ? 'bg-indigo-900 hover:bg-indigo-800 text-white border-indigo-600 cursor-pointer active:scale-95'
                : 'bg-slate-900 text-slate-600 border-slate-800 opacity-40 cursor-not-allowed'
            }`}
          >
            +15s 
          </button>
        </div>
      </div>

      {/* Pantalla Final o Pregunta Activa */}
      {juegoTerminado ? (
        <div className="bg-slate-900/95 border-4 border-yellow-400 rounded-3xl p-8 text-center space-y-4 animate-fade-in max-w-lg mx-auto shadow-2xl">
          
          <h4 className="text-3xl font-black text-yellow-400">¡GRAN CAMPEÓN DE LA TRIVIA!</h4>
          <p className="text-slate-200 text-base font-medium">
            Has respondido con maestría el banco curricular de preguntas.
          </p>
          <div className="text-4xl font-black text-emerald-400">
            {puntaje} PUNTOS DE ORO 
          </div>
          <button
            onClick={reiniciarTrivia}
            className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
             Jugar Nueva Ronda
          </button>
        </div>
      ) : (
        <>
          {/* Tarjeta de la Pregunta */}
          <div className="bg-gradient-to-b from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 border-2 border-indigo-700 shadow-xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-black text-yellow-400 uppercase tracking-widest">
                Pregunta #{indicePregunta + 1}
              </span>
              <button
                onClick={escucharPregunta}
                className="px-3.5 py-1.5 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                 Leer en Voz Alta
              </button>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white leading-relaxed">
              {preguntaActual.pregunta}
            </h4>

            {mostrarPista && (
              <div className="p-3 bg-amber-400/10 border border-yellow-400/40 rounded-2xl text-xs sm:text-sm text-yellow-200 animate-slide-down">
                <strong> Pista Pedagógica:</strong> {preguntaActual.pista}
              </div>
            )}
          </div>

          {/* Opciones de Respuesta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {preguntaActual.opciones.map((op, idx) => {
              if (descartadas.includes(idx)) {
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-800 bg-slate-950/40 text-slate-600 opacity-20 select-none"
                  >
                    <span className="font-bold text-sm">Opción {String.fromCharCode(65 + idx)}: Descartada</span>
                  </div>
                );
              }

              let estilo = 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-yellow-400';

              if (seleccionada !== null) {
                if (idx === preguntaActual.correcta) {
                  estilo = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/40 scale-102';
                } else if (idx === seleccionada) {
                  estilo = 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/40';
                } else {
                  estilo = 'bg-slate-950/40 text-slate-500 border-slate-800 opacity-40';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={seleccionada !== null}
                  onClick={() => responder(idx)}
                  className={`p-4 rounded-2xl border-3 text-left transition-all duration-150 flex items-center gap-3 select-none active:scale-98 cursor-pointer ${estilo}`}
                >
                  <span className="w-8 h-8 rounded-xl bg-black/30 flex items-center justify-center font-black text-xs shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-bold text-sm sm:text-base leading-snug">{op}</span>
                </button>
              );
            })}
          </div>

          {/* Retroalimentación Pedagógica Inmediata */}
          {respuestaEstado && (
            <div
              className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-down ${
                respuestaEstado === 'correcta'
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
                  : 'bg-rose-950/90 text-rose-200 border-rose-400'
              }`}
            >
              <div>
                <h5 className="font-black text-base flex items-center gap-2">
                  <span>{respuestaEstado === 'correcta' ? ' ¡Respuesta Correcta!' : ' ¡Respuesta Incorrecta!'}</span>
                </h5>
                <p className="text-xs sm:text-sm mt-1 font-semibold leading-relaxed">
                  {preguntaActual.explicacion}
                </p>
              </div>

              <button
                onClick={siguientePregunta}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Siguiente Pregunta 
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
