import React, { useState } from 'react';
import PizarraDigital from '../PizarraDigital';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { useAppTheme } from '../../utils/theme';

export default function VisorLeccionInteractiva({
  guia,
  grado,
  onVolverGuias,
  onSiguienteGuia,
  onAnteriorGuia,
  haySiguiente,
  hayAnterior,
}) {
  const { tema } = useAppTheme();
  const [tabActivo, setTabActivo] = useState('lectura'); // 'lectura', 'preguntas', 'pizarra'
  const [leyendoDocente, setLeyendoDocente] = useState(false);
  const [leyendoHistoria, setLeyendoHistoria] = useState(false);
  const [respuestasSeleccionadas, setRespuestasSeleccionadas] = useState({});

  const titulo = guia.titulo || guia.nombre || 'Guía de Aprendizaje';
  const lectura = guia.leccion?.lectura || '';
  const conceptos = guia.leccion?.conceptosClave || [];
  const preguntas = guia.preguntasComprension?.literal || [];

  const leerTextoDocente = () => {
    if (leyendoDocente) {
      voiceReader.stop();
      setLeyendoDocente(false);
    } else {
      sounds.playClick();
      setLeyendoDocente(true);
      const orientacion = `Apoyo docente para la guía ${titulo}. DBA: ${guia.dba || 'Desarrollo de habilidades comunicativas'}. Estándar: ${guia.estandares || 'Producción y comprensión textual'}.`;
      voiceReader.speak(orientacion, () => setLeyendoDocente(false));
    }
  };

  const reproducirHistoria = () => {
    if (leyendoHistoria) {
      voiceReader.stop();
      setLeyendoHistoria(false);
    } else {
      sounds.playClick();
      setLeyendoHistoria(true);
      voiceReader.speak(`${titulo}. ${lectura}`, () => setLeyendoHistoria(false));
    }
  };

  const seleccionarRespuesta = (idxPregunta, idxOpcion, esCorrecta) => {
    setRespuestasSeleccionadas((prev) => ({
      ...prev,
      [idxPregunta]: { idxOpcion, esCorrecta },
    }));

    if (esCorrecta) {
      sounds.playSuccess();
      voiceReader.speak("Excelente respuesta, muy bien.");
    } else {
      sounds.playError();
      voiceReader.speak("Intenta de nuevo, tú puedes.");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      
      {/* ══════════ SPLIT-SCREEN (APOYO DOCENTE + MULTIMEDIA) ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ── COLUMNA IZQUIERDA (4 COLS): RESUMEN + TEXTO APOYO DOCENTE ── */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Tarjeta superior: Resumen de la lección */}
          <div className={`${tema.headerBg} rounded-3xl p-5 text-white ${tema.headerShadow} border ${tema.headerBorder} space-y-2 transition-all duration-300`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-title font-black uppercase tracking-wider bg-black/20 px-2.5 py-1 rounded-full border border-white/20">
                {grado.nombre}
              </span>
              <span className="text-[10px] uppercase font-bold text-white/80">
                {guia.numero || 'Lección Oficial'}
              </span>
            </div>

            <div>
              <h2 className="text-lg font-title font-black leading-tight drop-shadow-xs">
                {titulo}
              </h2>
            </div>

            <button
              onClick={reproducirHistoria}
              className={`w-full mt-2 py-2.5 px-4 rounded-xl font-title font-black text-xs transition-all cursor-pointer shadow-xs ${
                leyendoHistoria
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white hover:bg-slate-100 text-slate-900'
              }`}
            >
              <span>{leyendoHistoria ? 'Detener lectura con voz' : 'Escuchar historia con voz'}</span>
            </button>
          </div>

          {/* Tarjeta inferior: "TEXTO APOYO DOCENTE" */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-title font-black text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
                TEXTO APOYO DOCENTE
              </h3>
              <button
                onClick={leerTextoDocente}
                title="Leer apoyo docente en voz alta"
                className={`px-3 py-1 rounded-xl text-xs font-title font-black transition-all cursor-pointer border ${
                  leyendoDocente
                    ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                }`}
              >
                <span>{leyendoDocente ? 'Detener' : 'Leer'}</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-700">
              {guia.dba && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
                  <span className={`font-title font-black ${tema.accentText} block text-[10px] uppercase tracking-wider`}>
                    DBA (Derecho Básico):
                  </span>
                  <p className="font-medium text-slate-700 mt-1 leading-relaxed text-[11px]">
                    {guia.dba}
                  </p>
                </div>
              )}

              {guia.estandares && (
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/70">
                  <span className="font-title font-black text-slate-700 block text-[10px] uppercase tracking-wider">
                    Estándar Pedagógico:
                  </span>
                  <p className="font-medium text-slate-600 mt-1 leading-relaxed text-[11px]">
                    {guia.estandares}
                  </p>
                </div>
              )}

              <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/70">
                <span className="font-title font-black text-amber-900 block text-[10px] uppercase tracking-wider">
                  Pregunta Detonante en Clase:
                </span>
                <p className="font-semibold text-slate-800 italic mt-1 leading-relaxed text-[11px]">
                  &quot;¿Qué relación tiene esta lectura con lo que vivimos en el campo o la escuela?&quot;
                </p>
              </div>

              {guia.retoCuaderno && (
                <div className="bg-blue-50/60 p-3 rounded-2xl border border-blue-200/70">
                  <span className="font-title font-black text-blue-900 block text-[10px] uppercase tracking-wider">
                    Reto Sugerido para el Cuaderno:
                  </span>
                  <p className="font-medium text-slate-700 mt-1 leading-relaxed text-[11px]">
                    {guia.retoCuaderno.titulo || 'Consignar ideas principales y realizar un dibujo alusivo.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── COLUMNA DERECHA (8 COLS): CONTENIDO MULTIMEDIA INTERACTIVO ── */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Pestañas limpias estilo App (sin iconos decorativos) */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-xs flex gap-1.5">
            <button
              onClick={() => {
                sounds.playClick();
                setTabActivo('lectura');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                tabActivo === 'lectura'
                  ? tema.btnGradient
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Lectura y Conceptos
            </button>

            {preguntas.length > 0 && (
              <button
                onClick={() => {
                  sounds.playClick();
                  setTabActivo('preguntas');
                }}
                className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                  tabActivo === 'preguntas'
                    ? tema.btnGradient
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                Preguntas ({preguntas.length})
              </button>
            )}

            <button
              onClick={() => {
                sounds.playClick();
                setTabActivo('pizarra');
              }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-title font-black text-xs transition-all cursor-pointer ${
                tabActivo === 'pizarra'
                  ? tema.btnGradient
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Pizarra de Aula
            </button>
          </div>

          {/* TAB 1: LECTURA Y CONCEPTOS */}
          {tabActivo === 'lectura' && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 animate-fade-in">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xl sm:text-2xl font-title font-black text-slate-900">
                    {titulo}
                  </h3>
                  <button
                    onClick={reproducirHistoria}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-title font-black text-xs cursor-pointer border border-slate-200"
                  >
                    <span>{leyendoHistoria ? 'Pausar audio' : 'Escuchar cuento'}</span>
                  </button>
                </div>

                <div className="p-5 bg-slate-50/70 border border-slate-200/70 rounded-2xl">
                  <p className="text-base sm:text-lg leading-relaxed text-slate-800 font-medium whitespace-pre-line">
                    {lectura || 'Lectura formativa para el grado.'}
                  </p>
                </div>
              </div>

              {/* Conceptos Clave Ilustrados (Texto limpio) */}
              {conceptos.length > 0 && (
                <div className="space-y-3 pt-1">
                  <span className={`text-[11px] font-title font-black uppercase tracking-wider ${tema.accentText} block`}>
                    Conceptos Clave de la Lección:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conceptos.map((c, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                        <h4 className="font-title font-black text-xs text-slate-900">{c.concepto}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{c.ejemplo}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PREGUNTAS DE COMPRENSIÓN */}
          {tabActivo === 'preguntas' && preguntas.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6 animate-fade-in">
              <div className="space-y-1 text-center sm:text-left border-b border-slate-100 pb-3">
                <span className={`text-[11px] font-title font-black uppercase tracking-wider ${tema.accentText}`}>
                  Desafío de Comprensión Lectora
                </span>
                <h3 className="text-xl font-title font-black text-slate-900">
                  ¿Qué aprendimos de la lectura?
                </h3>
              </div>

              <div className="space-y-4">
                {preguntas.map((p, idxP) => {
                  const seleccion = respuestasSeleccionadas[idxP];
                  return (
                    <div key={idxP} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                      <p className="font-title font-black text-sm text-slate-900">
                        {idxP + 1}. {p.pregunta}
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        {p.opciones.map((op, idxOp) => {
                          const esCorrecta = idxOp === p.correcta;
                          const fueSeleccionada = seleccion?.idxOpcion === idxOp;

                          return (
                            <button
                              key={idxOp}
                              onClick={() => seleccionarRespuesta(idxP, idxOp, esCorrecta)}
                              className={`p-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer border ${
                                fueSeleccionada
                                  ? esCorrecta
                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-black shadow-xs'
                                    : 'bg-rose-50 border-rose-400 text-rose-950 font-black shadow-xs'
                                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                              }`}
                            >
                              <span className="font-black text-slate-400">{String.fromCharCode(65 + idxOp)}) </span>
                              <span>{op}</span>
                              {fueSeleccionada && (
                                <span className={`ml-2 font-black ${esCorrecta ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {esCorrecta ? '✓ ¡Correcto!' : '✗ Intenta otra opción'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PIZARRA DE AULA */}
          {tabActivo === 'pizarra' && (
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-3 animate-fade-in">
              <div className="border-b border-slate-100 pb-2">
                <h3 className="text-base sm:text-lg font-title font-black text-slate-900">
                  Pizarra Digital: {titulo}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Espacio táctil para dibujar, responder retos del cuaderno o escribir palabras del tema.
                </p>
              </div>

              <PizarraDigital />
            </div>
          )}

          {/* Navegación Anterior / Siguiente Guía */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={onAnteriorGuia}
              disabled={!hayAnterior}
              className={`px-4 py-2.5 rounded-xl font-title font-black text-xs transition-all cursor-pointer border ${
                hayAnterior
                  ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-xs'
                  : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
              }`}
            >
              <span>← Guía Anterior</span>
            </button>

            <button
              onClick={onSiguienteGuia}
              disabled={!haySiguiente}
              className={`px-4 py-2.5 rounded-xl font-title font-black text-xs transition-all cursor-pointer border ${
                haySiguiente
                  ? `${tema.btnGradient} shadow-md`
                  : 'bg-slate-100 text-slate-300 border-transparent cursor-not-allowed'
              }`}
            >
              <span>Siguiente Guía →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
