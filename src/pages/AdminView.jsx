import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mallaData from '../data/mallaCurricularEspanol.json';
import { sounds } from '../utils/audio';
import { voiceReader } from '../utils/speech';
import { useAppTheme } from '../utils/theme';

export default function AdminView() {
  const navigate = useNavigate();
  const { tema } = useAppTheme();
  const gradosList = Object.values(mallaData.grados);

  // Pasos del flujo docente (Diapositiva 6: Cursos -> Contenido Multimedia -> Calificación)
  const [pasoActivo, setPasoActivo] = useState(1); // 1: Cursos, 2: Multimedia, 3: Calificación
  const [gradoSeleccionado, setGradoSeleccionado] = useState(gradosList[0]);

  // Lista de estudiantes para el aula rural multigrado
  const [estudiantes, setEstudiantes] = useState([
    { id: 1, nombre: 'Camilo Andrés Pérez', actividad: 'Letra A y Vocales', nota: 'Superior', medallas: 5 },
    { id: 2, nombre: 'Carmen Sofía Gómez', actividad: 'Sílabas Familia M', nota: 'Alto', medallas: 4 },
    { id: 3, nombre: 'Mateo Rincón', actividad: 'Cuento de la Selva', nota: 'Superior', medallas: 6 },
    { id: 4, nombre: 'Lucía Fernández', actividad: 'Reto de Ortografía', nota: 'Básico', medallas: 3 },
    { id: 5, nombre: 'Juan David Morales', actividad: 'Comprensión Lectora', nota: 'Alto', medallas: 5 },
  ]);

  const [nuevoEstudiante, setNuevoEstudiante] = useState('');
  const [guardadoExitoso, setGuardadoExitoso] = useState(false);

  const cambiarPaso = (nuevoPaso) => {
    sounds.playClick();
    setPasoActivo(nuevoPaso);
  };

  const seleccionarGrado = (g) => {
    sounds.playClick();
    setGradoSeleccionado(g);
    setPasoActivo(2); // Avanza automáticamente a Multimedia
  };

  const cambiarNotaEstudiante = (id, nuevaNota) => {
    sounds.playPop();
    setEstudiantes((prev) =>
      prev.map((e) => (e.id === id ? { ...e, nota: nuevaNota } : e))
    );
  };

  const agregarEstudiante = (e) => {
    e.preventDefault();
    if (!nuevoEstudiante.trim()) return;
    sounds.playClick();
    setEstudiantes((prev) => [
      ...prev,
      {
        id: Date.now(),
        nombre: nuevoEstudiante.trim(),
        actividad: 'Actividad Inicial',
        nota: 'Básico',
        medallas: 1,
      },
    ]);
    setNuevoEstudiante('');
  };

  const guardarPlanilla = () => {
    sounds.playFanfare();
    setGuardadoExitoso(true);
    voiceReader.speak("Planilla de calificaciones guardada correctamente.");
    setTimeout(() => setGuardadoExitoso(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* ══════════ ENCABEZADO (DIAPOSITIVA 6 DEL PROFESOR) ══════════ */}
      <div className={`${tema.headerBg} rounded-3xl p-5 sm:p-6 text-white ${tema.headerShadow} text-center border ${tema.headerBorder} transition-all duration-300`}>
        <span className={`inline-block ${tema.headerBadge} font-title font-black text-[10px] sm:text-xs uppercase tracking-widest px-3.5 py-1 rounded-full shadow-xs mb-2`}>
          GESTIÓN Y CALIFICACIÓN DE AULA MULTIGRADO
        </span>
        <h1 className="text-2xl sm:text-4xl font-title font-black uppercase tracking-wider drop-shadow-sm">
          ADMINISTRACIÓN DOCENTE
        </h1>
        <p className={`text-xs sm:text-sm font-semibold ${tema.headerSubtext} mt-1`}>
          Flujo de 3 pasos: Cursos → Contenido Multimedia → Calificación Opcional
        </p>
      </div>

      {/* ══════════ FLUJO LINEAL DE 3 PASOS (DIAPOSITIVA 6) ══════════ */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-slate-200/90">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          
          {/* Paso 1: Cursos */}
          <button
            onClick={() => cambiarPaso(1)}
            className={`p-4 rounded-2xl font-title font-black text-sm transition-all flex items-center justify-between cursor-pointer border ${
              pasoActivo === 1
                ? 'bg-slate-900 text-white border-blue-500 shadow-md scale-102 ring-2 ring-blue-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                1
              </span>
              <div className="text-left">
                <span className="block uppercase text-[10px] tracking-wider text-slate-400">Paso 1</span>
                <span>CURSOS</span>
              </div>
            </div>
            <span className="text-slate-400 font-black">→</span>
          </button>

          {/* Paso 2: Contenido Multimedia */}
          <button
            onClick={() => cambiarPaso(2)}
            className={`p-4 rounded-2xl font-title font-black text-sm transition-all flex items-center justify-between cursor-pointer border ${
              pasoActivo === 2
                ? 'bg-slate-900 text-white border-blue-500 shadow-md scale-102 ring-2 ring-blue-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                2
              </span>
              <div className="text-left">
                <span className="block uppercase text-[10px] tracking-wider text-slate-400">Paso 2</span>
                <span>CONTENIDO MULTIMEDIA</span>
              </div>
            </div>
            <span className="text-slate-400 font-black">→</span>
          </button>

          {/* Paso 3: Calificación Opcional */}
          <button
            onClick={() => cambiarPaso(3)}
            className={`p-4 rounded-2xl font-title font-black text-sm transition-all flex items-center justify-between cursor-pointer border ${
              pasoActivo === 3
                ? 'bg-slate-900 text-white border-blue-500 shadow-md scale-102 ring-2 ring-blue-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
                3
              </span>
              <div className="text-left">
                <span className="block uppercase text-[10px] tracking-wider text-slate-400">Paso 3</span>
                <span>CALIFICACIÓN (OPCIONAL)</span>
              </div>
            </div>
            <span className="text-emerald-500 font-black">✓</span>
          </button>

        </div>
      </div>

      {/* ══════════ CONTENIDO SEGÚN EL PASO ACTIVO ══════════ */}
      
      {/* ── PASO 1: SELECCIÓN DE CURSOS ── */}
      {pasoActivo === 1 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-title font-black text-blue-950">
                Selecciona el Grado o Curso que vas a gestionar:
              </h2>
              <p className="text-xs font-semibold text-blue-800 mt-0.5">
                Curso actualmente activo: <span className="underline font-bold">{gradoSeleccionado.nombre}</span>
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-title font-black text-sm">
              {gradoSeleccionado.numero}°
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {gradosList.map((g) => {
              const seleccionado = g.numero === gradoSeleccionado.numero;
              return (
                <button
                  key={g.numero}
                  onClick={() => seleccionarGrado(g)}
                  className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between h-32 active:scale-98 ${
                    seleccionado
                      ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-300'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center font-title font-black text-xs">
                      {g.numero}°
                    </span>
                    <span className={`text-[10px] font-title font-black uppercase px-2 py-0.5 rounded-full ${
                      seleccionado ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {g.nivel}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-title font-black text-base leading-tight">
                      {g.nombre}
                    </h3>
                    <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${
                      seleccionado ? 'text-blue-100' : 'text-slate-400'
                    }`}>
                      {g.lema}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── PASO 2: CONTENIDO MULTIMEDIA DEL CURSO SELECCIONADO ── */}
      {pasoActivo === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-title font-black text-lg">
                {gradoSeleccionado.numero}°
              </div>
              <div>
                <span className="text-[10px] font-title font-black uppercase text-blue-600 tracking-wider">
                  Curso Seleccionado
                </span>
                <h2 className="text-xl font-title font-black text-slate-900">
                  {gradoSeleccionado.nombre}
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  {gradoSeleccionado.lema}
                </p>
              </div>
            </div>

            <button
              onClick={() => cambiarPaso(1)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-title font-bold text-xs rounded-xl border border-slate-300 cursor-pointer"
            >
              Cambiar de Grado
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Recurso 1: Abecedario y Fonética Multimedia */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-title font-black text-base text-slate-900">
                  Abecedario y Fonética Interactiva
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  27 letras con pronunciación natural, sílabas sonoras y pizarra táctil para proyectar en el salón.
                </p>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    navigate(`/espanol/grado/${gradoSeleccionado.numero}`);
                  }}
                  className={`flex-1 py-2.5 px-4 ${tema.btnGradient} font-title font-black text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer`}
                >
                  Abrir en Modo Clase
                </button>
              </div>
            </div>

            {/* Recurso 2: Cuentos y Lecturas del Grado */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-title font-black text-base text-slate-900">
                  Cuentos, Fábulas y Mitos Narrados
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lecturas oficiales de la malla curricular con voz pedagógica, preguntas detonantes y talleres.
                </p>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    navigate(`/espanol/grado/${gradoSeleccionado.numero}`);
                  }}
                  className={`flex-1 py-2.5 px-4 ${tema.btnGradient} font-title font-black text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer`}
                >
                  Ver Lecturas
                </button>
              </div>
            </div>

            {/* Recurso 3: Juegos Didácticos Adaptados */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-title font-black text-base text-slate-900">
                  Arcade y Retos del Grado
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Actividades lúdicas para repasar ortografía, sílabas y vocabulario en grupo.
                </p>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    navigate(`/espanol/juegos?grado=${gradoSeleccionado.numero}`);
                  }}
                  className={`flex-1 py-2.5 px-4 ${tema.btnGradient} font-title font-black text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer`}
                >
                  Iniciar Juegos
                </button>
              </div>
            </div>

            {/* Recurso 4: Apoyo Pedagógico para el Docente */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-title font-black text-base text-slate-900">
                  Texto de Apoyo Docente & DBA
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Orientaciones del Ministerio, objetivos DBA y sugerencias de preguntas para dinamizar la clase.
                </p>
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => {
                    sounds.playClick();
                    cambiarPaso(3);
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-title font-black text-xs rounded-xl shadow-xs transition-colors text-center cursor-pointer"
                >
                  <span>Ir a Calificación →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── PASO 3: CALIFICACIÓN Y EVALUACIÓN (OPCIONAL) ── */}
      {pasoActivo === 3 && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-title font-black uppercase text-blue-600 tracking-wider">
                Registro del Aula Rural • {gradoSeleccionado.nombre}
              </span>
              <h2 className="text-xl font-title font-black text-slate-900">
                Planilla de Calificación y Desempeño
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Lleva el control de las actividades sin papeleos ni complicaciones
              </p>
            </div>

            <button
              onClick={guardarPlanilla}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-title font-black text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <span>Guardar Planilla</span>
            </button>
          </div>

          {guardadoExitoso && (
            <div className="p-3 bg-emerald-100 border border-emerald-400 rounded-2xl text-emerald-900 font-title font-black text-xs">
              <span>✓ Cambios guardados exitosamente en la memoria del dispositivo.</span>
            </div>
          )}

          {/* Tabla Limpia de Calificación */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-title font-black uppercase tracking-wider text-[11px] border-b border-slate-200">
                    <th className="py-3 px-4">Estudiante</th>
                    <th className="py-3 px-4">Última Actividad</th>
                    <th className="py-3 px-4 text-center">Medallas</th>
                    <th className="py-3 px-4 text-center">Calificación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {estudiantes.map((est) => (
                    <tr key={est.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-title font-black text-slate-800">
                        {est.nombre}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{est.actividad}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block bg-amber-100 text-amber-900 font-title font-black px-2.5 py-0.5 rounded-full text-[10px]">
                          {est.medallas} medallas
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                          {['Superior', 'Alto', 'Básico'].map((n) => (
                            <button
                              key={n}
                              onClick={() => cambiarNotaEstudiante(est.id, n)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-title font-black transition-all cursor-pointer ${
                                est.nota === n
                                  ? n === 'Superior'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : n === 'Alto'
                                    ? 'bg-blue-600 text-white shadow-xs'
                                    : 'bg-amber-500 text-white shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Agregar nuevo estudiante rápido */}
            <form onSubmit={agregarEstudiante} className="p-3 bg-slate-50 border-t border-slate-200 flex gap-2">
              <input
                type="text"
                value={nuevoEstudiante}
                onChange={(e) => setNuevoEstudiante(e.target.value)}
                placeholder="Nombre del nuevo estudiante..."
                className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-title font-black text-xs rounded-xl shadow-xs cursor-pointer"
              >
                + Agregar Estudiante
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
