import React, { useState } from 'react';
import { sounds } from '../../utils/audio';

export default function BancoRetosAula() {
  const retosLargaDuracion = [
    {
      id: 1,
      titulo: 'El Noticiero Radial de la Vereda',
      duracion: '40 Minutos',
      icono: '',
      color: 'border-sky-400 bg-sky-50/70',
      objetivo: 'Desarrollar la expresión oral, redacción de noticias locales y trabajo en equipo.',
      roles: ['Presentador en Cabina', 'Reportero en el Río', 'Testigo Campesino', 'Sonidista de Efectos Vocales'],
      pasos: [
        '1. Organización (8 min): Dividir el salón en grupos de 4 estudiantes y asignar los roles.',
        '2. Redacción del Guion (15 min): Cada grupo escribe en su cuaderno una noticia real o fantástica sobre la vereda (ej: avistamiento de un oso de anteojos, gran cosecha de café).',
        '3. Ensayo de Sonidos (7 min): El sonidista practica hacer ruidos con hojas secas, palmas o silbidos.',
        '4. Emisión en Vivo frente al Salón (10 min): Cada grupo pasa al frente a transmitir su emisión radial usando un lápiz como micrófono.'
      ]
    },
    {
      id: 2,
      titulo: 'El Gran Duelo de Copleros y Trovadores',
      duracion: '30 Minutos',
      icono: '',
      color: 'border-amber-400 bg-amber-50/70',
      objetivo: 'Entrenar el ritmo poético, la rima consonante y la agilidad mental.',
      roles: ['Equipo 1: Los Pumas del Cerro', 'Equipo 2: Las Águilas del Valle', 'Jurado del Salón'],
      pasos: [
        '1. Calentamiento Rítmico (5 min): Todo el salón aplaude al compás de 4 tiempos.',
        '2. Preparación de Versos (10 min): Cada equipo escribe en una hoja 3 coplas de 4 versos sobre su escuela y su vereda.',
        '3. El Duelo en el Tablero (15 min): Por turnos, un representante pasa al frente a cantar su copla. El equipo rival debe responder con otra copla que rime en menos de 1 minuto.',
        '4. Votación Colectiva: El salón vota cuál fue la copla más ingeniosa con aplausos.'
      ]
    },
    {
      id: 3,
      titulo: 'El Juicio Ético a los Personajes de la Fábula',
      duracion: '45 Minutos',
      icono: '',
      color: 'border-emerald-400 bg-emerald-50/70',
      objetivo: 'Fomentar el pensamiento crítico, la argumentación oral y la resolución de dilemas.',
      roles: ['El Juez del Tribunal', 'Fiscal Acusador', 'Abogado Defensor', 'Personaje Acusado', 'Jurado Popular'],
      pasos: [
        '1. Planteamiento del Caso (5 min): El profesor lee la fábula (ej: La Cigarra y la Hormiga, o El Zorro y el Cuervo).',
        '2. Preparación de Argumentos (15 min): El grupo acusador escribe por qué el personaje actuó mal; el grupo defensor busca atenuantes y razones de su conducta.',
        '3. Audiencia en Vivo (20 min): Se organiza el aula como un tribunal: el juez da la palabra, los oradores exponen sus razones y el acusado declara.',
        '4. Sentencia y Reflexión (5 min): El jurado vota un veredicto y redactan en el cuaderno la lección de convivencia aprendida.'
      ]
    },
    {
      id: 4,
      titulo: 'Teatro de Sombras y Relatos Ancestrales',
      duracion: '45 Minutos',
      icono: '',
      color: 'border-purple-400 bg-purple-50/70',
      objetivo: 'Explorar la comunicación no verbal, la tradición oral y la expresión plástica.',
      roles: ['Narrador Oral', 'Manipuladores de Siluetas', 'Efectos de Luces y Sombras'],
      pasos: [
        '1. Recorte de Siluetas (15 min): Con cartulina y palitos de paleta, recortar figuras de la Madremonte, árboles, ríos o animales.',
        '2. Montaje del Escenario (5 min): Colocar una tela blanca o usar la pared del salón con una linterna o lámpara.',
        '3. Puesta en Escena (20 min): Proyectar las sombras mientras el narrador cuenta el mito o leyenda de la región con voz misteriosa.',
        '4. Conversatorio (5 min): Reflexión sobre cómo nuestros antepasados transmitían sus relatos en las noches sin electricidad.'
      ]
    }
  ];

  const [tallerSeleccionado, setTallerSeleccionado] = useState(retosLargaDuracion[0]);

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-xl border-4 border-indigo-300 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          
          <div>
            <span className="text-xs font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Banco de Dinámicas Extensas de Clase (30 a 45 Minutos)
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              Talleres y Proyectos de Aula para Sesiones Completas
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Diseñados para ocupar una clase completa con trabajo en equipo, debate y producción activa.
            </p>
          </div>
        </div>
      </div>

      {/* Selector de Dinámicas de Larga Duración */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {retosLargaDuracion.map((taller) => (
          <button
            key={taller.id}
            onClick={() => { sounds.playClick(); setTallerSeleccionado(taller); }}
            className={`p-4 rounded-3xl border-3 text-left transition-all cursor-pointer ${
              tallerSeleccionado.id === taller.id
                ? 'bg-indigo-600 text-white border-indigo-800 shadow-lg scale-105 font-black'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-indigo-400 font-bold'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{taller.icono}</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                tallerSeleccionado.id === taller.id ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-800'
              }`}>
                 {taller.duracion}
              </span>
            </div>
            <h4 className="text-sm sm:text-base leading-snug">{taller.titulo}</h4>
          </button>
        ))}
      </div>

      {/* Ficha Guía Completa de la Dinámica Seleccionada */}
      <div className={`p-6 sm:p-8 rounded-3xl border-3 shadow-md space-y-6 animate-fade-in ${tallerSeleccionado.color}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-black/10 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-500">
              Proyecto de Aula en Vivo • Duración Estimada: {tallerSeleccionado.duracion}
            </span>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 mt-0.5">
              {tallerSeleccionado.titulo}
            </h4>
          </div>
          <span className="px-4 py-2 bg-white rounded-2xl text-xs font-black text-slate-800 border border-slate-300 shadow-sm">
             Objetivo: {tallerSeleccionado.objetivo}
          </span>
        </div>

        {/* Roles del Salón */}
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-slate-600 block mb-2">
            Equipos y Roles Asignados para los Niños:
          </span>
          <div className="flex flex-wrap gap-2">
            {tallerSeleccionado.roles.map((rol, i) => (
              <span key={i} className="bg-white border-2 border-slate-300 text-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-extrabold shadow-sm">
                 {rol}
              </span>
            ))}
          </div>
        </div>

        {/* Pasos y Cronograma de la Clase */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-slate-600 block">
            Cronograma Paso a Paso de la Sesión:
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {tallerSeleccionado.pasos.map((paso, idx) => (
              <div key={idx} className="bg-white/90 p-4 rounded-2xl border border-slate-200 shadow-sm text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                {paso}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
