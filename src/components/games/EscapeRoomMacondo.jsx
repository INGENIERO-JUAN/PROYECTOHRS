import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const SALAS_ESCAPE = [
  {
    id: 1,
    nombre: 'Sala 1: El Laboratorio de Melquíades',
    icono: '',
    historia: 'Has entrado al cuarto secreto del sabio gitano Melquíades. Los frascos de mercurio hierven solos y hay pergaminos flotando. Para abrir el candado de la puerta, debes descifrar el concepto cumbre del sabio que trajo los imanes y el hielo a Macondo.',
    enigma: '¿Cuál es el concepto clave de la literatura hispanoamericana que fusiona la realidad cotidiana con sucesos fantásticos tratados con total naturalidad?',
    opciones: [
      { texto: 'Realismo Mágico', correcta: true, explicacion: '¡Exacto! El Realismo Mágico hace que lo insólito ocurra con naturalidad, como alfombras voladoras o lluvia de flores amarillas.' },
      { texto: 'Ciencia Ficción Futurista', correcta: false, explicacion: 'La ciencia ficción se basa en tecnología y futuro, no en mitos y folclore cotidiano.' },
      { texto: 'Romanticismo Trágico', correcta: false, explicacion: 'El romanticismo exalta la nostalgia sentimental, como en María de Jorge Isaacs.' },
      { texto: 'Crónica Periodística Pura', correcta: false, explicacion: 'La crónica relata hechos reales sin elementos sobrenaturales.' }
    ],
    objetoDesbloqueado: ' La Llave de Hielo de Aureliano'
  },
  {
    id: 2,
    nombre: 'Sala 2: La Peste del Olvido y del Insomnio',
    icono: '',
    historia: 'Una extraña peste ha caído sobre el pueblo: los habitantes no pueden dormir y han empezado a olvidar el nombre y la función de las cosas. Aureliano Buendía cuelga letreros para recordar.',
    enigma: 'Ayuda a Aureliano a etiquetar la figura retórica correcta: En la frase "Llovió durante cuatro años, once meses y dos días", ¿qué figura de exageración deliberada y descomunal se está empleando?',
    opciones: [
      { texto: 'Hipérbole', correcta: true, explicacion: '¡Brillante! La hipérbole es una exageración deliberada para magnificar una idea o sentimiento.' },
      { texto: 'Símil o Comparación', correcta: false, explicacion: 'El símil utiliza nexos comparativos explícitos como "como" o "cual".' },
      { texto: 'Aliteración', correcta: false, explicacion: 'La aliteración es la repetición de sonidos consonánticos.' },
      { texto: 'Metonimia', correcta: false, explicacion: 'La metonimia designa una cosa con el nombre de otra por relación de causa o procedencia.' }
    ],
    objetoDesbloqueado: ' El Rótulo de la Memoria'
  },
  {
    id: 3,
    nombre: 'Sala 3: El Baúl de las Mariposas Amarillas',
    icono: '',
    historia: 'El aire se llena de mariposas doradas que anuncian la llegada de Mauricio Babilonia. Un baúl colonial de madera tallada bloquea la salida hacia el río de piedras blancas pulidas.',
    enigma: 'Identifica el OXÍMORON que desbloquea la cerradura del baúl (unión de dos términos contradictorios en una sola expresión):',
    opciones: [
      { texto: 'Un silencio atronador', correcta: true, explicacion: '¡Perfecto! "Silencio" y "atronador" son dos términos directamente contradictorios unidos en una misma frase.' },
      { texto: 'Tus ojos son como estrellas', correcta: false, explicacion: 'Eso es un símil o comparación.' },
      { texto: 'El viento silbaba en la colina', correcta: false, explicacion: 'Eso es una personificación o prosopopeya.' },
      { texto: 'Macondo era una aldea de veinte casas', correcta: false, explicacion: 'Eso es una descripción literal.' }
    ],
    objetoDesbloqueado: ' Amuleto de las Mariposas'
  },
  {
    id: 4,
    nombre: 'Sala 4: La Ciénaga y el Mito Ancestral',
    icono: '',
    historia: 'El suelo se transforma en ciénaga y manglares milenarios. Los espíritus de los ancianos indígenas cantan una leyenda sobre el origen de la luz y de las leyes de la selva amazónica colombiana.',
    enigma: '¿Cuál es el gran relato épico y mito sagrado indígena originario del río Vaupés y la Amazonía colombiana?',
    opciones: [
      { texto: 'La Leyenda de Yuruparí', correcta: true, explicacion: '¡Correcto! El mito de Yuruparí es la máxima epopeya indígena de la Amazonía colombiana sobre las leyes ancestrales.' },
      { texto: 'La Odisea de Homero', correcta: false, explicacion: 'La Odisea es de la Grecia antigua clásica.' },
      { texto: 'El Mío Cid Campeador', correcta: false, explicacion: 'El Cantar de Mío Cid es un poema épico medieval español.' },
      { texto: 'Las Mil y Una Noches', correcta: false, explicacion: 'Pertenece a la tradición literaria de Oriente Medio.' }
    ],
    objetoDesbloqueado: ' La Pluma Chamánica de Yuruparí'
  },
  {
    id: 5,
    nombre: 'Sala 5: La Biblioteca Virreinal de Santafé',
    icono: '',
    historia: 'Las paredes se cubren de anaqueles coloniales con manuscritos en tinta de nuez y candelabros de plata. Un escribano del siglo XVII te desafía a reconocer la obra cumbre de la Colonia en Colombia.',
    enigma: '¿Qué célebre crónica colonial de 1636, escrita por Juan Rodríguez Freyle, narra la conquista y los sucesos curiosos de Santafé de Bogotá?',
    opciones: [
      { texto: 'El Carnero', correcta: true, explicacion: '¡Exacto! "El Carnero" es la gran crónica colonial neogranadina que retrata la sociedad santafereña con picardía y rigor.' },
      { texto: 'Cien Años de Soledad', correcta: false, explicacion: 'García Márquez escribió en el siglo XX, no en la Colonia.' },
      { texto: 'La Vorágine', correcta: false, explicacion: 'José Eustasio Rivera publicó en 1924 sobre el caucho.' },
      { texto: 'Don Quijote de la Mancha', correcta: false, explicacion: 'Cervantes escribió su novela en España.' }
    ],
    objetoDesbloqueado: ' El Códice de Santafé de 1636'
  },
  {
    id: 6,
    nombre: 'Sala 6: El Viento que Todo lo Arrastra',
    icono: '',
    historia: 'El tiempo se pliega sobre sí mismo. Para escapar de Macondo antes de que el huracán bíblico arrastre el pueblo de la faz de la tierra, debes ordenar las cuatro grandes épocas de las letras colombianas.',
    enigma: '¿Cuál es la secuencia cronológica correcta de la literatura en Colombia y América Latina?',
    opciones: [
      {
        texto: '1. Indígena Precolombina  2. Conquista y Colonia  3. Romanticismo e Independencia  4. Boom Latinoamericano',
        correcta: true,
        explicacion: '¡Extraordinario! Mitos ancestrales (Yuruparí), Crónicas de Indias (El Carnero), Romanticismo del siglo XIX (María), y el Boom del siglo XX.'
      },
      {
        texto: '1. Boom Latinoamericano  2. Conquista  3. Precolombino  4. Modernismo',
        correcta: false,
        explicacion: 'El orden está invertido; el Boom ocurrió en el siglo XX.'
      },
      {
        texto: '1. Romanticismo  2. Vanguardias  3. Precolombino  4. Barroco',
        correcta: false,
        explicacion: 'El periodo precolombino es el origen ancestral previo a la llegada europea.'
      },
      {
        texto: '1. Conquista  2. Poesía Contemporánea  3. Leyendas Muiscas  4. Independencia',
        correcta: false,
        explicacion: 'Las leyendas indígenas precedieron por miles de años a la Conquista.'
      }
    ],
    objetoDesbloqueado: ' El Pergamino Descifrado de Melquíades'
  }
];

export default function EscapeRoomMacondo() {
  const [salaIndex, setSalaIndex] = useState(0);
  const [inventario, setInventario] = useState([]);
  const [tiempo, setTiempo] = useState(240); // 4 minutos
  const [puntos, setPuntos] = useState(0);
  const [seleccion, setSeleccion] = useState(null);
  const [acierto, setAcierto] = useState(null);
  const [escapado, setEscapado] = useState(false);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  const sala = SALAS_ESCAPE[salaIndex];

  // Temporizador general de escape
  useEffect(() => {
    if (escapado || tiempoAgotado) return;

    if (tiempo <= 0) {
      setTiempoAgotado(true);
      sounds.playWrong();
      voiceReader.speak('¡El tiempo se ha agotado en Macondo! El huracán cerró las puertas.');
      return;
    }

    const timer = setInterval(() => {
      setTiempo((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempo, escapado, tiempoAgotado]);

  const narrarSala = () => {
    sounds.playClick();
    voiceReader.speak(`${sala.nombre}. ${sala.historia}. Pregunta de la cerradura: ${sala.enigma}`);
  };

  const intentarDesbloqueo = (opcion) => {
    if (seleccion !== null) return;
    setSeleccion(opcion.texto);

    if (opcion.correcta) {
      sounds.playCorrect();
      sounds.playPop();
      setAcierto(true);
      const puntosSala = 250 + Math.max(0, tiempo);
      setPuntos((p) => p + puntosSala);
      setInventario((inv) => [...inv, sala.objetoDesbloqueado]);
      GameProgress.addXP(puntosSala, 'escape_macondo');

      setTimeout(() => {
        voiceReader.speak(`¡Cerradura abierta! Desbloqueaste: ${sala.objetoDesbloqueado}. ${opcion.explicacion}`);
      }, 300);
    } else {
      sounds.playWrong();
      setAcierto(false);
      setTiempo((t) => Math.max(0, t - 20)); // Penalización de tiempo

      setTimeout(() => {
        voiceReader.speak(`Cerradura trabada. Pierdes 20 segundos. ${opcion.explicacion}`);
      }, 300);
    }
  };

  const avanzarSala = () => {
    sounds.playClick();
    if (salaIndex + 1 < SALAS_ESCAPE.length) {
      setSalaIndex((s) => s + 1);
      setSeleccion(null);
      setAcierto(null);
    } else {
      setEscapado(true);
      sounds.playFanfare();
      lanzarConfeti();
      GameProgress.registrarVictoria(6);
      voiceReader.speak('¡Increíble proeza literaria! Has escapado del Laberinto de Macondo descifrando todos los pergaminos.');
    }
  };

  const reiniciarEscape = () => {
    sounds.playClick();
    setSalaIndex(0);
    setInventario([]);
    setTiempo(240);
    setPuntos(0);
    setSeleccion(null);
    setAcierto(null);
    setEscapado(false);
    setTiempoAgotado(false);
  };

  const formatTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-amber-950/30 to-indigo-950 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-yellow-400 text-white space-y-6">
      {/* Header del Escape Room */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-yellow-600/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
             Aventura Literaria de Escape (6° a 9°)
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center gap-2">
             Escape Room Macondo: El Laberinto
          </h3>
          <p className="text-xs sm:text-sm text-yellow-200 font-semibold">
            Cámara {salaIndex + 1} de {SALAS_ESCAPE.length} • Resuelve los enigmas de la literatura viva antes de que el huracán lo borre todo
          </p>
        </div>

        {/* Cronómetro y Puntos */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-2xl border-2 border-yellow-400 text-center">
            <span className="text-[10px] font-black text-yellow-400 uppercase tracking-widest block">Puntos</span>
            <span className="text-xl sm:text-2xl font-black text-white"> {puntos}</span>
          </div>

          <div
            className={`w-24 h-14 rounded-2xl flex items-center justify-center font-black text-xl border-2 shadow-inner tabular-nums ${
              tiempo <= 45
                ? 'bg-rose-600 text-white border-rose-300 animate-pulse'
                : 'bg-indigo-950 text-yellow-300 border-yellow-500'
            }`}
          >
             {formatTiempo(tiempo)}
          </div>
        </div>
      </div>

      {/* Inventario de Objetos Mágicos Desbloqueados */}
      <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-yellow-500/40 flex flex-wrap items-center gap-3">
        <span className="text-xs font-black uppercase tracking-wider text-yellow-400 shrink-0">
           Reliquias Desbloqueadas:
        </span>
        {inventario.length === 0 ? (
          <span className="text-xs text-slate-400 italic">Tu mochila está vacía. ¡Abre la primera cámara!</span>
        ) : (
          inventario.map((obj, i) => (
            <span key={i} className="text-xs font-black bg-yellow-400/20 text-yellow-300 px-3 py-1 rounded-full border border-yellow-400/40 animate-pop">
              {obj}
            </span>
          ))
        )}
      </div>

      {/* Pantalla Final de Escape Exitoso */}
      {escapado ? (
        <div className="bg-slate-900/95 border-4 border-yellow-400 rounded-3xl p-8 text-center space-y-5 animate-fade-in max-w-xl mx-auto shadow-2xl">
          
          <h4 className="text-3xl font-black text-yellow-400">¡ESCAPASTE DE MACONDO!</h4>
          <p className="text-slate-200 font-semibold text-base">
            Has descifrado los pergaminos de Melquíades y salvado la memoria de la literatura colombiana.
          </p>
          <div className="text-4xl font-black text-emerald-400">
            {puntos} PUNTOS DE GLORIA 
          </div>
          <button
            onClick={reiniciarEscape}
            className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
             Jugar el Laberinto Otra Vez
          </button>
        </div>
      ) : tiempoAgotado ? (
        <div className="bg-rose-950/90 border-4 border-rose-500 rounded-3xl p-8 text-center space-y-4 animate-fade-in max-w-xl mx-auto shadow-2xl">
          <span className="text-7xl block"></span>
          <h4 className="text-3xl font-black text-white">¡EL HURACÁN BORRÓ EL CAMINO!</h4>
          <p className="text-rose-200 font-semibold text-sm">
            Se agotó el tiempo de escape. ¡No te rindas y vuelve a intentarlo!
          </p>
          <button
            onClick={reiniciarEscape}
            className="px-8 py-3.5 bg-rose-500 hover:bg-rose-400 text-white font-black text-base rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
          >
             Reintentar Escape
          </button>
        </div>
      ) : (
        <>
          {/* Cámara Activa */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950/70 to-slate-900 rounded-3xl p-6 sm:p-8 border-3 border-yellow-500/80 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-indigo-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{sala.icono}</span>
                <div>
                  <span className="text-xs font-black text-yellow-400 uppercase tracking-widest block">
                    Cámara {salaIndex + 1} de {SALAS_ESCAPE.length}
                  </span>
                  <h4 className="text-xl sm:text-2xl font-black text-white">{sala.nombre}</h4>
                </div>
              </div>

              <button
                onClick={narrarSala}
                className="px-3.5 py-1.5 bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/50 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                 Escuchar Historia
              </button>
            </div>

            {/* Narración Inmersiva de la Habitación */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-indigo-900/60">
              {sala.historia}
            </p>

            {/* El Enigma de la Cerradura */}
            <div className="p-4 sm:p-5 bg-yellow-950/40 rounded-2xl border-2 border-yellow-500/60">
              <span className="text-xs font-black text-yellow-400 uppercase tracking-wider block mb-1">
                 Enigma de la Cerradura Mágica:
              </span>
              <p className="text-base sm:text-lg font-black text-white">{sala.enigma}</p>
            </div>

            {/* Feedback de Apertura */}
            {acierto !== null && (
              <div
                className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 animate-slide-down ${
                  acierto
                    ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
                    : 'bg-rose-950/90 text-rose-200 border-rose-400'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{acierto ? '' : ''}</span>
                  <div>
                    <h5 className="font-black text-base">
                      {acierto ? '¡CERRADURA DESBLOQUEADA!' : '¡MECANISMO TRABADO! (-20 segundos)'}
                    </h5>
                    <p className="text-xs font-semibold">
                      {sala.opciones.find((o) => o.texto === seleccion)?.explicacion}
                    </p>
                  </div>
                </div>

                {acierto && (
                  <button
                    onClick={avanzarSala}
                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    Cruzar a la Siguiente Cámara 
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Opciones de la Cerradura */}
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-300 block">
              Elige la clave lógica para activar los engranajes:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sala.opciones.map((op, i) => {
                const esSeleccionada = seleccion === op.texto;
                let estilo = 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700';

                if (seleccion !== null) {
                  if (op.correcta) {
                    estilo = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/50 scale-102';
                  } else if (esSeleccionada) {
                    estilo = 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/50';
                  } else {
                    estilo = 'bg-slate-900/50 text-slate-400 border-slate-800 opacity-60';
                  }
                }

                return (
                  <button
                    key={i}
                    disabled={seleccion !== null}
                    onClick={() => intentarDesbloqueo(op)}
                    className={`p-4 rounded-2xl border-3 text-left transition-all duration-150 flex items-start gap-3 select-none active:scale-98 cursor-pointer ${estilo}`}
                  >
                    
                    <span className="font-bold text-sm sm:text-base leading-snug">{op.texto}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
