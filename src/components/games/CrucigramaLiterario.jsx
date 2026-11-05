import React, { useState, useEffect, useCallback } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const PUZZLES = [
  {
    id: 1,
    nombre: 'Reto Lírico y Estilístico',
    nivel: 'Grado 6° - 7°',
    size: 7,
    palabras: [
      { id: '1H', numero: 1, direccion: 'H', palabra: 'VERSO', r: 0, c: 0, pista: 'Cada una de las líneas que componen un poema.' },
      { id: '2H', numero: 2, direccion: 'H', palabra: 'RIMA', r: 2, c: 0, pista: 'Semejanza de sonidos al final de dos o más versos.' },
      { id: '3H', numero: 3, direccion: 'H', palabra: 'TEXTO', r: 4, c: 2, pista: 'Enunciado o conjunto de palabras con sentido coherente.' },
      { id: '4H', numero: 4, direccion: 'H', palabra: 'PROSA', r: 6, c: 2, pista: 'Forma natural de expresión no sujeta a rima ni medida.' },
      { id: '1V', numero: 1, direccion: 'V', palabra: 'VERBO', r: 0, c: 0, pista: 'Clase de palabra que expresa una acción, movimiento o estado.' },
      { id: '2V', numero: 2, direccion: 'V', palabra: 'MITO', r: 2, c: 2, pista: 'Relato sagrado tradicional sobre dioses o el origen del cosmos.' },
      { id: '3V', numero: 3, direccion: 'V', palabra: 'ODA', r: 4, c: 6, pista: 'Poema lírico de tono elevado que alaba a un personaje u objeto.' }
    ]
  },
  {
    id: 2,
    nombre: 'Narrativa y Estructura Literaria',
    nivel: 'Grado 7° - 8°',
    size: 7,
    palabras: [
      { id: '1H', numero: 1, direccion: 'H', palabra: 'PUNTO', r: 2, c: 1, pista: 'Signo ortográfico que indica la pausa final de una oración.' },
      { id: '2H', numero: 2, direccion: 'H', palabra: 'EPICA', r: 5, c: 0, pista: 'Género poético narrativo sobre grandes hazañas bélicas y héroes.' },
      { id: '3H', numero: 3, direccion: 'H', palabra: 'NOVELA', r: 6, c: 0, pista: 'Narración extensa en prosa con personajes, trama y capítulos.' },
      { id: '1V', numero: 4, direccion: 'V', palabra: 'CRONICA', r: 0, c: 5, pista: 'Texto que narra acontecimientos reales en orden cronológico.' },
      { id: '2V', numero: 5, direccion: 'V', palabra: 'TEMA', r: 2, c: 4, pista: 'Asunto o idea central que el autor desarrolla en su texto.' }
    ]
  },
  {
    id: 3,
    nombre: 'Métrica, Teatro y Fonología',
    nivel: 'Grado 8° - 9°',
    size: 7,
    palabras: [
      { id: '1H', numero: 1, direccion: 'H', palabra: 'VERSOS', r: 0, c: 0, pista: 'Conjunto de líneas que siguen un compás métrico determinado.' },
      { id: '2H', numero: 2, direccion: 'H', palabra: 'RITMO', r: 5, c: 1, pista: 'Sensación de movimiento sonoro y musicalidad en la lengua.' },
      { id: '3H', numero: 3, direccion: 'H', palabra: 'DRAMA', r: 6, c: 0, pista: 'Obra escrita para ser actuada con diálogo frente al público.' },
      { id: '1V', numero: 4, direccion: 'V', palabra: 'SONETO', r: 0, c: 5, pista: 'Composición clásica de 14 versos endecasílabos y rima consonante.' },
      { id: '2V', numero: 5, direccion: 'V', palabra: 'FONEMA', r: 1, c: 4, pista: 'Unidad mínima fonológica que distingue significados en el habla.' }
    ]
  },
  {
    id: 4,
    nombre: 'Palabras y Rimas Mágicas',
    nivel: 'Grado 4° - 6°',
    size: 7,
    palabras: [
      { id: '1H', numero: 1, direccion: 'H', palabra: 'RIMA', r: 0, c: 0, pista: 'Sonidos iguales o semejantes al final de dos versos.' },
      { id: '2H', numero: 2, direccion: 'H', palabra: 'NIDO', r: 2, c: 0, pista: 'Hogar que construyen las aves con ramitas para sus huevos.' },
      { id: '3H', numero: 3, direccion: 'H', palabra: 'DULCE', r: 4, c: 2, pista: 'Sabor rico como la miel, el caramelo o la panela.' },
      { id: '4H', numero: 4, direccion: 'H', palabra: 'OSO', r: 6, c: 4, pista: 'Mamífero grande como el oso de anteojos de nuestros páramos.' },
      { id: '1V', numero: 1, direccion: 'V', palabra: 'RANA', r: 0, c: 0, pista: 'Anfibio saltador verde que canta en los charcos.' },
      { id: '2V', numero: 5, direccion: 'V', palabra: 'DADO', r: 2, c: 2, pista: 'Cubo con puntos numerados del 1 al 6 para jugar.' },
      { id: '3V', numero: 6, direccion: 'V', palabra: 'ECO', r: 4, c: 6, pista: 'Repetición de un sonido al chocar contra las montañas.' }
    ]
  }
];

export default function CrucigramaLiterario({ gradoNumero = 7 }) {
  const [puzzleIndex, setPuzzleIndex] = useState(() => {
    if (gradoNumero <= 5) return 3;
    if (gradoNumero <= 6) return 0;
    if (gradoNumero <= 8) return 1;
    return 2;
  });

  const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];
  const [gridValues, setGridValues] = useState({});
  const [selectedCell, setSelectedCell] = useState(null); // { r, c }
  const [selectedDirection, setSelectedDirection] = useState('H');
  const [selectedWordId, setSelectedWordId] = useState(null);
  const [tiempo, setTiempo] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  // Inicializar cuadrícula válida para el puzzle actual
  const validCells = React.useMemo(() => {
    const map = {};
    puzzle.palabras.forEach((p) => {
      for (let i = 0; i < p.palabra.length; i++) {
        const r = p.direccion === 'H' ? p.r : p.r + i;
        const c = p.direccion === 'H' ? p.c + i : p.c;
        const key = `${r}-${c}`;
        if (!map[key]) {
          map[key] = {
            r,
            c,
            correctLetter: p.palabra[i],
            wordIds: [p.id],
            number: i === 0 ? p.numero : null
          };
        } else {
          map[key].wordIds.push(p.id);
          if (i === 0 && !map[key].number) map[key].number = p.numero;
        }
      }
    });
    return map;
  }, [puzzle]);

  // Reset al cambiar puzzle
  useEffect(() => {
    setGridValues({});
    setSelectedCell(null);
    setSelectedWordId(null);
    setIsCompleted(false);
    setTiempo(0);
    setHintsUsed(0);
  }, [puzzleIndex]);

  // Cronómetro
  useEffect(() => {
    if (isCompleted) return;
    const interval = setInterval(() => {
      setTiempo((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted]);

  // Verificar si una palabra está resuelta
  const isWordComplete = useCallback((palabraObj, currentGrid) => {
    for (let i = 0; i < palabraObj.palabra.length; i++) {
      const r = palabraObj.direccion === 'H' ? palabraObj.r : palabraObj.r + i;
      const c = palabraObj.direccion === 'H' ? palabraObj.c + i : palabraObj.c;
      const key = `${r}-${c}`;
      if ((currentGrid[key] || '').toUpperCase() !== palabraObj.palabra[i]) {
        return false;
      }
    }
    return true;
  }, []);

  // Verificar victoria
  useEffect(() => {
    if (isCompleted) return;
    const totalWords = puzzle.palabras.length;
    let completedCount = 0;
    puzzle.palabras.forEach((p) => {
      if (isWordComplete(p, gridValues)) completedCount++;
    });

    if (completedCount === totalWords && totalWords > 0) {
      setIsCompleted(true);
      sounds.playCorrect();
      sounds.playFanfare();
      lanzarConfeti();
      const bonusTiempo = Math.max(0, 300 - tiempo) * 2;
      const bonusHints = Math.max(0, 200 - hintsUsed * 50);
      const puntosFinales = 600 + bonusTiempo + bonusHints;
      setScore(puntosFinales);
      GameProgress.addXP(puntosFinales, 'crucigrama_as');
      GameProgress.registrarVictoria(1);
    }
  }, [gridValues, puzzle, isCompleted, tiempo, hintsUsed, isWordComplete]);

  // Manejo de clics en celdas
  const handleCellClick = (r, c) => {
    const key = `${r}-${c}`;
    if (!validCells[key]) return;
    sounds.playClick();

    if (selectedCell && selectedCell.r === r && selectedCell.c === c) {
      // Alternar dirección H / V si la celda tiene ambas
      const cellData = validCells[key];
      if (cellData.wordIds.length > 1) {
        const newDir = selectedDirection === 'H' ? 'V' : 'H';
        setSelectedDirection(newDir);
        const nextWord = puzzle.palabras.find(
          (p) => cellData.wordIds.includes(p.id) && p.direccion === newDir
        );
        if (nextWord) setSelectedWordId(nextWord.id);
      }
    } else {
      setSelectedCell({ r, c });
      // Asignar palabra asociada
      const cellData = validCells[key];
      let matchedWord = puzzle.palabras.find(
        (p) => cellData.wordIds.includes(p.id) && p.direccion === selectedDirection
      );
      if (!matchedWord) {
        matchedWord = puzzle.palabras.find((p) => cellData.wordIds.includes(p.id));
        if (matchedWord) setSelectedDirection(matchedWord.direccion);
      }
      setSelectedWordId(matchedWord ? matchedWord.id : cellData.wordIds[0]);
    }
  };

  // Escribir letra
  const handleInputLetter = (char) => {
    if (!selectedCell || isCompleted) return;
    const key = `${selectedCell.r}-${selectedCell.c}`;
    if (!validCells[key]) return;

    sounds.playClick();
    const upper = char.toUpperCase();
    const newGrid = { ...gridValues, [key]: upper };
    setGridValues(newGrid);

    // Mover cursor a la siguiente celda de la palabra seleccionada
    const currentWord = puzzle.palabras.find((p) => p.id === selectedWordId);
    if (currentWord) {
      const nextR = selectedDirection === 'H' ? selectedCell.r : selectedCell.r + 1;
      const nextC = selectedDirection === 'H' ? selectedCell.c + 1 : selectedCell.c;
      const nextKey = `${nextR}-${nextC}`;
      if (validCells[nextKey] && validCells[nextKey].wordIds.includes(currentWord.id)) {
        setSelectedCell({ r: nextR, c: nextC });
      }
    }
  };

  // Borrar letra
  const handleBackspace = () => {
    if (!selectedCell || isCompleted) return;
    const key = `${selectedCell.r}-${selectedCell.c}`;
    const newGrid = { ...gridValues };

    if (newGrid[key]) {
      delete newGrid[key];
      setGridValues(newGrid);
      sounds.playClick();
    } else {
      // Retroceder celda
      const currentWord = puzzle.palabras.find((p) => p.id === selectedWordId);
      if (currentWord) {
        const prevR = selectedDirection === 'H' ? selectedCell.r : selectedCell.r - 1;
        const prevC = selectedDirection === 'H' ? selectedCell.c - 1 : selectedCell.c;
        const prevKey = `${prevR}-${prevC}`;
        if (validCells[prevKey] && validCells[prevKey].wordIds.includes(currentWord.id)) {
          setSelectedCell({ r: prevR, c: prevC });
        }
      }
    }
  };

  // Teclado físico
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCompleted) return;
      if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (/^[a-zA-ZñÑáéíóúÁÉÍÓÚ]$/.test(e.key)) {
        e.preventDefault();
        // Normalizar tildes si es necesario
        const clean = e.key.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
        handleInputLetter(clean);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, selectedWordId, selectedDirection, gridValues, isCompleted]);

  // Pista gratuita: revela una letra
  const handleUseHint = () => {
    if (isCompleted) return;
    const emptyKeys = Object.keys(validCells).filter(
      (k) => (gridValues[k] || '') !== validCells[k].correctLetter
    );
    if (emptyKeys.length === 0) return;
    const randomKey = emptyKeys[Math.floor(Math.random() * emptyKeys.length)];
    setGridValues((prev) => ({ ...prev, [randomKey]: validCells[randomKey].correctLetter }));
    setHintsUsed((h) => h + 1);
    sounds.playCorrect();
  };

  const formatearTiempo = (seg) => {
    const m = Math.floor(seg / 60);
    const s = seg % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  return (
    <div className="bg-slate-950 text-slate-100 rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-indigo-500/30 space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-indigo-900/50 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest bg-indigo-950 text-indigo-400 px-3 py-1 rounded-full border border-indigo-800">
              Desafío Intelectual • {puzzle.nivel}
            </span>
            <span className="text-xs font-bold text-slate-400">
              Puzzle #{puzzle.id} de {PUZZLES.length}
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-2.5">
             {puzzle.nombre}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Crucigrama estilístico para explorar vocabulario avanzado, figuras y teoría literaria.
          </p>
        </div>

        {/* Indicadores de Tiempo y Acciones */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-indigo-800/80 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-sm font-black text-indigo-300">
            <span></span>
            <span>{formatearTiempo(tiempo)}</span>
          </div>

          <button
            onClick={handleUseHint}
            title="Revela una letra al azar"
            className="px-3.5 py-2 bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/60 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span> Pista</span>
            {hintsUsed > 0 && <span className="text-[10px] bg-indigo-800 px-1.5 rounded-full">{hintsUsed}</span>}
          </button>

          <button
            onClick={() => setPuzzleIndex((idx) => (idx + 1) % PUZZLES.length)}
            className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-2xl text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span>Siguiente</span>
            
          </button>
        </div>
      </div>

      {/* Selector de Puzzles */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0">
          Elige Tablero:
        </span>
        {PUZZLES.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setPuzzleIndex(idx)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              puzzleIndex === idx
                ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            #{idx + 1} {p.nombre} ({p.nivel})
          </button>
        ))}
      </div>

      {/* Área Principal: Tablero + Pistas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Tablero Cuadrícula 7x7 */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="inline-block p-3 sm:p-4 bg-slate-900/90 rounded-3xl border-2 border-indigo-900/60 shadow-inner">
            <div
              className="grid gap-1 sm:gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`
              }}
            >
              {Array.from({ length: puzzle.size }).map((_, r) =>
                Array.from({ length: puzzle.size }).map((_, c) => {
                  const key = `${r}-${c}`;
                  const cell = validCells[key];
                  const isSelected = selectedCell && selectedCell.r === r && selectedCell.c === c;
                  const isInActiveWord =
                    cell && selectedWordId && cell.wordIds.includes(selectedWordId);
                  const val = gridValues[key] || '';
                  const isLetterCorrect = cell && val.toUpperCase() === cell.correctLetter;

                  if (!cell) {
                    return (
                      <div
                        key={key}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-950/80 border border-slate-900/40"
                      />
                    );
                  }

                  return (
                    <button
                      key={key}
                      onClick={() => handleCellClick(r, c)}
                      className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl font-black text-base sm:text-xl flex items-center justify-center transition-all cursor-pointer select-none ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300 shadow-lg scale-105 z-20'
                          : isInActiveWord
                          ? 'bg-indigo-700/80 text-white ring-2 ring-indigo-400/80 z-10'
                          : isLetterCorrect
                          ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800/90 text-white border border-indigo-900/80 hover:bg-slate-700'
                      }`}
                    >
                      {/* Número pequeño de referencia en la esquina */}
                      {cell.number && (
                        <span className="absolute top-0.5 left-1 text-[9px] font-bold text-slate-400 leading-none select-none">
                          {cell.number}
                        </span>
                      )}
                      <span>{val}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <p className="text-[11px] font-bold text-slate-500 text-center mt-3">
            Toca una casilla para escribir. Toca dos veces para cambiar entre dirección Horizontal y Vertical.
          </p>
        </div>

        {/* Panel de Pistas Literarias */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-indigo-900/60 shadow-lg space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2 border-b border-indigo-900/50 pb-2">
               Pistas Horizontales
            </h4>
            <div className="space-y-2">
              {puzzle.palabras
                .filter((p) => p.direccion === 'H')
                .map((p) => {
                  const complete = isWordComplete(p, gridValues);
                  const isWordActive = selectedWordId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedWordId(p.id);
                        setSelectedDirection('H');
                        setSelectedCell({ r: p.r, c: p.c });
                      }}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-xs border ${
                        isWordActive
                          ? 'bg-indigo-950 border-indigo-400 shadow-md ring-1 ring-indigo-400'
                          : complete
                          ? 'bg-emerald-950/40 border-emerald-800/40 opacity-70'
                          : 'bg-slate-950/60 border-slate-800 hover:border-indigo-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-black mb-1">
                        <span className={complete ? 'text-emerald-400' : 'text-indigo-300'}>
                          #{p.numero} Horizontal ({p.palabra.length} letras)
                        </span>
                        {complete && <span className="text-emerald-400 text-xs"> Resuelto</span>}
                      </div>
                      <p className="text-slate-300 font-medium leading-relaxed">{p.pista}</p>
                    </div>
                  );
                })}
            </div>

            <h4 className="text-xs font-black uppercase tracking-wider text-violet-400 flex items-center gap-2 border-b border-indigo-900/50 pb-2 pt-2">
               Pistas Verticales
            </h4>
            <div className="space-y-2">
              {puzzle.palabras
                .filter((p) => p.direccion === 'V')
                .map((p) => {
                  const complete = isWordComplete(p, gridValues);
                  const isWordActive = selectedWordId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        sounds.playClick();
                        setSelectedWordId(p.id);
                        setSelectedDirection('V');
                        setSelectedCell({ r: p.r, c: p.c });
                      }}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-xs border ${
                        isWordActive
                          ? 'bg-violet-950 border-violet-400 shadow-md ring-1 ring-violet-400'
                          : complete
                          ? 'bg-emerald-950/40 border-emerald-800/40 opacity-70'
                          : 'bg-slate-950/60 border-slate-800 hover:border-violet-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-black mb-1">
                        <span className={complete ? 'text-emerald-400' : 'text-violet-300'}>
                          #{p.numero} Vertical ({p.palabra.length} letras)
                        </span>
                        {complete && <span className="text-emerald-400 text-xs"> Resuelto</span>}
                      </div>
                      <p className="text-slate-300 font-medium leading-relaxed">{p.pista}</p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Teclado en Pantalla para Touch/Proyector */}
      <div className="bg-slate-900/80 rounded-2xl p-3 sm:p-4 border border-indigo-900/50 max-w-2xl mx-auto space-y-1.5">
        {keyboardRows.map((row, i) => (
          <div key={i} className="flex justify-center gap-1 sm:gap-1.5">
            {row.map((char) => (
              <button
                key={char}
                onClick={() => handleInputLetter(char)}
                className="w-8 h-10 sm:w-11 sm:h-12 bg-slate-800 hover:bg-indigo-600 text-white font-black text-xs sm:text-base rounded-xl border-b-2 border-slate-950 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center shadow"
              >
                {char}
              </button>
            ))}
            {i === 2 && (
              <button
                onClick={handleBackspace}
                className="px-3 sm:px-4 h-10 sm:h-12 bg-rose-900/70 hover:bg-rose-800 text-white font-black text-xs sm:text-sm rounded-xl border-b-2 border-rose-950 active:border-b-0 active:translate-y-0.5 transition-all cursor-pointer flex items-center justify-center gap-1 shadow"
              >
                <span>Borrar</span> Borrar
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pantalla de Victoria */}
      {isCompleted && (
        <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-indigo-950 border-2 border-emerald-400 p-6 sm:p-8 rounded-3xl text-center animate-fade-in space-y-4 shadow-2xl">
          
          <h4 className="text-2xl sm:text-3xl font-black text-emerald-300">
            ¡Crucigrama Literario Completado con Éxito!
          </h4>
          <p className="text-slate-200 text-sm max-w-lg mx-auto">
            Resolviste todas las intersecciones y pistas poéticas en{' '}
            <strong className="text-emerald-300">{formatearTiempo(tiempo)}</strong>.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 border border-emerald-500/50 px-5 py-2.5 rounded-2xl text-emerald-200 font-black text-lg">
            <span> Puntaje:</span>
            <span>{score} puntos</span>
          </div>
          <div>
            <button
              onClick={() => setPuzzleIndex((idx) => idx + 1)}
              className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
            >
              Jugar Siguiente Crucigrama 
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
