import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';

export default function Home() {
  const gradosList = Object.values(mallaData.grados);
  const primaria = gradosList.filter((g) => g.numero <= 5);
  const secundaria = gradosList.filter((g) => g.numero >= 6);

  const [seccionActiva, setSeccionActiva] = useState('todos');

  // Catálogo completo de juegos destacados
  const juegosDestacados = [
    {
      titulo: 'Abecedario Parlante',
      subtitulo: 'Fonética, letras y sílabas con voz real para 1°',
      nivel: '1° a 2°',
      icono: '🔤',
      color: 'from-amber-400 to-orange-500',
      tag: 'Especial 1° Grado',
      link: '/juegos?juego=abecedario&grado=1'
    },
    {
      titulo: 'Sílabas Ninja a Ráfaga',
      subtitulo: 'Corta sílabas voladoras con combos y modo fiebre',
      nivel: '1° a 9°',
      icono: '🥷',
      color: 'from-orange-500 to-red-600',
      tag: 'Acción y Reflejos',
      link: '/juegos?juego=ninja&grado=3'
    },
    {
      titulo: 'Tribunal de Falacias',
      subtitulo: 'Juez supremo de debates, oratoria y falacias lógicas',
      nivel: '7° a 9°',
      icono: '⚖️',
      color: 'from-amber-600 to-yellow-700',
      tag: 'Secundaria / Debate',
      link: '/juegos?juego=juicio&grado=8'
    },
    {
      titulo: 'Escape Room Macondo',
      subtitulo: 'Aventura de enigmas del Realismo Mágico y Gabo',
      nivel: '6° a 9°',
      icono: '🦋',
      color: 'from-yellow-400 to-amber-600',
      tag: 'Secundaria / Aventura',
      link: '/juegos?juego=escape&grado=7'
    },
    {
      titulo: 'Batalla de Rimas y Flow',
      subtitulo: 'Sigue el beatbox metrónomo y clava la copla rítmica',
      nivel: '2° a 8°',
      icono: '🎤',
      color: 'from-fuchsia-500 to-purple-600',
      tag: 'Métrica y Ritmo',
      link: '/juegos?juego=batalla&grado=5'
    },
    {
      titulo: 'Duelo de Vocabulario',
      subtitulo: 'Contrarreloj de 15s con multiplicadores de racha',
      nivel: '6° a 9°',
      icono: '⚔️',
      color: 'from-violet-600 to-indigo-700',
      tag: 'Secundaria / Rapidez',
      link: '/juegos?juego=duelo&grado=8'
    },
    {
      titulo: 'Crucigrama Literario',
      subtitulo: 'Pistas de métrica, sonetos y figuras retóricas',
      nivel: '6° a 9°',
      icono: '🧩',
      color: 'from-indigo-600 to-blue-700',
      tag: 'Secundaria / Léxico',
      link: '/juegos?juego=crucigrama&grado=7'
    },
    {
      titulo: 'Trivia Concurso TV',
      subtitulo: 'Preguntas con comodines 50:50, tiempo y podio',
      nivel: '1° a 9°',
      icono: '🏆',
      color: 'from-emerald-500 to-teal-700',
      tag: 'Para toda la clase',
      link: '/juegos?juego=trivia&grado=6'
    },
    {
      titulo: 'Detective Gramatical',
      subtitulo: 'Caza de errores de tildes y concordancia en textos',
      nivel: '4° a 9°',
      icono: '🔍',
      color: 'from-teal-500 to-emerald-700',
      tag: 'Ortografía y Tildes',
      link: '/juegos?juego=detective&grado=6'
    },
    {
      titulo: 'El Ahorcado Secreto',
      subtitulo: 'Descifra la palabra con pistas narradas del profesor',
      nivel: '1° a 9°',
      icono: '🕵️',
      color: 'from-purple-500 to-fuchsia-700',
      tag: 'Misterio de Palabras',
      link: '/juegos?juego=ahorcado&grado=4'
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-16">
      {/* ══════════ HERO BANNER PRINCIPAL LLENO DE ENERGÍA Y VIDA ══════════ */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-white rounded-4xl p-8 sm:p-12 shadow-2xl border-4 border-yellow-200 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-300 text-yellow-950 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
            <span>✨</span> Plataforma Educativa Oficial • 100% Sin Internet
          </div>

          <h2 className="text-3xl sm:text-6xl font-black leading-tight tracking-tight drop-shadow-sm">
            Lengua Viva 📖✨
          </h2>

          <p className="text-amber-100 text-lg sm:text-2xl font-bold leading-relaxed">
            Aprende, juega y explora la lengua castellana con lecciones oficiales, comprensión lectora en 3 niveles y un <strong className="text-white underline decoration-yellow-300">Arcade interactivo con 15 juegos completos</strong> adaptados por grado escolar.
          </p>

          {/* Botones de Acción Directa en el Hero */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/juegos"
              onClick={() => sounds.playClick()}
              className="px-6 py-4 bg-slate-900 hover:bg-slate-950 text-white font-black text-base sm:text-lg rounded-2xl shadow-xl border-b-4 border-black active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <span className="text-2xl">🎮</span>
              <span>¡Entrar a la Sala de Juegos!</span>
            </Link>

            <Link
              to="/grado/1"
              onClick={() => sounds.playClick()}
              className="px-5 py-4 bg-white hover:bg-amber-100 text-amber-950 font-black text-sm sm:text-base rounded-2xl shadow-lg border-b-4 border-slate-300 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="text-xl">🔤</span>
              <span>Fonética para 1° Grado</span>
            </Link>
          </div>

          {/* Insignias de Garantía */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs sm:text-sm font-black border border-white/30 flex items-center gap-2">
              <span>🔊</span> Voces Reales y Fonética Integrada
            </span>
            <span className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl text-xs sm:text-sm font-black border border-white/30 flex items-center gap-2">
              <span>⚔️</span> Juegos Sin Infantilización para Secundaria
            </span>
          </div>
        </div>

        {/* Mascota decorativa de fondo */}
        <div className="absolute -right-4 -bottom-8 text-9xl sm:text-[13rem] opacity-25 select-none pointer-events-none transform -rotate-12">
          📖
        </div>
      </div>

      {/* ══════════ SHOWCASE DEL ARCADE: 11 JUEGOS COMPLETOS ══════════ */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-amber-200 pb-3">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 block">
              Catálogo de Entretenimiento Educativo
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
              🎮 Sala de Juegos Didácticos
            </h3>
          </div>
          <Link
            to="/juegos"
            onClick={() => sounds.playClick()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs sm:text-sm shadow-md transition-all self-start sm:self-auto cursor-pointer"
          >
            <span>Ver Todos los Juegos</span>
            <span>➔</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {juegosDestacados.map((j, i) => (
            <Link
              key={i}
              to={j.link}
              onClick={() => sounds.playClick()}
              className="bg-white rounded-3xl p-5 border-3 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${j.color} text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                    {j.icono}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300">
                    {j.nivel}
                  </span>
                </div>
                <h4 className="font-black text-slate-800 text-lg mb-1 group-hover:text-amber-600 transition-colors">
                  {j.titulo}
                </h4>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                  {j.subtitulo}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl">
                  {j.tag}
                </span>
                <span className="text-xs text-amber-600 font-black group-hover:translate-x-1 transition-transform">
                  ¡Jugar! ➔
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ══════════ FILTROS DE NAVEGACIÓN POR CICLO ESCOLAR ══════════ */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border-2 border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              sounds.playClick();
              setSeccionActiva('todos');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 ${
              seccionActiva === 'todos'
                ? 'bg-slate-900 text-white border-black shadow-md'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            🗺️ Todos los Grados (1° a 9°)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSeccionActiva('primaria');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 ${
              seccionActiva === 'primaria'
                ? 'bg-emerald-600 text-white border-emerald-800 shadow-md'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            🎒 Básica Primaria (1° a 5°)
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setSeccionActiva('secundaria');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 ${
              seccionActiva === 'secundaria'
                ? 'bg-violet-600 text-white border-violet-800 shadow-md'
                : 'bg-violet-50 text-violet-800 border-violet-200 hover:bg-violet-100'
            }`}
          >
            🏛️ Básica Secundaria (6° a 9°)
          </button>
        </div>

        <span className="text-xs text-slate-500 font-bold hidden sm:inline-block">
          Selecciona un grado para abrir sus guías curriculares
        </span>
      </div>

      {/* ══════════ SECCIÓN 1: BÁSICA PRIMARIA (1° AL 5°) ══════════ */}
      {(seccionActiva === 'todos' || seccionActiva === 'primaria') && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🎒</span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                Aventuras de Primaria (1° a 5° Grado)
              </h3>
              <p className="text-sm font-bold text-slate-500">
                Fonética con voz, primeras lecturas, fábulas, rimas y cuentos
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {primaria.map((grado) => (
              <div
                key={grado.id}
                className="bg-white rounded-4xl p-6 shadow-lg border-4 border-slate-200 hover:border-emerald-400 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-emerald-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border-2 border-emerald-300 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      {grado.icono}
                    </div>
                    <span className="bg-emerald-100 text-emerald-900 font-black text-xs px-3 py-1.5 rounded-full border border-emerald-300 uppercase tracking-wider">
                      {grado.nombre}
                    </span>
                  </div>

                  <h4 className="text-xl sm:text-2xl font-black text-slate-800 mb-1 group-hover:text-emerald-700 transition-colors">
                    {grado.mundo}
                  </h4>

                  <p className="text-xs font-bold text-emerald-700 mb-3 flex items-center gap-1">
                    <span>✨</span> {grado.mascota}
                  </p>

                  <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
                    {grado.lema}
                  </p>
                </div>

                <Link
                  to={`/grado/${grado.id}`}
                  onClick={() => sounds.playClick()}
                  className="w-full py-4 text-center font-black text-base rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>🚀</span> ¡Abrir {grado.nombre}!
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════ SECCIÓN 2: BÁSICA SECUNDARIA (6° AL 9°) ══════════ */}
      {(seccionActiva === 'todos' || seccionActiva === 'secundaria') && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏛️</span>
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
                Retos y Literatura de Secundaria (6° a 9° Grado)
              </h3>
              <p className="text-sm font-bold text-slate-500">
                Popol Vuh, mitología universal, crónica, ensayo, figuras retóricas y Realismo Mágico
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {secundaria.map((grado) => (
              <div
                key={grado.id}
                className="bg-white rounded-4xl p-6 shadow-lg border-4 border-slate-200 hover:border-violet-400 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 bg-violet-50 rounded-3xl flex items-center justify-center text-4xl shadow-inner border-2 border-violet-300 group-hover:scale-110 group-hover:rotate-6 transition-all">
                      {grado.icono}
                    </div>
                    <span className="bg-violet-100 text-violet-900 font-black text-xs px-3 py-1.5 rounded-full border border-violet-300 uppercase tracking-wider">
                      {grado.nombre}
                    </span>
                  </div>

                  <h4 className="text-xl font-black text-slate-800 mb-1 group-hover:text-violet-700 transition-colors">
                    {grado.mundo}
                  </h4>

                  <p className="text-xs font-bold text-violet-700 mb-3 flex items-center gap-1">
                    <span>⚡</span> {grado.mascota}
                  </p>

                  <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
                    {grado.lema}
                  </p>
                </div>

                <Link
                  to={`/grado/${grado.id}`}
                  onClick={() => sounds.playClick()}
                  className="w-full py-4 text-center font-black text-base rounded-2xl text-white bg-violet-600 hover:bg-violet-700 shadow-md border-b-4 border-violet-900 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  <span>🔥</span> Iniciar Desafío
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
