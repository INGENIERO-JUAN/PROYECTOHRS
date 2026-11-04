import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';

export default function CuentacuentosIlustrado({ titulo = "El Relato del Campo", escenas = [] }) {
  const escenasDefault = [
    {
      titulo: 'Acto 1: El Amanecer en la Vereda',
      texto: 'El sol doraba la cúspide de las montañas andinas y las gotas de rocío brillaban sobre las hojas del cafetal. En la escuela de la colina, los niños llegaban saludando al río cantarino con cantos de alegría.',
      icono: '🌄',
      fondo: 'from-amber-400 via-orange-300 to-yellow-200',
      clima: '☀️ Mañana luminosa y fresca'
    },
    {
      titulo: 'Acto 2: El Misterio del Bosque de Niebla',
      texto: 'De repente, un susurro entre los frailejones alertó a los caminantes: la Madremonte había dejado una huella luminosa de musgo y agua clara en la piedra solitaria, pidiendo cuidar los manantiales de la cordillera.',
      icono: '🌿',
      fondo: 'from-emerald-500 via-teal-400 to-green-300',
      clima: '🌫️ Niebla mágica y misteriosa'
    },
    {
      titulo: 'Acto 3: El Pacto con la Madre Tierra',
      texto: 'Toda la comunidad veredal se unió sembrando alisos y sauces en la cuenca del agua. La selva floreció con orquídeas y las aves volvieron a cantar en paz, recordando que cuidar la naturaleza es cuidar la vida.',
      icono: '🌸',
      fondo: 'from-sky-500 via-blue-400 to-indigo-300',
      clima: '🌈 Paz y florecimiento comunitario'
    }
  ];

  const listaEscenas = escenas.length > 0 ? escenas : escenasDefault;
  const [escenaActual, setEscenaActual] = useState(0);
  const [narrando, setNarrando] = useState(false);

  const escena = listaEscenas[escenaActual];

  const cambiarEscena = (nuevoIndex) => {
    sounds.playClick();
    voiceReader.stop();
    setNarrando(false);
    setEscenaActual(nuevoIndex);
  };

  const narrarEscena = () => {
    if (narrando) {
      voiceReader.stop();
      setNarrando(false);
    } else {
      sounds.playClick();
      setNarrando(true);
      voiceReader.speak(`${escena.titulo}. ${escena.texto}`, () => {
        setNarrando(false);
      });
    }
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-2xl border-4 border-amber-300 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🎬</span>
          <div>
            <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              Modo Teatro Visual para el Salón
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {titulo}
            </h3>
          </div>
        </div>

        {/* Controles de Escena y Narrador */}
        <div className="flex items-center gap-2">
          <button
            onClick={narrarEscena}
            className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              narrando
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
            }`}
          >
            <span>{narrando ? '⏹️ Pausar Voz' : '🔊 Narrar Escena'}</span>
          </button>

          <span className="text-xs font-black bg-slate-100 text-slate-700 px-3 py-2 rounded-xl border border-slate-300">
            Escena {escenaActual + 1} de {listaEscenas.length}
          </span>
        </div>
      </div>

      {/* Tarjeta Escénica Ilustrada Gigante */}
      <div className={`rounded-3xl p-8 sm:p-12 bg-gradient-to-br ${escena.fondo} text-slate-900 shadow-xl border-4 border-white relative overflow-hidden transition-all duration-300`}>
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-white/70 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black text-slate-800 uppercase tracking-wider shadow-sm">
              {escena.clima}
            </span>
          </div>

          <h4 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 drop-shadow-sm">
            {escena.titulo}
          </h4>

          <p className="text-lg sm:text-2xl font-bold text-slate-800/95 leading-relaxed bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white/80 shadow-md">
            "{escena.texto}"
          </p>
        </div>

        {/* Icono gigante escénico */}
        <div className="absolute -right-4 -bottom-6 text-8xl sm:text-9xl opacity-30 select-none pointer-events-none transform -rotate-12">
          {escena.icono}
        </div>
      </div>

      {/* Botones de Navegación Teatral */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={() => cambiarEscena(Math.max(0, escenaActual - 1))}
          disabled={escenaActual === 0}
          className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all border-b-4 flex items-center gap-2 ${
            escenaActual > 0
              ? 'bg-slate-800 hover:bg-slate-900 text-white border-slate-950 cursor-pointer active:translate-y-1'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          <span>⬅️</span> Escena Anterior
        </button>

        {/* Indicadores de bolitas */}
        <div className="flex items-center gap-2">
          {listaEscenas.map((_, i) => (
            <button
              key={i}
              onClick={() => cambiarEscena(i)}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                escenaActual === i ? 'bg-amber-500 w-8' : 'bg-slate-200 hover:bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => cambiarEscena(Math.min(listaEscenas.length - 1, escenaActual + 1))}
          disabled={escenaActual === listaEscenas.length - 1}
          className={`px-6 py-3.5 rounded-2xl font-black text-sm transition-all border-b-4 flex items-center gap-2 ${
            escenaActual < listaEscenas.length - 1
              ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-700 cursor-pointer active:translate-y-1'
              : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
          }`}
        >
          Siguiente Escena <span>➔</span>
        </button>
      </div>
    </div>
  );
}
