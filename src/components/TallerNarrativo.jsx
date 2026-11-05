import React, { useState } from 'react';
import { sounds } from '../utils/audio';
import { lanzarConfeti } from '../utils/confetti';

export default function TallerNarrativo() {
  const [personaje, setPersonaje] = useState('Un valiente niño campesino');
  const [lugar, setLugar] = useState('un bosque de niebla y frailejones');
  const [conflicto, setConflicto] = useState('encontró una semilla mágica que no germinaba');
  const [solucion, setSolucion] = useState('con el canto de los pájaros y agua limpia del manantial');
  const [historiaGenerada, setHistoriaGenerada] = useState(false);

  const opcionesPersonajes = [
    { label: ' Un valiente niño campesino', val: 'Un valiente niño campesino llamado Mateo' },
    { label: ' Un jaguar dorado y sabio', val: 'Un majestuoso jaguar dorado y sabio guardián del monte' },
    { label: ' La Madremonte protectora', val: 'La Madremonte vestida de enredaderas y musgo verde' },
    { label: ' Una anciana pescadora del río', val: 'Doña Rosa, una sabia anciana pescadora del río grande' }
  ];

  const opcionesLugares = [
    { label: '️ El páramo de frailejones', val: 'las alturas del páramo donde nacen las nubes y el agua' },
    { label: ' Un bosque de niebla y arrayanes', val: 'un espeso bosque de niebla lleno de orquídeas y arrayanes' },
    { label: ' Las orillas del río cristalino', val: 'la orilla de un río cristalino que bajaba cantando de la sierra' },
    { label: ' El trapiche de la vereda', val: 'un viejo trapiche campesino donde el aire olía a caña dulce' }
  ];

  const opcionesConflictos = [
    { label: ' Una gran sequía amenazaba la huerta', val: 'una extraña sequía que marchitaba las matas de maíz' },
    { label: ' Un mapa misterioso escondido en un árbol', val: 'un antiguo pergamino con acertijos sobre tesoros de la naturaleza' },
    { label: ' El canto de un búho alertó un peligro', val: 'el silencio repentino de los animales que advertía la llegada de taladores' }
  ];

  const opcionesSoluciones = [
    { label: ' Sembrando árboles con toda la comunidad', val: 'reuniendo a todos los vecinos de la vereda para plantar cientos de árboles nativos' },
    { label: ' Cantando una copla ancestral al manantial', val: 'entonando una vieja copla campesina que devolvió la alegría a las aguas' },
    { label: ' Compartiendo semillas con humildad', val: 'demostrando que la generosidad y el cuidado mutuo vencen cualquier dificultad' }
  ];

  const crearHistoria = () => {
    sounds.playCorrect();
    lanzarConfeti();
    setHistoriaGenerada(true);
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-9 shadow-xl border-4 border-amber-300 space-y-6">
      <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-4">
        <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-3xl border border-amber-300">
          ️
        </div>
        <div>
          <span className="text-xs font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Laboratorio de Escritura Creativa
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1">
            Taller de Creación Narrativa y Cuentos
          </h3>
        </div>
      </div>

      <p className="text-slate-600 text-sm font-bold">
        Elige en grupo los 4 ingredientes de tu historia y pulsa el botón para ver cómo cobra vida en el proyector:
      </p>

      {/* Selectores Interactivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            1. ¿Quién es el Protagonista?
          </label>
          <select
            value={personaje}
            onChange={(e) => setPersonaje(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:border-amber-500 outline-none"
          >
            {opcionesPersonajes.map((op, i) => (
              <option key={i} value={op.val}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            2. ¿Dónde Ocurre la Aventura?
          </label>
          <select
            value={lugar}
            onChange={(e) => setLugar(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:border-amber-500 outline-none"
          >
            {opcionesLugares.map((op, i) => (
              <option key={i} value={op.val}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            3. ¿Cuál es el Conflicto o Reto?
          </label>
          <select
            value={conflicto}
            onChange={(e) => setConflicto(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:border-amber-500 outline-none"
          >
            {opcionesConflictos.map((op, i) => (
              <option key={i} value={op.val}>{op.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
            4. ¿Cómo se Resuelve la Misión?
          </label>
          <select
            value={solucion}
            onChange={(e) => setSolucion(e.target.value)}
            className="w-full p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-800 text-sm focus:border-amber-500 outline-none"
          >
            {opcionesSoluciones.map((op, i) => (
              <option key={i} value={op.val}>{op.label}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={crearHistoria}
        className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-lg rounded-2xl shadow-lg border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span></span> ¡Crear Cuento en Pantalla!
      </button>

      {/* Relato Generado en Vivo */}
      {historiaGenerada && (
        <div className="bg-amber-50 border-3 border-amber-300 p-6 sm:p-8 rounded-3xl animate-fade-in space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-800 uppercase tracking-widest bg-amber-200 px-3 py-1 rounded-full">
              ¡Cuento Colectivo del Salón!
            </span>
            <button
              onClick={() => window.print()}
              className="text-xs font-black bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm"
            >
              ️ Imprimir Ficha
            </button>
          </div>

          <h4 className="text-xl sm:text-2xl font-black text-slate-800">
            La Aventura en {lugar}
          </h4>

          <p className="text-slate-700 text-base sm:text-lg font-medium leading-relaxed italic">
            "Cuentan que en <strong>{lugar}</strong> vivía <strong>{personaje}</strong>. Todos los días cuidaba con esmero cada sendero, hasta que un día sucedió algo inesperado: <strong>{conflicto}</strong>. Nadie sabía qué camino tomar, pero nuestro protagonista no se rindió y logró salvar la armonía del campo <strong>{solucion}</strong>. Desde aquel día, en la vereda nunca olvidaron que la unión y el respeto por la tierra hacen los verdaderos milagros."
          </p>
        </div>
      )}
    </div>
  );
}
