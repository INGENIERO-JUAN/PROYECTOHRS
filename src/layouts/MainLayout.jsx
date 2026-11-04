import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { GameProgress, RANGOS_JUGADOR, INSIGNIAS_LOGROS } from '../utils/gamification';
import { lanzarConfeti } from '../utils/confetti';

export default function MainLayout() {
  const [estaEnLinea, setEstaEnLinea] = useState(navigator.onLine);
  const [enPantallaCompleta, setEnPantallaCompleta] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [resultadosBusqueda, setResultadosBusqueda] = useState([]);
  const [progreso, setProgreso] = useState(() => GameProgress.getProgress());
  const [modalTrofeosAbierto, setModalTrofeosAbierto] = useState(false);
  const [celebracionNivel, setCelebracionNivel] = useState(null); // { nuevoRango }
  const [vozSilenciada, setVozSilenciada] = useState(() => voiceReader.isMuted());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOnline = () => setEstaEnLinea(true);
    const handleOffline = () => setEstaEnLinea(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const handleFullscreenChange = () => {
      setEnPantallaCompleta(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Escuchar actualizaciones de progreso y subidas de nivel
    const handleProgresoActualizado = (e) => {
      const data = e.detail || {};
      const actual = GameProgress.getProgress();
      setProgreso(actual);

      if (data.subioDeNivel && data.rangoNuevo) {
        sounds.playLevelUp();
        lanzarConfeti();
        setCelebracionNivel(data.rangoNuevo);
        voiceReader.speak(`¡Felicitaciones! Has subido de nivel. Tu nuevo rango es: ${data.rangoNuevo.titulo}.`);
      }
    };

    window.addEventListener('lengua_viva_progreso_actualizado', handleProgresoActualizado);
    window.addEventListener('storage', handleProgresoActualizado);

    const handleVozCambiada = (e) => {
      if (e.detail) setVozSilenciada(e.detail.muted);
    };
    window.addEventListener('lengua_viva_voz_estado_cambiado', handleVozCambiada);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('lengua_viva_progreso_actualizado', handleProgresoActualizado);
      window.removeEventListener('storage', handleProgresoActualizado);
      window.removeEventListener('lengua_viva_voz_estado_cambiado', handleVozCambiada);
    };
  }, []);

  const togglePantallaCompleta = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleVoz = () => {
    sounds.playClick();
    const mut = voiceReader.toggleMute();
    setVozSilenciada(mut);
    if (!mut) {
      voiceReader.speak("Voz pedagógica activada.");
    }
  };

  const handleBuscar = (e) => {
    const query = e.target.value;
    setBusqueda(query);

    if (query.trim().length < 2) {
      setResultadosBusqueda([]);
      return;
    }

    const matches = [];
    Object.values(mallaData.grados).forEach((grado) => {
      const todasLasGuias = grado.periodos
        ? grado.periodos.flatMap((p) => p.unidades?.flatMap((u) => u.guias || []) || [])
        : grado.guias || [];

      todasLasGuias.forEach((guia) => {
        const titulo = guia.titulo || guia.nombre || '';
        const contenidos = guia.contenidos || '';
        const lectura = guia.leccion?.lectura || '';
        const textoBuscar = `${grado.nombre} ${titulo} ${contenidos} ${lectura}`.toLowerCase();

        if (textoBuscar.includes(query.toLowerCase())) {
          matches.push({
            gradoId: grado.id || grado.grado,
            gradoNombre: grado.nombre,
            guiaId: guia.id,
            guiaTitulo: titulo,
            tema: contenidos || titulo,
            icono: guia.icono || grado.icono
          });
        }
      });
    });

    setResultadosBusqueda(matches.slice(0, 6));
  };

  const seleccionarResultado = (res) => {
    sounds.playClick();
    setBusqueda('');
    setResultadosBusqueda([]);
    navigate(`/grado/${res.gradoId}`);
  };

  const gradosList = Object.values(mallaData.grados);
  const primaria = gradosList.filter((g) => g.numero <= 5);
  const secundaria = gradosList.filter((g) => g.numero >= 6);

  const rangoActual = GameProgress.getRangoPorXP(progreso.xpTotal);
  const siguienteRango = GameProgress.getSiguienteRango(progreso.xpTotal);
  const xpParaSiguiente = siguienteRango ? siguienteRango.xpMin - progreso.xpTotal : 0;
  const progresoPorcentaje = siguienteRango
    ? Math.min(100, Math.round(((progreso.xpTotal - rangoActual.xpMin) / (siguienteRango.xpMin - rangoActual.xpMin)) * 100))
    : 100;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50/40 via-slate-50 to-indigo-50/30 font-sans selection:bg-amber-300">
      {/* ══════════ HEADER PRINCIPAL ══════════ */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-400 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
          
          {/* Logo y Nombre con Identidad Fuerte */}
          <Link
            to="/"
            onClick={() => sounds.playClick()}
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-orange-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-200 border-2 border-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-200 text-2xl">
              📖✨
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-amber-600 transition-colors">
                  Lengua Viva
                </h1>
                <span className="text-[10px] bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                  Pro 100% Offline
                </span>
              </div>
              <p className="text-[11px] font-extrabold text-amber-700 tracking-wide mt-0.5">
                Plataforma Integral de Lenguaje • 1° a 9°
              </p>
            </div>
          </Link>

          {/* Buscador de Temas del Maestro */}
          <div className="relative flex-1 max-w-sm hidden md:block">
            <input
              type="text"
              value={busqueda}
              onChange={handleBuscar}
              placeholder="🔍 Buscar tema (ej: fábulas, vocales, mitos)..."
              className="w-full py-2 px-4 pl-9 bg-slate-100 border-2 border-slate-200 rounded-2xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-amber-400 focus:ring-2 focus:ring-amber-200 outline-none transition-all shadow-inner"
            />
            <span className="absolute left-3 top-2.5 text-xs text-slate-400">🔍</span>

            {resultadosBusqueda.length > 0 && (
              <div className="absolute top-11 left-0 w-full bg-white rounded-2xl shadow-2xl border-2 border-amber-300 overflow-hidden z-50 animate-slide-down">
                <div className="p-2 bg-amber-50 text-[10px] font-black text-amber-800 uppercase tracking-wider border-b border-amber-200">
                  Temas Encontrados:
                </div>
                {resultadosBusqueda.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => seleccionarResultado(r)}
                    className="w-full text-left p-3 hover:bg-amber-100 flex items-center gap-3 border-b border-slate-100 last:border-b-0 cursor-pointer transition-colors"
                  >
                    <span className="text-xl">{r.icono}</span>
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] font-black text-amber-700 block">{r.gradoNombre}</span>
                      <p className="text-xs font-bold text-slate-800 truncate">{r.guiaTitulo}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botones de Navegación, Rango XP y Herramientas */}
          <div className="flex items-center gap-2">
            
            {/* BOTÓN ESTRELLA: SALA DE JUEGOS ARCADE */}
            <NavLink
              to="/juegos"
              onClick={() => sounds.playClick()}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-b-4 active:border-b-0 active:translate-y-1 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 border-amber-600 shadow-lg scale-105 animate-pulse'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                }`
              }
            >
              <span className="text-base">🎮</span>
              <span className="hidden sm:inline">Sala de Juegos</span>
            </NavLink>

            {/* BADGE TÁCTIL DE PROGRESO / RANGO DEL JUGADOR */}
            <button
              onClick={() => {
                sounds.playClick();
                setModalTrofeosAbierto(true);
              }}
              title="Ver Salón de Trofeos y Rangos"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white border-2 border-amber-400 shadow-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
            >
              <span className="text-lg">{rangoActual.icono}</span>
              <div className="text-left leading-tight hidden sm:block">
                <span className="text-[9px] font-black text-amber-400 uppercase tracking-widest block">
                  Nivel {rangoActual.nivel}
                </span>
                <span className="text-xs font-black text-slate-100">
                  ⭐ {progreso.xpTotal} XP
                </span>
              </div>
            </button>

            {/* Botón Mundos / Home */}
            <NavLink
              to="/"
              onClick={() => sounds.playClick()}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 border-b-4 active:border-b-0 active:translate-y-1 ${
                  isActive && location.pathname === '/'
                    ? 'bg-slate-800 text-white border-slate-950 shadow-md'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`
              }
            >
              <span>🗺️</span>
              <span className="hidden md:inline">Mundos</span>
            </NavLink>

            {/* Botón de Silenciar / Activar Voz */}
            <button
              onClick={toggleVoz}
              title={vozSilenciada ? "Voz silenciada (Click para activar lectura)" : "Voz activa (Click para silenciar)"}
              className={`px-3 py-1.5 rounded-xl border-2 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                vozSilenciada
                  ? 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-300'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <span className="text-sm">{vozSilenciada ? '🔇' : '🔊'}</span>
              <span className="hidden sm:inline">{vozSilenciada ? 'Voz: Silencio' : 'Voz: Activa'}</span>
            </button>

            {/* Modo Proyector */}
            <button
              onClick={togglePantallaCompleta}
              title={enPantallaCompleta ? "Salir de pantalla completa" : "Modo Proyector (Pantalla Completa)"}
              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>{enPantallaCompleta ? '🗗' : '🖥️'}</span>
              <span className="hidden lg:inline">{enPantallaCompleta ? 'Salir' : 'Proyector'}</span>
            </button>

            {/* Badge de Red */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border ${
                estaEnLinea
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${estaEnLinea ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="hidden xl:inline">{estaEnLinea ? 'Listo Offline' : 'Sin Conexión'}</span>
            </span>
          </div>
        </div>

        {/* ══════════ BARRA RÁPIDA DE GRADOS CON BOTONES 3D ══════════ */}
        <div className="border-t-2 border-amber-200/80 bg-amber-50/70 overflow-x-auto scrollbar-none py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 min-w-max">
            <span className="text-[11px] font-black text-amber-900/70 uppercase tracking-widest mr-2 shrink-0">
              Grados:
            </span>

            {/* Primaria */}
            <div className="flex items-center gap-1.5">
              {primaria.map((g) => (
                <NavLink
                  key={g.id}
                  to={`/grado/${g.id}`}
                  onClick={() => sounds.playClick()}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 border-b-3 active:border-b-0 active:translate-y-0.5 ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-800 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-400 hover:text-emerald-800'
                    }`
                  }
                >
                  <span className="text-sm">{g.icono}</span>
                  <span>{g.nombre.replace('Grado ', '')}</span>
                </NavLink>
              ))}
            </div>

            <div className="h-4 w-px bg-amber-300 mx-2" />

            {/* Secundaria */}
            <div className="flex items-center gap-1.5">
              {secundaria.map((g) => (
                <NavLink
                  key={g.id}
                  to={`/grado/${g.id}`}
                  onClick={() => sounds.playClick()}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1 border-b-3 active:border-b-0 active:translate-y-0.5 ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-900 shadow-md scale-105'
                        : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-400 hover:text-indigo-800'
                    }`
                  }
                >
                  <span className="text-sm">{g.icono}</span>
                  <span>{g.nombre.replace('Grado ', '')}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* ══════════ CONTENIDO PRINCIPAL ══════════ */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>

      {/* ══════════ FOOTER PROFESIONAL ══════════ */}
      <footer className="border-t-2 border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-bold space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-800 font-black">
          <span>📖✨</span>
          <span>Lengua Viva • Suite Interactiva de Lenguaje y Literatura</span>
        </div>
        <p className="text-slate-400">
          Diseñada para 1° a 9° Grado • Fonética con voz para 1° • Duelos, Tribunal de Falacias y Escape Room para secundaria • 100% Funcional sin Internet
        </p>
      </footer>

      {/* ══════════ MODAL SALÓN DE TROFEOS Y RANGOS (DOPAMINA PURA) ══════════ */}
      {modalTrofeosAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border-4 border-amber-400 text-white rounded-4xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Cabecera del Salón */}
            <div className="flex items-center justify-between border-b border-indigo-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-amber-400/20 rounded-2xl border border-amber-400">
                  {rangoActual.icono}
                </span>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 block">
                    Tu Rango Actual:
                  </span>
                  <h3 className="text-2xl font-black text-white">{rangoActual.titulo}</h3>
                  <p className="text-xs text-slate-300 font-semibold">{rangoActual.desc}</p>
                </div>
              </div>

              <button
                onClick={() => setModalTrofeosAbierto(false)}
                className="w-10 h-10 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center font-black text-lg cursor-pointer border border-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Barra de Progreso a Siguiente Rango */}
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-indigo-800 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-amber-300">⭐ {progreso.xpTotal} XP Acumulados</span>
                {siguienteRango ? (
                  <span className="text-slate-400">
                    Siguiente: {siguienteRango.titulo} ({siguienteRango.xpMin} XP)
                  </span>
                ) : (
                  <span className="text-emerald-400">¡Rango Máximo Alcanzado!</span>
                )}
              </div>

              <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden p-0.5 border border-indigo-900">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>

              {siguienteRango && (
                <p className="text-[11px] text-slate-400 text-center font-medium">
                  Te faltan solo <strong className="text-white">{xpParaSiguiente} XP</strong> para desbloquear <strong className="text-amber-400">{siguienteRango.titulo}</strong>
                </p>
              )}
            </div>

            {/* Cuadrícula de Insignias y Logros */}
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400 block">
                Tus Insignias y Medallas de Honor ({progreso.insignias?.length || 0} / {INSIGNIAS_LOGROS.length}):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {INSIGNIAS_LOGROS.map((ins) => {
                  const desbloqueada = (progreso.insignias || []).includes(ins.id);
                  return (
                    <div
                      key={ins.id}
                      className={`p-3 rounded-2xl border-2 text-center flex flex-col items-center justify-center transition-all ${
                        desbloqueada
                          ? 'bg-amber-400/20 border-amber-400 text-white shadow-md'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500 opacity-50'
                      }`}
                    >
                      <span className="text-3xl mb-1">{ins.icono}</span>
                      <span className="text-xs font-black block leading-tight">{ins.titulo}</span>
                      <span className="text-[9px] mt-0.5 opacity-80 leading-tight block">{ins.desc}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Lista de Todos los 9 Rangos del Juego */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Escalafón de Sabiduría Literaria:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {RANGOS_JUGADOR.map((r) => {
                  const esActual = r.nivel === rangoActual.nivel;
                  const superado = progreso.xpTotal >= r.xpMin;
                  return (
                    <div
                      key={r.nivel}
                      className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                        esActual
                          ? 'bg-amber-400/30 border-amber-400 text-amber-200 font-black'
                          : superado
                          ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300 font-bold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-500'
                      }`}
                    >
                      <span className="text-xl">{r.icono}</span>
                      <div className="min-w-0">
                        <span className="block truncate">{r.titulo}</span>
                        <span className="text-[10px] opacity-70 block">{r.xpMin} XP</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setModalTrofeosAbierto(false)}
                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm rounded-2xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                ¡Seguir Jugando y Ganando XP!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ CELEBRACIÓN DE LEVEL UP (SUBIDA DE NIVEL) ESTÁTICA Y FÁCIL DE CLICKEAR ══════════ */}
      {celebracionNivel && (
        <div
          onClick={() => setCelebracionNivel(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in cursor-pointer select-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-b from-amber-500 via-orange-500 to-amber-600 border-4 border-yellow-200 text-white rounded-4xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl relative cursor-default"
          >
            {/* Botón cerrar X superior */}
            <button
              onClick={() => setCelebracionNivel(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white font-black flex items-center justify-center text-sm cursor-pointer transition-colors"
              title="Cerrar ventana"
            >
              ✕
            </button>

            <span className="text-6xl block">⭐👑⭐</span>
            <span className="text-xs font-black uppercase tracking-widest bg-yellow-300 text-yellow-950 px-3.5 py-1 rounded-full shadow-sm inline-block">
              ¡SUBIDA DE NIVEL!
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              ¡Nuevo Rango Desbloqueado!
            </h3>
            <div className="p-4 bg-slate-950/90 rounded-2xl border-2 border-yellow-300 space-y-1">
              <span className="text-5xl block">{celebracionNivel.icono}</span>
              <h4 className="text-2xl font-black text-amber-400">{celebracionNivel.titulo}</h4>
              <p className="text-xs text-slate-300 font-semibold">{celebracionNivel.desc}</p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playClick();
                setCelebracionNivel(null);
              }}
              className="w-full py-4 px-6 bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white border-2 border-yellow-300 font-black text-base sm:text-lg rounded-2xl shadow-2xl transition-all cursor-pointer transform hover:scale-102 active:scale-98"
            >
              ✨ ¡Recibir Honor y Continuar!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
