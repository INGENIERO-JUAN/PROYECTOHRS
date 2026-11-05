import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const NIVELES_PALABRAS = {
  basico: {
    nombre: 'Nivel 1: Palabras de 2 Sílabas',
    icono: '',
    palabras: [
      { palabra: 'MAPA', silabas: ['MA', 'PA'], pista: 'Nos guía y muestra senderos, ríos y montañas.', icono: '' },
      { palabra: 'SAPO', silabas: ['SA', 'PO'], pista: 'Animal anfibio que salta alegre en las charcas.', icono: '' },
      { palabra: 'LUNA', silabas: ['LU', 'NA'], pista: 'Ilumina las noches estrelladas en el campo.', icono: '' },
      { palabra: 'CASA', silabas: ['CA', 'SA'], pista: 'Lugar cálido donde descansamos en familia.', icono: '' },
      { palabra: 'PATO', silabas: ['PA', 'TO'], pista: 'Ave nadadora que nada en las lagunas.', icono: '' },
      { palabra: 'MESA', silabas: ['ME', 'SA'], pista: 'Mueble donde apoyamos los libros y el almuerzo.', icono: '' },
      { palabra: 'MAIZ', silabas: ['MA', 'ÍZ'], pista: 'Grano sagrado para deliciosas arepas y mazorcas.', icono: '' },
      { palabra: 'GATO', silabas: ['GA', 'TO'], pista: 'Felino cariñoso y buen cazador del tejado.', icono: '' },
      { palabra: 'RANA', silabas: ['RA', 'NA'], pista: 'Salta en los charcos y rima con campana.', icono: '' },
      { palabra: 'ROSA', silabas: ['RO', 'SA'], pista: 'Flor hermosa y aromática de suaves pétalos.', icono: '' },
      { palabra: 'NUBE', silabas: ['NU', 'BE'], pista: 'Algodón blanco en el cielo que trae la lluvia.', icono: '' },
      { palabra: 'PECES', silabas: ['PE', 'CES'], pista: 'Nadan en cardumen en las aguas limpias del río.', icono: '' }
    ]
  },
  intermedio: {
    nombre: 'Nivel 2: Palabras de 3 Sílabas',
    icono: '',
    palabras: [
      { palabra: 'FABULA', silabas: ['FÁ', 'BU', 'LA'], pista: 'Cuento de animales que deja una hermosa moraleja.', icono: '' },
      { palabra: 'POEMA', silabas: ['PO', 'E', 'MA'], pista: 'Composición llena de verso, rima y sentimientos.', icono: '' },
      { palabra: 'CAMINO', silabas: ['CA', 'MI', 'NO'], pista: 'Sendero que recorremos para llegar a la escuela.', icono: '' },
      { palabra: 'ESTRELLA', silabas: ['ES', 'TRE', 'LLA'], pista: 'Punto luminoso que brilla en el cielo nocturno.', icono: '' },
      { palabra: 'COLOMBIA', silabas: ['CO', 'LOM', 'BIA'], pista: 'País de hermosas montañas, café y dos océanos.', icono: '' },
      { palabra: 'CUADERNO', silabas: ['CUA', 'DER', 'NO'], pista: 'Hojas en blanco donde anotamos nuestras ideas.', icono: '' },
      { palabra: 'ARDILLA', silabas: ['AR', 'DI', 'LLA'], pista: 'Animal inquieto que trepa comiendo frutos secos.', icono: '' },
      { palabra: 'LEYENDA', silabas: ['LE', 'YEN', 'DA'], pista: 'Relato tradicional popular transmitido de abuelos a nietos.', icono: '' },
      { palabra: 'SEMILLA', silabas: ['SE', 'MI', 'LLA'], pista: 'Pequeño grano que germina para dar frutos en la huerta.', icono: '' },
      { palabra: 'BANDERA', silabas: ['BAN', 'DE', 'RA'], pista: 'Símbolo patrio tricolor que flamea con el viento.', icono: '' },
      { palabra: 'PAJARO', silabas: ['PÁ', 'JA', 'RO'], pista: 'Ave libre que trina al amanecer con sus plumas.', icono: '' },
      { palabra: 'CANTO', silabas: ['CAN', 'TO'], pista: 'Melodía que entonan las aves al amanecer.', icono: '' }
    ]
  },
  avanzado: {
    nombre: 'Nivel 3: Palabras Literarias de 4 Sílabas',
    icono: '',
    palabras: [
      { palabra: 'METAFORA', silabas: ['ME', 'TÁ', 'FO', 'RA'], pista: 'Figura que compara dos realidades sin usar "como".', icono: '' },
      { palabra: 'PERSONAJE', silabas: ['PER', 'SO', 'NA', 'JE'], pista: 'Ser real o ficticio que actúa dentro de una historia.', icono: '' },
      { palabra: 'DICCIONARIO', silabas: ['DIC', 'CIO', 'NA', 'RIO'], pista: 'Libro maestro que reúne las definiciones del idioma.', icono: '' },
      { palabra: 'LITERATURA', silabas: ['LI', 'TE', 'RA', 'TU', 'RA'], pista: 'Arte de la expresión verbal escrita y hablada.', icono: '' },
      { palabra: 'ORTOGRAFIA', silabas: ['OR', 'TO', 'GRA', 'FÍA'], pista: 'Reglas para escribir correctamente cada letra y tilde.', icono: '' },
      { palabra: 'NARRADOR', silabas: ['NA', 'RRA', 'DOR'], pista: 'Voz que relata los acontecimientos en una novela.', icono: '' },
      { palabra: 'CRONOLOGIA', silabas: ['CRO', 'NO', 'LO', 'GÍA'], pista: 'Orden temporal en que ocurren los sucesos históricos.', icono: '' },
      { palabra: 'ARGUMENTO', silabas: ['AR', 'GU', 'MEN', 'TO'], pista: 'Razonamiento que demuestra o refuta una proposición.', icono: '' },
      { palabra: 'HIPERBOLE', silabas: ['HI', 'PÉR', 'BO', 'LE'], pista: 'Exageración mayúscula para engrandecer una idea.', icono: '' },
      { palabra: 'CALIGRAFIA', silabas: ['CA', 'LI', 'GRA', 'FÍA'], pista: 'Arte de trazar letras bellas y legibles a mano.', icono: '' }
    ]
  }
};

export default function ConstructorPalabras() {
  const [nivelActual, setNivelActual] = useState('basico');
  const [indiceReto, setIndiceReto] = useState(0);
  const [piezasDisponibles, setPiezasDisponibles] = useState([]);
  const [piezasSeleccionadas, setPiezasSeleccionadas] = useState([]);
  const [estadoAcierto, setEstadoAcierto] = useState(null);
  const [puntaje, setPuntaje] = useState(0);
  const [streak, setStreak] = useState(0);

  const retos = NIVELES_PALABRAS[nivelActual].palabras;
  const retoActual = retos[indiceReto % retos.length];

  // Barajar sílabas
  const cargarReto = (indice, nivelKey = nivelActual) => {
    const listado = NIVELES_PALABRAS[nivelKey].palabras;
    const item = listado[indice % listado.length];
    const revueltas = item.silabas
      .map((s, id) => ({ id: `${s}-${id}-${Math.random()}`, texto: s }))
      .sort(() => Math.random() - 0.5);

    setPiezasDisponibles(revueltas);
    setPiezasSeleccionadas([]);
    setEstadoAcierto(null);
  };

  useEffect(() => {
    cargarReto(indiceReto, nivelActual);
  }, [indiceReto, nivelActual]);

  const tocarPiezaDisponible = (pieza) => {
    sounds.playPop();
    // Pronunciar sílaba en voz alta inmediatamente
    voiceReader.speakSyllable(pieza.texto);

    setPiezasDisponibles((prev) => prev.filter((p) => p.id !== pieza.id));
    const nuevasSeleccionadas = [...piezasSeleccionadas, pieza];
    setPiezasSeleccionadas(nuevasSeleccionadas);

    if (nuevasSeleccionadas.length === retoActual.silabas.length) {
      const palabraArmada = nuevasSeleccionadas.map((p) => p.texto).join('');
      const palabraEsperada = retoActual.silabas.join('');

      if (palabraArmada.toUpperCase() === palabraEsperada.toUpperCase()) {
        sounds.playCorrect();
        lanzarConfeti();
        setEstadoAcierto(true);
        const puntosGanados = 100 + streak * 25;
        setPuntaje((prev) => prev + puntosGanados);
        setStreak((s) => s + 1);
        GameProgress.addXP(puntosGanados);

        // Pronunciar en voz alta la palabra armada para niños
        setTimeout(() => {
          voiceReader.speak(`¡Excelente! Formaste la palabra: ${palabraArmada}. ${retoActual.pista}`);
        }, 350);
      } else {
        sounds.playWrong();
        setEstadoAcierto(false);
        setStreak(0);
        voiceReader.speak("Ese orden no suena bien, inténtalo de nuevo.");
      }
    }
  };

  const escucharPista = () => {
    sounds.playClick();
    voiceReader.speak(`Pista secreta: ${retoActual.pista}`);
  };

  const quitarPiezaSeleccionada = (pieza) => {
    sounds.playClick();
    setPiezasSeleccionadas((prev) => prev.filter((p) => p.id !== pieza.id));
    setPiezasDisponibles((prev) => [...prev, pieza]);
    setEstadoAcierto(null);
  };

  const siguienteReto = () => {
    sounds.playClick();
    if (indiceReto + 1 < retos.length) {
      setIndiceReto((prev) => prev + 1);
    } else {
      setIndiceReto(0);
    }
  };

  const cambiarNivel = (key) => {
    sounds.playClick();
    setNivelActual(key);
    setIndiceReto(0);
    setStreak(0);
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border-2 border-amber-300/80 space-y-6">
      {/* Selector de Nivel de Dificultad */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-black text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Arma-Palabras por Sílabas
          </span>
          <h3 className="text-2xl font-black text-slate-800 mt-1 flex items-center gap-2">
             Construcción Morfológica
          </h3>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            Palabra {indiceReto + 1} de {retos.length} en este nivel
          </p>
        </div>

        {/* Niveles */}
        <div className="flex gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          {Object.entries(NIVELES_PALABRAS).map(([key, val]) => (
            <button
              key={key}
              onClick={() => cambiarNivel(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                nivelActual === key
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white'
              }`}
            >
              <span>{val.icono}</span> {val.nombre.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Pista y Marcador */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50/80 border border-amber-200 p-4 rounded-2xl">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{retoActual.icono}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Pista del Enigma:
              </span>
              <button
                onClick={escucharPista}
                className="inline-flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-200/90 hover:bg-amber-300 px-2.5 py-0.5 rounded-full cursor-pointer transition-transform active:scale-95 shadow-sm"
              >
                 Escuchar en voz alta
              </button>
            </div>
            <p className="text-slate-800 font-bold text-sm sm:text-base leading-snug mt-0.5">
              "{retoActual.pista}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {streak > 1 && (
            <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-xl animate-pulse">
               Racha x{streak}
            </span>
          )}
          <div className="bg-white border border-amber-300 px-3 py-1.5 rounded-xl text-sm font-black text-amber-900 shadow-sm">
             {puntaje} pts
          </div>
        </div>
      </div>

      {/* Casillas Receptoras */}
      <div>
        <label className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-2 text-center">
          Tu palabra armada (Toca una sílaba para devolverla):
        </label>

        <div className="flex flex-wrap justify-center gap-2.5 min-h-[84px] p-4 bg-slate-100/90 rounded-2xl border-2 border-dashed border-slate-300 items-center">
          {piezasSeleccionadas.length === 0 && (
            <span className="text-slate-400 font-semibold text-xs sm:text-sm">
              (Toca las sílabas en orden para ubicarlas aquí)
            </span>
          )}

          {piezasSeleccionadas.map((pieza) => (
            <button
              key={pieza.id}
              onClick={() => quitarPiezaSeleccionada(pieza)}
              className={`min-w-[64px] h-16 sm:h-18 px-4 rounded-2xl text-xl sm:text-2xl font-black flex items-center justify-center shadow-md transition-all active:scale-90 cursor-pointer border-b-4 ${
                estadoAcierto === true
                  ? 'bg-emerald-500 text-white border-emerald-700 animate-bounce'
                  : estadoAcierto === false
                  ? 'bg-rose-500 text-white border-rose-700'
                  : 'bg-amber-400 text-amber-950 border-amber-600 hover:scale-105'
              }`}
            >
              {pieza.texto}
            </button>
          ))}
        </div>
      </div>

      {/* Sílabas Disponibles */}
      <div>
        <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-3 text-center">
          Sílabas Disponibles (Tócalas):
        </label>

        <div className="flex flex-wrap justify-center gap-3 min-h-[70px]">
          {piezasDisponibles.map((pieza) => (
            <button
              key={pieza.id}
              onClick={() => tocarPiezaDisponible(pieza)}
              className="min-w-[64px] h-16 sm:h-18 px-4 bg-white hover:bg-amber-50 text-slate-800 border-b-4 border-slate-300 hover:border-amber-500 text-xl sm:text-2xl font-black rounded-2xl shadow-sm transition-all active:border-b-0 active:translate-y-1 cursor-pointer flex items-center justify-center hover:scale-105"
            >
              {pieza.texto}
            </button>
          ))}
        </div>
      </div>

      {/* Estado y Feedback */}
      {estadoAcierto !== null && (
        <div
          className={`p-4 rounded-2xl border-2 text-center font-black text-base sm:text-lg flex items-center justify-center gap-2 animate-fade-in ${
            estadoAcierto
              ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
              : 'bg-rose-100 border-rose-400 text-rose-950'
          }`}
        >
          <span>{estadoAcierto ? ' ¡CORRECTO! ¡Formaste la palabra exacta!' : ' El orden no coincide. Toca las sílabas para reorganizarlas.'}</span>
        </div>
      )}

      {/* Acciones */}
      <div className="flex gap-3 pt-2">
        {estadoAcierto === false && (
          <button
            onClick={() => cargarReto(indiceReto)}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-sm"
          >
             Reintentar
          </button>
        )}

        {estadoAcierto === true && (
          <button
            onClick={siguienteReto}
            className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base rounded-xl shadow-md transition-all active:scale-95 cursor-pointer animate-pulse"
          >
            Siguiente Palabra 
          </button>
        )}
      </div>
    </div>
  );
}
