// Sistema de Gamificación y Niveles de Jugador (100% Offline con LocalStorage)
// Diseñado para generar satisfacción de progreso (XP, rangos, insignias y logros)

export const RANGOS_JUGADOR = [
  { nivel: 1, titulo: 'Aprendiz de Trazos', icono: '🌱', xpMin: 0, desc: 'Tus primeros pasos en el universo de las letras' },
  { nivel: 2, titulo: 'Cazador de Sílabas', icono: '🔤', xpMin: 300, desc: 'Domina los sonidos del abecedario y la fonética' },
  { nivel: 3, titulo: 'Domador de Rimas', icono: '🎵', xpMin: 800, desc: 'Reconoce el ritmo y la musicalidad de las coplas' },
  { nivel: 4, titulo: 'Narrador de Fogata', icono: '🦊', xpMin: 1600, desc: 'Conoce las fábulas y sus sabias moralejas' },
  { nivel: 5, titulo: 'Guardián de los Mitos', icono: '🌿', xpMin: 2800, desc: 'Descifra leyendas ancestrales de Colombia' },
  { nivel: 6, titulo: 'Poeta de Páramo', icono: '🦅', xpMin: 4500, desc: 'Crea versos, estrofas y figuras retóricas' },
  { nivel: 7, titulo: 'Orador de Asambleas', icono: '🎙️', xpMin: 6800, desc: 'Defiende argumentos y detecta falacias' },
  { nivel: 8, titulo: 'Maestro de Crónicas', icono: '📜', xpMin: 9500, desc: 'Experto en ortografía, tildes y redacción' },
  { nivel: 9, titulo: 'Sabio de Macondo', icono: '👑', xpMin: 13000, desc: 'Leyenda suprema de la literatura castellana' }
];

export const INSIGNIAS_LOGROS = [
  { id: 'ninja_master', titulo: 'Filo Ninja', icono: '🥷', desc: 'Consigue cortar sílabas a toda velocidad' },
  { id: 'rimas_flow', titulo: 'Flow Poético', icono: '🎤', desc: 'Clava rimas tradicionales con ritmo perfecto' },
  { id: 'oido_oro', titulo: 'Oído de Oro', icono: '👂', desc: 'Identifica letras y fonemas con voz real' },
  { id: 'detective_placa', titulo: 'Placa de Detective', icono: '🔍', desc: 'Caza errores de tilde y ortografía en los textos' },
  { id: 'crucigrama_as', titulo: 'Mente Cruzada', icono: '🧩', desc: 'Descifra todas las palabras de un crucigrama' },
  { id: 'tribunal_falacia', titulo: 'Juez de la Razón', icono: '⚖️', desc: 'Destruye falacias argumentativas con objeciones' },
  { id: 'escape_macondo', titulo: 'Héroe de Macondo', icono: '🦋', desc: 'Supera los enigmas del Realismo Mágico' },
  { id: 'racha_fuego', titulo: 'Racha de Fuego', icono: '🔥', desc: 'Alcanza una racha o combo superior a 5' },
  { id: 'trivia_oro', titulo: 'Podio de Honor', icono: '🏆', desc: 'Responde correctamente en la Trivia Literaria' },
  { id: 'sabio_supremo', titulo: 'Corona de Gabo', icono: '👑', desc: 'Alcanza el rango máximo de Sabio de Macondo' }
];

export class GameProgress {
  static getProgress() {
    try {
      const saved = localStorage.getItem('lengua_viva_progreso');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed.insignias)) parsed.insignias = [];
        return parsed;
      }
    } catch (e) {}

    return {
      xpTotal: 0,
      partidasJugadas: 0,
      victorias: 0,
      rachaMaxima: 0,
      insignias: []
    };
  }

  static addXP(puntos, insigniaId = null) {
    const progreso = this.getProgress();
    const prevXP = progreso.xpTotal;
    const nuevoXP = prevXP + Math.max(0, Math.round(puntos));
    progreso.xpTotal = nuevoXP;
    progreso.partidasJugadas += 1;

    let nuevaInsignia = null;
    if (insigniaId && !progreso.insignias.includes(insigniaId)) {
      progreso.insignias.push(insigniaId);
      nuevaInsignia = INSIGNIAS_LOGROS.find((ins) => ins.id === insigniaId);
    }

    // Comprobar insignia de Sabio de Macondo
    if (nuevoXP >= 13000 && !progreso.insignias.includes('sabio_supremo')) {
      progreso.insignias.push('sabio_supremo');
    }

    try {
      localStorage.setItem('lengua_viva_progreso', JSON.stringify(progreso));
    } catch (e) {}

    const rangoAnterior = this.getRangoPorXP(prevXP);
    const rangoNuevo = this.getRangoPorXP(nuevoXP);
    const subioDeNivel = rangoNuevo.nivel > rangoAnterior.nivel;

    // Disparar evento para sincronizar toda la app
    try {
      window.dispatchEvent(
        new CustomEvent('lengua_viva_progreso_actualizado', {
          detail: { progreso, subioDeNivel, rangoNuevo, rangoAnterior, nuevaInsignia, puntosGanados: puntos }
        })
      );
    } catch (e) {}

    return { progreso, subioDeNivel, rangoNuevo, nuevaInsignia };
  }

  static registrarVictoria(racha = 0) {
    const progreso = this.getProgress();
    progreso.victorias += 1;
    if (racha > (progreso.rachaMaxima || 0)) {
      progreso.rachaMaxima = racha;
    }
    if (racha >= 5 && !progreso.insignias.includes('racha_fuego')) {
      progreso.insignias.push('racha_fuego');
    }
    try {
      localStorage.setItem('lengua_viva_progreso', JSON.stringify(progreso));
    } catch (e) {}
  }

  static getRangoPorXP(xp) {
    let actual = RANGOS_JUGADOR[0];
    for (let r of RANGOS_JUGADOR) {
      if (xp >= r.xpMin) {
        actual = r;
      } else {
        break;
      }
    }
    return actual;
  }

  static getSiguienteRango(xp) {
    for (let r of RANGOS_JUGADOR) {
      if (xp < r.xpMin) return r;
    }
    return null;
  }

  static reiniciarProgreso() {
    try {
      localStorage.removeItem('lengua_viva_progreso');
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('lengua_viva_progreso_actualizado', { detail: { progreso: this.getProgress() } }));
  }
}
