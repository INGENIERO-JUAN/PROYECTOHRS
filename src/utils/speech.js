// Motor de Voz y Fonética Alegre y Divertida (Web Speech API)
// Calibrado con tono entusiasta, brillante, amigable y juvenil para estudiantes.
// 100% Offline, sin voces robóticas ni monótonas.

class VoiceReader {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isSpeaking = false;
    this.spanishVoice = null;
    this.muted = false;

    // Configuración de energía alegre y dinámica
    this.defaultRate = 1.05;   // Ritmo ágil y natural (no arrastra palabras)
    this.defaultPitch = 1.20;  // Tono brillante, simpático y juvenil (cero voz tenebrosa)

    try {
      localStorage.removeItem('lengua_viva_voz_silenciada');
    } catch (_) {}

    this.initVoices();
    this.setupUserGestureUnlock();
  }

  setupUserGestureUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.synth) {
        if (this.synth.paused) {
          try { this.synth.resume(); } catch (_) {}
        }
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('touchstart', unlock);
      window.removeEventListener('keydown', unlock);
    };
    window.addEventListener('click', unlock, { once: true, passive: true });
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    window.addEventListener('keydown', unlock, { once: true, passive: true });
  }

  initVoices() {
    if (!this.synth) return;

    const loadVoices = () => {
      try {
        const voices = this.synth.getVoices();
        if (!voices || voices.length === 0) return;

        // Todas las voces en español disponibles
        const espaniol = voices.filter((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          return l.startsWith('es') || l.includes('es-') || l.includes('spanish') || n.includes('spanish');
        });

        const pool = espaniol.length > 0 ? espaniol : voices;

        // Prioridad de voces:
        // 1. Voces Google (son las más naturales, alegres y fluidas en Chrome)
        // 2. Voces Naturales modernas (Edge/Windows: Dalia, Jorge, Paulina, Paloma)
        // 3. Voces amigables femeninas/jóvenes
        // 4. Excluir voces antiguas 'Desktop' si hay mejores opciones disponibles
        const preferidas = pool.filter((v) => {
          const n = v.name.toLowerCase();
          return (
            n.includes('google') ||
            n.includes('natural') ||
            n.includes('dalia') ||
            n.includes('paulina') ||
            n.includes('paloma') ||
            n.includes('sofia') ||
            n.includes('lucia') ||
            n.includes('camila') ||
            n.includes('salome')
          );
        });

        if (preferidas.length > 0) {
          this.spanishVoice =
            preferidas.find((v) => v.name.toLowerCase().includes('google') && v.lang.startsWith('es')) ||
            preferidas.find((v) => v.name.toLowerCase().includes('natural')) ||
            preferidas[0];
        } else {
          // Si solo están las voces de Windows, filtrar para no usar las más graves/robóticas
          this.spanishVoice =
            pool.find((v) => v.lang === 'es-MX' || v.lang === 'es-CO' || v.lang === 'es-419') ||
            pool.find((v) => v.lang.startsWith('es')) ||
            pool[0] ||
            null;
        }
      } catch (_) {}
    };

    loadVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = loadVoices;
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stop();
    }
    try {
      window.dispatchEvent(
        new CustomEvent('lengua_viva_voz_estado_cambiado', { detail: { muted: this.muted } })
      );
    } catch (_) {}
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  /**
   * Reproducir texto con voz alegre y divertida.
   * @param {string} text - Mensaje a narrar.
   * @param {Function} onEnd - Callback al finalizar.
   * @param {number} rate - Velocidad (default: 1.05 - ágil y ameno).
   * @param {number} pitch - Tono (default: 1.20 - brillante y entusiasta).
   */
  speak(text, onEnd = () => {}, rate = this.defaultRate, pitch = this.defaultPitch) {
    if (!this.synth || this.muted) {
      onEnd();
      return;
    }

    if (!text || String(text).trim() === '') {
      onEnd();
      return;
    }

    try {
      if (this.synth.paused) {
        this.synth.resume();
      }

      if (this.synth.speaking || this.synth.pending) {
        this.synth.cancel();
      }

      if (!this.spanishVoice) {
        this.initVoices();
      }

      const cleanText = String(text).trim();
      const utter = new SpeechSynthesisUtterance(cleanText);

      utter.lang = this.spanishVoice ? this.spanishVoice.lang : 'es-ES';
      if (this.spanishVoice) {
        utter.voice = this.spanishVoice;
      }

      // Calibración entusiasta: rango [1.10 - 1.35] para un tono alegre y animado
      const targetPitch = Number(pitch) || this.defaultPitch;
      const targetRate = Number(rate) || this.defaultRate;

      utter.rate = Math.min(1.2, Math.max(0.95, targetRate));
      utter.pitch = Math.min(1.35, Math.max(1.10, targetPitch));
      utter.volume = 1.0;

      utter.onend = () => {
        this.isSpeaking = false;
        onEnd();
      };

      utter.onerror = (e) => {
        this.isSpeaking = false;
        if (utter.voice && e.error !== 'canceled' && e.error !== 'interrupted') {
          try {
            const fallbackUtter = new SpeechSynthesisUtterance(cleanText);
            fallbackUtter.lang = 'es';
            fallbackUtter.rate = 1.05;
            fallbackUtter.pitch = 1.20;
            fallbackUtter.onend = onEnd;
            fallbackUtter.onerror = onEnd;
            this.synth.speak(fallbackUtter);
            return;
          } catch (_) {}
        }
        onEnd();
      };

      this.utterance = utter;
      this.isSpeaking = true;

      setTimeout(() => {
        try {
          if (this.synth) {
            this.synth.speak(utter);
          }
        } catch (_) {
          this.isSpeaking = false;
          onEnd();
        }
      }, 20);
    } catch (_) {
      this.isSpeaking = false;
      onEnd();
    }
  }

  // Pronunciar letra de forma alegre, clara y divertida
  speakLetter(letter, exampleWord = '') {
    if (!letter) return;
    const cleanLetter = String(letter).trim().toUpperCase();
    let textToSpeak = cleanLetter;

    if (['A', 'E', 'I', 'O', 'U'].includes(cleanLetter)) {
      textToSpeak = exampleWord
        ? `¡Vocal ${cleanLetter}! Como en ${exampleWord}.`
        : `¡${cleanLetter}!`;
    } else {
      const nombresLetras = {
        B: 'Be', C: 'Ce', D: 'De', F: 'Efe', G: 'Ge', H: 'Hache', J: 'Jota',
        K: 'Ka', L: 'Ele', M: 'Eme', N: 'Ene', Ñ: 'Eñe', P: 'Pe', Q: 'Cu',
        R: 'Erre', S: 'Ese', T: 'Te', V: 'Uve', W: 'Doble ve', X: 'Equis',
        Y: 'Ye', Z: 'Zeta'
      };
      const nombre = nombresLetras[cleanLetter] || cleanLetter;
      textToSpeak = exampleWord
        ? `¡Letra ${nombre}! Como en ${exampleWord}.`
        : `¡${nombre}!`;
    }

    // Tono extra alegre para los más pequeños (pitch 1.25)
    this.speak(textToSpeak, () => {}, 1.05, 1.25);
  }

  // Pronunciar sílaba de forma rítmica y clara
  speakSyllable(syllable) {
    if (!syllable) return;
    const clean = String(syllable).trim().toUpperCase();
    this.speak(clean, () => {}, 1.05, 1.22);
  }

  // Pronunciar palabra completa con entusiasmo
  speakWord(word) {
    if (!word) return;
    this.speak(String(word), () => {}, 1.05, 1.18);
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (_) {}
      this.isSpeaking = false;
    }
  }
}

export const voiceReader = new VoiceReader();
