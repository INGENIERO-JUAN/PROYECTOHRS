import zipfile
import xml.etree.ElementTree as ET
import json
import re
import os

DOCX_PATH = 'C:/Users/PERSONAL/.gemini/antigravity/brain/6eb7082b-f46f-43f1-9d90-797b9d5a6e52/.user_uploaded/media_1793581694469_2751c153.docx'
JSON_PATH = 'src/data/mallaCurricularEspanol.json'

with open(JSON_PATH, 'r', encoding='utf-8') as f:
    existing_data = json.load(f)

# Existing guides dictionary
existing_guias_dict = {}
for g_id, g_obj in existing_data.get('grados', {}).items():
    for p in g_obj.get('periodos', []):
        for u in p.get('unidades', []):
            for g in u.get('guias', []):
                key = f"{g_id}_{g.get('id')}"
                existing_guias_dict[key] = g

print(f"Loaded {len(existing_guias_dict)} existing pre-crafted guides.")

with zipfile.ZipFile(DOCX_PATH) as z:
    xml_content = z.read('word/document.xml')
    tree = ET.fromstring(xml_content)

namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
tables = tree.findall('.//{http://schemas.openxmlformats.org/wordprocessingml/2006/main}tbl')

def fix_enc(text):
    if not text: return ""
    text = text.replace('\xa0', ' ')
    reps = {
        'Cmo': '¿Cómo',
        'CMO': '¿CÓMO',
        'Quin': '¿Quién',
        'QUIN': '¿QUIÉN',
        'Qu': '¿Qué',
        'QU': '¿QUÉ',
        'Por': '¿Por',
        'POR': '¿POR',
        'Podramos': '¿Podríamos',
        'Es': '¿Es',
        'Disfrutemos': '¡Disfrutemos!',
        'LEER': '¡LEER',
        'JUGUEMOS': '¡JUGUEMOS',
        'ACTUEMOS': '¡ACTUEMOS',
        'ACTUAMOS': '¡ACTUAMOS',
        'LA ': '¡LA ',
        'LOS ': '¡LOS ',
        'ACCION': '¡ACCIÓN',
        'DESCUBRAMOS': '¡DESCUBRAMOS',
        'CONOZCAMOS': '¡CONOZCAMOS',
        'AVANCEMOS': '¡AVANCEMOS',
        'utilicemos': '¡utilicemos',
        'Conocemos': '¡Conocemos',
        'Escribo': '¡Escribo',
        'Juguemos': '¡Juguemos',
        'Escribamos': '¡Escribamos',
        'Podemos': '¡Podemos',
        'Identifiquemos': '¡Identifiquemos',
        'Aprendamos': '¡Aprendamos',
        'Interpretemos': '¡Interpretemos',
        'Comprendamos': '¡Comprendamos',
        'DESEMPEO': 'DESEMPEÑO',
        'ESTNDARES': 'ESTÁNDARES',
        'COMPRENSIN': 'COMPRENSIÓN',
        'INTERPRETACIN': 'INTERPRETACIÓN',
        'PRODUCCIN': 'PRODUCCIÓN',
        'TICA': 'ÉTICA',
        'COMUNICACIN': 'COMUNICACIÓN',
        'SLABAS': 'SÍLABAS',
        'slabas': 'sílabas',
        'maysculas': 'mayúsculas',
        'minsculas': 'minúsculas',
        'hbito': 'hábito',
        'hbitos': 'hábitos',
        'nmero': 'número',
        'gnero': 'género',
        'oracin': 'oración',
        'oraciones': 'oraciones',
        'fbula': 'fábula',
        'fbulas': 'fábulas',
        'poesa': 'poesía',
        'artculo': 'artículo',
        'lingstico': 'lingüístico',
        'autntico': 'auténtico',
        'autnticos': 'auténticos',
        'sbila': 'sábila',
        'tambin': 'también',
        'ms': 'más',
        'as': 'así',
        'dnde': 'dónde'
    }
    for k, v in reps.items():
        text = text.replace(k, v)
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def parse_tbl(idx):
    rows = []
    for tr in tables[idx].findall('w:tr', namespaces):
        cells = [fix_enc(''.join(tc.itertext())) for tc in tr.findall('w:tc', namespaces)]
        rows.append(cells)
    return rows

def split_guia_num_title(raw_str):
    raw_str = raw_str.strip()
    m = re.match(r'^(?:Gu[ií]a\s*)?(\d+)[\.\s\-:]*(.*)$', raw_str, re.IGNORECASE)
    if m:
        num = int(m.group(1))
        title = m.group(2).strip()
        if not title:
            title = f"Tema de Aprendizaje {num}"
        return num, f"Guía {num}", title
    return 1, "Guía 1", raw_str

def select_emoji(title, contents):
    t = (title + " " + contents).lower()
    if any(k in t for k in ['poema', 'verso', 'estrofa', 'rima', 'cancion', 'lira', 'copla', 'soneto']):
        return '🪕'
    if any(k in t for k in ['mito', 'leyenda', 'ancestral', 'indigena', 'maya', 'azteca', 'inca', 'bachue']):
        return '☀️'
    if any(k in t for k in ['fabula', 'animal', 'conejo', 'tortuga', 'zorro', 'lobo', 'pajaro']):
        return '🦊'
    if any(k in t for k in ['teatro', 'actuar', 'guion', 'titere', 'pantomima', 'personaje']):
        return '🎭'
    if any(k in t for k in ['noticia', 'periodico', 'radial', 'comunicacion', 'entrevista', 'debate']):
        return '🎙️'
    if any(k in t for k in ['publicidad', 'afiche', 'anuncio', 'propaganda', 'comercial']):
        return '📢'
    if any(k in t for k in ['cuento', 'narracion', 'historia', 'biografia', 'autobiografia']):
        return '📖'
    if any(k in t for k in ['oracion', 'sustantivo', 'verbo', 'adjetivo', 'parrafo', 'sujeto', 'predicado']):
        return '✍️'
    if any(k in t for k in ['vocal', 'consonante', 'silaba', 'abecedario', 'palabra', 'letra']):
        return '🔤'
    return '📚'

def generate_rich_lesson(title, contents, grade_num, dba):
    t_clean = title.replace('¿', '').replace('?', '').replace('¡', '').replace('!', '').strip()
    
    lectura = (
        f"En la escuela rural de nuestra vereda, nos reunimos en torno a la palabra para explorar '{t_clean}'. "
        f"A través de los saberes de nuestra comunidad campesina y los relatos que viajan de boca en boca, "
        f"descubrimos que la lengua castellana nos brinda herramientas maravillosas para expresar nuestras emociones, "
        f"contar lo que ocurre en el campo y comunicarnos con claridad y respeto.\n\n"
        f"Al trabajar con {contents.lower() if contents else 'los temas de esta lección'}, aprendemos a observar los detalles "
        f"de nuestro entorno natural: las montañas, el cantar de los pájaros al alba, el trabajo solidario de las familias y la memoria de nuestros abuelos. "
        f"Escribir y hablar bien no es solo una tarea escolar; es una manera de defender nuestra identidad, de dialogar en paz "
        f"y de construir un futuro lleno de oportunidades para toda la comunidad."
    )
    
    conceptos = [
        {
            "concepto": t_clean[:28] if len(t_clean) > 28 else t_clean,
            "ejemplo": f"Eje central: comprender y aplicar {contents[:40] if contents else 'el uso del lenguaje'}.",
            "dibujo": "💡"
        },
        {
            "concepto": "Uso en la Vereda",
            "ejemplo": "Compartir oralmente con la familia y anotar los aprendizajes en el cuaderno.",
            "dibujo": "🌱"
        },
        {
            "concepto": "Expresión y Creatividad",
            "ejemplo": "Construir oraciones coherentes y enriquecer nuestro vocabulario diario.",
            "dibujo": "✨"
        }
    ]
    
    sabiasQue = (
        f"En la educación rural Escuela Nueva, cada estudiante es protagonista de su propio saber: "
        f"al dialogar en grupo y relacionar '{t_clean}' con la vida diaria, el aprendizaje se vuelve inolvidable."
    )
    
    preguntas = {
        "literal": [
            {
                "id": f"lit-1",
                "pregunta": f"¿Cuál es el tema principal que se aborda en '{t_clean}' y qué contenidos se destacan?",
                "guiaRespuesta": f"Identificar el concepto de {t_clean} y los contenidos señalados en la lección."
            },
            {
                "id": f"lit-2",
                "pregunta": "¿Qué elementos de la vida en el campo y la escuela se mencionan en la lectura?",
                "guiaRespuesta": "Mencionar el entorno rural, las familias y las actividades comunitarias."
            },
            {
                "id": f"lit-3",
                "pregunta": "¿Qué pasos o normas se recomiendan para poner en práctica este aprendizaje?",
                "guiaRespuesta": "Destacar la observación atenta, la escritura clara y el respeto al dialogar."
            }
        ],
        "inferencial": [
            {
                "id": f"inf-1",
                "pregunta": f"¿Por qué es importante dominar '{t_clean}' al comunicarnos con los demás?",
                "guiaRespuesta": "Deducir la importancia de la claridad y la empatía en la comunicación oral y escrita."
            },
            {
                "id": f"inf-2",
                "pregunta": "¿De qué manera este conocimiento ayuda a resolver dudas o conflictos en el salón?",
                "guiaRespuesta": "Relacionar el uso de la palabra justa con el entendimiento y la convivencia pacífica."
            },
            {
                "id": f"inf-3",
                "pregunta": "¿Qué relación existe entre la tradición oral campesina y los textos que estudiamos?",
                "guiaRespuesta": "Vincular las historias familiares con las estructuras formales del lenguaje."
            }
        ],
        "critico": [
            {
                "id": f"cri-1",
                "pregunta": f"¿Cómo aplicarías lo aprendido sobre '{t_clean}' para mejorar la comunicación en tu hogar?",
                "guiaRespuesta": "Proponer una acción familiar o escolar fundamentada en el respeto y la escucha."
            },
            {
                "id": f"cri-2",
                "pregunta": "¿Crees que los medios de comunicación modernos sustituyen el valor de las historias contadas por nuestros abuelos? ¿Por qué?",
                "guiaRespuesta": "Construir una opinión argumentada valorando la memoria y la tecnología."
            },
            {
                "id": f"cri-3",
                "pregunta": "¿Qué mensaje o propuesta le darías a tus compañeros para seguir investigando sobre este tema?",
                "guiaRespuesta": "Elaborar una invitación entusiasta al trabajo en equipo y la lectura compartida."
            }
        ]
    }
    
    reto = {
        "titulo": f"Misión en tu Cuaderno: {t_clean}",
        "pasos": [
            f"1. Escribe con tu mejor caligrafía el título: '{t_clean}' en la parte superior de la página.",
            f"2. Redacta un párrafo corto (4 a 5 líneas) explicando con tus propias palabras qué aprendiste hoy.",
            f"3. Dibuja y colorea una escena de tu vereda o escuela que se relacione con este tema."
        ]
    }
    
    return {
        "lectura": lectura,
        "conceptosClave": conceptos,
        "sabiasQue": sabiasQue,
        "preguntasComprension": preguntas,
        "retoCuaderno": reto
    }

def extract_guias_from_table(tbl_idx, grade_id, period_num, default_comp="Lenguaje"):
    rows = parse_tbl(tbl_idx)
    guias = []
    
    for r in rows[1:]:
        if len(r) < 4: continue
        comp = r[0] if r[0] else default_comp
        est = r[1] if len(r) > 1 and r[1] else "Comprendo y produzco textos respondiendo a propósitos comunicativos."
        dba = r[2] if len(r) > 2 and r[2] else "Aplica conocimientos del lenguaje en situaciones de interacción cotidiana."
        raw_guia = r[3] if len(r) > 3 else ""
        raw_cont = r[4] if len(r) > 4 else ""
        
        if not raw_guia.strip(): continue
        
        num_val, num_str, title_str = split_guia_num_title(raw_guia)
        guia_id = f"{grade_id}-{period_num}-{num_val}"
        
        cache_key = f"{grade_id}_{guia_id}"
        if cache_key in existing_guias_dict:
            guia_obj = existing_guias_dict[cache_key]
            guia_obj['titulo'] = guia_obj.get('titulo') or guia_obj.get('nombre') or title_str
            guia_obj['nombre'] = guia_obj['titulo']
            if not guia_obj.get('preguntasComprension'):
                rich_data = generate_rich_lesson(guia_obj['titulo'], guia_obj.get('contenidos', ''), int(grade_id), guia_obj.get('dba', ''))
                guia_obj['preguntasComprension'] = rich_data['preguntasComprension']
            guias.append(guia_obj)
            continue
            
        rich_data = generate_rich_lesson(title_str, raw_cont, int(grade_id), dba)
        
        guia_obj = {
            "id": guia_id,
            "numero": num_str,
            "nombre": title_str,
            "titulo": title_str,
            "componente": comp,
            "estandares": est,
            "dba": dba,
            "contenidos": raw_cont,
            "icono": select_emoji(title_str, raw_cont),
            "leccion": {
                "lectura": rich_data["lectura"],
                "conceptosClave": rich_data["conceptosClave"],
                "sabiasQue": rich_data["sabiasQue"]
            },
            "retoCuaderno": rich_data["retoCuaderno"],
            "preguntasComprension": rich_data["preguntasComprension"]
        }
        guias.append(guia_obj)
        
    return guias

# Configuration for all 9 grades
grade_configs = {
    "1": {
        "numero": 1,
        "nombre": "Grado Primero",
        "nivel": "Básica Primaria",
        "icono": "🐥",
        "mascota": "Piolín el Pollito Lector 🎈",
        "color": "from-amber-400 to-yellow-500",
        "colorBoton": "bg-amber-500 hover:bg-amber-600 border-amber-700",
        "mundo": "Mundo 1: El Bosque de las Vocales",
        "lema": "¡Aprendemos a escribir nuestro nombre, vocales y primeras palabras mágicas!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: Me conozco y me divierto",
                        "desempeno": "Reconocer y cuidar el cuerpo con hábitos saludables y descubrir el valor de las letras.",
                        "tables": [1, 2]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: Juego con las palabras y consonantes",
                        "desempeno": "Identificar el sonido y la grafía de las consonantes y combinaciones silábicas.",
                        "tables": [3, 4]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Grupos consonánticos y oraciones",
                        "desempeno": "Lee y crea vocabulario con grupos consonánticos, escribiendo palabras y frases cortas.",
                        "tables": [5, 6]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Rimas, fábulas y comprensión lectora",
                        "desempeno": "Comprender textos literarios y producir composiciones sencillas con ortografía básica.",
                        "tables": [7, 8]
                    }
                ]
            }
        ]
    },
    "2": {
        "numero": 2,
        "nombre": "Grado Segundo",
        "nivel": "Básica Primaria",
        "icono": "🐸",
        "mascota": "Lucas la Ranita Cantora 🌱",
        "color": "from-emerald-400 to-green-600",
        "colorBoton": "bg-emerald-500 hover:bg-emerald-600 border-emerald-700",
        "mundo": "Mundo 2: La Laguna de las Rimas",
        "lema": "¡Exploramos descripciones, la familia, rimas y canciones campesinas!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: ¿Quién soy yo y cómo me expreso?",
                        "desempeno": "Nombro las partes de mi cuerpo, mi familia y expreso oralmente mis ideas.",
                        "tables": [9]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: ¿Cómo interpretamos los hechos?",
                        "desempeno": "Utilizo la descripción para comprender hechos, seres y objetos temporales.",
                        "tables": [10]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: ¡Actuamos y pensamos diferente!",
                        "desempeno": "Avanzo en la expresión oral, corporal y teatral mediante el juego de palabras.",
                        "tables": [11]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Medios de comunicación y transporte",
                        "desempeno": "Reconozco medios masivos de comunicación, señales y cartas familiares.",
                        "tables": [12]
                    }
                ]
            }
        ]
    },
    "3": {
        "numero": 3,
        "nombre": "Grado Tercero",
        "nivel": "Básica Primaria",
        "icono": "🦊",
        "mascota": "Simón el Zorro Sabio 🦊",
        "color": "from-sky-400 to-blue-600",
        "colorBoton": "bg-sky-500 hover:bg-sky-600 border-sky-700",
        "mundo": "Mundo 3: La Aldea de las Fábulas",
        "lema": "¡Leemos cuentos fantásticos, fábulas con moraleja y obras de teatro!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: ¡Leer y escribir enriquecen mi aprendizaje!",
                        "desempeno": "Identifico diversas maneras de expresar mis ideas: versos, rimas y narraciones.",
                        "tables": [14]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: ¡Juguemos a describir a interpretar!",
                        "desempeno": "Utilizo la descripción para comprender e interpretar fenómenos y estructuras del cuento.",
                        "tables": [16]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: ¡Las palabras tienen magia: ¡actuemos!",
                        "desempeno": "Avanzo en mi competencia comunicativa a través de mitos, leyendas y guiones teatrales.",
                        "tables": [18]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: ¡La comunicación enriquece mi pensamiento!",
                        "desempeno": "Utilizo adecuadamente las palabras en debates escolares, cartas y periódicos.",
                        "tables": [20]
                    }
                ]
            }
        ]
    },
    "4": {
        "numero": 4,
        "nombre": "Grado Cuarto",
        "nivel": "Básica Primaria",
        "icono": "🦉",
        "mascota": "Gaspar el Búho Guardián 🌿",
        "color": "from-teal-400 to-emerald-600",
        "colorBoton": "bg-teal-500 hover:bg-teal-600 border-teal-700",
        "mundo": "Mundo 4: El Cañón de los Mitos",
        "lema": "¡Descubrimos mitos indígenas, leyendas de aparecidos y poesía con ritmo!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: Las descripciones y narraciones enriquecen mi pensamiento",
                        "desempeno": "Identifico textos descriptivos y narrativos, y los utilizo para enriquecer la creatividad.",
                        "tables": [22]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: ¡Los textos literarios poéticos despiertan mi creatividad!",
                        "desempeno": "Avanzo en la sensibilidad estética mediante figuras poéticas y el ritmo de la palabra.",
                        "tables": [24]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Luces, cámara... ¡acción y canción!",
                        "desempeno": "Participo en obras y guiones teatrales empleando el lenguaje verbal y corporal.",
                        "tables": [26]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: ¡Los medios y la ética al comunicar!",
                        "desempeno": "Reconozco los medios masivos de comunicación y aplico criterios éticos al opinar.",
                        "tables": [28]
                    }
                ]
            }
        ]
    },
    "5": {
        "numero": 5,
        "nombre": "Grado Quinto",
        "nivel": "Básica Primaria",
        "icono": "🐴",
        "mascota": "Relámpago el Potrillo Trotón 🐴",
        "color": "from-indigo-500 to-blue-700",
        "colorBoton": "bg-indigo-600 hover:bg-indigo-700 border-indigo-800",
        "mundo": "Mundo 5: La Cumbre de las Letras",
        "lema": "¡Líderes de Primaria: Redactores, poetas y oradores de la vereda!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: Las descripciones y narraciones enriquecen mi pensamiento",
                        "desempeno": "Me relaciono y caracterizo claramente textos descriptivos y narrativos para crear nuevos relatos.",
                        "tables": [30]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: ¡Descubramos el sonido y la imaginación en las palabras!",
                        "desempeno": "Reconozco y valoro la palabra oral y escrita como herramienta básica de comunicación artística.",
                        "tables": [32]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: ¡Conozcamos formas de disfrutar y utilizar el lenguaje!",
                        "desempeno": "Identifico diversas formas de utilizar el lenguaje cotidiano, científico y literario.",
                        "tables": [34]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: ¡Avancemos en el conocimiento del lenguaje!",
                        "desempeno": "Reconozco técnicas de expresión oral como la entrevista, el debate y el ensayo.",
                        "tables": [36]
                    }
                ]
            }
        ]
    },
    "6": {
        "numero": 6,
        "nombre": "Grado Sexto",
        "nivel": "Básica Secundaria",
        "icono": "🐺",
        "mascota": "Lobo de los Páramos 🐺",
        "color": "from-cyan-500 to-teal-700",
        "colorBoton": "bg-cyan-600 hover:bg-cyan-700 border-cyan-800",
        "mundo": "Mundo 6: El Valle de la Tradición Oral",
        "lema": "¡Iniciando Secundaria: El paso de la oralidad ancestral a la literatura universal!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: Cómo lo cuento",
                        "desempeno": "Produzco textos narrativos coherentes y cohesionados seleccionando la voz narrativa.",
                        "tables": [38]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: De la oralidad a la escritura en la literatura",
                        "desempeno": "Analizo y contrasto las características de la tradición oral y la literatura informativa escrita.",
                        "tables": [40]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Tira la lira, tara la lara",
                        "desempeno": "Exploro y utilizo la función estética del lenguaje mediante lírica, sonetos y caligramas.",
                        "tables": [42]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Los textos que me informan",
                        "desempeno": "Interpreto medios de comunicación masivos, tecnología y arte en el mensaje cotidiano.",
                        "tables": [44]
                    }
                ]
            }
        ]
    },
    "7": {
        "numero": 7,
        "nombre": "Grado Séptimo",
        "nivel": "Básica Secundaria",
        "icono": "🦅",
        "mascota": "Cóndor de la Sabiduría 🦅",
        "color": "from-orange-400 to-amber-600",
        "colorBoton": "bg-orange-500 hover:bg-orange-600 border-orange-700",
        "mundo": "Mundo 7: El Sendero de la Argumentación",
        "lema": "¡Defendemos nuestras ideas con argumentos, artículos de opinión y teatro!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: El arte de la narración",
                        "desempeno": "Reconozco la diferencia entre la estructura lineal clásica y contemporánea en personajes y ambientes.",
                        "tables": [46]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: El enriquecedor mundo de los textos",
                        "desempeno": "Interactúo de manera crítica y creativa con textos informativos y expositivos.",
                        "tables": [48]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Sustento mis ideas con argumentos",
                        "desempeno": "Construyo y defiendo posturas personales fundamentadas sobre temas de interés social.",
                        "tables": [50]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Mi entorno habla",
                        "desempeno": "Interpreto los diversos lenguajes y señales del contexto, la publicidad y la televisión.",
                        "tables": [52]
                    }
                ]
            }
        ]
    },
    "8": {
        "numero": 8,
        "nombre": "Grado Octavo",
        "nivel": "Básica Secundaria",
        "icono": "🐆",
        "mascota": "Jaguar Dorado de América 🏺",
        "color": "from-rose-400 to-red-600",
        "colorBoton": "bg-rose-500 hover:bg-rose-600 border-rose-700",
        "mundo": "Mundo 8: Las Raíces Precolombinas",
        "lema": "¡Literatura precolombina, siglo XIX, costumbrismo y poesía hispanoamericana!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: Colombia precolombina: palabras y tradiciones",
                        "desempeno": "Reconozco y valoro la riqueza cultural y el legado de la tradición oral ancestral antes de la conquista.",
                        "tables": [54]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: El siglo XIX en letras",
                        "desempeno": "Analizo la producción literaria del siglo XIX: Romanticismo, Costumbrismo y Modernismo.",
                        "tables": [56]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Leo y disfruto la literatura latinoamericana",
                        "desempeno": "Aprecio la dimensión estética de la literatura indigenista y el Boom literario.",
                        "tables": [58]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Analizo la información comercial",
                        "desempeno": "Examino críticamente los discursos publicitarios, el cine y las estrategias de persuasión.",
                        "tables": [60]
                    }
                ]
            }
        ]
    },
    "9": {
        "numero": 9,
        "nombre": "Grado Noveno",
        "nivel": "Básica Secundaria",
        "icono": "🦋",
        "mascota": "Mariposa Amarilla de Macondo 🏛️",
        "color": "from-purple-500 to-violet-700",
        "colorBoton": "bg-purple-600 hover:bg-purple-700 border-purple-800",
        "mundo": "Mundo 9: El Templo de la Literatura Universal",
        "lema": "¡El Boom Latinoamericano, las vanguardias, el ensayo y la comunicación no verbal!",
        "periodos": [
            {
                "numero": 1,
                "nombre": "Primer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 1: América antes de llamarse así",
                        "desempeno": "Analizo las sociedades prehispánicas: Mayas, Aztecas, Incas y sus cantos de origen.",
                        "tables": [62]
                    }
                ]
            },
            {
                "numero": 2,
                "nombre": "Segundo Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 2: Latinoamérica y su literatura en el siglo XIX",
                        "desempeno": "Analizo la evolución literaria desde el romanticismo revolucionario hasta el realismo y modernismo.",
                        "tables": [64]
                    }
                ]
            },
            {
                "numero": 3,
                "nombre": "Tercer Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 3: Un 'boom' en la literatura",
                        "desempeno": "Analizo el fenómeno literario del Boom Latinoamericano, las vanguardias y el ensayo crítico.",
                        "tables": [66]
                    }
                ]
            },
            {
                "numero": 4,
                "nombre": "Cuarto Periodo",
                "unidades": [
                    {
                        "nombre": "Unidad 4: Otros lenguajes",
                        "desempeno": "Interpreto y produzco mensajes en sistemas no verbales, grafitis, collage y anuncios públicos.",
                        "tables": [68]
                    }
                ]
            }
        ]
    }
}

final_grados = {}

for g_id, cfg in grade_configs.items():
    g_numero = cfg["numero"]
    periodos_list = []
    
    for p_cfg in cfg["periodos"]:
        p_num = p_cfg["numero"]
        p_nombre = p_cfg["nombre"]
        unidades_list = []
        
        for u_cfg in p_cfg["unidades"]:
            u_nombre = u_cfg["nombre"]
            u_desempeno = u_cfg["desempeno"]
            tbl_ids = u_cfg["tables"]
            
            guias_en_unidad = []
            for t_id in tbl_ids:
                extracted = extract_guias_from_table(t_id, g_id, p_num)
                guias_en_unidad.extend(extracted)
                
            unidades_list.append({
                "nombre": u_nombre,
                "desempeno": u_desempeno,
                "guias": guias_en_unidad
            })
            
        periodos_list.append({
            "numero": p_num,
            "nombre": p_nombre,
            "unidades": unidades_list
        })
        
    final_grados[g_id] = {
        "id": g_id,
        "grado": g_id,
        "numero": g_numero,
        "nombre": cfg["nombre"],
        "nivel": cfg["nivel"],
        "icono": cfg["icono"],
        "mascota": cfg["mascota"],
        "color": cfg["color"],
        "colorBoton": cfg["colorBoton"],
        "mundo": cfg["mundo"],
        "lema": cfg["lema"],
        "periodos": periodos_list
    }

final_output = {
    "asignatura": "Lengua Castellana y Literatura",
    "institucion": "Institución Educativa Rural - Escuela Nueva",
    "grados": final_grados
}

with open(JSON_PATH, 'w', encoding='utf-8') as f:
    json.dump(final_output, f, ensure_ascii=False, indent=2)

print(f"SUCCESS: Created complete curriculum in {JSON_PATH}!")
total_guias = sum(
    len(u['guias'])
    for g in final_grados.values()
    for p in g['periodos']
    for u in p['unidades']
)
print(f"Total Grades: {len(final_grados)} (1 to 9)")
print(f"Total Guides generated: {total_guias}")
