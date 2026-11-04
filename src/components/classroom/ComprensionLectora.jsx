import React, { useState } from 'react';
import { sounds } from '../../utils/audio';

export default function ComprensionLectora({ lecturaTitulo = "Lectura de Clase", preguntas = null }) {
  const [nivelActivo, setNivelActivo] = useState('literal'); // 'literal' | 'inferencial' | 'critico'
  const [respuestasVisibles, setRespuestasVisibles] = useState({});
  const [conclusionesSalón, setConclusionesSalón] = useState('');

  const preguntasDefault = {
    literal: [
      {
        id: 'lit-1',
        pregunta: '¿Quiénes son los personajes principales del relato y en qué lugar se desarrolla la historia?',
        guiaRespuesta: 'Identificar a los personajes nombrados y el entorno geográfico rural.'
      },
      {
        id: 'lit-2',
        pregunta: '¿Cuál fue el primer obstáculo o situación inesperada que se presentó al inicio?',
        guiaRespuesta: 'Describir el acontecimiento inicial que alteró la tranquilidad del relato.'
      },
      {
        id: 'lit-3',
        pregunta: '¿Qué acciones específicas realizaron los protagonistas para resolver la dificultad?',
        guiaRespuesta: 'Enumerar los pasos o decisiones tomadas por los personajes.'
      }
    ],
    inferencial: [
      {
        id: 'inf-1',
        pregunta: '¿Qué motivos internos o sentimientos impulsaron a los personajes a actuar de esa manera?',
        guiaRespuesta: 'Deducir emociones no explícitas (miedo, generosidad, valentía, apego a la tierra).'
      },
      {
        id: 'inf-2',
        pregunta: '¿Qué creen que habría ocurrido en la vereda si nadie hubiera tomado la iniciativa de actuar?',
        guiaRespuesta: 'Imaginar un desenlace alternativo de consecuencias comunitarias o ambientales.'
      },
      {
        id: 'inf-3',
        pregunta: '¿Qué simbolizan los elementos de la naturaleza (el río, la montaña, el árbol) en este texto?',
        guiaRespuesta: 'Conectar el elemento natural con valores de vida, memoria y sustento.'
      }
    ],
    critico: [
      {
        id: 'cri-1',
        pregunta: '¿Están de acuerdo con la decisión final que tomaron los personajes? ¿Qué habrían hecho ustedes?',
        guiaRespuesta: 'Construir una opinión ética argumentada desde la experiencia del estudiante.'
      },
      {
        id: 'cri-2',
        pregunta: '¿Cómo se relaciona el mensaje de esta historia con la vida cotidiana y el cuidado de nuestra propia vereda?',
        guiaRespuesta: 'Vincular la lectura con la realidad de su escuela, su familia y sus fuentes de agua.'
      },
      {
        id: 'cri-3',
        pregunta: '¿Qué propuesta le harían a los líderes de la comunidad para aplicar la enseñanza de este texto?',
        guiaRespuesta: 'Plantear una acción ciudadana transformadora y colaborativa.'
      }
    ]
  };

  const listaActual = preguntas ? preguntas[nivelActivo] || preguntasDefault[nivelActivo] : preguntasDefault[nivelActivo];

  const toggleRespuesta = (id) => {
    sounds.playClick();
    setRespuestasVisibles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-xl border-4 border-teal-300 space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🧠</span>
          <div>
            <span className="text-xs font-black text-teal-700 uppercase tracking-widest bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Taller de Análisis Profundo de Lectura (20-30 Minutos)
            </span>
            <h3 className="text-2xl font-black text-slate-800 mt-1">
              Comprensión Lectora en Tres Niveles
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              Texto de análisis: <em>{lecturaTitulo}</em>
            </p>
          </div>
        </div>

        {/* Selector de Nivel de Pensamiento */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => { sounds.playClick(); setNivelActivo('literal'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              nivelActivo === 'literal'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟢 Literal
          </button>
          <button
            onClick={() => { sounds.playClick(); setNivelActivo('inferencial'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              nivelActivo === 'inferencial'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟡 Inferencial
          </button>
          <button
            onClick={() => { sounds.playClick(); setNivelActivo('critico'); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
              nivelActivo === 'critico'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔴 Crítico
          </button>
        </div>
      </div>

      {/* Explicación del Nivel Pedagógico Activo */}
      <div className={`p-4 rounded-2xl border-2 text-sm font-bold flex items-center gap-3 ${
        nivelActivo === 'literal'
          ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
          : nivelActivo === 'inferencial'
          ? 'bg-amber-50 border-amber-300 text-amber-900'
          : 'bg-rose-50 border-rose-300 text-rose-900'
      }`}>
        <span className="text-2xl">
          {nivelActivo === 'literal' ? '🔍' : nivelActivo === 'inferencial' ? '💡' : '⚖️'}
        </span>
        <div>
          <span className="font-black uppercase tracking-wider block text-xs">
            {nivelActivo === 'literal' ? 'Nivel 1: Comprensión Literal' : nivelActivo === 'inferencial' ? 'Nivel 2: Comprensión Inferencial' : 'Nivel 3: Comprensión Crítica y Valorativa'}
          </span>
          <p className="text-xs sm:text-sm mt-0.5">
            {nivelActivo === 'literal'
              ? 'Preguntas directas sobre lo que está escrito explícitamente en el texto (hechos, nombres, lugares y tiempos).'
              : nivelActivo === 'inferencial'
              ? 'Preguntas para deducir lo que el autor sugiere entre líneas (causas, motivos, simbolismos e hipótesis).'
              : 'Preguntas de juicio, debate ciudadano y valoración personal frente a la realidad de nuestra comunidad veredal.'}
          </p>
        </div>
      </div>

      {/* Tarjetas de Preguntas Guiadas para el Aula */}
      <div className="space-y-4">
        {listaActual.map((item, index) => (
          <div
            key={item.id}
            className="bg-slate-50 border-2 border-slate-200 hover:border-teal-400 p-5 rounded-3xl transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-teal-600 text-white font-black text-sm flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <h4 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                  {item.pregunta}
                </h4>
              </div>

              <button
                onClick={() => toggleRespuesta(item.id)}
                className="text-xs font-black bg-white hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-300 shadow-sm shrink-0 cursor-pointer"
              >
                {respuestasVisibles[item.id] ? 'Ocultar Guía' : '💡 Guía Docente'}
              </button>
            </div>

            {respuestasVisibles[item.id] && (
              <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-2xl text-xs sm:text-sm font-semibold text-teal-950 animate-fade-in">
                <strong>Pauta Pedagógica para el Profesor:</strong> {item.guiaRespuesta}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pizarra de Conclusiones del Aula */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-3 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">📝</span>
            <h4 className="font-black text-amber-300 text-sm sm:text-base">
              Conclusiones Colectivas del Salón (Para copiar en el cuaderno)
            </h4>
          </div>
          <button
            onClick={() => setConclusionesSalón('')}
            className="text-[11px] text-slate-400 hover:text-rose-400 font-bold cursor-pointer"
          >
            Borrar
          </button>
        </div>

        <textarea
          value={conclusionesSalón}
          onChange={(e) => setConclusionesSalón(e.target.value)}
          placeholder="El profesor o un relator estudiantil escribe aquí el acuerdo del debate de la clase..."
          rows={3}
          className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-2xl text-sm font-medium text-white placeholder-slate-500 focus:border-amber-400 outline-none"
        />
      </div>
    </div>
  );
}
