import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const COPLAS_BATALLA = [
  {
    id: 1,
    verso1: 'Ayer pasé por tu casa',
    verso2: 'y me tiraste un limón...',
    rimaClave: '-ón',
    opciones: [
      { texto: 'el limón cayó en el suelo y el jugo en mi corazón.', correcta: true, explicacion: 'Rima consonante perfecta en -ón (limón / corazón).' },
      { texto: 'me comí una mandarina con azúcar y con pan.', correcta: false, explicacion: 'Termina en -an, no rima con limón.' },
      { texto: 'me puse a mirar la luna que brillaba en el tejado.', correcta: false, explicacion: 'Termina en -ado, sin rima musical.' },
      { texto: 'el camino estaba solo y me fui para la escuela.', correcta: false, explicacion: 'Termina en -ela, métrica no coincidente.' }
    ],
    tema: 'Copla Tradicional',
    icono: ''
  },
  {
    id: 2,
    verso1: 'En las selvas colombianas',
    verso2: 'cuida bien la Madremonte...',
    rimaClave: '-onte',
    opciones: [
      { texto: 'los arroyos cristalinos que bajan del horizonte.', correcta: true, explicacion: 'Rima perfecta en -onte (Madremonte / horizonte).' },
      { texto: 'las flores que están creciendo en medio del pastizal.', correcta: false, explicacion: 'Termina en -al.' },
      { texto: 'a los pajaritos dulces que cantan en la mañana.', correcta: false, explicacion: 'Termina en -ana.' },
      { texto: 'los árboles de la sierra que tocan el cielo azul.', correcta: false, explicacion: 'Termina en -ul.' }
    ],
    tema: 'Mitos y Leyendas',
    icono: ''
  },
  {
    id: 3,
    verso1: 'La gallina campesina',
    verso2: 'puso un huevo en el corral...',
    rimaClave: '-al',
    opciones: [
      { texto: 'y el gallito cantó fuerte: ¡ese huevo es colosal!', correcta: true, explicacion: 'Rima aguda consonante en -al (corral / colosal).' },
      { texto: 'y se fue para el sendero a comer un poco de maíz.', correcta: false, explicacion: 'Termina en -iz.' },
      { texto: 'las estrellas alumbraban el camino de la granja.', correcta: false, explicacion: 'Termina en -anja.' },
      { texto: 'los pollitos se acostaron a dormir en el granero.', correcta: false, explicacion: 'Termina en -ero.' }
    ],
    tema: 'Tradición Rural',
    icono: ''
  },
  {
    id: 4,
    verso1: 'Con mariposas amarillas',
    verso2: 'en Macondo brilla el sol...',
    rimaClave: '-ol',
    opciones: [
      { texto: 'alumbrando los secretos de la magia y del caracol.', correcta: true, explicacion: 'Rima consonante en -ol (sol / caracol).' },
      { texto: 'recordando las leyendas que escribió nuestro gran Gabo con fervor.', correcta: false, explicacion: 'Termina en -or.' },
      { texto: 'las guitarras van sonando en la plaza principal.', correcta: false, explicacion: 'Termina en -al.' },
      { texto: 'las historias de los abuelos se quedan en la memoria.', correcta: false, explicacion: 'Termina en -oria.' }
    ],
    tema: 'Realismo Mágico',
    icono: ''
  },
  {
    id: 5,
    verso1: 'Quien lee libros con empeño',
    verso2: 'y cultiva la razón...',
    rimaClave: '-ón',
    opciones: [
      { texto: 'abre puertas al futuro con saber y convicción.', correcta: true, explicacion: 'Rima rotunda en -ón (razón / convicción).' },
      { texto: 'llega siempre muy temprano a la clase de español.', correcta: false, explicacion: 'Termina en -ol.' },
      { texto: 'dibuja muchos paisajes con lápices de colores.', correcta: false, explicacion: 'Termina en -ores.' },
      { texto: 'comparte con sus amigos en el patio de recreo.', correcta: false, explicacion: 'Termina en -eo.' }
    ],
    tema: 'El Valor del Lenguaje',
    icono: ''
  },
  {
    id: 6,
    verso1: 'Por las costas del Arauca',
    verso2: 'galopando va el corcel...',
    rimaClave: '-el',
    opciones: [
      { texto: 'levantando polvo fino con el cuatro y el laurel.', correcta: true, explicacion: 'Rima aguda consonante en -el (corcel / laurel).' },
      { texto: 'mirando la tarde clara que cae sobre el morichal.', correcta: false, explicacion: 'Termina en -al.' },
      { texto: 'buscando un poco de sombra debajo del samán.', correcta: false, explicacion: 'Termina en -án.' },
      { texto: 'los terneros van corriendo alegremente en la sabana.', correcta: false, explicacion: 'Termina en -ana.' }
    ],
    tema: 'Joropo Llanero',
    icono: ''
  },
  {
    id: 7,
    verso1: 'Por las aguas de mi río',
    verso2: 'va bajando la piragua...',
    rimaClave: '-agua',
    opciones: [
      { texto: 'entre cantos de bogas navegando sobre el agua.', correcta: true, explicacion: 'Rima exacta y juego poético en -agua (piragua / agua).' },
      { texto: 'los peces van saltando alegres en la corriente.', correcta: false, explicacion: 'Termina en -ente.' },
      { texto: 'las palmeras se divisan cerquita de la ribera.', correcta: false, explicacion: 'Termina en -era.' },
      { texto: 'los caimanes descansan tomando el sol caliente.', correcta: false, explicacion: 'Termina en -ente.' }
    ],
    tema: 'Río Magdalena',
    icono: ''
  },
  {
    id: 8,
    verso1: 'Al sonar de la marimba',
    verso2: 'y al repique del tambor...',
    rimaClave: '-or',
    opciones: [
      { texto: 'baila alegre el pueblo entero con cadencia y con sabor.', correcta: true, explicacion: 'Rima consonante festiva en -or (tambor / sabor).' },
      { texto: 'las olas van quebrando en la playa de arena negra.', correcta: false, explicacion: 'Termina en -egra.' },
      { texto: 'los pescadores recogen sus redes en la canoa.', correcta: false, explicacion: 'Termina en -oa.' },
      { texto: 'el cielo se viste de nubes grises al atardecer.', correcta: false, explicacion: 'Termina en -er.' }
    ],
    tema: 'Pacífico Colombiano',
    icono: ''
  },
  {
    id: 9,
    verso1: 'Con mi ruana campesina',
    verso2: 'y sombrero de jipijapa...',
    rimaClave: '-apa',
    opciones: [
      { texto: 'recorro las vereditas de mi tierrita en el mapa.', correcta: true, explicacion: 'Rima perfecta en -apa (jipijapa / mapa).' },
      { texto: 'subo la cuesta empinada silbando una guabina.', correcta: false, explicacion: 'Termina en -ina.' },
      { texto: 'me como una papita criolla con queso y con café.', correcta: false, explicacion: 'Termina en -é.' },
      { texto: 'los bueyes van arando la tierra para la siembra.', correcta: false, explicacion: 'Termina en -embra.' }
    ],
    tema: 'Trova Andina',
    icono: ''
  },
  {
    id: 10,
    verso1: 'Las palabras son las alas',
    verso2: 'del que quiere navegar...',
    rimaClave: '-ar',
    opciones: [
      { texto: 'por los mares del saber y del asombro sin cesar.', correcta: true, explicacion: 'Rima en infinitivo -ar (navegar / sin cesar).' },
      { texto: 'descubriendo muchos mundos en cada amanecer.', correcta: false, explicacion: 'Termina en -er.' },
      { texto: 'haciendo amigos sinceros en el camino escolar.', correcta: true, explicacion: 'También rima en -ar, pero la opción canónica es la poética del saber.' },
      { texto: 'escribiendo en su libreta con letra redondita.', correcta: false, explicacion: 'Termina en -ita.' }
    ],
    tema: 'Lectura y Creación',
    icono: ''
  },
  {
    id: 11,
    verso1: 'Si una palabra es aguda',
    verso2: 'y termina en N o en S...',
    rimaClave: '-és / -es',
    opciones: [
      { texto: 'márquele la tilde clara como aprendiste en el mes.', correcta: true, explicacion: 'Rima consonante en -es (S / mes).' },
      { texto: 'la pronuncias muy fuerte al principio de la frase.', correcta: false, explicacion: 'Termina en -ase.' },
      { texto: 'no le pongas nada encima que se entiende al revés.', correcta: false, explicacion: 'Sentido contradictorio a la regla ortográfica.' },
      { texto: 'cuenta las sílabas con los dedos de la mano.', correcta: false, explicacion: 'Termina en -ano.' }
    ],
    tema: 'Regla Ortográfica',
    icono: ''
  },
  {
    id: 12,
    verso1: 'En la copa del samán',
    verso2: 'canta libre el ruiseñor...',
    rimaClave: '-or',
    opciones: [
      { texto: 'regalando su tonada a la dicha y al amor.', correcta: true, explicacion: 'Rima consonante clásica en -or (ruiseñor / amor).' },
      { texto: 'comiendo ricas semillas que caen del árbol.', correcta: false, explicacion: 'Termina en -ol.' },
      { texto: 'volando entre las nubes del cielo mañanero.', correcta: false, explicacion: 'Termina en -ero.' },
      { texto: 'las mariposas lo miran desde la hierba fresca.', correcta: false, explicacion: 'Termina en -esca.' }
    ],
    tema: 'Canto a la Naturaleza',
    icono: ''
  }
];

export default function BatallaDeRimas() {
  const [indiceRonda, setIndiceRonda] = useState(0);
  const [puntaje, setPuntaje] = useState(0);
  const [flowCombo, setFlowCombo] = useState(0);
  const [aplausometro, setAplausometro] = useState(60); // 0 a 100
  const [ritmoActivo, setRitmoActivo] = useState(true);
  const [seleccionada, setSeleccionada] = useState(null);
  const [esAcierto, setEsAcierto] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);

  const coplaActual = COPLAS_BATALLA[indiceRonda % COPLAS_BATALLA.length];

  // Beatbox rítmico automático (Metrónomo Web Audio)
  useEffect(() => {
    if (!ritmoActivo || juegoTerminado) return;

    let step = 0;
    const interval = setInterval(() => {
      if (step % 2 === 0) {
        sounds.playBeat(); // Bombo grave
      } else {
        sounds.playTick(); // Caja / Hi-hat
      }
      step++;
    }, 750); // ~80 BPM ritmo rap/copla relajado

    return () => clearInterval(interval);
  }, [ritmoActivo, juegoTerminado]);

  // Leer versos iniciales
  useEffect(() => {
    if (juegoTerminado) return;
    const timer = setTimeout(() => {
      voiceReader.speak(`${coplaActual.verso1}... ${coplaActual.verso2}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [indiceRonda, juegoTerminado]);

  const elegirRima = (opcion) => {
    if (seleccionada !== null) return;
    setSeleccionada(opcion.texto);

    if (opcion.correcta) {
      sounds.playCorrect();
      lanzarConfeti();
      setEsAcierto(true);

      setFlowCombo((c) => {
        const nuevo = c + 1;
        sounds.playCombo(nuevo);
        const puntosGanados = 150 + nuevo * 50;
        setPuntaje((p) => p + puntosGanados);
        return nuevo;
      });

      setAplausometro((a) => Math.min(100, a + 15));

      setTimeout(() => {
        voiceReader.speak(
          `¡Rima perfecta con flow! ${coplaActual.verso1}, ${coplaActual.verso2}... ${opcion.texto}`
        );
      }, 350);
    } else {
      sounds.playWrong();
      setEsAcierto(false);
      setFlowCombo(0);
      setAplausometro((a) => Math.max(20, a - 15));
      voiceReader.speak(`Esa rima no cuadra en el compás. ${opcion.explicacion}`);
    }
  };

  const siguienteRonda = () => {
    sounds.playClick();
    setSeleccionada(null);
    setEsAcierto(null);

    if (indiceRonda + 1 < COPLAS_BATALLA.length) {
      setIndiceRonda((idx) => idx + 1);
    } else {
      setJuegoTerminado(true);
      sounds.playFanfare();
      lanzarConfeti();
      GameProgress.addXP(puntaje, 'rimas_flow');
      GameProgress.registrarVictoria(flowCombo);
      voiceReader.speak("¡Ovación de pie en el escenario! Dominaste la métrica y las rimas tradicionales.");
    }
  };

  const reiniciar = () => {
    sounds.playClick();
    setIndiceRonda(0);
    setPuntaje(0);
    setFlowCombo(0);
    setAplausometro(60);
    setSeleccionada(null);
    setEsAcierto(null);
    setJuegoTerminado(false);
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-fuchsia-500 text-white space-y-6">
      {/* Cabecera del Escenario */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-fuchsia-800/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/40 text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
             Duelo Musical de Métrica y Tradición Oral
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center gap-2">
             Batalla de Rimas y Coplas
          </h3>
          <p className="text-xs sm:text-sm text-fuchsia-200">
            Coplas colombianas • Ronda {indiceRonda + 1} de {COPLAS_BATALLA.length} • Sigue el compás y clava la rima
          </p>
        </div>

        {/* Interruptor de Ritmo Beatbox */}
        <button
          onClick={() => {
            sounds.playClick();
            setRitmoActivo(!ritmoActivo);
          }}
          className={`px-4 py-2 rounded-2xl font-black text-xs transition-all flex items-center gap-2 border cursor-pointer active:scale-95 ${
            ritmoActivo
              ? 'bg-fuchsia-600 text-white border-fuchsia-400 shadow-lg shadow-fuchsia-900/50'
              : 'bg-slate-900 text-slate-400 border-slate-700'
          }`}
        >
          <span>{ritmoActivo ? '' : ''}</span>
          <span>{ritmoActivo ? 'Beatbox: ACTIVO' : 'Beatbox: PAUSA'}</span>
        </button>
      </div>

      {/* Marcadores: Puntos, Flow Combo y Aplausómetro */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-950/80 p-4 rounded-3xl border-2 border-fuchsia-900/80 flex items-center gap-3">
          <span className="text-3xl"></span>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Puntos de Rima:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
              {puntaje}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-3xl border-2 border-fuchsia-900/80 flex items-center gap-3">
          
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Combo de Flow:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-fuchsia-400">
              x{flowCombo}
            </span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-3xl border-2 border-fuchsia-900/80 space-y-1">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-fuchsia-300"> Aplausómetro del Público:</span>
            <span className="text-amber-400">{aplausometro}%</span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-3.5 overflow-hidden p-0.5 border border-fuchsia-800">
            <div
              className="bg-gradient-to-r from-amber-400 via-fuchsia-500 to-rose-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${aplausometro}%` }}
            />
          </div>
        </div>
      </div>

      {/* Pantalla Final o Verso Activo */}
      {juegoTerminado ? (
        <div className="bg-slate-900/90 border-4 border-fuchsia-500 rounded-3xl p-8 text-center space-y-4 animate-fade-in max-w-lg mx-auto shadow-2xl">
          
          <h4 className="text-3xl font-black text-fuchsia-400">¡GRAN MAESTRO DE LA RIMA!</h4>
          <p className="text-slate-200 text-sm font-semibold">
            Te consagraste como el coplero supremo de la tradición oral colombiana.
          </p>
          <div className="text-4xl font-black text-amber-400">
            {puntaje} PUNTOS DE FLOW 
          </div>
          <button
            onClick={reiniciar}
            className="px-8 py-3.5 bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white font-black text-base rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
             Iniciar Nueva Batalla
          </button>
        </div>
      ) : (
        <>
          {/* El Escenario de los Versos */}
          <div className="bg-gradient-to-b from-purple-950/60 to-slate-950 p-6 sm:p-8 rounded-3xl border-3 border-fuchsia-500/80 text-center space-y-4 relative overflow-hidden shadow-2xl">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider bg-fuchsia-900/60 text-fuchsia-200 px-3 py-1 rounded-full border border-fuchsia-700">
                {coplaActual.icono} {coplaActual.tema}
              </span>
              <span className="text-xs font-bold text-amber-300 bg-black/40 px-3 py-1 rounded-full border border-amber-400/40">
                Terminación Clave: {coplaActual.rimaClave}
              </span>
            </div>

            <div className="space-y-1.5 font-black text-xl sm:text-3xl text-amber-300 drop-shadow-md">
              <p>"{coplaActual.verso1}"</p>
              <p>"{coplaActual.verso2}"</p>
            </div>

            <p className="text-xs text-slate-400 font-semibold pt-1">
               ¿Cuál de los siguientes versos completa la copla con la métrica y rima exacta?
            </p>
          </div>

          {/* Opciones de Remate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coplaActual.opciones.map((op, idx) => {
              const esSeleccionada = seleccionada === op.texto;
              let estiloBoton = 'bg-slate-900 hover:bg-slate-800 text-white border-slate-700 hover:border-fuchsia-400';

              if (seleccionada !== null) {
                if (op.correcta) {
                  estiloBoton = 'bg-emerald-600 text-white border-emerald-400 ring-4 ring-emerald-500/50 scale-102';
                } else if (esSeleccionada) {
                  estiloBoton = 'bg-rose-600 text-white border-rose-400 ring-4 ring-rose-500/50';
                } else {
                  estiloBoton = 'bg-slate-900/50 text-slate-500 border-slate-800 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={seleccionada !== null}
                  onClick={() => elegirRima(op)}
                  className={`p-4 rounded-2xl border-3 text-left transition-all duration-150 flex items-start gap-3 select-none active:scale-98 cursor-pointer ${estiloBoton}`}
                >
                  
                  <div>
                    <span className="font-bold text-sm sm:text-base leading-snug block">
                      "{op.texto}"
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback Didáctico de Métrica y Rima */}
          {esAcierto !== null && (
            <div
              className={`p-5 rounded-3xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-down ${
                esAcierto
                  ? 'bg-emerald-950/90 text-emerald-200 border-emerald-400'
                  : 'bg-rose-950/90 text-rose-200 border-rose-400'
              }`}
            >
              <div>
                <h5 className="font-black text-base flex items-center gap-2">
                  <span>{esAcierto ? ' ¡RIMÓ CON FLOW PERFECTO!' : ' ¡RIMA DESAFINADA!'}</span>
                </h5>
                <p className="text-xs sm:text-sm mt-1 font-semibold leading-relaxed">
                  {coplaActual.opciones.find((o) => o.texto === seleccionada)?.explicacion}
                </p>
              </div>

              <button
                onClick={siguienteRonda}
                className="px-6 py-3 bg-fuchsia-500 hover:bg-fuchsia-400 text-white font-black text-sm rounded-xl shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                Siguiente Copla 
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
