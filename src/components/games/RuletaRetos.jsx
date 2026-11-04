import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';

const BANCOS_RULETA = {
  secundaria: {
    nombre: 'Retos de Secundaria (6° a 9°)',
    colorHeader: 'text-violet-600',
    bgBadge: 'bg-violet-50 text-violet-700 border-violet-200',
    retos: [
      { texto: '🎤 ¡Improvisa un discurso de 30 segundos defendiendo la lectura frente a las redes sociales!', icono: '🎙️', color: '#6366f1' },
      { texto: '✨ ¡Crea una metáfora poética original para describir una noche tormentosa!', icono: '⚡', color: '#8b5cf6' },
      { texto: '⚔️ ¡Duelo de oratoria: explica la diferencia entre mito y leyenda con tus propias palabras!', icono: '📜', color: '#ec4899' },
      { texto: '🎭 ¡Interpreta a un personaje histórico colombiano argumentando su causa con pasión!', icono: '🏛️', color: '#f59e0b' },
      { texto: '🧩 ¡Define qué es una hipérbole y di dos ejemplos exagerados frente a la clase!', icono: '💥', color: '#10b981' },
      { texto: '🔍 ¡Menciona 3 obras o autores fundamentales de la literatura latinoamericana!', icono: '📚', color: '#3b82f6' },
      { texto: '⏱️ ¡En 15 segundos di 4 palabras esdrújulas con su tilde bien pronunciada!', icono: '✍️', color: '#ef4444' },
      { texto: '🤝 ¡Convence a un compañero de clase de una idea disparatada usando argumentos lógicos!', icono: '🧠', color: '#14b8a6' }
    ]
  },
  primaria: {
    nombre: 'Retos de Primaria (1° a 5°)',
    colorHeader: 'text-emerald-600',
    bgBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    retos: [
      { texto: '🐾 ¡Imita la voz y rugido de un jaguar protegiendo la selva!', icono: '🌿', color: '#10b981' },
      { texto: '🎵 ¡Di 3 palabras que rimen con "corazón" en menos de 10 segundos!', icono: '🎤', color: '#3b82f6' },
      { texto: '🌽 ¡Nombra 3 alimentos tradicionales hechos con maíz en Colombia!', icono: '🌽', color: '#f59e0b' },
      { texto: '👅 ¡Repite el trabalenguas: "Tres tristes tigres tragaban trigo en un trigal"!', icono: '🐯', color: '#ec4899' },
      { texto: '🖍️ ¡Pasa al tablero y dibuja al personaje principal de la lectura en 20 segundos!', icono: '🦉', color: '#8b5cf6' },
      { texto: '🎸 ¡Crea una copla o rima divertida de dos versos con tu compañero de al lado!', icono: '🎶', color: '#ef4444' },
      { texto: '🐸 ¡Haz la mímica de un animal de la fábula para que el salón adivine cuál es!', icono: '🎭', color: '#14b8a6' },
      { texto: '⭐ ¡Di las 5 vocales bailando o haciendo un gesto distinto para cada una!', icono: '🔤', color: '#6366f1' }
    ]
  }
};

export default function RuletaRetos() {
  const [categoria, setCategoria] = useState('secundaria');
  const [girando, setGirando] = useState(false);
  const [rotacion, setRotacion] = useState(0);
  const [retoSeleccionado, setRetoSeleccionado] = useState(null);

  const bancoActual = BANCOS_RULETA[categoria] || BANCOS_RULETA.secundaria;
  const retos = bancoActual.retos;

  const girarRuleta = () => {
    if (girando) return;
    sounds.playClick();
    setGirando(true);
    setRetoSeleccionado(null);

    // Calcular giros completos + ángulo aleatorio
    const girosCompletos = 5 + Math.floor(Math.random() * 4);
    const indiceAleatorio = Math.floor(Math.random() * retos.length);
    const gradosPorSegmento = 360 / retos.length;
    const anguloFinal =
      girosCompletos * 360 +
      (retos.length - 1 - indiceAleatorio) * gradosPorSegmento +
      gradosPorSegmento / 2;

    setRotacion((prev) => prev + anguloFinal);

    setTimeout(() => {
      setGirando(false);
      setRetoSeleccionado(retos[indiceAleatorio]);
      sounds.playCorrect();
      lanzarConfeti();
    }, 3200);
  };

  const cambiarCategoria = (cat) => {
    sounds.playClick();
    setCategoria(cat);
    setRetoSeleccionado(null);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-indigo-200/80 space-y-6 text-center">
      {/* Cabecera y Selector de Nivel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4 text-left">
        <div>
          <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border ${bancoActual.bgBadge}`}>
            Dinámica de Aula y Participación Oral
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
            <span>🎡</span> Ruleta de Desafíos
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Gira la ruleta para seleccionar retos de oratoria, creatividad o expresión oral.
          </p>
        </div>

        {/* Botones de Categoría */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => cambiarCategoria('primaria')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoria === 'primaria'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            🎒 Primaria (1°-5°)
          </button>
          <button
            onClick={() => cambiarCategoria('secundaria')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              categoria === 'secundaria'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            🏛️ Secundaria (6°-9°)
          </button>
        </div>
      </div>

      {/* Rueda Interactiva */}
      <div className="relative w-64 h-64 sm:w-76 sm:h-76 mx-auto my-3 flex items-center justify-center">
        {/* Puntero indicador superior */}
        <div className="absolute -top-3 z-20 text-3xl transform -translate-x-1/2 left-1/2 text-rose-600 drop-shadow-md animate-bounce select-none">
          ▼
        </div>

        {/* Disco giratorio SVG */}
        <div
          className="w-full h-full rounded-full shadow-2xl border-6 border-white overflow-hidden transition-transform duration-[3200ms] ease-out select-none"
          style={{ transform: `rotate(${rotacion}deg)` }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {retos.map((reto, i) => {
              const angulo = 360 / retos.length;
              const startAngle = (i * angulo * Math.PI) / 180;
              const endAngle = ((i + 1) * angulo * Math.PI) / 180;
              const x1 = 50 + 50 * Math.cos(startAngle);
              const y1 = 50 + 50 * Math.sin(startAngle);
              const x2 = 50 + 50 * Math.cos(endAngle);
              const y2 = 50 + 50 * Math.sin(endAngle);
              const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

              return (
                <path
                  key={i}
                  d={pathData}
                  fill={reto.color}
                  stroke="#ffffff"
                  strokeWidth="1.2"
                />
              );
            })}
          </svg>
        </div>

        {/* Botón central de Giro */}
        <button
          onClick={girarRuleta}
          disabled={girando}
          className="absolute z-10 w-20 h-20 sm:w-22 sm:h-22 bg-white hover:bg-amber-50 text-slate-800 rounded-full font-black text-xs uppercase tracking-wider shadow-xl border-4 border-amber-400 flex flex-col items-center justify-center cursor-pointer active:scale-95 transition-all select-none"
        >
          <span className="text-xl sm:text-2xl">⚡</span>
          <span className="text-[11px] font-black">{girando ? 'GIRANDO' : '¡GIRAR!'}</span>
        </button>
      </div>

      {/* Reto Revelado */}
      {retoSeleccionado && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border-2 border-indigo-300 p-5 sm:p-6 rounded-2xl animate-fade-in space-y-2">
          <span className="text-4xl block">{retoSeleccionado.icono}</span>
          <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">
            ¡DESAFÍO REVELADO!
          </h4>
          <p className="text-slate-800 font-extrabold text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {retoSeleccionado.texto}
          </p>
        </div>
      )}
    </div>
  );
}
