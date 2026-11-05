// src/features/spanish/utils/theme.js
import { useState, useEffect } from 'react';

/**
 * Paletas de color premium y armoniosas para una experiencia de APP educativa moderna.
 * Diseñadas para alta legibilidad, accesibilidad visual y estética profesional tipo Apple / Khan Academy.
 */
export const TEMAS = {
  indigo: {
    id: 'indigo',
    nombre: 'Índigo Real & Slate',
    descripcion: 'Paleta insignia: moderna, sobria y de alta concentración',
    dotColor: 'bg-indigo-600',
    headerBg: 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900',
    headerShadow: 'shadow-[0_16px_36px_rgba(15,23,42,0.25)]',
    headerBorder: 'border-indigo-500/30',
    headerBadge: 'bg-indigo-500/20 text-indigo-200 border border-indigo-400/30',
    headerSubtext: 'text-slate-300',
    accentText: 'text-indigo-600',
    btnGradient: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/25 hover:from-indigo-500 hover:to-blue-500',
    btnDock: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/35 ring-2 ring-indigo-400/40',
    cardBorderHover: 'hover:border-indigo-400/70 hover:shadow-[0_12px_30px_rgba(79,70,229,0.12)]',
    cardBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
    cardHoverText: 'group-hover:text-indigo-600',
    cardHoverBtn: 'group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent',
    accentPill: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    logoBg: 'bg-gradient-to-tr from-indigo-600 to-blue-500 text-white shadow-indigo-500/30',
    badgeApp: 'bg-indigo-50 text-indigo-700 border-indigo-200/70',
  },
  azul: {
    id: 'azul',
    nombre: 'Azul Zafiro Océano',
    descripcion: 'Clásico pedagógico, sereno y confiable',
    dotColor: 'bg-blue-600',
    headerBg: 'bg-gradient-to-r from-blue-900 via-sky-900 to-slate-900',
    headerShadow: 'shadow-[0_16px_36px_rgba(30,58,138,0.25)]',
    headerBorder: 'border-blue-400/30',
    headerBadge: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
    headerSubtext: 'text-blue-100/90',
    accentText: 'text-blue-600',
    btnGradient: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/25 hover:from-blue-500 hover:to-sky-500',
    btnDock: 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-blue-600/35 ring-2 ring-blue-300',
    cardBorderHover: 'hover:border-blue-400/70 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)]',
    cardBadge: 'bg-blue-50 text-blue-700 border-blue-200/80',
    cardHoverText: 'group-hover:text-blue-600',
    cardHoverBtn: 'group-hover:bg-blue-600 group-hover:text-white group-hover:border-transparent',
    accentPill: 'bg-blue-50 text-blue-800 border-blue-200',
    logoBg: 'bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-blue-500/30',
    badgeApp: 'bg-blue-50 text-blue-700 border-blue-200/70',
  },
  esmeralda: {
    id: 'esmeralda',
    nombre: 'Verde Esmeralda Bosque',
    descripcion: 'Orgánico, campestre y relajante para la vista',
    dotColor: 'bg-emerald-600',
    headerBg: 'bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900',
    headerShadow: 'shadow-[0_16px_36px_rgba(6,78,59,0.25)]',
    headerBorder: 'border-emerald-400/30',
    headerBadge: 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30',
    headerSubtext: 'text-emerald-100/90',
    accentText: 'text-emerald-600',
    btnGradient: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:from-emerald-500 hover:to-teal-500',
    btnDock: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/35 ring-2 ring-emerald-300',
    cardBorderHover: 'hover:border-emerald-400/70 hover:shadow-[0_12px_30px_rgba(5,150,105,0.12)]',
    cardBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    cardHoverText: 'group-hover:text-emerald-600',
    cardHoverBtn: 'group-hover:bg-emerald-600 group-hover:text-white group-hover:border-transparent',
    accentPill: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    logoBg: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-emerald-500/30',
    badgeApp: 'bg-emerald-50 text-emerald-700 border-emerald-200/70',
  },
  amatista: {
    id: 'amatista',
    nombre: 'Amatista & Literatura',
    descripcion: 'Creativo, imaginativo y narrativo',
    dotColor: 'bg-purple-600',
    headerBg: 'bg-gradient-to-r from-purple-950 via-violet-900 to-slate-900',
    headerShadow: 'shadow-[0_16px_36px_rgba(88,28,135,0.25)]',
    headerBorder: 'border-purple-400/30',
    headerBadge: 'bg-purple-500/20 text-purple-200 border border-purple-400/30',
    headerSubtext: 'text-purple-100/90',
    accentText: 'text-purple-600',
    btnGradient: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-md shadow-purple-500/25 hover:from-purple-500 hover:to-violet-500',
    btnDock: 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-lg shadow-purple-600/35 ring-2 ring-purple-300',
    cardBorderHover: 'hover:border-purple-400/70 hover:shadow-[0_12px_30px_rgba(124,58,237,0.12)]',
    cardBadge: 'bg-purple-50 text-purple-700 border-purple-200/80',
    cardHoverText: 'group-hover:text-purple-600',
    cardHoverBtn: 'group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent',
    accentPill: 'bg-purple-50 text-purple-800 border-purple-200',
    logoBg: 'bg-gradient-to-tr from-purple-600 to-violet-400 text-white shadow-purple-500/30',
    badgeApp: 'bg-purple-50 text-purple-700 border-purple-200/70',
  },
  ambar: {
    id: 'ambar',
    nombre: 'Ámbar Cálido & Miel',
    descripcion: 'Cálido, tradicional y acogedor sin estridencias',
    dotColor: 'bg-amber-600',
    headerBg: 'bg-gradient-to-r from-amber-950 via-yellow-950 to-slate-900',
    headerShadow: 'shadow-[0_16px_36px_rgba(120,53,15,0.25)]',
    headerBorder: 'border-amber-400/30',
    headerBadge: 'bg-amber-500/20 text-amber-200 border border-amber-400/30',
    headerSubtext: 'text-amber-100/90',
    accentText: 'text-amber-700',
    btnGradient: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md shadow-amber-500/25 hover:from-amber-500 hover:to-yellow-500',
    btnDock: 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-600/35 ring-2 ring-amber-300',
    cardBorderHover: 'hover:border-amber-400/70 hover:shadow-[0_12px_30px_rgba(217,119,6,0.12)]',
    cardBadge: 'bg-amber-50 text-amber-800 border-amber-200/80',
    cardHoverText: 'group-hover:text-amber-700',
    cardHoverBtn: 'group-hover:bg-amber-600 group-hover:text-white group-hover:border-transparent',
    accentPill: 'bg-amber-50 text-amber-900 border-amber-200',
    logoBg: 'bg-gradient-to-tr from-amber-600 to-yellow-500 text-white shadow-amber-500/30',
    badgeApp: 'bg-amber-50 text-amber-800 border-amber-200/70',
  }
};

const THEME_KEY = 'lengua_viva_app_theme';

export function getTemaActual() {
  try {
    const guardado = localStorage.getItem(THEME_KEY);
    if (guardado && TEMAS[guardado]) {
      return TEMAS[guardado];
    }
  } catch {
    // fallback
  }
  return TEMAS.indigo; // Por defecto: Índigo Real & Slate (elegante, sobrio, premium)
}

export function setTemaActual(id) {
  if (TEMAS[id]) {
    try {
      localStorage.setItem(THEME_KEY, id);
    } catch {
      // fallback
    }
    window.dispatchEvent(new CustomEvent('lengua_viva_tema_cambiado', { detail: { temaId: id } }));
  }
}

export function useAppTheme() {
  const [tema, setTema] = useState(getTemaActual);

  useEffect(() => {
    const handleCambio = (e) => {
      const nuevoId = e?.detail?.temaId;
      if (nuevoId && TEMAS[nuevoId]) {
        setTema(TEMAS[nuevoId]);
      } else {
        setTema(getTemaActual());
      }
    };

    window.addEventListener('lengua_viva_tema_cambiado', handleCambio);
    window.addEventListener('storage', handleCambio);

    return () => {
      window.removeEventListener('lengua_viva_tema_cambiado', handleCambio);
      window.removeEventListener('storage', handleCambio);
    };
  }, []);

  const cambiarTema = (nuevoId) => {
    setTemaActual(nuevoId);
    if (TEMAS[nuevoId]) {
      setTema(TEMAS[nuevoId]);
    }
  };

  return { tema, temaId: tema.id, cambiarTema, temasDisponibles: Object.values(TEMAS) };
}
