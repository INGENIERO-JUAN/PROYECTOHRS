import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { lanzarConfeti } from '../../utils/confetti';
import { GameProgress } from '../../utils/gamification';

/* ─────────────────────────────────────────────
   Banco de pasajes — temas de educación secundaria colombiana
   Cada pasaje: { texto (con errores), palabras[], errores{índice → corrección} }
   ───────────────────────────────────────────── */

const PASAJES_POR_GRADO = {
  3: [
    {
      titulo: 'El Frailejón Ernesto Pérez en el Páramo',
      palabras: [
        'En','el','paramo','vive','Ernesto','el','frailejon.','El','cuida','el','agua',
        'para','todo','el','mundo.','Sus','ojas','son','suaves','y','verdes.',
        'Los','niños','deven','cuidar','la','naturaleza.'
      ],
      errores: {
        2:  { correcto: 'páramo',     tipo: 'Tilde: paramo → páramo' },
        6:  { correcto: 'frailejón.', tipo: 'Tilde: frailejon → frailejón' },
        16: { correcto: 'hojas',      tipo: 'Ortografía h: ojas → hojas' },
        23: { correcto: 'deben',      tipo: 'Ortografía b/v: deven → deben' },
      },
    },
    {
      titulo: 'La Mariposa Azul del Chocó',
      palabras: [
        'En','la','selva','del','Choco','vuela','una','mariposa','asul.',
        'A','ella','le','gusta','el','nectar','de','las','flores.',
        'Los','arboles','altos','le','dan','sombra.',
        'Ella','es','muy','rapida','y','alegre.'
      ],
      errores: {
        4:  { correcto: 'Chocó',    tipo: 'Tilde: Choco → Chocó' },
        8:  { correcto: 'azul.',    tipo: 'Ortografía s/z: asul → azul' },
        14: { correcto: 'néctar',   tipo: 'Tilde: nectar → néctar' },
        19: { correcto: 'árboles',  tipo: 'Tilde: arboles → árboles' },
        27: { correcto: 'rápida',   tipo: 'Tilde: rapida → rápida' },
      },
    },
  ],
  4: [
    {
      titulo: 'El Cóndor de los Andes',
      palabras: [
        'El','condor','es','el','ave','mas','grande','de','nuestra','patria.',
        'Vuela','sobre','las','montañas','nevadas.',
        'En','el','escudo','de','Colombia','lleba','una','corona','de','laurel.',
        'Es','un','simbolo','de','libertad','y','orgullo','nacional.'
      ],
      errores: {
        1:  { correcto: 'cóndor',   tipo: 'Tilde: condor → cóndor' },
        5:  { correcto: 'más',      tipo: 'Tilde: mas → más' },
        20: { correcto: 'lleva',    tipo: 'Ortografía b/v: lleba → lleva' },
        27: { correcto: 'símbolo',  tipo: 'Tilde: simbolo → símbolo' },
      },
    },
    {
      titulo: 'Bochica y el Salto del Tequendama',
      palabras: [
        'Segun','la','leyenda','muisca,','la','sabana','de','Bogota','se','inundo','por','las','lluvias.',
        'Bochica','toco','las','rocas','con','su','baston','de','oro.',
        'El','agua','salio','formando','una','ermosa','cascada.',
        'Asi','nacio','el','Salto','del','Tequendama.'
      ],
      errores: {
        0:  { correcto: 'Según',    tipo: 'Tilde: Segun → Según' },
        7:  { correcto: 'Bogotá',   tipo: 'Tilde: Bogota → Bogotá' },
        9:  { correcto: 'inundó',   tipo: 'Tilde: inundo → inundó' },
        14: { correcto: 'tocó',     tipo: 'Tilde: toco → tocó' },
        19: { correcto: 'bastón',   tipo: 'Tilde: baston → bastón' },
        24: { correcto: 'salió',    tipo: 'Tilde: salio → salió' },
        27: { correcto: 'hermosa',  tipo: 'Ortografía h: ermosa → hermosa' },
        29: { correcto: 'Así',      tipo: 'Tilde: Asi → Así' },
        30: { correcto: 'nació',    tipo: 'Tilde: nacio → nació' },
      },
    },
  ],
  5: [
    {
      titulo: 'El Sombrero Vueltiao y la Caña Flecha',
      palabras: [
        'El','sombrero','vueltiao','es','un','simbolo','artesanal','del','pueblo','Zenú.',
        'Se','teje','con','la','fibra','de','la','caña','flecha.',
        'Los','artesanos','combinan','colores','blanco','y','negro','con','gran','perfeccion.',
        'Esta','tradicion','a','sido','declarada','patrimonio','cultural','de','la','nacion.'
      ],
      errores: {
        5:  { correcto: 'símbolo',     tipo: 'Tilde: simbolo → símbolo' },
        29: { correcto: 'perfección.', tipo: 'Tilde: perfeccion → perfección' },
        31: { correcto: 'tradición',   tipo: 'Tilde: tradicion → tradición' },
        32: { correcto: 'ha',          tipo: 'Verbo: a → ha (auxiliar haber)' },
        38: { correcto: 'nación.',     tipo: 'Tilde: nacion → nación' },
      },
    },
    {
      titulo: 'La Leyenda del Hombre Caimán',
      palabras: [
        'En','el','municipio','de','Plato,','Magdalena,','cuenta','la','leyenda','que','un','hombre',
        'bevio','una','pocion','magica.','Se','convirtio','en','caiman','para','espiar','a','las','muchachas',
        'en','el','rio.','Cuando','la','pocion','se','agoto,','quedo','atrapado','para','siempre.'
      ],
      errores: {
        12: { correcto: 'bebió',     tipo: 'Ortografía b/v y tilde: bevio → bebió' },
        14: { correcto: 'poción',    tipo: 'Tilde: pocion → poción' },
        15: { correcto: 'mágica.',   tipo: 'Tilde: magica → mágica' },
        17: { correcto: 'convirtió', tipo: 'Tilde: convirtio → convirtió' },
        19: { correcto: 'caimán',    tipo: 'Tilde: caiman → caimán' },
        27: { correcto: 'río.',      tipo: 'Tilde: rio → río' },
        30: { correcto: 'poción',    tipo: 'Tilde: pocion → poción' },
        32: { correcto: 'agotó,',    tipo: 'Tilde: agoto → agotó' },
        33: { correcto: 'quedó',     tipo: 'Tilde: quedo → quedó' },
      },
    },
  ],
  6: [
    {
      titulo: 'El río Magdalena',
      palabras: [
        'El','rio','Magdalena','es','el','mas','importante','de','Colombia.',
        'Nace','en','el','Macizo','Colombiano','y','desemboca','en','el','mar','Caribe.',
        'Sus','aguas','recorren','varios','departamentos','y','a','alimentado','la','vida',
        'de','muchas','comunidades','desde','hace','siglos.',
        'Los','pescadores','depende','de','el','para','sobrebivir','cada','dia.'
      ],
      errores: {
        1:  { correcto: 'río',         tipo: 'Tilde: rio → río' },
        5:  { correcto: 'más',         tipo: 'Tilde: mas → más' },
        27: { correcto: 'ha alimentado', tipo: 'Verbo: a → ha (auxiliar haber)' },
        38: { correcto: 'dependen',    tipo: 'Concordancia: depende → dependen' },
        42: { correcto: 'sobrevivir',  tipo: 'Ortografía b/v: sobrebivir → sobrevivir' },
        44: { correcto: 'día',         tipo: 'Tilde: dia → día' },
      },
    },
    {
      titulo: 'La diversidad colombiana',
      palabras: [
        'Colombia','es','un','pais','con','gran','diversidad','cultural.',
        'En','sus','regiones','se','hablan','muchas','lenguas','indigenas.',
        'La','musica','vallenata','nacio','en','la','costa','Caribe.',
        'Los','campesinos','de','Boyaca','cultivan','papa','y','trigo','con','dedicacion.',
        'Su','trabajo','a','sido','fundamental','para','alimentar','al','país.'
      ],
      errores: {
        3:  { correcto: 'país',       tipo: 'Tilde: pais → país' },
        15: { correcto: 'indígenas',  tipo: 'Tilde: indigenas → indígenas' },
        17: { correcto: 'música',     tipo: 'Tilde: musica → música' },
        19: { correcto: 'nació',      tipo: 'Tilde: nacio → nació' },
        27: { correcto: 'Boyacá',     tipo: 'Tilde: Boyaca → Boyacá' },
        36: { correcto: 'ha',         tipo: 'Verbo: a → ha (auxiliar haber)' },
      },
    },
    {
      titulo: 'El Parque Nacional Tayrona',
      palabras: [
        'En','la','costa','norte','de','Colombia,','el','Parque','Tayrona','reune','playas','y','selvas.',
        'Alli','vivieron','antiguos','pobladores','indigenas','que','cuidavan','la','sierra.',
        'Los','arrecifes','de','coral','son','un','refugio','fragil','que','todos','devemos','respetar.'
      ],
      errores: {
        9:  { correcto: 'reúne',     tipo: 'Tilde en hiato: reune → reúne' },
        13: { correcto: 'Allí',      tipo: 'Tilde: Alli → Allí' },
        17: { correcto: 'indígenas', tipo: 'Tilde: indigenas → indígenas' },
        19: { correcto: 'cuidaban',  tipo: 'Ortografía b/v: cuidavan → cuidaban' },
        29: { correcto: 'frágil',    tipo: 'Tilde: fragil → frágil' },
        32: { correcto: 'debemos',   tipo: 'Ortografía b/v: devemos → debemos' },
      },
    },
  ],
  7: [
    {
      titulo: 'La Independencia de Colombia',
      palabras: [
        'El','20','de','julio','de','1810','marco','el','inicio','de','la','independencia.',
        'Los','criollos','se','rebelaron','contra','el','dominio','español.',
        'Simon','Bolívar','fue','uno','de','los','lideres','mas','importantes','de','la','lucha.',
        'El','liberto','a','varios','paises','del','yugo','colonial.',
        'Su','legado','permanece','vibo','en','la','memoria','de','America','Latina.'
      ],
      errores: {
        6:  { correcto: 'marcó',       tipo: 'Tilde: marco → marcó' },
        20: { correcto: 'Simón',       tipo: 'Tilde: Simon → Simón' },
        26: { correcto: 'líderes',     tipo: 'Tilde: lideres → líderes' },
        27: { correcto: 'más',         tipo: 'Tilde: mas → más' },
        33: { correcto: 'libertó',     tipo: 'Tilde: liberto → libertó' },
        43: { correcto: 'vivo',        tipo: 'Ortografía b/v: vibo → vivo' },
      },
    },
    {
      titulo: 'García Márquez y Macondo',
      palabras: [
        'Gabriel','Garcia','Márquez','escribio','Cien','años','de','soledad','en','1967.',
        'La','obra','narra','la','istoria','de','la','familia','Buendía','en','Macondo.',
        'El','realismo','magico','combina','lo','cotidiano','con','lo','fantastico.',
        'Muchos','lectores','consideran','que','es','la','novela','mas','importante',
        'de','la','literatura','latinoamericana.','Garcia','Márquez','resivió','el','Nobel','en','1982.'
      ],
      errores: {
        1:  { correcto: 'García',      tipo: 'Tilde: Garcia → García' },
        3:  { correcto: 'escribió',    tipo: 'Tilde: escribio → escribió' },
        14: { correcto: 'historia',    tipo: 'Ortografía h: istoria → historia' },
        23: { correcto: 'mágico',      tipo: 'Tilde: magico → mágico' },
        29: { correcto: 'fantástico.', tipo: 'Tilde: fantastico → fantástico' },
        45: { correcto: 'recibió',     tipo: 'Ortografía b/v: resivió → recibió' },
      },
    },
    {
      titulo: 'La Leyenda de Yurupary y las Selvas',
      palabras: [
        'El','mito','de','Yurupary','es','una','de','las','tradiciones','orales','mas','ricas','de','la','Amazonia.',
        'El','heroe','sagrado','viajo','por','los','rios','enseñando','leyes','y','cantos.',
        'Los','ancianos','an','transmitido','este','saber','milenario','atravez','del','tiempo.'
      ],
      errores: {
        10: { correcto: 'más',       tipo: 'Tilde: mas → más' },
        16: { correcto: 'héroe',     tipo: 'Tilde: heroe → héroe' },
        18: { correcto: 'viajó',     tipo: 'Tilde: viajo → viajó' },
        21: { correcto: 'ríos',      tipo: 'Tilde: rios → ríos' },
        28: { correcto: 'han',       tipo: 'Ortografía h: an → han' },
        33: { correcto: 'a través',  tipo: 'Ortografía y espacio: atravez → a través' },
      },
    },
  ],
  8: [
    {
      titulo: 'El conflicto armado colombiano',
      palabras: [
        'El','conflicto','armado','en','Colombia','duro','varias','decadas.',
        'Millones','de','personas','fueron','desplasadas','de','sus','hogares.',
        'El','acuerdo','de','paz','de','2016','represento','un','paso','historico.',
        'Sin','embargo,','la','implementacion','requiere','el','compromiso','de','todos.',
        'Las','victimas','merecen','justicia','y','reparacion','integral.'
      ],
      errores: {
        5:  { correcto: 'duró',          tipo: 'Tilde: duro → duró' },
        12: { correcto: 'desplazadas',   tipo: 'Ortografía s/z: desplasadas → desplazadas' },
        22: { correcto: 'representó',    tipo: 'Tilde: represento → representó' },
        25: { correcto: 'histórico.',    tipo: 'Tilde: historico → histórico' },
        29: { correcto: 'implementación', tipo: 'Tilde: implementacion → implementación' },
        36: { correcto: 'víctimas',      tipo: 'Tilde: victimas → víctimas' },
      },
    },
    {
      titulo: 'Ecosistemas de Colombia',
      palabras: [
        'Colombia','posee','una','biodiversidad','extraordinaria','en','sus','ecosistemas.',
        'Los','paramos','alvergan','especies','unicas','que','no','existen','en','ningun',
        'otro','lugar','del','planeta.',
        'La','deforestacion','en','la','Amazonia','colombiana','a','aumentado',
        'de','manera','alarmante.','Los','cientificos','advierten','que','devemos',
        'proteger','estos','havitats','antes','de','que','sea','demasiado','tarde.'
      ],
      errores: {
        9:  { correcto: 'páramos',       tipo: 'Tilde: paramos → páramos' },
        10: { correcto: 'albergan',      tipo: 'Ortografía b/v: alvergan → albergan' },
        12: { correcto: 'únicas',        tipo: 'Tilde: unicas → únicas' },
        23: { correcto: 'deforestación', tipo: 'Tilde: deforestacion → deforestación' },
        28: { correcto: 'ha',            tipo: 'Verbo: a → ha (auxiliar haber)' },
        40: { correcto: 'hábitats',      tipo: 'Ortografía h: havitats → hábitats' },
      },
    },
    {
      titulo: 'El Bogotazo y la Radio Nacional',
      palabras: [
        'El','nueve','de','abril','de','1948','ocurrio','el','asesinato','de','Jorge','Eliecer','Gaitán.',
        'La','multitud','se','tomo','las','estaciones','de','radio','para','difundir','mensajes','de','rebelion.',
        'Aquel','suceso','cambio','el','rumbo','politico','del','pais','durante','decadas.'
      ],
      errores: {
        6:  { correcto: 'ocurrió',   tipo: 'Tilde: ocurrio → ocurrió' },
        11: { correcto: 'Eliécer',   tipo: 'Tilde: Eliecer → Eliécer' },
        15: { correcto: 'tomó',      tipo: 'Tilde: tomo → tomó' },
        23: { correcto: 'rebelión.', tipo: 'Tilde: rebelion → rebelión' },
        26: { correcto: 'cambió',    tipo: 'Tilde: cambio → cambió' },
        29: { correcto: 'político',  tipo: 'Tilde: politico → político' },
        31: { correcto: 'país',      tipo: 'Tilde: pais → país' },
        33: { correcto: 'décadas.',  tipo: 'Tilde: decadas → décadas' },
      },
    },
  ],
  9: [
    {
      titulo: 'La economía cafetera',
      palabras: [
        'El','cafe','colombiano','es','reconocido','mundialmente','por','su','calidad.',
        'Los','caficultores','del','Eje','Cafetero','an','cultivado','este','grano',
        'durante','generaciones.','La','produccion','a','disminuido','en','los','ultimos','años',
        'devido','a','el','cambio','climatico.',
        'Sin','embargo,','nuevas','tecnicas','de','cultivo','estan','permitiendo',
        'recuperar','la','competitividad','en','el','mercado','internacional.'
      ],
      errores: {
        1:  { correcto: 'café',        tipo: 'Tilde: cafe → café' },
        14: { correcto: 'han',         tipo: 'Ortografía h: an → han' },
        21: { correcto: 'producción',  tipo: 'Tilde: produccion → producción' },
        26: { correcto: 'últimos',     tipo: 'Tilde: ultimos → últimos' },
        28: { correcto: 'debido',      tipo: 'Ortografía b/v: devido → debido' },
        36: { correcto: 'técnicas',    tipo: 'Tilde: tecnicas → técnicas' },
      },
    },
    {
      titulo: 'Literatura y sociedad',
      palabras: [
        'La','literatura','colombiana','refleja','las','tensiones','sociales','del','pais.',
        'Autores','como','Alvaro','Mutis','y','Laura','Restrepo','han','explorado',
        'temas','de','identidad','y','violencia.','Sus','obras','an','sido','traducidas',
        'a','multiples','idiomas.','La','critica','literaria','destaca','la','capacidad',
        'de','estos','escritores','para','transformar','el','dolor','en','veneficio',
        'de','la','comprension','humana.'
      ],
      errores: {
        8:  { correcto: 'país.',       tipo: 'Tilde: pais → país' },
        11: { correcto: 'Álvaro',      tipo: 'Tilde: Alvaro → Álvaro' },
        25: { correcto: 'han',         tipo: 'Ortografía h: an → han' },
        29: { correcto: 'múltiples',   tipo: 'Tilde: multiples → múltiples' },
        32: { correcto: 'crítica',     tipo: 'Tilde: critica → crítica' },
        45: { correcto: 'beneficio',   tipo: 'Ortografía b/v: veneficio → beneficio' },
      },
    },
    {
      titulo: 'La Vorágine de José Eustasio Rivera',
      palabras: [
        'Publicada','en','1924,','La','Vorágine','denuncio','la','explotacion','de','los','caucheros','en','la','selva.',
        'Arturo','Cova','se','adentra','en','un','territorio','inhospito','donde','la','violencia','y','la','fiebre','amenasan','la','vida.',
        'La','selva','devora','a','los','hombres','sin','piedad.'
      ],
      errores: {
        5:  { correcto: 'denunció',    tipo: 'Tilde: denuncio → denunció' },
        7:  { correcto: 'explotación', tipo: 'Tilde: explotacion → explotación' },
        21: { correcto: 'inhóspito',   tipo: 'Tilde: inhospito → inhóspito' },
        28: { correcto: 'amenazan',    tipo: 'Ortografía s/z: amenasan → amenazan' },
      },
    },
  ],
};

/* ─────────────────────────────────────────────
   Componente principal
   ───────────────────────────────────────────── */

export default function DetectiveGramatical({ gradoNumero = 6 }) {
  const grado = Math.min(9, Math.max(3, gradoNumero));
  const pasajes = PASAJES_POR_GRADO[grado] || PASAJES_POR_GRADO[6];

  const [indicePasaje, setIndicePasaje] = useState(0);
  const [erroresEncontrados, setErroresEncontrados] = useState(new Set());
  const [vidas, setVidas] = useState(5);
  const [puntaje, setPuntaje] = useState(0);
  const [sinErrorEnPasaje, setSinErrorEnPasaje] = useState(true);
  const [shakeIndex, setShakeIndex] = useState(null);
  const [pistaIndex, setPistaIndex] = useState(null);
  const [juegoTerminado, setJuegoTerminado] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [celebrando, setCelebrando] = useState(false);
  const [mensajeError, setMensajeError] = useState(null);

  const pasajeActual = pasajes[indicePasaje];
  const totalErrores = pasajeActual ? Object.keys(pasajeActual.errores).length : 0;
  const erroresDelPasaje = pasajeActual
    ? Object.keys(pasajeActual.errores).map(Number)
    : [];

  // Limpiar shake después de la animación
  useEffect(() => {
    if (shakeIndex !== null) {
      const t = setTimeout(() => setShakeIndex(null), 500);
      return () => clearTimeout(t);
    }
  }, [shakeIndex]);

  // Limpiar pista
  useEffect(() => {
    if (pistaIndex !== null) {
      const t = setTimeout(() => setPistaIndex(null), 1500);
      return () => clearTimeout(t);
    }
  }, [pistaIndex]);

  // Limpiar mensaje de error
  useEffect(() => {
    if (mensajeError !== null) {
      const t = setTimeout(() => setMensajeError(null), 2000);
      return () => clearTimeout(t);
    }
  }, [mensajeError]);

  // Verificar si se completó el pasaje
  useEffect(() => {
    if (!pasajeActual || celebrando || juegoTerminado || gameOver) return;

    const todosEncontrados = erroresDelPasaje.every((i) =>
      erroresEncontrados.has(`${indicePasaje}-${i}`)
    );

    if (todosEncontrados && erroresEncontrados.size > 0) {
      setCelebrando(true);
      sounds.playCorrect();

      const t = setTimeout(() => {
        setCelebrando(false);
        if (indicePasaje < pasajes.length - 1) {
          setIndicePasaje((prev) => prev + 1);
          setSinErrorEnPasaje(true);
        } else {
          setJuegoTerminado(true);
          lanzarConfeti();
          sounds.playFanfare();
          GameProgress.addXP(puntaje, 'detective_placa');
          GameProgress.registrarVictoria(1);
        }
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [erroresEncontrados, indicePasaje, pasajes.length, celebrando, juegoTerminado, gameOver]);

  /* ── Handlers ── */

  const handleClickPalabra = (idx) => {
    if (gameOver || juegoTerminado || celebrando) return;

    const clave = `${indicePasaje}-${idx}`;

    // Ya encontrada
    if (erroresEncontrados.has(clave)) return;

    if (erroresDelPasaje.includes(idx)) {
      // ¡Error encontrado!
      sounds.playCorrect();
      const nuevos = new Set(erroresEncontrados);
      nuevos.add(clave);
      setErroresEncontrados(nuevos);

      const bonus = sinErrorEnPasaje ? 50 : 0;
      setPuntaje((prev) => prev + 100 + bonus);
      setMensajeError({
        tipo: 'correcto',
        texto: pasajeActual.errores[idx].tipo,
        correccion: pasajeActual.errores[idx].correcto,
      });
    } else {
      // Click incorrecto
      sounds.playWrong();
      setShakeIndex(idx);
      setSinErrorEnPasaje(false);
      const nuevasVidas = vidas - 1;
      setVidas(nuevasVidas);
      if (nuevasVidas <= 0) {
        setGameOver(true);
      }
    }
  };

  const handlePista = () => {
    if (puntaje < 50 || gameOver || juegoTerminado || celebrando) return;

    const noEncontrado = erroresDelPasaje.find(
      (i) => !erroresEncontrados.has(`${indicePasaje}-${i}`)
    );
    if (noEncontrado !== undefined) {
      setPuntaje((prev) => prev - 50);
      setPistaIndex(noEncontrado);
    }
  };

  const reiniciar = () => {
    setIndicePasaje(0);
    setErroresEncontrados(new Set());
    setVidas(5);
    setPuntaje(0);
    setSinErrorEnPasaje(true);
    setShakeIndex(null);
    setPistaIndex(null);
    setJuegoTerminado(false);
    setGameOver(false);
    setCelebrando(false);
    setMensajeError(null);
  };

  /* ── Progreso ── */

  const erroresEncontradosEnPasaje = erroresDelPasaje.filter((i) =>
    erroresEncontrados.has(`${indicePasaje}-${i}`)
  ).length;

  /* ── Render ── */

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-indigo-200 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-2">
             Detective Gramatical
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Encuentra los errores ocultos en el texto — Grado {grado}°
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Vidas */}
          <div className="flex items-center gap-1" title={`${vidas} vidas restantes`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={"w-3.5 h-3.5 rounded-full border " + (i < vidas ? "bg-rose-500 border-rose-400" : "bg-slate-200 border-slate-300")}
              />
            ))}
          </div>

          {/* Puntaje */}
          <div className="bg-indigo-50 rounded-xl px-4 py-2 border border-indigo-200">
            <span className="text-xs text-indigo-500 font-semibold uppercase tracking-wide">
              Puntos
            </span>
            <p className="text-xl font-black text-indigo-700 leading-tight">
              {puntaje}
            </p>
          </div>
        </div>
      </div>

      {/* Progreso de pasajes */}
      <div className="flex items-center gap-2 mb-4">
        {pasajes.map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
              i < indicePasaje
                ? 'bg-emerald-400'
                : i === indicePasaje
                ? 'bg-indigo-400'
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>

      {/* Juego terminado — victoria */}
      {juegoTerminado && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4"></p>
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            ¡Caso resuelto, detective!
          </h3>
          <p className="text-slate-600 mb-1">
            Encontraste todos los errores gramaticales.
          </p>
          <p className="text-3xl font-black text-indigo-600 mb-6">
            {puntaje} puntos
          </p>
          <button
            onClick={reiniciar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Investigar de nuevo
          </button>
        </div>
      )}

      {/* Game over */}
      {gameOver && !juegoTerminado && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4"></p>
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            Caso cerrado
          </h3>
          <p className="text-slate-600 mb-1">
            Te quedaste sin pistas. ¡Vuelve a intentarlo!
          </p>
          <p className="text-3xl font-black text-indigo-600 mb-6">
            {puntaje} puntos
          </p>
          <button
            onClick={reiniciar}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Pasaje activo */}
      {!juegoTerminado && !gameOver && pasajeActual && (
        <>
          {/* Info pasaje */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
                
                {pasajeActual.titulo}
              </h3>
              <p className="text-sm text-slate-500">
                Pasaje {indicePasaje + 1} de {pasajes.length} — Errores:{' '}
                <span className="font-bold text-emerald-600">
                  {erroresEncontradosEnPasaje}
                </span>{' '}
                / {totalErrores}
              </p>
            </div>

            <button
              onClick={handlePista}
              disabled={puntaje < 50}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                puntaje >= 50
                  ? 'bg-amber-50 text-amber-700 border border-amber-300 hover:bg-amber-100 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title="Resalta un error sin encontrar (cuesta 50 puntos)"
            >
               Pista
              <span className="text-xs opacity-70">(-50 pts)</span>
            </button>
          </div>

          {/* Barra de progreso del pasaje */}
          <div className="w-full bg-slate-100 rounded-full h-2 mb-5">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(erroresEncontradosEnPasaje / totalErrores) * 100}%`,
              }}
            />
          </div>

          {/* Texto del pasaje */}
          <div className="bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200 mb-4 select-none">
            <p className="text-lg leading-relaxed text-slate-800">
              {pasajeActual.palabras.map((palabra, idx) => {
                const clave = `${indicePasaje}-${idx}`;
                const encontrada = erroresEncontrados.has(clave);
                const esShake = shakeIndex === idx;
                const esPista = pistaIndex === idx;

                return (
                  <span
                    key={idx}
                    onClick={() => handleClickPalabra(idx)}
                    className={[
                      'inline-block cursor-pointer px-0.5 rounded transition-colors duration-200',
                      encontrada
                        ? 'bg-emerald-100 text-emerald-800 line-through font-semibold'
                        : esPista
                        ? 'bg-amber-200 text-amber-900 ring-2 ring-amber-400'
                        : 'hover:bg-indigo-50',
                      esShake ? 'animate-shake text-red-600' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    title={encontrada ? pasajeActual.errores[idx]?.correcto : ''}
                  >
                    {encontrada && erroresDelPasaje.includes(idx)
                      ? `${palabra} `
                      : palabra}
                  </span>
                );
              }).reduce((acc, el, i) => {
                // Agregar espacios entre palabras
                if (i === 0) return [el];
                return [...acc, ' ', el];
              }, [])}
            </p>
          </div>

          {/* Mensaje de feedback */}
          {mensajeError && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-medium mb-2 transition-all ${
                mensajeError.tipo === 'correcto'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {mensajeError.tipo === 'correcto' ? (
                <>
                  <span className="font-bold"> ¡Correcto!</span>{' '}
                  {mensajeError.texto} → <em>{mensajeError.correccion}</em>
                </>
              ) : (
                mensajeError.texto
              )}
            </div>
          )}

          {/* Celebración entre pasajes */}
          {celebrando && (
            <div className="text-center py-4 animate-pulse">
              <p className="text-2xl font-black text-indigo-600">
                 ¡Pasaje completado!
              </p>
              <p className="text-slate-500 text-sm">
                Preparando el siguiente caso...
              </p>
            </div>
          )}

          {/* Leyenda */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300 inline-block" />{' '}
              Error encontrado
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400 inline-block" />{' '}
              Pista activa
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-100 border border-red-300 inline-block" />{' '}
              Click incorrecto
            </span>
          </div>
        </>
      )}

      {/* CSS para la animación shake */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-4px); }
          40% { transform: translateX(4px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
