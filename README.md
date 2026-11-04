# 📚 Lengua Viva | Plataforma Educativa Interactiva de Lenguaje (1° a 9°)

[![React 18](https://img.shields.io/badge/React-18.3.1-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.16-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline--First-success.svg?logo=pwa)](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Lengua Viva** (Aprende Rural PWA) es una plataforma web interactiva y progresiva (PWA) de **Lengua Castellana y Literatura** diseñada específicamente para enriquecer los procesos de enseñanza y aprendizaje desde **Grado 1° hasta Grado 9°**.

Concebida con un enfoque pedagógico inclusivo y **100% offline-first**, responde a las realidades de conectividad limitada de entornos rurales e institucionales, permitiendo a docentes y estudiantes acceder a mallas curriculares oficiales, módulos de comprensión lectora, dinámicas de aula y un completo arcade lúdico sin depender de internet.

---

## 🌟 Características Principales

### 1. 📖 Malla Curricular Oficial Completa (1° a 9°)
- **Contenidos Estructurados**: Cobertura pedagógica organizada por grados, periodos académicos y unidades de aprendizaje.
- **Alineación Pedagógica**: Basada en Estándares Básicos de Competencias y Derechos Básicos de Aprendizaje (DBA).
- **Módulos de Lección Interactivos**: Lectura asistida por voz (Web Speech API), preguntas formativas tipo prueba saber (niveles literal, inferencial y crítico), talleres y resúmenes guiados.

### 2. 🎮 Arcade Central de Juegos Pedagógicos
Un catálogo diverso de experiencias gamificadas clasificadas por nivel y habilidades comunicativas:
- **Escape Room Macondo**: Desafío narrativo ambientado en el realismo mágico y la literatura hispanoamericana.
- **Juicio a las Falacias**: Simulador de debate jurídico-argumentativo para secundaria enfocado en pensamiento crítico.
- **Batalla de Rimas & Karaoke de Coplas**: Estimulación de la métrica poética, rima y tradición oral.
- **Crucigrama Literario & Duelo de Vocabulario**: Enriquecimiento léxico y ortográfico competitivo.
- **Detective Gramatical & Organizador de Oraciones**: Sintaxis, categorías gramaticales y coherencia textual.
- **Abecedario Sonoro & Lluvia de Sílabas Ninja**: Fonética y lectoescritura inicial para los primeros grados.
- **Ahorcado Literario, Trivia Literaria & Memoria**: Refuerzo de autores, obras y conceptos clave.

### 3. 🛠️ Herramientas de Aula para el Docente
- **Pizarra Digital**: Tablero interactivo con trazos libres, formas y marcadores para explicaciones en vivo.
- **Temporizador de Clase**: Cronómetro didáctico configurable con efectos acústicos (Web Audio API) para pruebas y pausas activas.
- **Selector de Estudiante**: Ruleta aleatoria para fomentar la participación equitativa y dinámica en el aula.
- **Generador de Fichas**: Creación de material de trabajo y talleres listos para imprimir o proyectar.
- **Glosario Pedagógico**: Búsqueda instantánea de términos literarios, gramaticales y figuras retóricas.

### 4. ⚡ Arquitectura Offline-First & Gamificación
- **PWA Instalable**: Service Worker nativo que almacena en caché todos los assets, estilos, código y bases de datos JSON.
- **Motor de Audio Autónomo**: Efectos sonoros generados programáticamente vía Web Audio API sin consumir ancho de banda ni requerir archivos de audio externos.
- **Persistencia Local**: Puntos, estrellas, insignias y progreso curricular persistidos automáticamente en `localStorage`.

---

## 🧱 Estructura del Proyecto

```text
PROYECTO HORAS/
├── public/
│   ├── icon.svg                     # Iconografía vectorial de la PWA
│   ├── manifest.json                # Configuración de Progressive Web App
│   └── sw.js                        # Service Worker para funcionamiento offline
├── scripts/
│   ├── build_full_database.py       # Script ETL para construir la base curricular
│   └── enrich_malla.py              # Enriquecedor de metadatos curriculares
├── src/
│   ├── components/
│   │   ├── classroom/               # Herramientas docentes (Retos, Fichas, Glosario)
│   │   ├── games/                   # Videojuegos didácticos y mecánicas lúdicas
│   │   ├── interactive/             # Componentes interactivos y de apoyo en aula
│   │   ├── ModuloInteractivo.jsx    # Visor y ejecutor de actividades por grado
│   │   ├── ModuloLeccion.jsx        # Lecciones detalladas con lectura y preguntas
│   │   ├── PizarraDigital.jsx       # Tablero táctil interactivo
│   │   ├── TallerNarrativo.jsx      # Editor guiado de producción escrita
│   │   └── TemporizadorClase.jsx    # Reloj sonoro para dinámicas grupales
│   ├── data/
│   │   └── mallaCurricularEspanol.json # Base de datos completa 1° a 9° (JSON)
│   ├── layouts/
│   │   └── MainLayout.jsx           # Navegación responsive, header y contenedor
│   ├── pages/
│   │   ├── Home.jsx                 # Dashboard principal con selector de grados
│   │   ├── GradoView.jsx            # Explorador de unidades y contenidos por grado
│   │   └── JuegosHub.jsx            # Portal centralizado de juegos didácticos
│   ├── utils/
│   │   ├── audio.js                 # Sintetizador acústico (Web Audio API)
│   │   ├── confetti.js              # Efectos visuales de celebración
│   │   ├── gamification.js          # Lógica de estrellas, niveles e insignias
│   │   └── speech.js                # Locución asistida (Web Speech API)
│   ├── App.jsx                      # Enrutamiento principal (React Router)
│   ├── index.css                    # Directivas Tailwind y estilos globales
│   └── main.jsx                     # Punto de entrada de la aplicación React
├── index.html                       # Documento raíz con metadatos y enlaces PWA
├── package.json                     # Dependencias y scripts de construcción
├── postcss.config.js                # Pipeline de procesamiento CSS
├── tailwind.config.js               # Paleta de colores, tipografías y tema
└── vite.config.js                   # Configuración de compilación Vite y chunks
```

---

## 🚀 Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 18.x o superior recomendada)
- [npm](https://www.npmjs.com/) (versión 9.x o superior)

---

## 💻 Instalación y Uso Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/INGENIERO-JUAN/PROYECTOHRS.git
   cd PROYECTOHRS
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la plataforma.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Los artefactos optimizados se generarán dentro de la carpeta `dist/`.

5. **Previsualizar la compilación de producción:**
   ```bash
   npm run preview
   ```

---

## 🛠️ Tecnologías Empleadas

- **Frontend Core**: [React 18](https://react.dev/) + [Vite 6](https://vitejs.dev/)
- **Estilos & Diseño**: [Tailwind CSS 3](https://tailwindcss.com/) + [PostCSS](https://postcss.org/)
- **Enrutamiento**: [React Router DOM 6](https://reactrouter.com/)
- **Offline / PWA**: Service Workers nativos + Web App Manifest
- **APIs del Navegador**:
  - `Web Audio API` (efectos de sonido sintetizados en tiempo real)
  - `Web Speech API` (narración y lectura de texto a voz)
  - `HTML5 Canvas API` (pizarra digital y partículas de confeti)
  - `LocalStorage API` (persistencia del progreso del estudiante)

---

## 👤 Autor

- **Juan Santander** - [@INGENIERO-JUAN](https://github.com/INGENIERO-JUAN)
  *Estudiante de Desarrollo de Software - Instituto Tecnológico del Putumayo*

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
