import React, { useRef, useState, useEffect } from 'react';
import { sounds } from '../utils/audio';

/**
 * PizarraDigital - Pizarra interactiva para el salón de clase.
 * Permite a los estudiantes pasar al tablero a trazar vocales, letras,
 * subrayar ideas o dibujar personajes de las lecturas.
 */
export default function PizarraDigital({ tituloGuia = "Pizarra Mágica del Salón" }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#10b981'); // Tiza esmeralda por defecto
  const [lineWidth, setLineWidth] = useState(5);
  const [modoBorrador, setModoBorrador] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Configurar resolución interna del canvas
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fondo verde pizarra escolar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = modoBorrador ? '#1e293b' : color;
    ctx.lineWidth = modoBorrador ? lineWidth * 3 : lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const limpiarPizarra = () => {
    sounds.playClick();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, rect.width, rect.height);
  };

  const paletaColores = [
    { nombre: 'Tiza Blanca', hex: '#ffffff' },
    { nombre: 'Tiza Amarilla', hex: '#facc15' },
    { nombre: 'Tiza Verde', hex: '#4ade80' },
    { nombre: 'Tiza Azul', hex: '#38bdf8' },
    { nombre: 'Tiza Rosa', hex: '#f472b6' }
  ];

  return (
    <div className="bg-slate-900 rounded-4xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-white space-y-4">
      {/* Cabecera de la Pizarra */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">️</span>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-amber-300">
              Pizarra Escolar Interactiva
            </h3>
            <p className="text-xs text-slate-400 font-semibold">
              Pasa al frente y traza letras, palabras o dibuja personajes de: <em>{tituloGuia}</em>
            </p>
          </div>
        </div>

        {/* Herramientas de trazo */}
        <div className="flex flex-wrap items-center gap-2">
          {paletaColores.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                sounds.playClick();
                setColor(c.hex);
                setModoBorrador(false);
              }}
              style={{ backgroundColor: c.hex }}
              title={c.nombre}
              className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                color === c.hex && !modoBorrador ? 'scale-125 border-white shadow-lg' : 'border-slate-600'
              }`}
            />
          ))}

          <button
            onClick={() => {
              sounds.playClick();
              setModoBorrador(!modoBorrador);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              modoBorrador
                ? 'bg-amber-400 text-slate-950 font-black'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
             Borrador
          </button>

          <button
            onClick={limpiarPizarra}
            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            ️ Limpiar Todo
          </button>
        </div>
      </div>

      {/* Área del Lienzo Canvas Táctil */}
      <div className="w-full h-80 sm:h-96 rounded-3xl overflow-hidden border-2 border-slate-700 cursor-crosshair touch-none shadow-inner bg-slate-900">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full block"
        />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
        <span> Tip: En pantallas táctiles o tablets de la escuela, puedes dibujar directamente con tu dedo.</span>
        <span>Grosor: 
          <input
            type="range"
            min="2"
            max="16"
            value={lineWidth}
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="ml-2 accent-amber-400 cursor-pointer align-middle"
          />
        </span>
      </div>
    </div>
  );
}
