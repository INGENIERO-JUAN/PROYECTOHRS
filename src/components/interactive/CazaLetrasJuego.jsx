import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';
import { lanzarConfeti } from '../../utils/confetti';

export default function CazaLetrasJuego({ modo = 'vocales' }) {
  const canvasRef = useRef(null);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  const [juegoActivo, setJuegoActivo] = useState(false);
  const [victoria, setVictoria] = useState(false);

  // Misiones según el modo
  const misiones = {
    vocales: {
      titulo: '¡Caza de Burbujas: Atrapa las Vocales!',
      objetivoTexto: 'Toca únicamente las burbujas que contengan una VOCAL (A, E, I, O, U)',
      esCorrecto: (t) => ['A', 'E', 'I', 'O', 'U'].includes(t.toUpperCase()),
      itemsValidos: ['A', 'E', 'I', 'O', 'U'],
      itemsFalsos: ['M', 'P', 'S', 'L', 'T', 'B', 'R', 'C']
    },
    rimas: {
      titulo: '¡Caza de Burbujas: Palabras que Riman con RATÓN!',
      objetivoTexto: 'Toca las burbujas que terminen con el sonido musical -ÓN',
      esCorrecto: (t) => t.endsWith('ÓN') || t.endsWith('ON'),
      itemsValidos: ['BOTÓN', 'CANCIÓN', 'CORAZÓN', 'BALÓN', 'LIMÓN'],
      itemsFalsos: ['CASA', 'ÁRBOL', 'PERRO', 'MESA', 'RÍO']
    }
  };

  const configMision = misiones[modo] || misiones.vocales;

  useEffect(() => {
    if (!juegoActivo || victoria || vidas <= 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    const burbujas = [];
    const colores = ['#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

    function crearBurbuja() {
      const todosItems = Math.random() > 0.45 ? configMision.itemsValidos : configMision.itemsFalsos;
      const texto = todosItems[Math.floor(Math.random() * todosItems.length)];
      burbujas.push({
        x: 40 + Math.random() * (canvas.width - 80),
        y: canvas.height + 40,
        radius: 35 + Math.random() * 10,
        vy: 1.6 + Math.random() * 1.4,
        color: colores[Math.floor(Math.random() * colores.length)],
        texto: texto,
        viva: true
      });
    }

    let frameCount = 0;

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (frameCount % 45 === 0) {
        crearBurbuja();
      }

      for (let i = burbujas.length - 1; i >= 0; i--) {
        const b = burbujas[i];
        b.y -= b.vy;

        // Dibujar burbuja brillante
        ctx.save();
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 12;
        ctx.fill();

        // Brillo de luz de burbuja
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.25, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fill();

        // Texto de la letra o palabra
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowBlur = 0;
        ctx.fillText(b.texto, b.x, b.y);
        ctx.restore();

        // Si se sale por arriba sin tocar
        if (b.y + b.radius < 0) {
          burbujas.splice(i, 1);
        }
      }

      frameCount++;
      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left;
      const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top;

      for (let i = burbujas.length - 1; i >= 0; i--) {
        const b = burbujas[i];
        const dist = Math.hypot(b.x - x, b.y - y);

        if (dist <= b.radius) {
          sounds.playPop();
          const acierto = configMision.esCorrecto(b.texto);

          if (acierto) {
            // Pronunciar letra o palabra acertada para niños que no saben leer
            if (modo === 'vocales') {
              voiceReader.speakLetter(b.texto);
            } else {
              voiceReader.speakWord(b.texto);
            }

            setPuntos((p) => {
              const nuevoPuntaje = p + 50;
              if (nuevoPuntaje >= 300) {
                sounds.playFanfare();
                lanzarConfeti();
                setVictoria(true);
                setJuegoActivo(false);
                voiceReader.speak("¡Misión cumplida! ¡Excelente puntería con las letras!");
              }
              return nuevoPuntaje;
            });
          } else {
            sounds.playWrong();
            voiceReader.speak("¡Cuidado, esa no es!");
            setVidas((v) => {
              const nuevasVidas = v - 1;
              if (nuevasVidas <= 0) {
                setJuegoActivo(false);
                voiceReader.speak("Se acabaron las vidas, ¡inténtalo otra vez!");
              }
              return nuevasVidas;
            });
          }

          burbujas.splice(i, 1);
          break;
        }
      }
    };

    canvas.addEventListener('mousedown', handleClick);
    canvas.addEventListener('touchstart', handleClick);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', handleClick);
      canvas.removeEventListener('touchstart', handleClick);
    };
  }, [juegoActivo, victoria, vidas, modo, configMision]);

  const iniciarJuego = () => {
    sounds.playClick();
    setPuntos(0);
    setVidas(3);
    setVictoria(false);
    setJuegoActivo(true);
    // Anunciar por voz el objetivo
    voiceReader.speak(`¡Atención! ${configMision.objetivoTexto}`);
  };

  return (
    <div className="bg-slate-900 rounded-4xl p-6 sm:p-9 shadow-2xl border-4 border-sky-400 text-white space-y-4">
      {/* Marcador Superior */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <span className="text-xs font-black text-sky-400 uppercase tracking-widest bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
            Mini-Juego de Destreza Táctil
          </span>
          <h3 className="text-2xl font-black text-white mt-1">
            {configMision.titulo}
          </h3>
          <p className="text-xs sm:text-sm text-sky-200 mt-0.5">
            🎯 {configMision.objetivoTexto}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-2xl">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < vidas ? 'animate-pulse' : 'opacity-20 grayscale'}>
                ❤️
              </span>
            ))}
          </div>

          <div className="bg-amber-400/20 border border-amber-400 px-4 py-2 rounded-2xl">
            <span className="text-amber-300 font-black text-base sm:text-lg">
              ⭐ {puntos} / 300 pts
            </span>
          </div>
        </div>
      </div>

      {/* Pantalla del Lienzo Interactivo */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-sky-800 bg-gradient-to-b from-slate-950 via-slate-900 to-sky-950 shadow-inner flex items-center justify-center">
        {!juegoActivo && !victoria && vidas > 0 && (
          <div className="text-center p-6 space-y-4 z-10 animate-fade-in">
            <span className="text-6xl block animate-bounce">🫧</span>
            <h4 className="text-2xl sm:text-3xl font-black text-white">
              ¿Listos para explotar burbujas en el tablero?
            </h4>
            <p className="text-sky-200 text-sm max-w-md mx-auto">
              Las burbujas flotarán hacia arriba. Toca rápido con tu dedo o mouse las correctas antes de que escapen.
            </p>
            <button
              onClick={iniciarJuego}
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg rounded-2xl shadow-xl border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all cursor-pointer"
            >
              ▶️ ¡Iniciar Misión en el Salón!
            </button>
          </div>
        )}

        {victoria && (
          <div className="text-center p-6 space-y-3 z-10 animate-fade-in">
            <span className="text-6xl block animate-bounce">🏆</span>
            <h4 className="text-3xl font-black text-emerald-400">
              ¡MISIÓN CUMPLIDA POR EL SALÓN!
            </h4>
            <p className="text-white font-bold text-lg">
              Alcanzaron 300 puntos sin perder sus vidas.
            </p>
            <button
              onClick={iniciarJuego}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-sm transition-transform active:scale-95 cursor-pointer"
            >
              🔄 Jugar Otra Ronda
            </button>
          </div>
        )}

        {!juegoActivo && vidas <= 0 && (
          <div className="text-center p-6 space-y-3 z-10 animate-fade-in">
            <span className="text-6xl block">💨</span>
            <h4 className="text-2xl font-black text-rose-400">
              ¡Se acabaron las vidas del equipo!
            </h4>
            <p className="text-slate-300 text-sm">
              Tocaron burbujas que no correspondían al objetivo. ¡Reintenten juntos!
            </p>
            <button
              onClick={iniciarJuego}
              className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-sm transition-transform active:scale-95 cursor-pointer"
            >
              🔄 Reintentar Desafío
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={700}
          height={380}
          className="w-full h-full block cursor-pointer select-none touch-none"
        />
      </div>
    </div>
  );
}
