import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import VisorLeccionInteractiva from '../components/interactive/VisorLeccionInteractiva';
import VisorLetraInteractiva from '../components/interactive/VisorLetraInteractiva';
import ArcadeDidactico from '../components/games/ArcadeDidactico';
import { ABECEDARIO } from '../components/games/AbecedarioSonoro';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { useAppTheme } from '../utils/theme';

/**
 * GradoView — Vista Pedagógica de Curso y Aula Digital.
 * Experiencia de app nativa sin sobrecarga visual ni iconos innecesarios.
 */
export default function GradoView() {
  const { gradoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tema } = useAppTheme();
  const grado = mallaData.grados[gradoId] || mallaData.grados["1"];

  const basePath = location.pathname.startsWith('/espanol') ? '/espanol' : '';

  // 'leccion' = Clases, lecturas y retos del cuaderno
  // 'letras'  = Abecedario interactivo fonético
  // 'juegos'  = Minijuegos adaptados directamente al grado
  const [modoVista, setModoVista] = useState('leccion');
  const [letraSeleccionada, setLetraSeleccionada] = useState(ABECEDARIO[0]);
  const [periodoFiltro, setPeriodoFiltro] = useState('todos'); // 'todos' | número de periodo

  const periodos = grado.periodos || [];

  // Aplanar todas las guías del plan de estudio
  const todasLasGuias = useMemo(() => {
    return periodos.flatMap((per) =>
      (per.unidades || []).flatMap((u) =>
        (u.guias || []).map((g) => ({
          ...g,
          periodoNumero: per.numero,
          periodoNombre: per.nombre,
          unidadNombre: u.nombre,
        }))
      )
    );
  }, [periodos]);

  // Guías filtradas según el periodo seleccionado (evita sobrecarga visual)
  const guiasVisibles = useMemo(() => {
    if (periodoFiltro === 'todos') return todasLasGuias;
    return todasLasGuias.filter((g) => g.periodoNumero === Number(periodoFiltro));
  }, [todasLasGuias, periodoFiltro]);

  const [guiaActivaId, setGuiaActivaId] = useState(() =>
    todasLasGuias.length > 0 ? todasLasGuias[0].id : null
  );

  useEffect(() => {
    if (todasLasGuias.length > 0) {
      setGuiaActivaId(todasLasGuias[0].id);
    }
    setPeriodoFiltro('todos');
    setModoVista('leccion');
  }, [gradoId, todasLasGuias]);

  const guiaSeleccionada =
    todasLasGuias.find((g) => g.id === guiaActivaId) || todasLasGuias[0];
  const indiceActual = todasLasGuias.findIndex((g) => g.id === guiaActivaId);

  const avanzarSiguienteGuia = () => {
    if (indiceActual < todasLasGuias.length - 1) {
      sounds.playClick();
      setGuiaActivaId(todasLasGuias[indiceActual + 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else if (grado.numero < 9) {
      sounds.playFanfare();
      navigate(basePath ? `${basePath}/grado/${grado.numero + 1}` : `/grado/${grado.numero + 1}`);
    }
  };

  const retrocederGuiaAnterior = () => {
    if (indiceActual > 0) {
      sounds.playClick();
      setGuiaActivaId(todasLasGuias[indiceActual - 1].id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    } else if (grado.numero > 1) {
      sounds.playClick();
      navigate(basePath ? `${basePath}/grado/${grado.numero - 1}` : `/grado/${grado.numero - 1}`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* ════════════════════════════════════════════════════════════════════════════════
          ENCABEZADO DE CURSO (LIMPIO, ELEGANTE, TIPOGRÁFICO)
         ════════════════════════════════════════════════════════════════════════════════ */}
      <section className={`${tema.headerBg} rounded-3xl p-5 sm:p-6 text-white ${tema.headerShadow} border ${tema.headerBorder} flex flex-col md:flex-row items-center justify-between gap-5 transition-all duration-300 relative overflow-hidden`}>
        {/* Identidad del Grado */}
        <div className="flex items-center gap-4 text-center sm:text-left z-10 w-full md:w-auto">
          <Link
            to={basePath || '/'}
            onClick={() => sounds.playClick()}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/20 cursor-pointer text-white font-title font-bold text-xs shrink-0 active:scale-95 flex items-center gap-1.5"
            title="Volver al catálogo de cursos"
          >
            <span>← Cursos</span>
          </Link>

          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className={`text-[11px] ${tema.headerBadge} font-title font-bold px-3 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-md`}>
                {grado.nivel} • {grado.numero}.° Grado
              </span>
              <span className="text-[10px] bg-white/15 text-white/90 font-semibold px-2.5 py-0.5 rounded-full border border-white/10">
                Plan Curricular Oficial
              </span>
            </div>

            <h1 className="font-title font-black text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white uppercase mt-0.5 leading-tight">
              {grado.nombre.replace('Grado ', '')}
            </h1>

            <p className={`text-xs ${tema.headerSubtext} font-medium`}>
              {grado.mundo}
            </p>
          </div>
        </div>

        {/* Switcher Rápido de Modos (Sin iconos innecesarios, solo tipografía clara) */}
        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 flex-wrap justify-center z-10">
          
          <button
            onClick={() => {
              sounds.playClick();
              voiceReader.speak(`Lecciones y plan de estudios de ${grado.nombre}`);
              setModoVista('leccion');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              modoVista === 'leccion'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Clases y Guías ({todasLasGuias.length})
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              voiceReader.speak("Abecedario interactivo con fonética y trazo");
              setModoVista('letras');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              modoVista === 'letras'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Aprende las Letras
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              voiceReader.speak(`Minijuegos didácticos adaptados a ${grado.nombre}`);
              setModoVista('juegos');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-title font-bold transition-all cursor-pointer ${
              modoVista === 'juegos'
                ? 'bg-white text-slate-900 shadow-md font-extrabold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            }`}
          >
            Juegos de {grado.numero}°
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════════════
          MODO 1: LECCIONES Y PLAN DE ESTUDIOS
         ════════════════════════════════════════════════════════════════════════════════ */}
      {modoVista === 'leccion' && (
        <div className="space-y-4">
          
          {/* BARRA DE NAVEGACIÓN Y FILTRO POR PERIODOS */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
            
            {/* Filtro por Periodo Académico */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
              <span className="text-[11px] font-title font-bold uppercase tracking-wider text-slate-400 pl-1 pr-2 shrink-0">
                Periodos:
              </span>

              <button
                onClick={() => {
                  sounds.playPop();
                  setPeriodoFiltro('todos');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  periodoFiltro === 'todos'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Todos ({todasLasGuias.length})
              </button>

              {periodos.map((p) => {
                const guiasPeriodo = (p.unidades || []).reduce(
                  (acc, u) => acc + (u.guias || []).length, 0
                );
                return (
                  <button
                    key={p.numero}
                    onClick={() => {
                      sounds.playPop();
                      setPeriodoFiltro(p.numero);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                      periodoFiltro === p.numero
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Periodo {p.numero} ({guiasPeriodo})
                  </button>
                );
              })}
            </div>

            {/* Contador de Guía Activa */}
            <div className="text-xs font-semibold text-slate-500 shrink-0">
              Guía {indiceActual + 1} de {todasLasGuias.length}
            </div>
          </div>

          {/* LISTA RÁPIDA DE GUÍAS (TEXTO LIMPIO, SIN ICONOS REPETIDOS 29 VECES) */}
          <div className="bg-slate-100/70 rounded-2xl p-2.5 border border-slate-200/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[10px] font-title font-bold uppercase tracking-wider text-slate-400 pl-1 shrink-0">
              Guías:
            </span>

            {guiasVisibles.map((g) => {
              const estaActiva = g.id === guiaActivaId;
              const idxGlobal = todasLasGuias.findIndex((item) => item.id === g.id);

              return (
                <button
                  key={g.id}
                  onClick={() => {
                    sounds.playClick();
                    setGuiaActivaId(g.id);
                  }}
                  className={`py-1.5 px-3 rounded-xl font-title font-bold text-xs transition-all cursor-pointer shrink-0 ${
                    estaActiva
                      ? `${tema.btnGradient} font-extrabold shadow-sm`
                      : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80'
                  }`}
                >
                  <span className="truncate max-w-[200px]">
                    Guía {idxGlobal + 1}: {g.nombre || g.titulo}
                  </span>
                </button>
              );
            })}
          </div>

          {/* VISOR INTERACTIVO ESTRUCTURADO */}
          {guiaSeleccionada && (
            <VisorLeccionInteractiva
              guia={guiaSeleccionada}
              grado={grado}
              onVolverGuias={() => navigate(basePath || '/')}
              onSiguienteGuia={avanzarSiguienteGuia}
              onAnteriorGuia={retrocederGuiaAnterior}
              haySiguiente={indiceActual < todasLasGuias.length - 1 || grado.numero < 9}
              hayAnterior={indiceActual > 0 || grado.numero > 1}
            />
          )}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════════
          MODO 2: ABECEDARIO INTERACTIVO (Aa)
         ════════════════════════════════════════════════════════════════════════════════ */}
      {modoVista === 'letras' && (
        <section className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-title font-black text-slate-900 text-base sm:text-lg uppercase">
                  Abecedario Fonético Interactivo
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Toca cualquier letra para escuchar su pronunciación, ejemplos y practicar su trazo.
                </p>
              </div>

              <span className={`text-xs font-title font-bold px-3 py-1 rounded-full border ${tema.cardBadge}`}>
                27 Letras con Audio
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2">
              {ABECEDARIO.map((l) => {
                const esActiva = letraSeleccionada.letra === l.letra;
                return (
                  <button
                    key={l.letra}
                    onClick={() => {
                      sounds.playPop();
                      voiceReader.speak(`Letra ${l.letra}. ${l.palabra}.`);
                      setLetraSeleccionada(l);
                    }}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center transition-all cursor-pointer border ${
                      esActiva
                        ? `${tema.btnDock} font-black`
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200 font-bold'
                    }`}
                  >
                    <span className="text-2xl font-title font-black leading-none">{l.letra}</span>
                    <span className={`text-[10px] leading-tight font-medium ${esActiva ? 'text-white/90' : 'text-slate-500'}`}>{l.min}</span>
                    <span className="text-[10px] mt-1 font-bold text-slate-400 truncate max-w-full">{l.palabra}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <VisorLetraInteractiva
            letraData={letraSeleccionada}
            onCambiarLetra={(nueva) => setLetraSeleccionada(nueva)}
            onVolverAbecedario={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════════════════
          MODO 3: MINIJUEGOS DEL GRADO (CARGADOS Y JUGABLES DIRECTAMENTE AQUÍ)
         ════════════════════════════════════════════════════════════════════════════════ */}
      {modoVista === 'juegos' && (
        <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.03)] space-y-4 animate-fade-in">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-title font-black text-slate-900 text-xl">
                Sala de Minijuegos • {grado.nombre}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Desafíos interactivos adaptados pedagógicamente a este grado escolar:
              </p>
            </div>

            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full">
              {grado.numero >= 6 ? 'Secundaria' : 'Primaria'}
            </span>
          </div>

          {/* Se monta directamente el ArcadeDidactico con el número del grado */}
          <ArcadeDidactico gradoNumero={grado.numero} />
        </section>
      )}
    </div>
  );
}
