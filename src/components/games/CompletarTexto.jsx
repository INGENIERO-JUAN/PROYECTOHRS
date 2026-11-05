import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const PASAJES = {
  basicos: [
    {
      titulo: 'Realismo mágico',
      autor: 'Inspirado en García Márquez',
      texto: [
        'Muchos años después, frente al pelotón de fusilamiento, el coronel había de recordar aquella tarde',
        'en que su padre lo llevó a conocer el',
        '_HIELO_',
        '. El mundo era tan',
        '_RECIENTE_',
        'que muchas cosas carecían de nombre, y para mencionarlas había que',
        '_SEÑALARLAS_',
        'con el dedo. Todos los años, por el mes de',
        '_MARZO_',
        ', una familia de gitanos plantaba su carpa cerca de la aldea.',
      ],
      palabrasCorrectas: ['HIELO', 'RECIENTE', 'SEÑALARLAS', 'MARZO'],
      distractores: ['FUEGO', 'ANTIGUO', 'OLVIDARLAS'],
    },
    {
      titulo: 'Geografía colombiana',
      autor: 'Descripción geográfica',
      texto: [
        'Colombia se encuentra en el extremo',
        '_NOROESTE_',
        'de América del Sur. Su territorio está atravesado por tres',
        '_CORDILLERAS_',
        'que forman valles fértiles y ríos caudalosos. La',
        '_BIODIVERSIDAD_',
        'del país es una de las más ricas del planeta, albergando especies únicas en sus',
        '_SELVAS_',
        'tropicales y páramos.',
      ],
      palabrasCorrectas: ['NOROESTE', 'CORDILLERAS', 'BIODIVERSIDAD', 'SELVAS'],
      distractores: ['SURESTE', 'MONTAÑAS', 'DESIERTOS'],
    },
    {
      titulo: 'La leyenda del Dorado',
      autor: 'Mito muisca',
      texto: [
        'Cuenta la leyenda que el cacique muisca cubría su cuerpo con polvo de',
        '_ORO_',
        'y navegaba en una balsa hacia el centro de la laguna de',
        '_GUATAVITA_',
        '. Allí realizaba',
        '_OFRENDAS_',
        'a los dioses mientras su pueblo entonaba cánticos desde la',
        '_ORILLA_',
        '. Este ritual atrajo a los conquistadores españoles.',
      ],
      palabrasCorrectas: ['ORO', 'GUATAVITA', 'OFRENDAS', 'ORILLA'],
      distractores: ['PLATA', 'TOTA', 'PLEGARIAS', 'MONTAÑA'],
    },
    {
      titulo: 'Poesía americana',
      autor: 'Inspirado en Gabriela Mistral',
      texto: [
        'Dame la',
        '_MANO_',
        'y danzaremos; dame la mano y me',
        '_AMARÁS_',
        '. Como una sola',
        '_FLOR_',
        'seremos, como una flor y nada más. Cantando el mismo',
        '_VERSO_',
        ', por el mismo caminar.',
      ],
      palabrasCorrectas: ['MANO', 'AMARÁS', 'FLOR', 'VERSO'],
      distractores: ['BRAZO', 'QUERRÁS', 'HOJA', 'CANTO'],
    },
    {
      titulo: 'El Carnaval de Barranquilla',
      autor: 'Tradición y Folclor Caribe',
      texto: [
        'En el Carnaval de Barranquilla, la alegría se vive al ritmo de la',
        '_CUMBIA_',
        'y el mapalé. Personajes tradicionales como la',
        '_MARIMONDA_',
        'y el Rey Momo llenan las calles de',
        '_COLOR_',
        'y baile. Esta fiesta es una',
        '_TRADICIÓN_',
        'inmortal del Caribe colombiano.',
      ],
      palabrasCorrectas: ['CUMBIA', 'MARIMONDA', 'COLOR', 'TRADICIÓN'],
      distractores: ['SALSA', 'MÁSCARA', 'TRISTEZA', 'MODERNA'],
    },
    {
      titulo: 'Rafael Pombo y la Literatura Infantil',
      autor: 'Fábula Clásica Colombiana',
      texto: [
        'El poeta bogotano Rafael Pombo escribió fábulas inolvidables como',
        '_RIN_RIN_',
        'Renacuajo y Simón el',
        '_BOBITO_',
        '. Sus versos enseñan valores mediante el humor y la',
        '_IMAGINACIÓN_',
        ', deleitando a generaciones de',
        '_NIÑOS_',
        'y adultos.',
      ],
      palabrasCorrectas: ['RIN_RIN', 'BOBITO', 'IMAGINACIÓN', 'NIÑOS'],
      distractores: ['DON_JUAN', 'SABIO', 'SERIEDAD', 'JÓVENES'],
    },
    {
      titulo: 'El Río Amazonas y la Selva',
      autor: 'Biodiversidad de la Amazonía',
      texto: [
        'El majestuoso río Amazonas serpentea a través del',
        '_PULMÓN_',
        'del planeta. En sus aguas nada el misterioso delfín',
        '_ROSADO_',
        ', mientras que en la copa de los árboles cantan los',
        '_TUCANES_',
        '. Proteger este tesoro ecológico es el gran',
        '_DEBER_',
        'de la humanidad.',
      ],
      palabrasCorrectas: ['PULMÓN', 'ROSADO', 'TUCANES', 'DEBER'],
      distractores: ['CORAZÓN', 'AZUL', 'LEONES', 'JUEGO'],
    },
    {
      titulo: 'Bachué y la Laguna de Iguaque',
      autor: 'Mito Muisca del Origen',
      texto: [
        'De las aguas sagradas de la laguna de Iguaque emergió',
        '_BACHUÉ_',
        'llevando a un niño de la mano. Al crecer, poblaron la',
        '_TIERRA_',
        'con hombres sabios y laboriosos. Al final de su vida, se convirtieron en',
        '_SERPIENTES_',
        'y regresaron a las profundidades de la',
        '_LAGUNA_',
        '.',
      ],
      palabrasCorrectas: ['BACHUÉ', 'TIERRA', 'SERPIENTES', 'LAGUNA'],
      distractores: ['BOCHICA', 'LUNA', 'PÁJAROS', 'CIUDAD'],
    },
  ],
  avanzados: [
    {
      titulo: 'Crónica periodística',
      autor: 'Estilo crónica literaria',
      texto: [
        'La',
        '_METAMORFOSIS_',
        'urbana de Medellín constituye un paradigma de',
        '_RESILIENCIA_',
        'social. Los barrios que alguna vez fueron sinónimo de violencia hoy albergan bibliotecas y centros',
        '_CULTURALES_',
        'que transformaron la',
        '_PERCEPCIÓN_',
        'internacional de la ciudad. Este fenómeno demuestra que la inversión en educación genera cambios',
        '_ESTRUCTURALES_',
        'profundos.',
      ],
      palabrasCorrectas: ['METAMORFOSIS', 'RESILIENCIA', 'CULTURALES', 'PERCEPCIÓN', 'ESTRUCTURALES'],
      distractores: ['TRANSFORMACIÓN', 'PACIENCIA', 'SUPERFICIALES', 'INTUICIÓN'],
    },
    {
      titulo: 'Realismo mágico avanzado',
      autor: 'Inspirado en García Márquez',
      texto: [
        'El',
        '_ESPLENDOR_',
        'de Macondo se extinguió en una',
        '_VORÁGINE_',
        'de hojas secas y mariposas amarillas. Los',
        '_PERGAMINOS_',
        'de Melquíades contenían la',
        '_PROFECÍA_',
        'de una estirpe condenada a cien años de',
        '_SOLEDAD_',
        ', sin una segunda oportunidad sobre la tierra.',
      ],
      palabrasCorrectas: ['ESPLENDOR', 'VORÁGINE', 'PERGAMINOS', 'PROFECÍA', 'SOLEDAD'],
      distractores: ['RESPLANDOR', 'TORMENTA', 'MANUSCRITOS', 'LEYENDA'],
    },
    {
      titulo: 'Poesía del mar',
      autor: 'Inspirado en Pablo Neruda',
      texto: [
        'Puedo escribir los versos más',
        '_TRISTES_',
        'esta noche. Pensar que no la tengo, sentir que la he',
        '_PERDIDO_',
        '. Oír la noche',
        '_INMENSA_',
        ', más inmensa sin ella. Y el verso cae al',
        '_ALMA_',
        'como al pasto el',
        '_ROCÍO_',
        '.',
      ],
      palabrasCorrectas: ['TRISTES', 'PERDIDO', 'INMENSA', 'ALMA', 'ROCÍO'],
      distractores: ['BELLOS', 'OLVIDADO', 'OSCURA', 'LLUVIA'],
    },
    {
      titulo: 'Historia precolombina',
      autor: 'Ensayo académico',
      texto: [
        'Las civilizaciones',
        '_PRECOLOMBINAS_',
        'de América desarrollaron sistemas',
        '_AGRÍCOLAS_',
        'sofisticados que incluían terrazas y canales de',
        '_IRRIGACIÓN_',
        '. Su conocimiento',
        '_ASTRONÓMICO_',
        'les permitió crear calendarios de notable',
        '_PRECISIÓN_',
        'que aún hoy asombran a los investigadores.',
      ],
      palabrasCorrectas: ['PRECOLOMBINAS', 'AGRÍCOLAS', 'IRRIGACIÓN', 'ASTRONÓMICO', 'PRECISIÓN'],
      distractores: ['COLONIALES', 'INDUSTRIALES', 'NAVEGACIÓN', 'EXACTITUD'],
    },
    {
      titulo: 'María de Jorge Isaacs',
      autor: 'Novela Cumbre del Romanticismo',
      texto: [
        'La novela cumbre del romanticismo hispanoamericano relata el idilio campestre entre Efraín y',
        '_MARÍA_',
        'en el Valle del',
        '_CAUCA_',
        '. La exuberancia del paisaje se funde con el',
        '_DESTINO_',
        'trágico de la protagonista, convirtiéndose en un canto a la',
        '_NOSTALGIA_',
        'y la pureza del amor.',
      ],
      palabrasCorrectas: ['MARÍA', 'CAUCA', 'DESTINO', 'NOSTALGIA'],
      distractores: ['ISABEL', 'MAGDALENA', 'TRIUNFO', 'ALEGRÍA'],
    },
    {
      titulo: 'La Vorágine y el Infierno Verde',
      autor: 'José Eustasio Rivera',
      texto: [
        'La selva amazónica no es un paraíso bucólico, sino una',
        '_DEGRADACIÓN_',
        'donde impera la ley de la supervivencia. Arturo Cova sucumbe ante la',
        '_DESMESURA_',
        'del entorno y la crueldad de la explotación cauchera, en una prosa lírica cargada de',
        '_DESESPERANZA_',
        'y vigor',
        '_TESTIMONIAL_',
        '.',
      ],
      palabrasCorrectas: ['DEGRADACIÓN', 'DESMESURA', 'DESESPERANZA', 'TESTIMONIAL'],
      distractores: ['PAZ', 'CALMA', 'ILUSIÓN', 'FANTASIOSO'],
    },
    {
      titulo: 'El Simbolismo de José Asunción Silva',
      autor: 'Lírica Modernista',
      texto: [
        'El poeta bogotano renovó la métrica castellana al componer su célebre',
        '_NOCTURNO_',
        ', caracterizado por el ritmo envolvente y la atmósfera de',
        '_PENUMBRA_',
        '. Su sensibilidad decadentista anticipó el modernismo y dejó una',
        '_HUELLA_',
        'imborrable en la lírica',
        '_CONTINENTAL_',
        '.',
      ],
      palabrasCorrectas: ['NOCTURNO', 'PENUMBRA', 'HUELLA', 'CONTINENTAL'],
      distractores: ['MADRIGAL', 'CLARIDAD', 'DEUDA', 'EFÍMERA'],
    },
    {
      titulo: 'El Ensayo Crítico y la Identidad Nacional',
      autor: 'Análisis Sociolingüístico',
      texto: [
        'El análisis riguroso de nuestra historia exige superar visiones',
        '_MANIQUEAS_',
        'y simplistas. Comprender las raíces del conflicto implica examinar la estructura',
        '_AGRARIA_',
        ', la exclusión social y la pluralidad de',
        '_VOCES_',
        'que confluyen en el relato de la',
        '_NACIÓN_',
        '.',
      ],
      palabrasCorrectas: ['MANIQUEAS', 'AGRARIA', 'VOCES', 'NACIÓN'],
      distractores: ['COMPLEJAS', 'URBANA', 'SILENCIOS', 'COLONIA'],
    },
  ],
};

function mezclarArray(arr) {
  const copia = [...arr];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function parsearPasaje(pasaje) {
  const blanks = [];
  const segmentos = [];
  let blankIndex = 0;

  pasaje.texto.forEach((parte) => {
    const match = parte.match(/^_(.+)_$/);
    if (match) {
      blanks.push({ id: blankIndex, palabra: match[1], filled: null, correct: false });
      segmentos.push({ tipo: 'blank', blankIndex });
      blankIndex++;
    } else {
      segmentos.push({ tipo: 'texto', contenido: parte });
    }
  });

  return { blanks, segmentos };
}

export default function CompletarTexto({ gradoNumero = 7 }) {
  const esAvanzado = gradoNumero >= 8;
  const listaPasajes = esAvanzado ? PASAJES.avanzados : PASAJES.basicos;

  const [pasajeActual, setPasajeActual] = useState(0);
  const [blanks, setBlanks] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [bancoPalabras, setBancoPalabras] = useState([]);
  const [blankSeleccionado, setBlankSeleccionado] = useState(null);
  const [palabraSeleccionada, setPalabraSeleccionada] = useState(null);
  const [puntuacion, setPuntuacion] = useState(0);
  const [tiempoRestante, setTiempoRestante] = useState(90);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [pasajeCompletado, setPasajeCompletado] = useState(false);
  const [animacionError, setAnimacionError] = useState(null);
  const [animacionCorrecta, setAnimacionCorrecta] = useState(null);
  const [bonusTiempo, setBonusTiempo] = useState(0);

  useEffect(() => {
    setPasajeActual(0);
    cargarPasaje(0);
  }, [esAvanzado]);

  useEffect(() => {
    if (juegoTerminado || pasajeCompletado) return;
    if (tiempoRestante <= 0) {
      avanzarPasaje();
      return;
    }
    const timer = setInterval(() => {
      setTiempoRestante((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [tiempoRestante, juegoTerminado, pasajeCompletado]);

  function cargarPasaje(index) {
    if (index >= listaPasajes.length) {
      setJuegoTerminado(true);
      try { lanzarConfeti(); } catch (_) {}
      try { sounds.playFanfare(); } catch (_) {}
      try {
        GameProgress.addXP(puntuacion);
        GameProgress.registrarVictoria(1);
      } catch (_) {}
      return;
    }
    const pasaje = listaPasajes[index];
    const { blanks: newBlanks, segmentos: newSegmentos } = parsearPasaje(pasaje);
    const todasPalabras = mezclarArray([...pasaje.palabrasCorrectas, ...pasaje.distractores]);

    setBlanks(newBlanks);
    setSegmentos(newSegmentos);
    setBancoPalabras(todasPalabras.map((p) => ({ palabra: p, usada: false })));
    setBlankSeleccionado(null);
    setPalabraSeleccionada(null);
    setTiempoRestante(90);
    setPasajeCompletado(false);
    setAnimacionError(null);
    setAnimacionCorrecta(null);
    setBonusTiempo(0);
  }

  function avanzarPasaje() {
    const siguiente = pasajeActual + 1;
    setPasajeActual(siguiente);
    cargarPasaje(siguiente);
  }

  function intentarColocar(blankIdx, palabra) {
    const blank = blanks[blankIdx];
    if (!blank || blank.correct) return;

    const pasaje = listaPasajes[pasajeActual];

    if (palabra.toUpperCase() === blank.palabra.toUpperCase()) {
      const newBlanks = blanks.map((b) =>
        b.id === blankIdx ? { ...b, filled: palabra, correct: true } : b
      );
      setBlanks(newBlanks);
      setBancoPalabras((prev) =>
        prev.map((p) => (p.palabra === palabra ? { ...p, usada: true } : p))
      );
      setPuntuacion((s) => s + 150);
      setAnimacionCorrecta(blankIdx);
      setTimeout(() => setAnimacionCorrecta(null), 600);

      const todosCorrectos = newBlanks.every((b) => b.correct);
      if (todosCorrectos) {
        const bonus = Math.floor(tiempoRestante * 2);
        setBonusTiempo(bonus);
        setPuntuacion((s) => s + bonus);
        setPasajeCompletado(true);
        try { sounds.playCorrect(); } catch (_) {}
        setTimeout(() => avanzarPasaje(), 2000);
      }
    } else {
      setPuntuacion((s) => Math.max(0, s - 50));
      setAnimacionError(blankIdx);
      try { sounds.playIncorrect?.(); } catch (_) {}
      setTimeout(() => setAnimacionError(null), 500);
    }

    setBlankSeleccionado(null);
    setPalabraSeleccionada(null);
  }

  function handleClickBlank(blankIdx) {
    const blank = blanks[blankIdx];
    if (blank.correct || pasajeCompletado) return;

    if (palabraSeleccionada !== null) {
      intentarColocar(blankIdx, palabraSeleccionada);
    } else {
      setBlankSeleccionado(blankIdx === blankSeleccionado ? null : blankIdx);
    }
  }

  function handleClickPalabra(palabra) {
    if (pasajeCompletado) return;

    if (blankSeleccionado !== null) {
      intentarColocar(blankSeleccionado, palabra);
    } else {
      setPalabraSeleccionada(palabra === palabraSeleccionada ? null : palabra);
    }
  }

  const progreso = ((pasajeActual) / listaPasajes.length) * 100;
  const progresoActual = blanks.length > 0
    ? (blanks.filter((b) => b.correct).length / blanks.length) * 100
    : 0;

  const minutosRestantes = Math.floor(tiempoRestante / 60);
  const segundosRestantes = tiempoRestante % 60;
  const tiempoColor = tiempoRestante <= 15
    ? 'text-red-500'
    : tiempoRestante <= 30
      ? 'text-amber-500'
      : 'text-indigo-600';

  if (juegoTerminado) {
    return (
      <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-violet-200 text-center">
        <div className="text-6xl mb-4"></div>
        <h2 className="text-3xl font-black text-violet-800 mb-2">¡Texto Completado!</h2>
        <p className="text-lg text-slate-600 mb-6">
          Has completado todos los pasajes literarios
        </p>
        <div className="bg-white rounded-2xl p-6 shadow-lg inline-block mb-6">
          <p className="text-sm text-slate-500 uppercase tracking-wide font-semibold">Puntuación Final</p>
          <p className="text-5xl font-black text-violet-700 mt-1">{puntuacion}</p>
          <p className="text-sm text-slate-400 mt-2">puntos</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => {
              setPasajeActual(0);
              setPuntuacion(0);
              setJuegoTerminado(false);
              cargarPasaje(0);
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Jugar de nuevo
          </button>
        </div>
      </div>
    );
  }

  const pasaje = listaPasajes[pasajeActual];

  return (
    <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-violet-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-violet-800 tracking-tight">
             Completar el Texto
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Grado {gradoNumero} · Pasaje {pasajeActual + 1} de {listaPasajes.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`font-mono text-2xl font-black ${tiempoColor} tabular-nums`}>
            {minutosRestantes}:{segundosRestantes.toString().padStart(2, '0')}
          </div>
          <div className="bg-white rounded-xl px-4 py-2 shadow-md border border-violet-200">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Puntos</span>
            <p className="text-xl font-black text-violet-700 leading-tight">{puntuacion}</p>
          </div>
        </div>
      </div>

      {/* Progress bar general */}
      <div className="mb-2">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Progreso general</span>
          <span>{Math.round(progreso)}%</span>
        </div>
        <div className="w-full h-2 bg-violet-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      {/* Progress bar pasaje actual */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>Espacios completados</span>
          <span>{blanks.filter((b) => b.correct).length}/{blanks.length}</span>
        </div>
        <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${progresoActual}%` }}
          />
        </div>
      </div>

      {/* Passage info */}
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          {pasaje.titulo}
        </span>
        <span className="text-xs text-slate-400 italic">{pasaje.autor}</span>
      </div>

      {/* Text display */}
      <div className="bg-white rounded-2xl p-6 shadow-inner text-lg leading-loose font-medium text-slate-800 mb-6 select-none">
        {segmentos.map((seg, i) => {
          if (seg.tipo === 'texto') {
            return <span key={i}>{seg.contenido}</span>;
          }
          const blank = blanks[seg.blankIndex];
          const estaSeleccionado = blankSeleccionado === seg.blankIndex;
          const tieneError = animacionError === seg.blankIndex;
          const tieneExito = animacionCorrecta === seg.blankIndex;

          if (blank.correct) {
            return (
              <span
                key={i}
                className={`inline-block min-w-[80px] bg-emerald-100 border-b-3 border-emerald-500 border-solid rounded-lg font-bold text-center mx-1 px-3 py-1 text-emerald-700 transition-all ${
                  tieneExito ? 'animate-pulse ring-2 ring-emerald-400 scale-105' : ''
                }`}
              >
                {blank.filled}
              </span>
            );
          }

          return (
            <span
              key={i}
              onClick={() => handleClickBlank(seg.blankIndex)}
              className={`inline-block min-w-[80px] border-b-3 border-dashed text-center mx-1 px-2 py-1 cursor-pointer transition-all ${
                estaSeleccionado
                  ? 'border-violet-500 bg-violet-100 rounded-lg scale-105 ring-2 ring-violet-400'
                  : 'border-indigo-400 hover:border-violet-400 hover:bg-violet-50'
              } ${
                tieneError
                  ? 'animate-[shake_0.5s_ease-in-out] bg-red-100 border-red-400'
                  : ''
              }`}
              title="Haz clic para seleccionar este espacio"
            >
              {blank.filled || (
                <span className="text-indigo-300 text-sm">
                  {estaSeleccionado ? '▼' : '___'}
                </span>
              )}
            </span>
          );
        })}
      </div>

      {/* Instruction */}
      <p className="text-sm text-slate-500 text-center mb-3">
        {blankSeleccionado !== null
          ? ' Ahora selecciona una palabra del banco'
          : palabraSeleccionada
            ? ' Ahora haz clic en el espacio donde va la palabra'
            : ' Selecciona un espacio vacío o una palabra para comenzar'}
      </p>

      {/* Word bank */}
      <div className="bg-white/60 rounded-2xl p-4 border border-violet-100">
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3">
          Banco de palabras
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {bancoPalabras.map((item, i) => {
            if (item.usada) return null;
            const seleccionada = palabraSeleccionada === item.palabra;
            return (
              <button
                key={`${item.palabra}-${i}`}
                onClick={() => handleClickPalabra(item.palabra)}
                className={`bg-white shadow-md border-2 rounded-xl px-4 py-2 font-bold transition-all hover:scale-105 active:scale-95 ${
                  seleccionada
                    ? 'ring-2 ring-violet-500 bg-violet-50 border-violet-400 text-violet-700'
                    : 'border-slate-200 hover:border-violet-400 text-slate-700 hover:text-violet-700'
                }`}
              >
                {item.palabra}
              </button>
            );
          })}
        </div>
      </div>

      {/* Passage completed overlay */}
      {pasajeCompletado && (
        <div className="mt-4 text-center animate-bounce">
          <div className="inline-block bg-emerald-100 border-2 border-emerald-300 rounded-2xl px-6 py-3">
            <p className="text-emerald-700 font-bold text-lg">
               ¡Pasaje completado!
              {bonusTiempo > 0 && (
                <span className="text-emerald-500 ml-2 text-sm">+{bonusTiempo} bonus por tiempo</span>
              )}
            </p>
            <p className="text-emerald-500 text-sm mt-1">Avanzando al siguiente...</p>
          </div>
        </div>
      )}

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
