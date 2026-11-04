import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';

export default function KaraokeCoplas() {
  const coplas = [
    {
      titulo: 'Copla de la Cordillera',
      versos: [
        ['En', 'la', 'punta', 'de', 'aquel', 'cerro'],
        ['canta', 'alegre', 'el', 'pajarito'],
        ['despertando', 'los', 'senderos'],
        ['con', 'su', 'canto', 'tan', 'bonito']
      ],
      icono: '🦜'
    },
    {
      titulo: 'Copla del Café y la Tierra',
      versos: [
        ['En', 'mi', 'tierra', 'campesina'],
        ['donde', 'crece', 'el', 'buen', 'café'],
        ['se', 'trabaja', 'con', 'cariño'],
        ['con', 'respeto', 'y', 'mucha', 'fe']
      ],
      icono: '☕'
    }
  ];

  const [indiceCopla, setIndiceCopla] = useState(0);
  const [cantando, setCantando] = useState(false);
  const [versoActivo, setVersoActivo] = useState(0);
  const [palabraActiva, setPalabraActiva] = useState(-1);

  const coplaActual = coplas[indiceCopla];

  useEffect(() => {
    let timer;
    if (cantando) {
      const versos = coplaActual.versos;
      let v = versoActivo;
      let p = palabraActiva;

      timer = setInterval(() => {
        sounds.playClick();
        p++;
        if (p >= versos[v].length) {
          p = 0;
          v++;
          if (v >= versos.length) {
            setCantando(false);
            setVersoActivo(0);
            setPalabraActiva(-1);
            sounds.playFanfare();
            lanzarConfeti();
            clearInterval(timer);
            return;
          }
        }
        setVersoActivo(v);
        setPalabraActiva(p);
      }, 420); // Tempo rítmico de copla
    }
    return () => clearInterval(timer);
  }, [cantando, versoActivo, palabraActiva, coplaActual]);

  const iniciarKaraoke = () => {
    sounds.playClick();
    setVersoActivo(0);
    setPalabraActiva(0);
    setCantando(true);
  };

  const detenerKaraoke = () => {
    setCantando(false);
    setVersoActivo(0);
    setPalabraActiva(-1);
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-xl border-4 border-rose-300 space-y-6 text-center">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-4">
        <div className="flex items-center gap-3 text-left">
          <span className="text-4xl">{coplaActual.icono}</span>
          <div>
            <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Karaoke Campesino de Coplas
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {coplaActual.titulo}
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            detenerKaraoke();
            setIndiceCopla((prev) => (prev + 1) % coplas.length);
          }}
          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl border border-slate-300 cursor-pointer"
        >
          🔄 Cambiar Copla
        </button>
      </div>

      <p className="text-slate-600 font-bold text-sm">
        Sigue la estrella saltarina ⭐ cantando y aplaudiendo al ritmo del verso con todo el salón:
      </p>

      {/* Pantalla de Karaoke con Versos Rítmicos */}
      <div className="bg-gradient-to-b from-rose-50 to-pink-50 p-6 sm:p-10 rounded-3xl border-3 border-rose-200 shadow-inner space-y-4 max-w-xl mx-auto">
        {coplaActual.versos.map((linea, vIdx) => (
          <div key={vIdx} className="flex flex-wrap justify-center gap-2 sm:gap-3 text-xl sm:text-3xl font-black">
            {linea.map((palabra, pIdx) => {
              const estaActiva = cantando && versoActivo === vIdx && palabraActiva === pIdx;
              return (
                <span
                  key={pIdx}
                  className={`transition-all duration-150 px-2 py-1 rounded-xl relative ${
                    estaActiva
                      ? 'bg-rose-500 text-white scale-125 shadow-lg animate-bounce'
                      : 'text-slate-700'
                  }`}
                >
                  {estaActiva && (
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-lg">
                      ⭐
                    </span>
                  )}
                  {palabra}
                </span>
              );
            })}
          </div>
        ))}
      </div>

      {/* Controles de Canto */}
      <div className="pt-2">
        {!cantando ? (
          <button
            onClick={iniciarKaraoke}
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-black text-lg sm:text-xl rounded-2xl shadow-xl border-b-6 border-rose-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
          >
            <span>🎤</span> ¡Cantar con el Salón!
          </button>
        ) : (
          <button
            onClick={detenerKaraoke}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-black text-lg rounded-2xl shadow-md transition-all cursor-pointer mx-auto"
          >
            ⏹️ Detener Karaoke
          </button>
        )}
      </div>
    </div>
  );
}
