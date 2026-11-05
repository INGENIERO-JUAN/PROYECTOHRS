import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const MAZOS_PAREJAS = {
  rimas: {
    nombre: 'Rimas y Sonidos',
    descripcion: 'Encuentra las palabras que riman con la misma musicalidad',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'RATÓN', icono: '' }, b: { texto: 'BOTÓN', icono: '' } },
      { id: 'p2', a: { texto: 'CAMPANA', icono: '' }, b: { texto: 'MANZANA', icono: '' } },
      { id: 'p3', a: { texto: 'ESTRELLA', icono: '' }, b: { texto: 'BOTELLA', icono: '' } },
      { id: 'p4', a: { texto: 'VENTANA', icono: '' }, b: { texto: 'RANA', icono: '' } },
      { id: 'p5', a: { texto: 'CANCION', icono: '' }, b: { texto: 'CORAZÓN', icono: '' } },
      { id: 'p6', a: { texto: 'PINTOR', icono: '' }, b: { texto: 'FLOR', icono: '' } }
    ]
  },
  sinonimos: {
    nombre: 'Sinónimos Expresivos',
    descripcion: 'Empareja términos que tienen significados semejantes',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'ALEGRE', icono: '' }, b: { texto: 'FELIZ', icono: '' } },
      { id: 'p2', a: { texto: 'VELOZ', icono: '' }, b: { texto: 'RÁPIDO', icono: '' } },
      { id: 'p3', a: { texto: 'ENORME', icono: '' }, b: { texto: 'GIGANTE', icono: '' } },
      { id: 'p4', a: { texto: 'DULCE', icono: '' }, b: { texto: 'MELOSO', icono: '' } },
      { id: 'p5', a: { texto: 'ANTIGUO', icono: '' }, b: { texto: 'VETUSTO', icono: '' } },
      { id: 'p6', a: { texto: 'CALMA', icono: '' }, b: { texto: 'SERENIDAD', icono: '' } }
    ]
  },
  antonimos: {
    nombre: 'Antónimos Opuestos',
    descripcion: 'Empareja palabras con significados contrarios',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'LUZ', icono: '' }, b: { texto: 'OSCURIDAD', icono: '' } },
      { id: 'p2', a: { texto: 'VALIENTE', icono: '' }, b: { texto: 'TEMEROSO', icono: '' } },
      { id: 'p3', a: { texto: 'SUBIR', icono: '⬆' }, b: { texto: 'BAJAR', icono: '⬇' } },
      { id: 'p4', a: { texto: 'ANCHO', icono: '↔' }, b: { texto: 'ESTRECHO', icono: '↕' } },
      { id: 'p5', a: { texto: 'INICIO', icono: '' }, b: { texto: 'DESENLACE', icono: '' } },
      { id: 'p6', a: { texto: 'EFÍMERO', icono: '' }, b: { texto: 'ETERNO', icono: '' } }
    ]
  },
  figuras: {
    nombre: 'Figuras Literarias',
    descripcion: 'Conceptos retóricos emparejados con su definición clave',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'METÁFORA', icono: '' }, b: { texto: 'Comparar sin "como"', icono: '' } },
      { id: 'p2', a: { texto: 'SÍMIL', icono: '' }, b: { texto: 'Comparar con "como"', icono: '' } },
      { id: 'p3', a: { texto: 'HIPÉRBOLE', icono: '' }, b: { texto: 'Exageración extrema', icono: '' } },
      { id: 'p4', a: { texto: 'PERSONIFICACIÓN', icono: '' }, b: { texto: 'Cualidad humana a cosas', icono: '' } },
      { id: 'p5', a: { texto: 'ONOMATOPEYA', icono: '' }, b: { texto: 'Imitar sonido real', icono: '' } },
      { id: 'p6', a: { texto: 'MORALEJA', icono: '' }, b: { texto: 'Enseñanza ética final', icono: '' } }
    ]
  },
  fauna: {
    nombre: 'Fauna Colombiana',
    descripcion: 'Animales emblemáticos de nuestros páramos, selvas y llanos',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'CHIGÜIRO', icono: '' }, b: { texto: 'Roedor gigante de los Llanos', icono: '' } },
      { id: 'p2', a: { texto: 'CÓNDOR', icono: '' }, b: { texto: 'Rey de las alturas andinas', icono: '' } },
      { id: 'p3', a: { texto: 'JAGUAR', icono: '' }, b: { texto: 'Guardián de la selva', icono: '' } },
      { id: 'p4', a: { texto: 'OSO ANDINO', icono: '' }, b: { texto: 'Cuidador de los páramos', icono: '' } },
      { id: 'p5', a: { texto: 'RANA DORADA', icono: '' }, b: { texto: 'Joya del Chocó', icono: '' } },
      { id: 'p6', a: { texto: 'GUACAMAYA', icono: '' }, b: { texto: 'Alas tricolores del aire', icono: '' } }
    ]
  },
  fabulas: {
    nombre: 'Fábulas y Moralejas',
    descripcion: 'Asocia cada historia clásica o colombiana con su enseñanza',
    icono: '',
    parejas: [
      { id: 'p1', a: { texto: 'LA LIEBRE Y LA TORTUGA', icono: '' }, b: { texto: 'Constancia y humildad', icono: '' } },
      { id: 'p2', a: { texto: 'EL PASTOR MENTIROSO', icono: '' }, b: { texto: 'La verdad es oro', icono: '' } },
      { id: 'p3', a: { texto: 'CIGARRA Y HORMIGA', icono: '' }, b: { texto: 'El esfuerzo previene el frío', icono: '' } },
      { id: 'p4', a: { texto: 'SIMÓN EL BOBITO', icono: '' }, b: { texto: 'Pensar antes de actuar', icono: '' } },
      { id: 'p5', a: { texto: 'LEÓN Y EL RATÓN', icono: '' }, b: { texto: 'Todos podemos ayudar', icono: '' } },
      { id: 'p6', a: { texto: 'CUERVO Y LA ZORRA', icono: '' }, b: { texto: 'Cuidado con la adulación', icono: '' } }
    ]
  }
};

export default function JuegoMemoriaParejas({ tema = 'rimas' }) {
  const [mazoActual, setMazoActual] = useState(MAZOS_PAREJAS[tema] ? tema : 'rimas');
  const [cartas, setCartas] = useState([]);
  const [volteadas, setVolteadas] = useState([]);
  const [acertadas, setAcertadas] = useState([]);
  const [intentos, setIntentos] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [tiempo, setTiempo] = useState(0);
  const [activo, setActivo] = useState(false);

  const mazo = MAZOS_PAREJAS[mazoActual] || MAZOS_PAREJAS.rimas;

  // Generar cartas aplanadas a partir de las parejas
  const inicializarJuego = (nuevoTema = mazoActual) => {
    const dataMazo = MAZOS_PAREJAS[nuevoTema] || MAZOS_PAREJAS.rimas;
    const items = [];
    dataMazo.parejas.forEach((par, idx) => {
      items.push({
        id: `a-${idx}-${par.id}`,
        parId: par.id,
        texto: par.a.texto,
        icono: par.a.icono
      });
      items.push({
        id: `b-${idx}-${par.id}`,
        parId: par.id,
        texto: par.b.texto,
        icono: par.b.icono
      });
    });

    setCartas(items.sort(() => Math.random() - 0.5));
    setVolteadas([]);
    setAcertadas([]);
    setIntentos(0);
    setTiempo(0);
    setPuntaje(0);
    setActivo(true);
  };

  useEffect(() => {
    inicializarJuego(mazoActual);
  }, [mazoActual]);

  // Cronómetro
  useEffect(() => {
    if (!activo || acertadas.length === mazo.parejas.length) return;
    const timer = setInterval(() => {
      setTiempo((t) => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activo, acertadas.length, mazo.parejas.length]);

  const voltearCarta = (carta) => {
    if (volteadas.length === 2) return;
    if (volteadas.find((c) => c.id === carta.id)) return;
    if (acertadas.includes(carta.parId)) return;

    sounds.playClick();
    // Pronunciar en voz alta la palabra de la tarjeta
    voiceReader.speakWord(carta.texto);

    const nuevasVolteadas = [...volteadas, carta];
    setVolteadas(nuevasVolteadas);

    if (nuevasVolteadas.length === 2) {
      setIntentos((prev) => prev + 1);
      const [c1, c2] = nuevasVolteadas;

      if (c1.parId === c2.parId) {
        sounds.playCorrect();
        setPuntaje((p) => p + 150);
        setAcertadas((prev) => {
          const actualizadas = [...prev, c1.parId];
          if (actualizadas.length === mazo.parejas.length) {
            sounds.playFanfare();
            lanzarConfeti();
            setActivo(false);
            const bonusIntentos = Math.max(50, 200 - intentos * 10);
            const puntosFinales = puntaje + 150 + bonusIntentos;
            GameProgress.addXP(puntosFinales, 'rimas_flow');
            GameProgress.registrarVictoria(1);
            voiceReader.speak("¡Felicitaciones! ¡Encontraste todas las parejas con gran memoria!");
          }
          return actualizadas;
        });
        setVolteadas([]);
      } else {
        setTimeout(() => {
          sounds.playWrong();
          setVolteadas([]);
        }, 900);
      }
    }
  };

  const completado = acertadas.length === mazo.parejas.length && mazo.parejas.length > 0;

  const formatearTiempo = (s) => {
    const min = Math.floor(s / 60);
    const seg = s % 60;
    return `${min}:${seg < 10 ? '0' : ''}${seg}`;
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-indigo-200/80 space-y-6">
      {/* Selector de Mazos Temáticos */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Juego de Memoria Visual y Conceptual
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>{mazo.icono}</span> {mazo.nombre}
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">{mazo.descripcion}</p>
        </div>

        {/* Mazos disponibles */}
        <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {Object.entries(MAZOS_PAREJAS).map(([key, item]) => (
            <button
              key={key}
              onClick={() => {
                sounds.playClick();
                setMazoActual(key);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mazoActual === key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span>{item.icono}</span> {item.nombre.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Marcadores */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-700">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span></span> Tiempo: <strong className="text-indigo-600 font-black">{formatearTiempo(tiempo)}</strong>
          </span>
          <span className="flex items-center gap-1.5">
             Intentos: <strong className="text-slate-900 font-black">{intentos}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span></span> Puntos: <strong className="text-amber-600 font-black">{puntaje}</strong>
          </span>
        </div>

        <button
          onClick={() => inicializarJuego(mazoActual)}
          className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black border border-slate-300 transition-all cursor-pointer shadow-sm active:scale-95"
        >
           Barajar de nuevo
        </button>
      </div>

      {/* Cuadrícula de Cartas (12 cartas en 3x4 o 4x3) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
        {cartas.map((carta) => {
          const estaVolteada = volteadas.some((c) => c.id === carta.id);
          const estaAcertada = acertadas.includes(carta.parId);

          return (
            <button
              key={carta.id}
              onClick={() => voltearCarta(carta)}
              disabled={estaAcertada}
              className={`h-28 sm:h-32 rounded-2xl p-3 flex flex-col items-center justify-center border-b-4 transition-all duration-200 cursor-pointer select-none ${
                estaAcertada
                  ? 'bg-emerald-500 text-white border-emerald-700 shadow-sm scale-95 opacity-85 cursor-default'
                  : estaVolteada
                  ? 'bg-amber-400 text-amber-950 border-amber-600 shadow-lg scale-105 ring-2 ring-amber-300'
                  : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white border-indigo-800 hover:scale-[1.03] hover:shadow-md'
              }`}
            >
              {estaVolteada || estaAcertada ? (
                <>
                  <span className="text-3xl sm:text-4xl mb-1.5">{carta.icono}</span>
                  <span className="font-extrabold text-xs sm:text-sm text-center leading-tight max-w-[120px]">
                    {carta.texto}
                  </span>
                </>
              ) : (
                <>
                  
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">
                    Descubrir
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Pantalla de Victoria */}
      {completado && (
        <div className="bg-emerald-50 border-2 border-emerald-300 p-6 sm:p-8 rounded-3xl text-center animate-fade-in space-y-3">
          
          <h4 className="text-2xl font-black text-emerald-950">
            ¡Felicitaciones! ¡Todas las parejas encontradas!
          </h4>
          <p className="text-emerald-800 font-bold text-sm">
            Completaste el mazo de <strong>{mazo.nombre}</strong> en {intentos} intentos y {formatearTiempo(tiempo)}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => inicializarJuego(mazoActual)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              Jugar otra ronda 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
