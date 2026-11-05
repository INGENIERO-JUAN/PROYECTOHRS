import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { GameProgress, RANGOS_JUGADOR } from '../utils/gamification';
import { lanzarConfeti } from '../utils/confetti';
import { useAppTheme } from '../utils/theme';

/**
 * MainLayout — Shell estilo APP DE APRENDIZAJE para tablet / móvil / escritorio.
 * Interfaz limpia, moderna y tipográfica, sin emojis ni iconos innecesarios.
 */
export default function MainLayout() {
  const { tema, temaId, cambiarTema, temasDisponibles } = useAppTheme();
  const [enPantallaCompleta, setEnPantallaCompleta] = useState(false);
  const [progreso, setProgreso] = useState(() => GameProgress.getProgress());
  const [modalTrofeosAbierto, setModalTrofeosAbierto] = useState(false);
  const [celebracionNivel, setCelebracionNivel] = useState(null);
  const [vozSilenciada, setVozSilenciada] = useState(() => voiceReader.isMuted());
  const [menuTemaAbierto, setMenuTemaAbierto] = useState(false);
  const menuTemaRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setEnPantallaCompleta(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    const handleProgresoActualizado = (e) => {
      const data = e.detail || {};
      const actual = GameProgress.getProgress();
      setProgreso(actual);

      if (data.subioDeNivel && data.rangoNuevo) {
        sounds.playLevelUp();
        lanzarConfeti();
        setCelebracionNivel(data.rangoNuevo);
        voiceReader.speak(`Felicitaciones, has subido de nivel. Tu nuevo rango es: ${data.rangoNuevo.titulo}.`);
      }
    };

    window.addEventListener('lengua_viva_progreso_actualizado', handleProgresoActualizado);
    window.addEventListener('storage', handleProgresoActualizado);

    const handleVozCambiada = (e) => {
      if (e.detail) setVozSilenciada(e.detail.muted);
    };
    window.addEventListener('lengua_viva_voz_estado_cambiado', handleVozCambiada);

    const handleClicksAfuera = (e) => {
      if (menuTemaRef.current && !menuTemaRef.current.contains(e.target)) {
        setMenuTemaAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClicksAfuera);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('lengua_viva_progreso_actualizado', handleProgresoActualizado);
      window.removeEventListener('storage', handleProgresoActualizado);
      window.removeEventListener('lengua_viva_voz_estado_cambiado', handleVozCambiada);
      document.removeEventListener('mousedown', handleClicksAfuera);
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

  const seleccionarTema = (id) => {
    sounds.playPop();
    cambiarTema(id);
    setMenuTemaAbierto(false);
  };

  const rangoActual = GameProgress.getRangoPorXP(progreso.xpTotal);
  const siguienteRango = GameProgress.getSiguienteRango(progreso.xpTotal);
  const xpParaSiguiente = siguienteRango ? siguienteRango.xpMin - progreso.xpTotal : 0;
  const progresoPorcentaje = siguienteRango
    ? Math.min(100, Math.round(((progreso.xpTotal - rangoActual.xpMin) / (siguienteRango.xpMin - rangoActual.xpMin)) * 100))
    : 100;

  // Ruta activa para iluminar el Dock inferior
  const path = location.pathname;
  const basePath = path.startsWith('/espanol') ? '/espanol' : '';
  const esCursos = path === '/' || path === '/espanol' || path.includes('/grado');
  const esLetras = path.includes('/letras');
  const esJuegos = path.includes('/juegos');
  const esDocente = path.includes('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/70 via-white to-blue-50/20 font-sans text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-900 relative">
      
      {/* ════════════════════════════════════════════════════════════════════════════════
          APP BAR SUPERIOR (LIMPIA, MODERNA Y SIN ICONOS INNECESARIOS)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          
          {/* Logo de la APP */}
          <Link
            to={basePath || '/'}
            onClick={() => sounds.playClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className={`w-9 h-9 ${tema.logoBg} rounded-xl flex items-center justify-center shadow-xs font-title font-black text-sm text-white group-hover:scale-105 transition-all`}>
              LV
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className={`text-base sm:text-lg font-title font-black text-slate-900 tracking-tight leading-none ${tema.cardHoverText} transition-colors`}>
                  Lengua Viva
                </span>
                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${tema.badgeApp} tracking-wide`}>
                  APP
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-none mt-0.5">
                Rural Offline • Grados 1° a 9°
              </p>
            </div>
          </Link>

          {/* Herramientas de la APP */}
          <div className="flex items-center gap-2">
            
            {/* SELECTOR DE COLOR / TEMA */}
            <div className="relative" ref={menuTemaRef}>
              <button
                onClick={() => {
                  sounds.playClick();
                  setMenuTemaAbierto(!menuTemaAbierto);
                }}
                title="Cambiar paleta de colores de la app"
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-title font-bold shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${tema.dotColor}`} />
                <span className="hidden md:inline font-bold text-[11px] text-slate-700">{tema.nombre}</span>
                <span className="text-[10px] text-slate-400">▼</span>
              </button>

              {/* Menú flotante de temas */}
              {menuTemaAbierto && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-fade-in space-y-1">
                  <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Paleta de Color
                  </div>
                  {temasDisponibles.map((t) => {
                    const activo = t.id === temaId;
                    return (
                      <button
                        key={t.id}
                        onClick={() => seleccionarTema(t.id)}
                        className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer text-xs font-title ${
                          activo
                            ? 'bg-slate-100 text-slate-900 font-black border border-slate-200'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded-full ${t.dotColor} shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-xs leading-none">{t.nombre}</div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">{t.descripcion}</div>
                        </div>
                        {activo && <span className="text-xs font-bold text-blue-600">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Botón de Voz */}
            <button
              onClick={toggleVoz}
              title={vozSilenciada ? "Voz silenciada (Click para activar)" : "Voz activa (Click para silenciar)"}
              className={`px-3 py-1.5 rounded-xl border font-title font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                vozSilenciada
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${vozSilenciada ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              <span>{vozSilenciada ? 'Silencio' : 'Voz'}</span>
            </button>

            {/* Botón Proyector / Pantalla Completa */}
            <button
              onClick={togglePantallaCompleta}
              title={enPantallaCompleta ? "Salir de pantalla completa" : "Modo Proyector de Aula"}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 text-xs font-title font-bold transition-colors cursor-pointer"
            >
              <span>Proyector</span>
            </button>

            {/* Insignia de Nivel / XP */}
            <button
              onClick={() => {
                sounds.playClick();
                setModalTrofeosAbierto(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 shadow-xs flex items-center cursor-pointer transition-all active:scale-95"
              title="Ver medallas y progreso"
            >
              <span className="text-xs font-title font-black text-amber-300">
                {progreso.xpTotal} XP
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════════════
          CONTENEDOR PRINCIPAL ESTILO APP
         ════════════════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 py-4 pb-28">
        <Outlet />
      </main>

      {/* ════════════════════════════════════════════════════════════════════════════════
          DOCK FLOTANTE INFERIOR ESTILO APP (TIPOGRAFÍA LIMPIA, SIN ICONOS INNECESARIOS)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Navegación principal de la app"
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl px-4 sm:px-6 py-2 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.18)] border-2 border-slate-200/90 flex items-center gap-1.5 sm:gap-3"
      >
        {/* TAB 1: CURSOS */}
        <NavLink
          to={basePath || '/'}
          onClick={() => sounds.playClick()}
          className={`px-4 sm:px-5 py-2 rounded-full font-title font-black text-xs transition-all cursor-pointer ${
            esCursos
              ? tema.btnDock
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span className="tracking-wide">CURSOS</span>
        </NavLink>

        {/* TAB 2: LETRAS */}
        <NavLink
          to={basePath ? `${basePath}/letras` : '/letras'}
          onClick={() => sounds.playClick()}
          className={`px-4 sm:px-5 py-2 rounded-full font-title font-black text-xs transition-all cursor-pointer ${
            esLetras
              ? tema.btnDock
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span className="tracking-wide">LETRAS</span>
        </NavLink>

        {/* TAB 3: JUEGOS */}
        <NavLink
          to={basePath ? `${basePath}/juegos` : '/juegos'}
          onClick={() => sounds.playClick()}
          className={`px-4 sm:px-5 py-2 rounded-full font-title font-black text-xs transition-all cursor-pointer ${
            esJuegos
              ? tema.btnDock
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span className="tracking-wide">JUEGOS</span>
        </NavLink>

        {/* TAB 4: DOCENTE */}
        <NavLink
          to={basePath ? `${basePath}/admin` : '/admin'}
          onClick={() => sounds.playClick()}
          className={`px-4 sm:px-5 py-2 rounded-full font-title font-black text-xs transition-all cursor-pointer ${
            esDocente
              ? tema.btnDock
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <span className="tracking-wide">DOCENTE</span>
        </NavLink>
      </nav>

      {/* ══════════ MODAL DE TROFEOS Y RANGOS ══════════ */}
      {modalTrofeosAbierto && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="font-title font-black text-xl text-white">
                  {rangoActual.titulo}
                </h3>
                <p className="text-xs text-amber-300 font-bold">
                  {progreso.xpTotal} Puntos de Sabiduría (XP)
                </p>
              </div>
              <button
                onClick={() => setModalTrofeosAbierto(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-title font-black">
                <span className="text-slate-400">Progreso de Nivel</span>
                <span className="text-amber-300">{progresoPorcentaje}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${progresoPorcentaje}%` }}
                />
              </div>
              {siguienteRango ? (
                <p className="text-[11px] text-slate-400 text-right">
                  Faltan {xpParaSiguiente} XP para alcanzar <strong className="text-white">{siguienteRango.titulo}</strong>
                </p>
              ) : (
                <p className="text-[11px] text-emerald-400 font-black text-right">
                  ¡Has alcanzado el rango máximo de sabiduría!
                </p>
              )}
            </div>

            {/* Catálogo de Rangos */}
            <div className="space-y-3">
              <h4 className="text-xs font-title font-black uppercase tracking-wider text-slate-400">
                Escalafón de Sabiduría
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {RANGOS_JUGADOR.map((r, i) => {
                  const alcanzado = progreso.xpTotal >= r.xpMin;
                  const esActual = r.nivel === rangoActual.nivel;

                  return (
                    <div
                      key={i}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        esActual
                          ? 'bg-amber-400/10 border-amber-400/50 shadow-xs'
                          : alcanzado
                          ? 'bg-slate-800/60 border-slate-700 text-slate-300'
                          : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                      }`}
                    >
                      <div>
                        <div className="font-title font-black text-xs text-white">
                          Nivel {r.nivel}: {r.titulo}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {r.xpMin} XP requeridos
                        </div>
                      </div>
                      {esActual ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                          Actual
                        </span>
                      ) : alcanzado ? (
                        <span className="text-xs text-emerald-400 font-bold">✓</span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
