import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { lanzarConfeti } from '../utils/confetti';

/**
 * ModuloInteractivo - Versión Gamificada para Salón de Clases
 * Diseñado específicamente para proyectarse en el aula o usarse en tablets.
 * Con retroalimentación sonora offline, confeti, botones táctiles 3D,
 * mascota interactiva y modo pista para los estudiantes.
 */
export default function ModuloInteractivo({ 
  modulos = [], 
  nombreArea = "Misión de Español", 
  iconoArea = "🎯",
  mascota = "🦜 Tito el Loro Lector"
}) {
  const [indiceActual, setIndiceActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(null);
  const [estadoValidacion, setEstadoValidacion] = useState(null); // null | 'correcta' | 'incorrecta'
  const [puntajeTotal, setPuntajeTotal] = useState(0);
  const [rachaCorrectas, setRachaCorrectas] = useState(0);
  const [mostrarPista, setMostrarPista] = useState(false);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [sonidoActivo, setSonidoActivo] = useState(true);

  if (!modulos || modulos.length === 0) {
    return (
      <div className="bg-white rounded-4xl p-8 text-center shadow-lg border-4 border-amber-200">
        <span className="text-6xl block mb-3 animate-bounce">🎈</span>
        <h3 className="text-2xl font-black text-slate-800">¡Esta misión se está preparando!</h3>
        <p className="text-slate-600 font-bold mt-2">Pronto el profesor activará nuevos retos.</p>
      </div>
    );
  }

  const ejercicio = modulos[indiceActual];
  const totalPreguntas = modulos.length;
  const porcentajeProgreso = Math.round(((indiceActual + 1) / totalPreguntas) * 100);

  // Paleta de colores estilo juego para las 4 opciones
  const coloresOpciones = [
    { bg: 'bg-rose-500', hover: 'hover:bg-rose-600', border: 'border-rose-700', text: 'text-white', light: 'bg-rose-50', letra: 'A' },
    { bg: 'bg-sky-500', hover: 'hover:bg-sky-600', border: 'border-sky-700', text: 'text-white', light: 'bg-sky-50', letra: 'B' },
    { bg: 'bg-amber-500', hover: 'hover:bg-amber-600', border: 'border-amber-700', text: 'text-white', light: 'bg-amber-50', letra: 'C' },
    { bg: 'bg-emerald-500', hover: 'hover:bg-emerald-600', border: 'border-emerald-700', text: 'text-white', light: 'bg-emerald-50', letra: 'D' }
  ];

  const handleSeleccionarOpcion = (id) => {
    if (estadoValidacion !== null) return;
    if (sonidoActivo) sounds.playClick();
    setOpcionSeleccionada(id);
  };

  const handleVerificar = () => {
    if (opcionSeleccionada === null || estadoValidacion !== null) return;

    const esAcierto = opcionSeleccionada === ejercicio.respuestaCorrecta;

    if (esAcierto) {
      if (sonidoActivo) sounds.playCorrect();
      lanzarConfeti();
      setEstadoValidacion('correcta');
      setPuntajeTotal((prev) => prev + (ejercicio.puntos || 100));
      setRachaCorrectas((prev) => prev + 1);
    } else {
      if (sonidoActivo) sounds.playWrong();
      setEstadoValidacion('incorrecta');
      setRachaCorrectas(0);
    }
  };

  const handleSiguiente = () => {
    if (sonidoActivo) sounds.playClick();
    setMostrarPista(false);

    if (indiceActual + 1 < totalPreguntas) {
      setIndiceActual((prev) => prev + 1);
      setOpcionSeleccionada(null);
      setEstadoValidacion(null);
    } else {
      if (sonidoActivo) sounds.playFanfare();
      lanzarConfeti();
      setJuegoTerminado(true);
    }
  };

  const handleReiniciar = () => {
    if (sonidoActivo) sounds.playClick();
    setIndiceActual(0);
    setOpcionSeleccionada(null);
    setEstadoValidacion(null);
    setPuntajeTotal(0);
    setRachaCorrectas(0);
    setMostrarPista(false);
    setJuegoTerminado(false);
  };

  const toggleSonido = () => {
    sounds.muted = !sonidoActivo;
    setSonidoActivo(!sonidoActivo);
  };

  // PANTALLA DE VICTORIA Y TROFEO
  if (juegoTerminado) {
    return (
      <div className="bg-gradient-to-b from-white to-amber-50 rounded-4xl p-8 sm:p-12 shadow-2xl border-4 border-amber-300 text-center max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
        {/* Confeti decorativo de fondo */}
        <div className="absolute top-2 left-4 text-3xl animate-bounce">⭐</div>
        <div className="absolute top-4 right-4 text-3xl animate-bounce">🎉</div>

        <div className="w-28 h-28 bg-gradient-to-br from-yellow-300 to-amber-500 text-white rounded-full flex items-center justify-center text-6xl mx-auto mb-6 shadow-xl border-4 border-white animate-pulse">
          🏆
        </div>

        <span className="inline-block bg-amber-400 text-amber-950 text-sm font-black px-6 py-2 rounded-full uppercase tracking-widest mb-3 shadow-sm">
          ¡Misión Superada con Éxito!
        </span>

        <h2 className="text-3xl sm:text-5xl font-black text-slate-800 mb-3 tracking-tight">
          ¡Son unos Genios de la Lectura! 🌟
        </h2>

        <p className="text-slate-600 text-lg sm:text-xl font-bold mb-8">
          Todo el salón ha completado los desafíos de <span className="text-amber-600 font-black">{nombreArea}</span>.
        </p>

        {/* Marcadores Gamificados de Clase */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-amber-100/80 rounded-3xl p-5 border-2 border-amber-300 shadow-inner">
            <span className="text-4xl block font-black text-amber-700 mb-1">
              ⭐ {puntajeTotal}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-800 uppercase tracking-wider">
              Puntos Ganados
            </span>
          </div>

          <div className="bg-emerald-100/80 rounded-3xl p-5 border-2 border-emerald-300 shadow-inner">
            <span className="text-4xl block font-black text-emerald-700 mb-1">
              🔥 x{rachaCorrectas || totalPreguntas}
            </span>
            <span className="text-xs sm:text-sm font-black text-emerald-800 uppercase tracking-wider">
              Racha del Salón
            </span>
          </div>
        </div>

        <button
          onClick={handleReiniciar}
          className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xl rounded-3xl shadow-xl shadow-emerald-200 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto cursor-pointer"
        >
          <span>🔄</span> ¡Jugar Otra Vez con el Salón!
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Barra de Estado Gamificada del Salón */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-md border-3 border-slate-200 flex flex-wrap items-center justify-between gap-4">
        
        {/* Identificador y Pregunta Actual */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-amber-300">
            {iconoArea}
          </div>
          <div>
            <h3 className="font-black text-slate-800 text-base sm:text-lg leading-tight">
              {ejercicio.titulo}
            </h3>
            <span className="text-xs font-black text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Reto {indiceActual + 1} de {totalPreguntas}
            </span>
          </div>
        </div>

        {/* Racha, Estrellas y Control de Sonido */}
        <div className="flex items-center gap-3">
          {rachaCorrectas > 1 && (
            <div className="flex items-center gap-1 bg-orange-100 border border-orange-300 px-3 py-1.5 rounded-2xl animate-bounce">
              <span className="text-orange-600 text-base">🔥</span>
              <span className="font-black text-orange-700 text-xs sm:text-sm">Racha x{rachaCorrectas}</span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-2xl shadow-inner">
            <span className="text-amber-600 text-lg">⭐</span>
            <span className="font-black text-amber-900 text-sm sm:text-base">{puntajeTotal}</span>
          </div>

          <button
            onClick={toggleSonido}
            title={sonidoActivo ? "Silenciar audio" : "Activar audio"}
            className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-2xl flex items-center justify-center text-lg transition-transform active:scale-90"
          >
            {sonidoActivo ? '🔊' : '🔇'}
          </button>
        </div>

        {/* Barra de Progreso Viva */}
        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden border border-slate-200 p-0.5">
          <div
            className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-500 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${porcentajeProgreso}%` }}
          />
        </div>
      </div>

      {/* Tarjeta Gigante del Desafío (Lista para Pantallas y Proyectores) */}
      <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-xl border-4 border-amber-200/80 relative">
        
        {/* Mascota con Globo de Diálogo Interactivo */}
        <div className="flex items-start gap-4 mb-6 bg-amber-50/90 border-2 border-amber-200 p-4 sm:p-5 rounded-3xl">
          <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 border-amber-300 shrink-0">
            {mascota.split(' ')[0] || '🦜'}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-black text-amber-800 uppercase tracking-wider">
                {mascota} te cuenta:
              </span>
              
              {ejercicio.pista && (
                <button
                  onClick={() => setMostrarPista(!mostrarPista)}
                  className="text-xs font-black bg-yellow-300 hover:bg-yellow-400 text-yellow-900 px-3 py-1 rounded-xl shadow-sm transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>💡</span> {mostrarPista ? 'Ocultar Pista' : 'Pedir Pista'}
                </button>
              )}
            </div>

            {ejercicio.contexto ? (
              <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed italic">
                "{ejercicio.contexto}"
              </p>
            ) : (
              <p className="text-slate-700 text-base font-bold">
                ¡Vamos clase, lean juntos y elijan la opción ganadora!
              </p>
            )}

            {mostrarPista && ejercicio.pista && (
              <div className="mt-2.5 p-3 bg-yellow-100/90 border border-yellow-300 rounded-2xl text-xs sm:text-sm font-bold text-yellow-900 animate-fade-in flex items-center gap-2">
                <span>🕵️ Pista Secreta:</span>
                <span>{ejercicio.pista}</span>
              </div>
            )}
          </div>
        </div>

        {/* Pregunta en Letra Grande y Clara */}
        <div className="mb-7">
          <h4 className="text-2xl sm:text-3xl font-black text-slate-800 leading-snug tracking-tight">
            {ejercicio.pregunta}
          </h4>
        </div>

        {/* Opciones de Respuesta en Botones Grandes 3D (Estilo Kahoot / Juego de Mesa) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-7">
          {ejercicio.opciones.map((opcion, index) => {
            const configColor = coloresOpciones[index % coloresOpciones.length];
            const esSeleccionada = opcionSeleccionada === opcion.id;
            const esCorrecta = opcion.id === ejercicio.respuestaCorrecta;

            // Clases de validación visual verde/rojo
            let aspecto = "bg-white text-slate-800 border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-md";

            if (estadoValidacion === null) {
              if (esSeleccionada) {
                aspecto = "bg-sky-500 text-white border-sky-700 shadow-lg scale-[1.02] ring-4 ring-sky-200";
              }
            } else {
              if (esCorrecta) {
                aspecto = "bg-emerald-500 text-white border-emerald-700 ring-4 ring-emerald-200 shadow-xl scale-[1.02] animate-bounce";
              } else if (esSeleccionada && !esCorrecta) {
                aspecto = "bg-rose-500 text-white border-rose-700 ring-4 ring-rose-200 shadow-md opacity-90";
              } else {
                aspecto = "bg-slate-100 text-slate-400 border-slate-200 opacity-40";
              }
            }

            return (
              <button
                key={opcion.id}
                onClick={() => handleSeleccionarOpcion(opcion.id)}
                disabled={estadoValidacion !== null}
                className={`p-5 sm:p-6 rounded-3xl border-b-6 font-black text-lg sm:text-xl text-left transition-all duration-150 flex items-center gap-4 cursor-pointer active:border-b-0 active:translate-y-1 disabled:cursor-default ${aspecto}`}
              >
                {/* Insignia A, B, C, D */}
                <span className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 shadow-sm ${
                  esSeleccionada || (estadoValidacion && esCorrecta)
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-100 text-slate-700 border border-slate-300'
                }`}>
                  {configColor.letra}
                </span>

                <span className="flex-1 leading-snug">{opcion.texto}</span>

                {/* Iconos de retroalimentación inmediata */}
                {estadoValidacion !== null && esCorrecta && (
                  <span className="text-3xl font-black shrink-0 animate-ping">✨</span>
                )}
                {estadoValidacion !== null && esSeleccionada && !esCorrecta && (
                  <span className="text-3xl font-black shrink-0">❌</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Retroalimentación Pedagógica Inmediata en el Salón */}
        {estadoValidacion !== null && (
          <div
            className={`p-6 rounded-3xl border-4 mb-7 animate-fade-in ${
              estadoValidacion === 'correcta'
                ? 'bg-emerald-100 border-emerald-400 text-emerald-950 shadow-emerald-100'
                : 'bg-rose-100 border-rose-400 text-rose-950 shadow-rose-100'
            }`}
          >
            <div className="flex items-center gap-3 font-black text-xl mb-2">
              <span className="text-3xl">
                {estadoValidacion === 'correcta' ? '🎉' : '🌱'}
              </span>
              <span>
                {estadoValidacion === 'correcta'
                  ? '¡CORRECTO, GRAN TRABAJO DE EQUIPO!'
                  : '¡CASI LO LOGRAN! VUELVAN A LEER:'}
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold leading-relaxed">
              {ejercicio.explicacion}
            </p>
          </div>
        )}

        {/* Botón de Acción Principal (Enorme y con Sensación 3D) */}
        <div>
          {estadoValidacion === null ? (
            <button
              onClick={handleVerificar}
              disabled={opcionSeleccionada === null}
              className={`w-full py-5 sm:py-6 px-8 rounded-3xl font-black text-xl sm:text-2xl transition-all duration-150 flex items-center justify-center gap-3 border-b-6 ${
                opcionSeleccionada !== null
                  ? 'bg-emerald-500 hover:bg-emerald-600 active:border-b-0 active:translate-y-1 text-white border-emerald-700 shadow-xl shadow-emerald-200 cursor-pointer animate-pulse'
                  : 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed shadow-none'
              }`}
            >
              <span>🚀</span> ¡Comprobar Respuesta del Salón!
            </button>
          ) : (
            <button
              onClick={handleSiguiente}
              className="w-full py-5 sm:py-6 px-8 rounded-3xl font-black text-xl sm:text-2xl bg-amber-500 hover:bg-amber-600 active:border-b-0 active:translate-y-1 text-white border-b-6 border-amber-700 shadow-xl shadow-amber-200 transition-all duration-150 flex items-center justify-center gap-3 cursor-pointer"
            >
              {indiceActual + 1 < totalPreguntas ? (
                <><span>Siguiente Desafío</span> ➔</>
              ) : (
                <><span>Ver Nuestro Gran Trofeo</span> 🏆</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
