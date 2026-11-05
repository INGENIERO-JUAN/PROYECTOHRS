import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const BANCO_ORACIONES = [
  // Nivel 1: Estructura básica sujeto + verbo + predicado (1° a 3° Grado)
  {
    id: 1,
    nivel: 'Básico',
    palabrasCorrectas: ['El', 'colibrí', 'vuela', 'entre', 'las', 'flores', 'silvestres'],
    pista: 'Ave diminuta que liba el néctar en el jardín.',
    icono: ''
  },
  {
    id: 2,
    nivel: 'Básico',
    palabrasCorrectas: ['La', 'maestra', 'lee', 'un', 'cuento', 'maravilloso', 'en', 'voz', 'alta'],
    pista: 'Actividad de narración oral en el salón de clases.',
    icono: ''
  },
  {
    id: 3,
    nivel: 'Básico',
    palabrasCorrectas: ['El', 'campesino', 'cultiva', 'el', 'café', 'con', 'gran', 'esmero'],
    pista: 'Labor agrícola tradicional en las montañas colombianas.',
    icono: ''
  },
  {
    id: 4,
    nivel: 'Básico',
    palabrasCorrectas: ['Los', 'niños', 'escriben', 'poemas', 'con', 'rimas', 'alegres'],
    pista: 'Creación literaria en el cuaderno de español.',
    icono: ''
  },
  {
    id: 5,
    nivel: 'Básico',
    palabrasCorrectas: ['El', 'sol', 'dorado', 'ilumina', 'la', 'mañana', 'en', 'el', 'campo'],
    pista: 'Amanecer radiante en la vereda.',
    icono: ''
  },
  {
    id: 6,
    nivel: 'Básico',
    palabrasCorrectas: ['La', 'mariposa', 'amarilla', 'visita', 'las', 'plantas', 'del', 'huerto'],
    pista: 'Insecto alado de bellos colores.',
    icono: ''
  },

  // Nivel 2: Mitos, fábulas y geografía (4° a 5° Grado)
  {
    id: 7,
    nivel: 'Intermedio',
    palabrasCorrectas: ['La', 'Madremonte', 'protege', 'las', 'fuentes', 'de', 'agua', 'cristalina'],
    pista: 'Leyenda del folclor que cuida la naturaleza y los bosques.',
    icono: ''
  },
  {
    id: 8,
    nivel: 'Intermedio',
    palabrasCorrectas: ['Los', 'dioses', 'mayas', 'crearon', 'al', 'hombre', 'a', 'partir', 'del', 'maíz'],
    pista: 'Mito del Popol Vuh sobre el origen sagrado de la humanidad.',
    icono: ''
  },
  {
    id: 9,
    nivel: 'Intermedio',
    palabrasCorrectas: ['Las', 'fábulas', 'dejan', 'una', 'valiosa', 'moraleja', 'para', 'reflexionar'],
    pista: 'Narraciones protagonizadas por animales que enseñan virtudes.',
    icono: ''
  },
  {
    id: 10,
    nivel: 'Intermedio',
    palabrasCorrectas: ['El', 'río', 'Magdalena', 'atraviesa', 'valles', 'fértiles', 'de', 'nuestro', 'país'],
    pista: 'Principal arteria fluvial que une las regiones de Colombia.',
    icono: ''
  },
  {
    id: 11,
    nivel: 'Intermedio',
    palabrasCorrectas: ['Bochica', 'abrió', 'el', 'Salto', 'del', 'Tequendama', 'con', 'su', 'báculo', 'sagrado'],
    pista: 'Mito muisca sobre el desagüe de la sabana de Bogotá.',
    icono: ''
  },
  {
    id: 12,
    nivel: 'Intermedio',
    palabrasCorrectas: ['Los', 'adjetivos', 'califican', 'las', 'cualidades', 'del', 'sustantivo', 'en', 'la', 'oración'],
    pista: 'Regla gramatical sobre las palabras que describen personas y cosas.',
    icono: ''
  },

  // Nivel 3: Sintaxis avanzada, subordinadas y figuras literarias (6° a 9° Grado)
  {
    id: 13,
    nivel: 'Avanzado',
    palabrasCorrectas: ['El', 'realismo', 'mágico', 'entrelaza', 'lo', 'cotidiano', 'con', 'lo', 'fantástico'],
    pista: 'Corriente literaria cumbre de Gabriel García Márquez.',
    icono: ''
  },
  {
    id: 14,
    nivel: 'Avanzado',
    palabrasCorrectas: ['Una', 'metáfora', 'transforma', 'las', 'palabras', 'en', 'imágenes', 'poéticas'],
    pista: 'Recurso expresivo que compara realidades sin usar conectores explícitos.',
    icono: ''
  },
  {
    id: 15,
    nivel: 'Avanzado',
    palabrasCorrectas: ['Aunque', 'el', 'camino', 'sea', 'largo', 'el', 'conocimiento', 'ilumina', 'el', 'futuro'],
    pista: 'Oración subordinada concesiva sobre el valor de estudiar.',
    icono: ''
  },
  {
    id: 16,
    nivel: 'Avanzado',
    palabrasCorrectas: ['Los', 'ensayos', 'argumentativos', 'defienden', 'una', 'tesis', 'con', 'evidencias', 'demostrables'],
    pista: 'Estructura formal del discurso persuasivo y crítico.',
    icono: ''
  },
  {
    id: 17,
    nivel: 'Avanzado',
    palabrasCorrectas: ['La', 'Vorágine', 'denunció', 'la', 'explotación', 'cauchense', 'en', 'las', 'selvas', 'amazónicas'],
    pista: 'Novela de José Eustasio Rivera de 1924.',
    icono: ''
  },
  {
    id: 18,
    nivel: 'Avanzado',
    palabrasCorrectas: ['El', 'oxímoron', 'combina', 'dos', 'términos', 'opuestos', 'en', 'un', 'mismo', 'verso'],
    pista: 'Figura retórica que armoniza conceptos contrarios como fuego helado.',
    icono: ''
  }
];

export default function OrganizadorOraciones() {
  const [indice, setIndice] = useState(0);
  const desafioActual = BANCO_ORACIONES[indice] || BANCO_ORACIONES[0];

  const [bancoPalabras, setBancoPalabras] = useState([]);
  const [oracionConstruida, setOracionConstruida] = useState([]);
  const [acierto, setAcierto] = useState(null);
  const [puntaje, setPuntaje] = useState(0);

  // Inicializar oración actual
  useEffect(() => {
    const revueltas = [...desafioActual.palabrasCorrectas]
      .map((p, i) => ({ id: `${p}-${i}-${Math.random()}`, texto: p }))
      .sort(() => Math.random() - 0.5);

    setBancoPalabras(revueltas);
    setOracionConstruida([]);
    setAcierto(null);
  }, [indice]);

  const agregarPalabra = (palabra) => {
    sounds.playClick();
    voiceReader.speakWord(palabra.texto);

    setBancoPalabras((prev) => prev.filter((p) => p.id !== palabra.id));
    const nuevaOracion = [...oracionConstruida, palabra];
    setOracionConstruida(nuevaOracion);

    if (nuevaOracion.length === desafioActual.palabrasCorrectas.length) {
      const textoFinal = nuevaOracion.map((p) => p.texto).join(' ');
      const textoEsperado = desafioActual.palabrasCorrectas.join(' ');

      if (textoFinal === textoEsperado) {
        sounds.playCorrect();
        lanzarConfeti();
        setAcierto(true);
        setPuntaje((p) => p + 120);
        GameProgress.addXP(120);
        setTimeout(() => {
          voiceReader.speak(`¡Excelente! ${textoEsperado}`);
        }, 300);
      } else {
        sounds.playWrong();
        setAcierto(false);
        voiceReader.speak("Ese orden no suena bien, prueba reorganizarlas.");
      }
    }
  };

  const escucharPista = () => {
    sounds.playClick();
    voiceReader.speak(`Pista de la oración: ${desafioActual.pista}`);
  };

  const quitarPalabra = (palabra) => {
    sounds.playClick();
    setOracionConstruida((prev) => prev.filter((p) => p.id !== palabra.id));
    setBancoPalabras((prev) => [...prev, palabra]);
    setAcierto(null);
  };

  const siguiente = () => {
    sounds.playClick();
    if (indice + 1 < BANCO_ORACIONES.length) {
      setIndice((prev) => prev + 1);
    } else {
      setIndice(0);
    }
  };

  const reiniciarActual = () => {
    sounds.playClick();
    const revueltas = [...desafioActual.palabrasCorrectas]
      .map((p, i) => ({ id: `${p}-${i}-${Math.random()}`, texto: p }))
      .sort(() => Math.random() - 0.5);

    setBancoPalabras(revueltas);
    setOracionConstruida([]);
    setAcierto(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-orange-200/80 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-orange-700 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Detective de Sintaxis y Cohesión
            </span>
            <span className="text-xs font-bold text-slate-400">
              Nivel: {desafioActual.nivel} • Reto {indice + 1} de {BANCO_ORACIONES.length}
            </span>
          </div>
          <h3 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
             ¡Ordena la Frase Revuelta!
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Ubica las palabras en el orden gramatical y lógico correcto para formar una oración con sentido.
          </p>
        </div>

        <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-2xl flex items-center gap-2 text-sm font-black text-orange-900 shadow-sm">
          <span> Puntos:</span>
          <span>{puntaje}</span>
        </div>
      </div>

      {/* Pista */}
      <div className="bg-orange-50/80 border border-orange-200 p-4 rounded-2xl flex items-center gap-3">
        <span className="text-3xl">{desafioActual.icono}</span>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-800">
              Pista de contexto:
            </span>
            <button
              onClick={escucharPista}
              className="inline-flex items-center gap-1 text-[11px] font-black text-orange-950 bg-orange-200/90 hover:bg-orange-300 px-2.5 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 shadow-sm"
            >
               Escuchar en voz alta
            </button>
          </div>
          <p className="text-slate-800 font-bold text-sm sm:text-base leading-snug mt-0.5">
            {desafioActual.pista}
          </p>
        </div>
      </div>

      {/* Oración en Construcción */}
      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
          Tu Oración en Formación (Toca una palabra para devolverla):
        </label>

        <div className="flex flex-wrap justify-center items-center gap-2 min-h-[90px] p-4 bg-slate-100/90 rounded-2xl border-2 border-dashed border-slate-300">
          {oracionConstruida.length === 0 && (
            <span className="text-slate-400 font-medium text-xs sm:text-sm">
              (Toca las palabras de abajo en orden lógico para ubicarlas aquí)
            </span>
          )}

          {oracionConstruida.map((p) => (
            <button
              key={p.id}
              onClick={() => quitarPalabra(p)}
              className={`px-3.5 py-2 rounded-xl font-black text-sm sm:text-base shadow-sm transition-all active:scale-90 cursor-pointer border-b-3 ${
                acierto === true
                  ? 'bg-emerald-500 text-white border-emerald-700 animate-bounce'
                  : acierto === false
                  ? 'bg-rose-500 text-white border-rose-700'
                  : 'bg-orange-500 text-white border-orange-700 hover:scale-105'
              }`}
            >
              {p.texto}
            </button>
          ))}
        </div>
      </div>

      {/* Banco de Palabras */}
      <div>
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 text-center">
          Palabras Disponibles (Tócalas):
        </label>

        <div className="flex flex-wrap justify-center gap-2.5 min-h-[60px]">
          {bancoPalabras.map((p) => (
            <button
              key={p.id}
              onClick={() => agregarPalabra(p)}
              className="px-4 py-2.5 bg-white hover:bg-orange-50 text-slate-800 border-b-4 border-slate-300 hover:border-orange-500 font-black text-sm sm:text-base rounded-xl shadow-sm transition-all active:border-b-0 active:translate-y-1 cursor-pointer hover:scale-105"
            >
              {p.texto}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback y Siguiente */}
      {acierto === true && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-5 rounded-2xl text-center animate-fade-in space-y-3">
          
          <h4 className="text-lg font-black text-emerald-950">
            ¡Oración estructurada con total coherencia y cohesión!
          </h4>
          <button
            onClick={siguiente}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            Siguiente Oración 
          </button>
        </div>
      )}

      {acierto === false && (
        <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl text-center animate-fade-in space-y-2">
          <p className="text-rose-950 font-bold text-sm">
             El orden de las palabras no concuerda gramaticalmente. Toca las palabras para reorganizarlas.
          </p>
          <button
            onClick={reiniciarActual}
            className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl shadow-sm cursor-pointer transition-all active:scale-95"
          >
             Limpiar y Reintentar
          </button>
        </div>
      )}
    </div>
  );
}
