import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

const MISIONES_NINJA = [
  {
    id: 'm-silabas',
    nombre: 'Misión 1: Familia de la Letra M (1° Grado)',
    objetivo: '¡Corta únicamente las sílabas con la letra M (MA, ME, MI, MO, MU)!',
    instruccionVoz: 'Atención ninja: corta únicamente las sílabas con la letra M.',
    esValido: (t) => ['MA', 'ME', 'MI', 'MO', 'MU'].includes(t.toUpperCase()),
    validos: ['MA', 'ME', 'MI', 'MO', 'MU'],
    falsos: ['PA', 'SO', 'LE', 'TI', 'NU', 'CA', 'RO'],
    colorBurbuja: '#f59e0b',
    icono: ''
  },
  {
    id: 'p-silabas',
    nombre: 'Misión 2: Familia de la Letra P (1° Grado)',
    objetivo: '¡Corta únicamente las sílabas con la letra P (PA, PE, PI, PO, PU)!',
    instruccionVoz: 'Atención ninja: corta únicamente las sílabas con la letra P.',
    esValido: (t) => ['PA', 'PE', 'PI', 'PO', 'PU'].includes(t.toUpperCase()),
    validos: ['PA', 'PE', 'PI', 'PO', 'PU'],
    falsos: ['MA', 'TE', 'LU', 'SA', 'DO', 'BE', 'RO'],
    colorBurbuja: '#3b82f6',
    icono: ''
  },
  {
    id: 'rimas-ninja',
    nombre: 'Misión 3: Rimas Musicales en -ÓN (2° a 3° Grado)',
    objetivo: '¡Corta las palabras que riman con RATÓN (-ón)!',
    instruccionVoz: 'Atención ninja: corta las palabras que riman con ratón, que terminen en ón.',
    esValido: (t) => t.toUpperCase().endsWith('ÓN') || t.toUpperCase().endsWith('ON'),
    validos: ['BOTÓN', 'CANCIÓN', 'CORAZÓN', 'BALÓN', 'LIMÓN', 'JABÓN'],
    falsos: ['CASA', 'ÁRBOL', 'PERRO', 'MESA', 'RÍO', 'SOL', 'FLOR'],
    colorBurbuja: '#ec4899',
    icono: ''
  },
  {
    id: 'verbos-ninja',
    nombre: 'Misión 4: Caza de Verbos de Acción (4° a 5° Grado)',
    objetivo: '¡Corta únicamente los VERBOS (acciones en infinitivo)!',
    instruccionVoz: 'Atención ninja: corta únicamente los verbos de acción.',
    esValido: (t) => ['CANTAR', 'CORRER', 'SALTAR', 'ESCRIBIR', 'BAILAR', 'LEER', 'NADAR', 'DIBUJAR'].includes(t.toUpperCase()),
    validos: ['CANTAR', 'CORRER', 'SALTAR', 'ESCRIBIR', 'BAILAR', 'LEER', 'NADAR', 'DIBUJAR'],
    falsos: ['AZUL', 'CASA', 'GRANDE', 'MESA', 'ALEGRE', 'VERDE', 'SOL', 'RÍO'],
    colorBurbuja: '#10b981',
    icono: ''
  },
  {
    id: 'esdrujulas-ninja',
    nombre: 'Misión 5: Palabras Esdrújulas con Tilde (6° a 7° Grado)',
    objetivo: '¡Corta las palabras ESDRÚJULAS (acento antepenúltima sílaba)!',
    instruccionVoz: 'Atención ninja: corta las palabras esdrújulas con su tilde antepenúltima.',
    esValido: (t) => ['MÚSICA', 'PÁJARO', 'MÉTRICA', 'BRÚJULA', 'SÍLABA', 'LÁMPARA', 'CÁNTARO', 'CRÓNICA'].includes(t.toUpperCase()),
    validos: ['MÚSICA', 'PÁJARO', 'MÉTRICA', 'BRÚJULA', 'SÍLABA', 'LÁMPARA', 'CÁNTARO', 'CRÓNICA'],
    falsos: ['CAFÉ', 'RATÓN', 'ÁRBOL', 'CÁRCEL', 'RELOJ', 'PAPEL', 'PARED', 'CANCIÓN'],
    colorBurbuja: '#8b5cf6',
    icono: ''
  },
  {
    id: 'figuras-ninja',
    nombre: 'Misión 6: Figuras Retóricas y Términos Literarios (8° a 9° Grado)',
    objetivo: '¡Corta únicamente las FIGURAS RETÓRICAS reconocidas!',
    instruccionVoz: 'Atención ninja de secundaria: corta únicamente los nombres de figuras retóricas.',
    esValido: (t) => ['METÁFORA', 'SÍMIL', 'HIPÉRBOLE', 'ANÁFORA', 'OXÍMORON', 'IRONÍA'].includes(t.toUpperCase()),
    validos: ['METÁFORA', 'SÍMIL', 'HIPÉRBOLE', 'ANÁFORA', 'OXÍMORON', 'IRONÍA'],
    falsos: ['SUJETO', 'PÁRRAFO', 'CÓDIGO', 'CANAL', 'VERBO', 'TILDE', 'SÍLABA', 'COMA'],
    colorBurbuja: '#f43f5e',
    icono: ''
  }
];

export default function LluviaSilabasNinja({ gradoNumero = 1 }) {
  const [misionIndex, setMisionIndex] = useState(() => {
    if (gradoNumero <= 2) return 0;
    if (gradoNumero <= 3) return 1;
    if (gradoNumero <= 5) return 2;
    return 3;
  });

  const mision = MISIONES_NINJA[misionIndex % MISIONES_NINJA.length];

  const canvasRef = useRef(null);
  const [juegoActivo, setJuegoActivo] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [combo, setCombo] = useState(0);
  const [feverMode, setFeverMode] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(45);
  const [partidaFinalizada, setPartidaFinalizada] = useState(false);
  const [flotantes, setFlotantes] = useState([]); // Textos flotantes (+100! COMBO!)

  // Iniciar partida
  const iniciarJuego = () => {
    sounds.playClick();
    sounds.playLevelUp();
    setPuntos(0);
    setCombo(0);
    setFeverMode(false);
    setTiempoRestante(45);
    setPartidaFinalizada(false);
    setJuegoActivo(true);

    voiceReader.speak(mision.instruccionVoz);
  };

  // Cronómetro
  useEffect(() => {
    if (!juegoActivo || partidaFinalizada) return;

    if (tiempoRestante <= 0) {
      setJuegoActivo(false);
      setPartidaFinalizada(true);
      sounds.playFanfare();
      lanzarConfeti();
      GameProgress.addXP(puntos);
      voiceReader.speak(`¡Tiempo cumplido! Lograste una puntuación récord de ${puntos} puntos.`);
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((t) => {
        if (t <= 5 && t > 0) sounds.playTick();
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [juegoActivo, tiempoRestante, partidaFinalizada, puntos]);

  // Motor Canvas de Objetos Voladores (Loop de Física y Partículas)
  useEffect(() => {
    if (!juegoActivo || partidaFinalizada) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const items = [];
    const particulas = [];
    let frame = 0;

    // Crear ítem volador
    function spawnItem() {
      const esValido = Math.random() > 0.42;
      const pool = esValido ? mision.validos : mision.falsos;
      const texto = pool[Math.floor(Math.random() * pool.length)];

      items.push({
        x: 40 + Math.random() * (canvas.width - 80),
        y: canvas.height + 40,
        vx: (Math.random() - 0.5) * 2.5,
        vy: -(6 + Math.random() * 3.5), // Impulso hacia arriba como Fruit Ninja
        gravity: 0.14,
        radius: 36,
        texto,
        esValido,
        cortado: false,
        color: esValido ? mision.colorBurbuja : '#64748b',
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 4
      });
    }

    // Loop
    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fondo dinámico si hay Fever Mode
      if (feverMode) {
        ctx.fillStyle = 'rgba(234, 88, 12, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Generar ítems a ritmo constante
      if (frame % (feverMode ? 32 : 45) === 0) {
        spawnItem();
      }

      // Dibujar y actualizar partículas
      for (let pIdx = particulas.length - 1; pIdx >= 0; pIdx--) {
        const pt = particulas[pIdx];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.2;
        pt.alpha -= 0.03;
        if (pt.alpha <= 0) {
          particulas.splice(pIdx, 1);
          continue;
        }
        ctx.save();
        ctx.globalAlpha = pt.alpha;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Dibujar y actualizar ítems
      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        it.x += it.vx;
        it.y += it.vy;
        it.vy += it.gravity;
        it.rotation += it.vRot;

        // Si ya cayó fuera por abajo
        if (it.y > canvas.height + 80 && it.vy > 0) {
          items.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(it.x, it.y);

        // Si fue cortado, dibujar dos mitades separándose
        if (it.cortado) {
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = it.color;
          ctx.beginPath();
          ctx.arc(0, 0, it.radius * 0.7, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          continue;
        }

        // Círculo exterior brillante con sombra
        ctx.beginPath();
        ctx.arc(0, 0, it.radius, 0, Math.PI * 2);
        ctx.fillStyle = it.color;
        ctx.shadowColor = it.color;
        ctx.shadowBlur = feverMode ? 22 : 12;
        ctx.fill();

        // Borde dorado si es fiebre
        if (feverMode) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = '#fef08a';
          ctx.stroke();
        }

        // Brillo blanco de burbuja
        ctx.beginPath();
        ctx.arc(-it.radius * 0.3, -it.radius * 0.3, it.radius * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
        ctx.fill();

        // Texto centrado
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 18px "Plus Jakarta Sans", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(it.texto, 0, 0);

        ctx.restore();
      }

      frame++;
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    // Detección de Corte / Touch / Clic
    const handleSlice = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      const x = (clientX - rect.left) * (canvas.width / rect.width);
      const y = (clientY - rect.top) * (canvas.height / rect.height);

      for (let i = items.length - 1; i >= 0; i--) {
        const it = items[i];
        if (it.cortado) continue;

        const dist = Math.hypot(it.x - x, it.y - y);
        if (dist <= it.radius + 15) {
          it.cortado = true;
          sounds.playSlash();

          // Explosión de partículas
          for (let p = 0; p < 12; p++) {
            particulas.push({
              x: it.x,
              y: it.y,
              vx: (Math.random() - 0.5) * 8,
              vy: (Math.random() - 0.5) * 8,
              radius: 4 + Math.random() * 4,
              color: it.color,
              alpha: 1
            });
          }

          if (it.esValido) {
            // Sonido y voz de la sílaba o letra
            voiceReader.speakSyllable(it.texto);

            setCombo((c) => {
              const nuevoCombo = c + 1;
              sounds.playCombo(nuevoCombo);
              if (nuevoCombo >= 4) {
                setFeverMode(true);
              }
              const puntosBase = feverMode ? 250 : 120;
              const bonus = nuevoCombo * 30;
              setPuntos((p) => p + puntosBase + bonus);

              // Texto flotante
              setFlotantes((prev) => [
                ...prev.slice(-3),
                { id: Math.random(), texto: `+${puntosBase + bonus}! x${nuevoCombo}`, x: it.x, y: it.y }
              ]);

              return nuevoCombo;
            });
          } else {
            // Cortó un distractor falso
            sounds.playWrong();
            setCombo(0);
            setFeverMode(false);
            setPuntos((p) => Math.max(0, p - 60));
            voiceReader.speak(`¡Cuidado, ${it.texto} no cumple la misión!`);
          }

          break;
        }
      }
    };

    canvas.addEventListener('mousedown', handleSlice);
    canvas.addEventListener('touchstart', handleSlice);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleSlice);
      canvas.removeEventListener('touchstart', handleSlice);
    };
  }, [juegoActivo, partidaFinalizada, mision, feverMode]);

  return (
    <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-4xl p-5 sm:p-8 shadow-2xl border-4 border-amber-400 text-white space-y-6">
      {/* Cabecera y Selector de Misiones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full uppercase tracking-wider mb-1">
             Acción Rápida con Combos y Puntos
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white mt-1 flex items-center gap-2">
             Lluvia de Sílabas Ninja
          </h3>
          <p className="text-xs sm:text-sm text-amber-300 font-bold mt-0.5">
             {mision.objetivo}
          </p>
        </div>

        {/* Misiones por Grado */}
        <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-indigo-800">
          {MISIONES_NINJA.map((m, idx) => (
            <button
              key={m.id}
              onClick={() => {
                sounds.playClick();
                setMisionIndex(idx);
                setJuegoActivo(false);
                setPartidaFinalizada(false);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                misionIndex === idx
                  ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{m.icono}</span> M{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Marcadores Superiores: Tiempo, Puntos, Combo y Modo Fiebre */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-3xl border-2 border-indigo-800/80">
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl border-2 shadow-inner ${
              tiempoRestante <= 10
                ? 'bg-rose-600 text-white border-rose-300 animate-pulse'
                : 'bg-indigo-950 text-amber-300 border-indigo-700'
            }`}
          >
            {tiempoRestante}s
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              Puntos Ninja:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400">
               {puntos}
            </span>
          </div>

          {combo > 1 && (
            <div className="bg-orange-500 text-white font-black text-xs sm:text-sm px-3 py-1.5 rounded-xl animate-bounce shadow-md flex items-center gap-1">
              
              <span>COMBO x{combo}!</span>
            </div>
          )}

          {feverMode && (
            <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white font-black text-xs uppercase px-3 py-1.5 rounded-xl animate-pulse shadow-lg border border-yellow-200">
               ¡MODO FIEBRE!
            </div>
          )}
        </div>

        <button
          onClick={() => voiceReader.speak(mision.instruccionVoz)}
          className="px-4 py-2 bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 rounded-xl text-xs font-bold border border-indigo-700 cursor-pointer flex items-center gap-1.5 transition-all"
        >
           Recordar Misión
        </button>
      </div>

      {/* Lienzo Interactivo Canvas estilo Videojuego Ninja */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-4 border-indigo-700 bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 shadow-2xl flex items-center justify-center select-none">
        {/* Pantalla Inicial antes de jugar */}
        {!juegoActivo && !partidaFinalizada && (
          <div className="text-center p-6 space-y-4 z-10 animate-fade-in max-w-md">
            
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              ¿Listo para cortar con tus dedos a toda velocidad?
            </h4>
            <p className="text-amber-200 text-sm font-semibold">
              {mision.objetivo} Las burbujas saltarán por el aire. ¡Tócalas o córtalas antes de que caigan!
            </p>
            <button
              onClick={iniciarJuego}
              className="px-8 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-lg rounded-2xl shadow-xl border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            >
              ▶ ¡INICIAR DESAFÍO NINJA!
            </button>
          </div>
        )}

        {/* Pantalla Final de Puntuación */}
        {partidaFinalizada && (
          <div className="text-center p-6 space-y-4 z-10 animate-fade-in max-w-md bg-slate-900/90 rounded-3xl border-3 border-amber-400 p-8 shadow-2xl">
            
            <h4 className="text-3xl font-black text-amber-400">
              ¡PARTIDA NINJA COMPLETADA!
            </h4>
            <p className="text-slate-200 text-sm font-bold">
              Cosechaste una puntuación impresionante:
            </p>
            <div className="text-4xl font-black text-emerald-400">
              {puntos} Puntos 
            </div>
            <button
              onClick={iniciarJuego}
              className="px-8 py-3.5 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-base rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
               Jugar de Nuevo
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={700}
          height={380}
          className="w-full h-full block cursor-crosshair select-none touch-none"
        />
      </div>
    </div>
  );
}
