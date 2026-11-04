import React from 'react';
import { sounds } from '../../utils/audio';

export default function GeneradorFichas({ guia, gradoNombre }) {
  const imprimir = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Barra de control para el maestro */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-3 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Ficha Pedagógica Formal para Imprimir o Proyectar
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
            Ficha de Trabajo de Aula: {guia.numero}
          </h3>
          <p className="text-xs text-slate-500 font-bold">
            Formato oficial listo para fotocopiar, imprimir o proyectar en clase.
          </p>
        </div>

        <button
          onClick={imprimir}
          className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm rounded-2xl shadow-lg border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🖨️</span> ¡Imprimir Hoja de Trabajo!
        </button>
      </div>

      {/* DOCUMENTO DE FICHA ESCOLAR IMPRIMIBLE (Estilo Hoja de Cuaderno/Examen) */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-slate-300 max-w-4xl mx-auto text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Encabezado Institucional */}
        <div className="border-b-2 border-slate-800 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              INSTITUCIÓN EDUCATIVA
            </h2>
            <p className="text-xs font-bold text-slate-600 uppercase">
              Área de Lengua Castellana y Literatura • {gradoNombre}
            </p>
          </div>
          <div className="text-right text-xs font-extrabold bg-slate-100 p-2.5 rounded-xl border border-slate-300">
            <span>Guía N°: <strong>{guia.numero}</strong></span> | <span>Periodo Vigente</span>
          </div>
        </div>

        {/* Campos del Estudiante */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-bold bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Nombre del Estudiante:</span>
            <span className="border-b border-dotted border-slate-400 block h-6 w-full" />
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Grado y Grupo:</span>
            <span className="border-b border-dotted border-slate-400 block h-6 w-full" />
          </div>
          <div>
            <span className="text-slate-400 uppercase text-[10px] block">Fecha de Realización:</span>
            <span className="border-b border-dotted border-slate-400 block h-6 w-full" />
          </div>
        </div>

        {/* Tema y DBA Oficial */}
        <div className="border-l-4 border-amber-500 pl-4 py-1 text-xs">
          <span className="font-black uppercase text-amber-700">Tema Central: {guia.titulo}</span>
          <p className="text-slate-600 font-medium mt-0.5"><strong>DBA:</strong> {guia.dba || "Aplica conocimientos gramaticales y literarios en contextos comunicativos reales."}</p>
        </div>

        {/* Actividad 1: Lectura y Subrayado */}
        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase bg-slate-100 p-2 rounded-xl text-slate-800">
            Actividad 1. Lectura Comprensiva y Vocabulario (15 Minutos)
          </h4>
          <p className="text-xs sm:text-sm leading-relaxed p-4 bg-slate-50 rounded-2xl italic border border-slate-200">
            "{guia.leccion?.lectura?.slice(0, 420)}..."
          </p>
          <p className="text-xs font-bold text-slate-600 pl-2">
            ➔ <em>Instrucción: Lee el texto con atención y subraya con color rojo tres palabras que no conozcas. Búscalas con el profesor y escribe su significado abajo.</em>
          </p>
          <div className="border-b border-slate-200 h-6" />
          <div className="border-b border-slate-200 h-6" />
        </div>

        {/* Actividad 2: Conceptos y Relaciones */}
        <div className="space-y-3">
          <h4 className="font-black text-sm uppercase bg-slate-100 p-2 rounded-xl text-slate-800">
            Actividad 2. Taller de Aplicación de Conceptos (20 Minutos)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black block text-slate-700">A. Explica con tus propias palabras:</span>
              <p className="text-slate-500 text-[11px]">¿Cuál es la idea más importante que nos enseña este texto?</p>
              <div className="border-b border-slate-200 h-8" />
              <div className="border-b border-slate-200 h-8" />
            </div>
            <div className="p-3 rounded-2xl border border-slate-200 space-y-2">
              <span className="font-black block text-slate-700">B. Aplicación en la Vereda:</span>
              <p className="text-slate-500 text-[11px]">¿Cómo puedes aplicar esta enseñanza en tu casa o con tus vecinos?</p>
              <div className="border-b border-slate-200 h-8" />
              <div className="border-b border-slate-200 h-8" />
            </div>
          </div>
        </div>

        {/* Actividad 3: Expresión Gráfica y Creativa */}
        <div className="space-y-2">
          <h4 className="font-black text-sm uppercase bg-slate-100 p-2 rounded-xl text-slate-800">
            Actividad 3. Expresión Artística y Creativa (15 Minutos)
          </h4>
          <p className="text-xs font-bold text-slate-600 pl-2">
            ➔ <em>Dibuja en el recuadro una escena del relato y decórala con elementos naturales o colores.</em>
          </p>
          <div className="w-full h-44 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">
            [Espacio para Dibujo e Ilustración del Estudiante]
          </div>
        </div>

        {/* Rúbrica de Autoevaluación del Niño */}
        <div className="border-t-2 border-slate-300 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-bold">
          <span className="text-slate-500">¿Cómo sentiste tu trabajo hoy?:</span>
          <div className="flex gap-4">
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" /> <span>😃 ¡Excelente!</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" /> <span>🤔 ¡Aprendí algo nuevo!</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" /> <span>💪 ¡Puedo mejorar!</span>
            </label>
          </div>
          <div className="text-right">
            <span>Firma del Docente: __________________</span>
          </div>
        </div>

      </div>
    </div>
  );
}
