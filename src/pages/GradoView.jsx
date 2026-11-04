import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ModuloLeccion from '../components/ModuloLeccion';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';

export default function GradoView() {
  const { gradoId } = useParams();
  const navigate = useNavigate();
  const grado = mallaData.grados[gradoId] || mallaData.grados["1"];
  const esSecundaria = grado.numero >= 6;

  const periodos = grado.periodos || [];
  const [periodoActivoNum, setPeriodoActivoNum] = useState(
    periodos.length > 0 ? periodos[0].numero : 1
  );

  const [modalMapaAbierto, setModalMapaAbierto] = useState(false);

  const periodoSeleccionado = periodos.find((p) => p.numero === periodoActivoNum) || periodos[0];
  const unidadesDelPeriodo = periodoSeleccionado?.unidades || [];
  const guiasDelPeriodo = unidadesDelPeriodo.flatMap((u) => u.guias || []);

  const [guiaActivaId, setGuiaActivaId] = useState(
    guiasDelPeriodo.length > 0 ? guiasDelPeriodo[0].id : null
  );

  useEffect(() => {
    const nuevosPeriodos = grado.periodos || [];
    if (nuevosPeriodos.length > 0) {
      setPeriodoActivoNum(nuevosPeriodos[0].numero);
      const primerasGuias = nuevosPeriodos[0].unidades?.flatMap((u) => u.guias || []) || [];
      if (primerasGuias.length > 0) {
        setGuiaActivaId(primerasGuias[0].id);
      }
    }
  }, [gradoId]);

  // Lista secuencial continua de todas las guías del grado (unión de todos los periodos)
  const todasLasGuiasDelGrado = periodos.flatMap((per) =>
    (per.unidades || []).flatMap((u) =>
      (u.guias || []).map((g) => ({
        ...g,
        periodoNumero: per.numero,
        periodoNombre: per.nombre,
        unidadNombre: u.nombre
      }))
    )
  );

  const guiaSeleccionada = guiasDelPeriodo.find((g) => g.id === guiaActivaId) || guiasDelPeriodo[0];
  const indiceGuiaActual = guiasDelPeriodo.findIndex((g) => g.id === guiaActivaId);

  const indiceGlobalActual = todasLasGuiasDelGrado.findIndex((g) => g.id === guiaActivaId);
  const guiaGlobalAnterior = indiceGlobalActual > 0 ? todasLasGuiasDelGrado[indiceGlobalActual - 1] : null;
  const guiaGlobalSiguiente =
    indiceGlobalActual >= 0 && indiceGlobalActual < todasLasGuiasDelGrado.length - 1
      ? todasLasGuiasDelGrado[indiceGlobalActual + 1]
      : null;

  const handleCambiarPeriodo = (num) => {
    sounds.playClick();
    setPeriodoActivoNum(num);
    const nuevoPeriodo = periodos.find((p) => p.numero === num);
    const nuevasGuias = nuevoPeriodo?.unidades?.flatMap((u) => u.guias || []) || [];
    if (nuevasGuias.length > 0) {
      setGuiaActivaId(nuevasGuias[0].id);
    }
  };

  const handleCambiarGuia = (id) => {
    sounds.playClick();
    setGuiaActivaId(id);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  // Navegación secuencial sin bloqueos de periodo
  const avanzarSiguienteGuia = () => {
    if (guiaGlobalSiguiente) {
      sounds.playClick();
      if (guiaGlobalSiguiente.periodoNumero !== periodoActivoNum) {
        setPeriodoActivoNum(guiaGlobalSiguiente.periodoNumero);
      }
      setGuiaActivaId(guiaGlobalSiguiente.id);
      window.scrollTo({ top: 340, behavior: 'smooth' });
    } else if (grado.numero < 9) {
      sounds.playFanfare();
      navigate(`/grado/${grado.numero + 1}`);
    }
  };

  const retrocederGuiaAnterior = () => {
    if (guiaGlobalAnterior) {
      sounds.playClick();
      if (guiaGlobalAnterior.periodoNumero !== periodoActivoNum) {
        setPeriodoActivoNum(guiaGlobalAnterior.periodoNumero);
      }
      setGuiaActivaId(guiaGlobalAnterior.id);
      window.scrollTo({ top: 340, behavior: 'smooth' });
    } else if (grado.numero > 1) {
      sounds.playClick();
      navigate(`/grado/${grado.numero - 1}`);
    }
  };

  const saltarAGuia = (periodoNum, guiaId) => {
    sounds.playClick();
    setPeriodoActivoNum(periodoNum);
    setGuiaActivaId(guiaId);
    setModalMapaAbierto(false);
    window.scrollTo({ top: 340, behavior: 'smooth' });
  };

  const irAGrado = (num) => {
    sounds.playClick();
    navigate(`/grado/${num}`);
  };

  const todosLosGrados = Object.values(mallaData.grados);

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* ══════════ BREADCRUMBS Y SELECTOR RÁPIDO DE GRADOS ══════════ */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Breadcrumb visual paso a paso */}
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-500 flex-wrap">
          <Link
            to="/"
            onClick={() => sounds.playClick()}
            className="hover:text-amber-600 transition-colors flex items-center gap-1"
          >
            <span>🏠</span> Inicio
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-black text-slate-800 flex items-center gap-1">
            <span>{grado.icono}</span> {grado.nombre}
          </span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-600 font-bold">
            📅 {periodoSeleccionado?.nombre}
          </span>
          {guiaSeleccionada && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-amber-700 font-extrabold truncate max-w-[200px]">
                📖 {guiaSeleccionada.nombre}
              </span>
            </>
          )}
        </nav>

        {/* Selector Rápido de Cambio de Grado (1° a 9°) */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1 shrink-0">
            Cambiar Grado:
          </span>
          {todosLosGrados.map((g) => {
            const esActivo = g.numero === grado.numero;
            return (
              <button
                key={g.numero}
                onClick={() => irAGrado(g.numero)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-black text-xs transition-all flex items-center justify-center cursor-pointer select-none ${
                  esActivo
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300 scale-105'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title={g.nombre}
              >
                {g.numero}°
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ CABECERA DEL GRADO CON IDENTIDAD CLARA ══════════ */}
      <div
        className={`rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden ${
          esSecundaria
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-violet-900 border border-indigo-500/30'
            : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 border border-emerald-400/30'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl sm:text-5xl border border-white/20 shadow-inner">
              {grado.icono}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-white/20 backdrop-blur-sm text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {grado.nivel}
                </span>
                <span className="text-[10px] sm:text-xs font-bold text-white/80 bg-black/20 px-2.5 py-0.5 rounded-full">
                  {grado.mascota}
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-none">
                {grado.nombre}
              </h2>
              <p className="text-white/80 text-xs sm:text-sm font-medium mt-1.5 max-w-xl">
                {grado.lema}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/juegos?grado=${grado.numero}`}
              onClick={() => sounds.playClick()}
              className="px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>🎮</span>
              <span>Sala de Juegos ({grado.nombre})</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ══════════ SELECTOR DE PERIODOS (1°, 2°, 3° y 4°) ══════════ */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-500 block px-1">
          Paso 1: Elige el Periodo Académico:
        </span>
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-sm border border-slate-200/80 flex flex-wrap gap-1.5 justify-center">
          {periodos.map((per) => {
            const activo = periodoActivoNum === per.numero;
            return (
              <button
                key={per.numero}
                onClick={() => handleCambiarPeriodo(per.numero)}
                className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer btn-press ${
                  activo
                    ? esSecundaria
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-200 ring-2 ring-violet-300'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-200 ring-2 ring-emerald-300'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>📅</span>
                <span>{per.nombre}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ SELECTOR DE GUÍAS DEL PERIODO ══════════ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📚</span>
            <h3 className="font-extrabold text-slate-800 text-base sm:text-lg">
              Paso 2: Selecciona la Guía ({periodoSeleccionado?.nombre}):
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalMapaAbierto(true)}
              className="px-3.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>🗺️</span>
              <span>Ver Plan Completo ({todasLasGuiasDelGrado.length} Guías)</span>
            </button>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                esSecundaria
                  ? 'bg-violet-50 text-violet-700 border border-violet-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}
            >
              {guiasDelPeriodo.length} guía(s)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {guiasDelPeriodo.map((guia, i) => {
            const estaActiva = guia.id === guiaActivaId;
            return (
              <button
                key={guia.id}
                onClick={() => handleCambiarGuia(guia.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer btn-press ${
                  estaActiva
                    ? esSecundaria
                      ? 'bg-violet-600 text-white border-violet-700 shadow-md ring-2 ring-violet-300 scale-102'
                      : 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-300 scale-102'
                    : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:border-slate-300 text-slate-700'
                }`}
              >
                <span
                  className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-sm ${
                    estaActiva
                      ? 'bg-white/20 text-white'
                      : 'bg-white border border-slate-200 text-slate-700'
                  }`}
                >
                  {guia.icono || '📖'}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-[10px] uppercase tracking-wider block font-black ${
                      estaActiva ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    Guía #{i + 1} • {guia.numero || `Guía ${i + 1}`}
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block leading-snug">
                    {guia.nombre || guia.titulo}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ BARRA DE NAVEGACIÓN ANTERIOR / SIGUIENTE GUÍA CONTINUA ══════════ */}
      {guiaSeleccionada && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-r from-amber-50 via-white to-amber-50 border-2 border-amber-300 p-3 sm:p-4 rounded-3xl shadow-sm">
          <button
            disabled={!guiaGlobalAnterior && grado.numero === 1}
            onClick={retrocederGuiaAnterior}
            className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center sm:justify-start gap-2 transition-all ${
              guiaGlobalAnterior || grado.numero > 1
                ? 'bg-white hover:bg-slate-100 text-slate-800 border-2 border-slate-300 shadow-sm cursor-pointer active:scale-95'
                : 'bg-slate-100 text-slate-400 border border-slate-200 opacity-50 cursor-not-allowed'
            }`}
          >
            <span>◀</span>
            {guiaGlobalAnterior ? (
              <span className="truncate max-w-[200px]">
                {guiaGlobalAnterior.periodoNumero !== periodoActivoNum
                  ? `Per. ${guiaGlobalAnterior.periodoNumero}: ${guiaGlobalAnterior.nombre}`
                  : guiaGlobalAnterior.nombre}
              </span>
            ) : grado.numero > 1 ? (
              <span>Ir a Grado {grado.numero - 1}°</span>
            ) : (
              <span>Inicio del Curso</span>
            )}
          </button>

          <div className="text-center px-2">
            <span className="text-xs font-black text-amber-950 block">
              {periodoSeleccionado?.nombre} • Guía {indiceGuiaActual + 1} de {guiasDelPeriodo.length}
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              Progreso Anual: Guía #{indiceGlobalActual + 1} de {todasLasGuiasDelGrado.length}
            </span>
          </div>

          <button
            onClick={avanzarSiguienteGuia}
            className="w-full sm:w-auto px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center sm:justify-end gap-2 transition-all bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 shadow-md cursor-pointer active:scale-95"
          >
            {guiaGlobalSiguiente ? (
              <span className="truncate max-w-[200px]">
                {guiaGlobalSiguiente.periodoNumero !== periodoActivoNum
                  ? `Avanzar a Per. ${guiaGlobalSiguiente.periodoNumero}: ${guiaGlobalSiguiente.nombre}`
                  : `Siguiente: ${guiaGlobalSiguiente.nombre}`}
              </span>
            ) : grado.numero < 9 ? (
              <span>¡Avanzar a Grado {grado.numero + 1}°! 🚀</span>
            ) : (
              <span>🎉 ¡Completaste 9°!</span>
            )}
            <span>▶</span>
          </button>
        </div>
      )}

      {/* ══════════ MÓDULO DE LECCIÓN COMPLETO ══════════ */}
      {guiaSeleccionada && (
        <div className="space-y-6">
          <ModuloLeccion
            guia={guiaSeleccionada}
            gradoNombre={grado.nombre}
            gradoNumero={grado.numero}
            mascota={grado.mascota}
          />

          {/* BARRA REPETIDA AL FINAL PARA AVANZAR FÁCILMENTE */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-2 border-slate-200 p-4 rounded-3xl shadow-sm">
            <button
              disabled={!guiaGlobalAnterior && grado.numero === 1}
              onClick={retrocederGuiaAnterior}
              className={`w-full sm:w-auto px-5 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center sm:justify-start gap-2 transition-all ${
                guiaGlobalAnterior || grado.numero > 1
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                  : 'bg-slate-50 text-slate-400 opacity-50 cursor-not-allowed'
              }`}
            >
              <span>◀</span>
              <span>
                {guiaGlobalAnterior
                  ? `Anterior: ${guiaGlobalAnterior.nombre}`
                  : grado.numero > 1
                  ? `Ir a Grado ${grado.numero - 1}°`
                  : 'Inicio'}
              </span>
            </button>

            <span className="text-xs font-extrabold text-slate-500">
              {grado.nombre} • {periodoSeleccionado?.nombre}
            </span>

            <button
              onClick={avanzarSiguienteGuia}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center sm:justify-end gap-2 transition-all bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-md hover:scale-105 cursor-pointer"
            >
              <span>
                {guiaGlobalSiguiente
                  ? `Siguiente: ${guiaGlobalSiguiente.nombre}`
                  : grado.numero < 9
                  ? `¡Pasar a Grado ${grado.numero + 1}°! 🚀`
                  : '🎉 Fin del Curso'}
              </span>
              <span>▶</span>
            </button>
          </div>

          {/* FICHA TÉCNICA CURRICULAR OFICIAL */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
            <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <span>📋</span> Competencias del Ministerio: {guiaSeleccionada.numero || 'Guía'} - {guiaSeleccionada.nombre}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
                  Componente:
                </span>
                <p className="text-slate-800 font-bold">{guiaSeleccionada.componente}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
                  Contenidos:
                </span>
                <p className="text-slate-800 font-bold">{guiaSeleccionada.contenidos}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
                  Estándar:
                </span>
                <p className="text-slate-600 font-medium">{guiaSeleccionada.estandares}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 text-[10px]">
                  DBA (Derecho Básico):
                </span>
                <p className="text-slate-600 font-medium">{guiaSeleccionada.dba}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL: MAPA CURRICULAR Y NAVEGACIÓN DIRECTA DE TODAS LAS GUÍAS ══════════ */}
      {modalMapaAbierto && (
        <div
          onClick={() => setModalMapaAbierto(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border-2 border-slate-200 overflow-hidden cursor-default"
          >
            {/* Header del modal */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🗺️</span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black">
                    Mapa de Aprendizaje: {grado.nombre}
                  </h3>
                  <p className="text-xs text-amber-100 font-medium">
                    Explora y salta a cualquiera de las {todasLasGuiasDelGrado.length} guías del año escolar
                  </p>
                </div>
              </div>

              <button
                onClick={() => setModalMapaAbierto(false)}
                className="w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center font-black cursor-pointer transition-colors"
                title="Cerrar mapa"
              >
                ✕
              </button>
            </div>

            {/* Contenido scrolleable por periodos */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
              {periodos.map((per) => {
                const perGuias = (per.unidades || []).flatMap((u) => u.guias || []);
                const esPeriodoActual = per.numero === periodoActivoNum;

                return (
                  <div
                    key={per.numero}
                    className={`rounded-2xl p-4 sm:p-5 border-2 transition-all ${
                      esPeriodoActual
                        ? 'bg-amber-50/50 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3 border-b pb-2 border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <h4 className="font-black text-slate-800 text-sm sm:text-base">
                          {per.nombre}
                        </h4>
                        {esPeriodoActual && (
                          <span className="text-[10px] bg-amber-500 text-white font-black px-2 py-0.5 rounded-full uppercase">
                            Periodo en Curso
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-bold">
                        {perGuias.length} Guías
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {perGuias.map((g, idx) => {
                        const esGuiaActiva = g.id === guiaActivaId;
                        return (
                          <button
                            key={g.id}
                            onClick={() => saltarAGuia(per.numero, g.id)}
                            className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer hover:scale-102 ${
                              esGuiaActiva
                                ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300'
                                : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-amber-50 text-slate-800'
                            }`}
                          >
                            <span className="text-xl shrink-0">{g.icono || '📖'}</span>
                            <div className="min-w-0 flex-1">
                              <span
                                className={`text-[10px] block font-black uppercase tracking-wider ${
                                  esGuiaActiva ? 'text-amber-100' : 'text-slate-400'
                                }`}
                              >
                                Guía #{idx + 1}
                              </span>
                              <p className="text-xs font-bold truncate">{g.nombre}</p>
                            </div>
                            {esGuiaActiva && (
                              <span className="text-xs font-black text-white shrink-0">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer del modal */}
            <div className="p-3 bg-white border-t border-slate-200 text-center">
              <button
                onClick={() => setModalMapaAbierto(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-black text-xs rounded-xl transition-all cursor-pointer"
              >
                Cerrar Mapa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
