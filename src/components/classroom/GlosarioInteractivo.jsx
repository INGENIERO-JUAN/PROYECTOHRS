import React, { useState } from 'react';
import { sounds } from '../../utils/audio';
import { voiceReader } from '../../utils/speech';

export const TERMINOS_GLOSARIO = [
  // Figuras Literarias
  {
    termino: 'Metáfora',
    categoria: 'Figuras Literarias',
    icono: '✨',
    definicion: 'Figura retórica que consiste en identificar un término real con uno imaginario, diciendo que una cosa "es" otra debido a su parecido.',
    ejemplo: 'Las gotas de rocío en el pasto son perlas brillantes del amanecer.',
    pistaSalón: '¿Qué dos cosas se comparan sin usar la palabra "como"?'
  },
  {
    termino: 'Símil o Comparación',
    categoria: 'Figuras Literarias',
    icono: '🔍',
    definicion: 'Figura que compara de forma directa dos elementos utilizando conectores como "como", "tal cual" o "parece".',
    ejemplo: 'El caballo corría tan veloz como el viento de la montaña.',
    pistaSalón: 'Busca la palabra mágica "como" para encontrar el símil.'
  },
  {
    termino: 'Personificación',
    categoria: 'Figuras Literarias',
    icono: '🦊',
    definicion: 'Recurso que atribuye cualidades o acciones humanas a animales, plantas o cosas inanimadas.',
    ejemplo: 'El río cantaba alegremente al chocar con las piedras del camino.',
    pistaSalón: '¿Puede un río cantar como una persona? ¡Eso es personificar!'
  },
  {
    termino: 'Hipérbole',
    categoria: 'Figuras Literarias',
    icono: '💥',
    definicion: 'Exageración intencional de la realidad para aumentar el impacto emocional o el humor en la narración.',
    ejemplo: 'Tengo tanta hambre que me comería una vaca entera al almuerzo.',
    pistaSalón: '¿Es posible en la realidad o es una gran exageración divertida?'
  },
  {
    termino: 'Aliteración',
    categoria: 'Figuras Literarias',
    icono: '🎶',
    definicion: 'Repetición intencionada de sonidos similares en un verso o frase para producir un efecto sonoro y rítmico.',
    ejemplo: 'En el silencio solo se escuchaba el susurro de las abejas que sonaban.',
    pistaSalón: 'Nota cómo se repite el sonido "s-s-s" como un zumbido.'
  },
  {
    termino: 'Onomatopeya',
    categoria: 'Figuras Literarias',
    icono: '🔔',
    definicion: 'Palabra que imita o recrea el sonido de una acción, un animal o un objeto.',
    ejemplo: '¡Quiquiriquí! cantaba el gallo, y el reloj hacía ¡tic, tac, tic, tac!',
    pistaSalón: 'Imiten en voz alta el sonido que hace el objeto.'
  },

  // Tradición Oral y Mundo Rural
  {
    termino: 'La Madremonte',
    categoria: 'Tradición Oral y Campo',
    icono: '🌿',
    definicion: 'Personaje mítico de las montañas colombianas, guardiana celosa de los bosques, las selvas y los nacimientos de agua.',
    ejemplo: 'Los leñadores cuidan de no talar árboles verdes para no despertar la furia de la Madremonte.',
    pistaSalón: '¿Por qué nuestros abuelos inventaban mitos para cuidar los ríos y árboles?'
  },
  {
    termino: 'El Mohán',
    categoria: 'Tradición Oral y Campo',
    icono: '🌊',
    definicion: 'Ser mitológico que habita en las profundidades de los grandes ríos, lagunas y charcos, amante de la pesca y el tabaco.',
    ejemplo: 'Los pescadores ribereños le dejan tabaco y café al Mohán para tener buena pesca.',
    pistaSalón: '¿Qué leyendas del río o de la quebrada conocen en su vereda?'
  },
  {
    termino: 'La Patasola',
    categoria: 'Tradición Oral y Campo',
    icono: '🌲',
    definicion: 'Espíritu de la selva con una sola pierna que protege la fauna silvestre y castiga a los cazadores furtivos.',
    ejemplo: 'La Patasola avisa a los ciervos y pavas para que huyan de las trampas de los cazadores.',
    pistaSalón: 'Este relato tradicional enseña el respeto hacia los animales del bosque.'
  },
  {
    termino: 'Minga / Ayni',
    categoria: 'Tradición Oral y Campo',
    icono: '🤝',
    definicion: 'Antigua tradición comunitaria campesina e indígena donde todos los vecinos se unen para trabajar la tierra o construir sin cobrar dinero, recibiendo a cambio comida y ayuda recíproca.',
    ejemplo: 'Toda la vereda se reunió en minga el sábado para arreglar el camino hacia la escuela.',
    pistaSalón: 'La minga demuestra que la unión y la solidaridad hacen grande a una comunidad.'
  },
  {
    termino: 'Trapiche',
    categoria: 'Tradición Oral y Campo',
    icono: '🪵',
    definicion: 'Molino tradicional movido por bestias o motor donde se extrae el jugo dulce de la caña para fabricar panela en paila.',
    ejemplo: 'Del trapiche sale un aroma delicioso a melao caliente que perfuma toda la vereda.',
    pistaSalón: '¿Quién ha visto cómo se muele la caña de azúcar para hacer la panela?'
  },
  {
    termino: 'Copla Popular',
    categoria: 'Tradición Oral y Campo',
    icono: '🪕',
    definicion: 'Composición poética popular de cuatro versos de arte menor (octosílabos), con rima en el segundo y cuarto verso, típica de fiestas campesinas.',
    ejemplo: 'Ayer pasé por tu casa / y me tiraste un limón, / el limón cayó en el suelo / y el jugo en mi corazón.',
    pistaSalón: '¡Canten esta copla marcando el ritmo con las palmas!'
  },
  {
    termino: 'Trova',
    categoria: 'Tradición Oral y Campo',
    icono: '🎙️',
    definicion: 'Canto improvisado en rima entre dos o más trovadores que se responden mutuamente con humor, picardía e ingenio.',
    ejemplo: 'Los troveros compiten frente al público inventando versos en menos de diez segundos.',
    pistaSalón: '¿Quién en el salón se anima a improvisar un verso para un compañero?'
  },

  // Gramática y Palabras
  {
    termino: 'Sustantivo Propio',
    categoria: 'Gramática y Palabras',
    icono: '🏷️',
    definicion: 'Palabra que nombra de manera individual y única a una persona, animal, pueblo o río. Siempre se escribe con mayúscula inicial.',
    ejemplo: 'Colombia, Magdalena, María, San Isidro, Bogotá.',
    pistaSalón: 'Tu propio nombre y el nombre de tu vereda son sustantivos propios.'
  },
  {
    termino: 'Sustantivo Común',
    categoria: 'Gramática y Palabras',
    icono: '📦',
    definicion: 'Palabra que nombra a cualquier ser, animal, planta o cosa de la misma especie sin distinguirlo de los demás.',
    ejemplo: 'perro, montaña, lápiz, árbol, casa, río.',
    pistaSalón: 'Mira a tu alrededor: casi todo lo que puedes tocar es un sustantivo común.'
  },
  {
    termino: 'Adjetivo Calificativo',
    categoria: 'Gramática y Palabras',
    icono: '🎨',
    definicion: 'Palabra que acompaña al sustantivo para indicar cómo es o qué cualidad tiene (color, tamaño, forma, sabor).',
    ejemplo: 'café caliente, flor aromática, cerro imponente, niño inteligente.',
    pistaSalón: 'Haz la pregunta: ¿Cómo es? La respuesta es el adjetivo.'
  },
  {
    termino: 'Verbo',
    categoria: 'Gramática y Palabras',
    icono: '🏃',
    definicion: 'Palabra que expresa acciones, estados o procesos que realiza el sujeto en un tiempo determinado (presente, pasado o futuro).',
    ejemplo: 'sembrar, cosechó, cantará, leemos, corrieron.',
    pistaSalón: 'Todo lo que implique movimiento o pensamiento es un verbo.'
  },
  {
    termino: 'Palabra Polisémica',
    categoria: 'Gramática y Palabras',
    icono: '💎',
    definicion: 'Palabra que tiene dos o más significados distintos según el contexto de la oración.',
    ejemplo: 'Banco (asiento para descansar en el parque) y Banco (entidad donde se guarda dinero).',
    pistaSalón: '¿Qué significa la palabra "hoja"? ¡Hoja de árbol y hoja de cuaderno!'
  },
  {
    termino: 'Sinónimos',
    categoria: 'Gramática y Palabras',
    icono: '👯',
    definicion: 'Palabras distintas que tienen un significado igual o muy semejante.',
    ejemplo: 'alegre / contento, veloz / rápido, sendero / camino.',
    pistaSalón: 'Usar sinónimos hace que tus escritos no repitan la misma palabra.'
  },
  {
    termino: 'Antónimos',
    categoria: 'Gramática y Palabras',
    icono: '⚖️',
    definicion: 'Palabras que tienen significados opuestos o contrarios entre sí.',
    ejemplo: 'alto / bajo, claro / oscuro, subir / bajar, paz / guerra.',
    pistaSalón: 'Piensa en lo exactamente opuesto para encontrar el antónimo.'
  },
  {
    termino: 'Sílaba Tónica',
    categoria: 'Gramática y Palabras',
    icono: '🔊',
    definicion: 'La sílaba que se pronuncia con mayor fuerza de voz dentro de una palabra.',
    ejemplo: 'En ca-mi-NO, la sílaba tónica es "NO". En ÁR-bol, la sílaba tónica es "ÁR".',
    pistaSalón: 'Da un aplauso fuerte en la sílaba que suena con más poder.'
  },
  {
    termino: 'Sujeto y Predicado',
    categoria: 'Gramática y Palabras',
    icono: '🧩',
    definicion: 'Las dos partes fundamentales de una oración. El sujeto indica quién realiza la acción; el predicado dice qué hace o qué se dice del sujeto.',
    ejemplo: '[Los campesinos madrugadores] (sujeto) [cosechan el café maduro] (predicado).',
    pistaSalón: 'Pregunta: ¿Quién realiza la acción? Eso es el Sujeto.'
  },

  // Géneros Literarios
  {
    termino: 'Fábula',
    categoria: 'Géneros Literarios',
    icono: '🐢',
    definicion: 'Relato breve ficticio, generalmente protagonizado por animales que hablan, que culmina con una enseñanza moral llamada moraleja.',
    ejemplo: 'La liebre y la tortuga, donde la constancia venció a la vanidad.',
    pistaSalón: 'Toda fábula busca enseñarnos una lección de vida y convivencia.'
  },
  {
    termino: 'Moraleja',
    categoria: 'Géneros Literarios',
    icono: '💡',
    definicion: 'Enseñanza moral, ética o consejo práctico que se extrae al final de una fábula o relato pedagógico.',
    ejemplo: 'Moraleja: "Quien mucho abarca, poco aprieta".',
    pistaSalón: '¿Qué lección podemos aplicar en el salón después de escuchar la fábula?'
  },
  {
    termino: 'Mito',
    categoria: 'Géneros Literarios',
    icono: '☀️',
    definicion: 'Relato sagrado tradicional de los pueblos antiguos que intenta explicar el origen del universo, los astros, los fenómenos naturales o los seres humanos.',
    ejemplo: 'El mito chibcha de Bachué y el origen de los seres humanos desde la laguna de Iguaque.',
    pistaSalón: 'Los mitos explican los grandes misterios del mundo con dioses y héroes.'
  },
  {
    termino: 'Leyenda',
    categoria: 'Géneros Literarios',
    icono: '🕯️',
    definicion: 'Narración de hechos con base histórica o verídica que con el paso de los años se ha transformado con elementos fantásticos y sobrenaturales.',
    ejemplo: 'La leyenda de El Dorado y la balsa muisca de oro.',
    pistaSalón: 'La leyenda ocurre en un lugar real y conocido por la comunidad.'
  },
  {
    termino: 'Realismo Mágico',
    categoria: 'Géneros Literarios',
    icono: '🦋',
    definicion: 'Movimiento literario latinoamericano (creado por Gabriel García Márquez) donde elementos fantásticos o insólitos se presentan como parte normal de la vida cotidiana.',
    ejemplo: 'Las mariposas amarillas que revolotean anunciando la llegada de Mauricio Babilonia en Cien años de soledad.',
    pistaSalón: 'Es mágico para el lector, pero completamente natural para los personajes.'
  },
  {
    termino: 'El Ensayo',
    categoria: 'Géneros Literarios',
    icono: '📝',
    definicion: 'Texto en prosa donde el autor reflexiona, analiza y expone sus propios argumentos y opiniones sobre un tema específico, respaldado con razones.',
    ejemplo: 'Un ensayo sobre el cuidado del agua en las veredas cafeteras de Colombia.',
    pistaSalón: 'En el ensayo no solo informas: ¡defiendes tu punto de vista con razones sólidas!'
  }
];

export default function GlosarioInteractivo() {
  const [busqueda, setBusqueda] = useState('');
  const [categoriaActiva, setCategoriaActiva] = useState('Todos');
  const [palabraAudio, setPalabraAudio] = useState(null);

  const categorias = ['Todos', 'Figuras Literarias', 'Tradición Oral y Campo', 'Gramática y Palabras', 'Géneros Literarios'];

  // Término del Día (índice según el día de la semana para rotación)
  const diaIndice = new Date().getDay() % TERMINOS_GLOSARIO.length;
  const terminoDelDia = TERMINOS_GLOSARIO[diaIndice];

  const terminosFiltrados = TERMINOS_GLOSARIO.filter((item) => {
    const coincideCategoria = categoriaActiva === 'Todos' || item.categoria === categoriaActiva;
    const coincideBusqueda =
      item.termino.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.definicion.toLowerCase().includes(busqueda.toLowerCase()) ||
      item.ejemplo.toLowerCase().includes(busqueda.toLowerCase());
    return coincideCategoria && coincideBusqueda;
  });

  const escucharPronunciacion = (item) => {
    sounds.playClick();
    setPalabraAudio(item.termino);
    const textoAudio = `${item.termino}. ${item.definicion}. Por ejemplo: ${item.ejemplo}`;
    voiceReader.speak(textoAudio, () => {
      setPalabraAudio(null);
    });
  };

  return (
    <div className="bg-white rounded-4xl p-6 sm:p-10 shadow-xl border-4 border-amber-300 space-y-8 animate-fade-in">
      {/* Encabezado del Glosario */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-3xl flex items-center justify-center text-4xl border-2 border-amber-300 shadow-inner">
            📚
          </div>
          <div>
            <span className="text-xs font-black text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              Diccionario Pedagógico y Conceptual
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mt-1">
              Glosario de Lengua Castellana y Literatura
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-bold">
              Explora términos literarios, gramaticales y tradiciones de nuestro entorno escolar.
            </p>
          </div>
        </div>

        {/* Buscador Rápido */}
        <div className="w-full md:w-72 relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar término o ejemplo..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-amber-400 focus:bg-white text-xs sm:text-sm font-bold text-slate-800 outline-none transition-all"
          />
          <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm">🔍</span>
          {busqueda && (
            <button
              onClick={() => setBusqueda('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 font-black text-sm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* TARJETA DESTACADA: "TÉRMINO DEL DÍA" */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-lg border-2 border-amber-300 relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="bg-yellow-300 text-yellow-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <span>⭐</span> Término Destacado de la Clase
            </span>
            <button
              onClick={() => escucharPronunciacion(terminoDelDia)}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-black border border-white/40 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{palabraAudio === terminoDelDia.termino ? '⏹️' : '🔊'}</span>
              <span>{palabraAudio === terminoDelDia.termino ? 'Escuchando...' : 'Escuchar Voz'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{terminoDelDia.icono}</span>
            <h4 className="text-2xl sm:text-3xl font-black drop-shadow-sm">
              {terminoDelDia.termino}
            </h4>
          </div>

          <p className="text-amber-100 text-sm sm:text-base font-semibold leading-relaxed">
            {terminoDelDia.definicion}
          </p>

          <div className="bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/20">
            <p className="text-xs sm:text-sm font-bold text-yellow-200">
              📌 <strong>Ejemplo en clase:</strong> "{terminoDelDia.ejemplo}"
            </p>
          </div>
        </div>
      </div>

      {/* FILTROS DE CATEGORÍAS */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => { sounds.playClick(); setCategoriaActiva(cat); }}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer border-b-3 active:border-b-0 active:translate-y-0.5 ${
              categoriaActiva === cat
                ? 'bg-amber-500 text-white border-amber-700 shadow-md scale-105'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID DE TÉRMINOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {terminosFiltrados.map((item, idx) => {
          const reproduciendo = palabraAudio === item.termino;
          return (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.icono}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200">
                    {item.categoria}
                  </span>
                </div>

                <h5 className="text-xl font-black text-slate-800 group-hover:text-amber-700 transition-colors">
                  {item.termino}
                </h5>

                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {item.definicion}
                </p>

                <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200/60 text-xs font-bold text-amber-950">
                  <span className="block text-[10px] uppercase tracking-wider text-amber-600 mb-0.5">Ejemplo:</span>
                  "{item.ejemplo}"
                </div>

                {item.pistaSalón && (
                  <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-200 text-[11px] font-bold text-emerald-900 flex items-start gap-1.5">
                    <span>💡</span>
                    <span>{item.pistaSalón}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200/80 mt-4 flex items-center justify-between">
                <button
                  onClick={() => escucharPronunciacion(item)}
                  className={`w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    reproduciendo
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-slate-200 hover:bg-amber-500 hover:text-white text-slate-700'
                  }`}
                >
                  <span>{reproduciendo ? '⏹️' : '🔊'}</span>
                  <span>{reproduciendo ? 'Detener Voz' : 'Escuchar Voz'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {terminosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-300">
          <span className="text-4xl block mb-2">🔍</span>
          <p className="font-black text-slate-700 text-base">No se encontraron términos con ese filtro.</p>
          <p className="text-xs text-slate-500 font-bold mt-1">Prueba escribiendo otra palabra o selecciona "Todos".</p>
        </div>
      )}
    </div>
  );
}
