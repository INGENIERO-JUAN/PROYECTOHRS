import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { useAppTheme } from '../utils/theme';

/**
 * Home — Pantalla Principal estilo APP EDUCATIVA LIMPIA (Grados 1.° a 9.°).
 * Diseño tipográfico refinado, limpio, táctil y sin iconos decorativos innecesarios.
 */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { tema } = useAppTheme();
  const [filtroCiclo, setFiltroCiclo] = useState('todos'); // 'todos' | 'primaria' | 'secundaria'

  const basePath = location.pathname.startsWith('/espanol') ? '/espanol' : '';
  const gradosList = Object.values(mallaData.grados);

  const gradosFiltrados = gradosList.filter((g) => {
    if (filtroCiclo === 'primaria') return g.numero <= 5;
    if (filtroCiclo === 'secundaria') return g.numero >= 6;
    return true;
  });

  const tocarGrado = (grado) => {
    sounds.playClick();
    voiceReader.speak(`Entrando a ${grado.nombre}. ${grado.mundo}.`);
    navigate(basePath ? `${basePath}/grado/${grado.id}` : `/grado/${grado.id}`);
  };

  const narrarBienvenida = () => {
    sounds.playClick();
    voiceReader.speak("Bienvenido a Lengua Viva. Selecciona tu grado escolar para comenzar tu aventura de lectura, escritura y juegos didácticos.");
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* ════════════════════════════════════════════════════════════════════════════════
          CABECERA HERO ESTILO APP (LIMPIA, MODERNA, SIN ICONOS INNECESARIOS)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <section className={`${tema.headerBg} rounded-3xl p-6 sm:p-8 text-white ${tema.headerShadow} border ${tema.headerBorder} relative overflow-hidden transition-all duration-300`}>
        <div className="relative z-10 max-w-3xl space-y-3">
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-block ${tema.headerBadge} font-title font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md`}>
              Plataforma Pedagógica Rural • Grados 1.° a 9.°
            </span>

            <span className="text-[11px] font-semibold text-slate-300/90 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
              100% Offline
            </span>
          </div>

          <h1 className="font-title font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
            Grados y Plan de Estudios
          </h1>

          <p className={`text-xs sm:text-sm ${tema.headerSubtext} font-normal leading-relaxed max-w-2xl`}>
            Explora las lecturas curriculares oficiales, retos pedagógicos del cuaderno y salas de minijuegos adaptadas a cada nivel de formación.
          </p>

          <div className="pt-1">
            <button
              onClick={narrarBienvenida}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all cursor-pointer active:scale-95"
              title="Escuchar narración introductoria con voz pedagógica"
            >
              <span>Escuchar con voz pedagógica</span>
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
          SELECTOR DE CICLO FORMATIVO (TABS TIPO APP)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1 rounded-2xl border border-slate-200/80">
          <button
            onClick={() => {
              sounds.playPop();
              setFiltroCiclo('todos');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              filtroCiclo === 'todos'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos los Grados (1.° a 9.°)
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFiltroCiclo('primaria');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              filtroCiclo === 'primaria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Primaria (1.° a 5.°)
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              setFiltroCiclo('secundaria');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              filtroCiclo === 'secundaria'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Secundaria (6.° a 9.°)
          </button>
        </div>

        <span className="text-xs font-semibold text-slate-400 pr-1">
          {gradosFiltrados.length} grados disponibles
        </span>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════════════
          GRID TÁCTIL DE LOS 9 GRADOS (TIPOGRAFÍA PURA, LIMPIA Y SIN ICONOS REPETITIVOS)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {gradosFiltrados.map((grado) => {
          const esSec = grado.numero >= 6;
          const totalGuias = (grado.periodos || []).reduce(
            (acc, p) => acc + (p.unidades || []).reduce((uAcc, u) => uAcc + (u.guias || []).length, 0),
            0
          );

          return (
            <div
              key={grado.id}
              onClick={() => tocarGrado(grado)}
              className={`bg-white rounded-3xl p-6 border border-slate-200/90 ${tema.cardBorderHover} transition-all duration-200 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-1 cursor-pointer flex flex-col justify-between group active:scale-[0.99] relative overflow-hidden`}
            >
              {/* Franja superior sutil según el nivel */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 ${
                  esSec ? 'bg-indigo-600' : 'bg-blue-600'
                }`}
              />

              <div className="space-y-3 pt-1">
                
                {/* Cabecera de la Card: Número de Grado Grande + Nivel */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-title font-black text-lg px-3 py-1 rounded-xl border ${
                      esSec
                        ? 'bg-indigo-50 text-indigo-800 border-indigo-200/80'
                        : tema.cardBadge
                    }`}
                  >
                    {grado.numero}.° Grado
                  </span>

                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {grado.nivel}
                  </span>
                </div>

                {/* Título y Temática del Grado */}
                <div>
                  <h2 className={`font-title font-black text-2xl text-slate-900 tracking-tight uppercase ${tema.cardHoverText} transition-colors`}>
                    {grado.nombre.replace('Grado ', '')}
                  </h2>
                  <span className="text-xs font-bold text-slate-500 block mt-0.5">
                    {grado.mundo}
                  </span>
                </div>

                {/* Lema formativo de 2 líneas */}
                <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                  {grado.lema}
                </p>

                {/* Micro-Badges de Contenido (Texto limpio sin iconos) */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {totalGuias || 29} Guías Oficiales
                  </span>

                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                    Juegos Didácticos
                  </span>
                </div>
              </div>

              {/* Botón Táctil de Entrada con Enlace Claro */}
              <div className="pt-4 mt-3 border-t border-slate-100">
                <div className={`w-full py-2.5 px-4 rounded-xl bg-slate-50 ${tema.cardHoverBtn} text-slate-700 font-title font-bold text-xs transition-all duration-200 flex items-center justify-between border border-slate-200/80 shadow-xs`}>
                  <span>Entrar al aula de {grado.nombre.replace('Grado ', '')}</span>
                  <span className="text-sm font-black transition-transform duration-200 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
