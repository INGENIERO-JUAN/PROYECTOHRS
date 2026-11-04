// Motor de Voz y Fonética Amigable 100% Offline (Web Speech API)
// Calibrado con tono cálido, pausado y natural para estudiantes.
// Compatible con Chrome, Edge, Firefox, Android y Windows sin requerir conexión a internet.

class VoiceReader {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.utterance = null;
    this.isSpeaking = false;
    this.spanishVoice = null;
    this.muted = false;

    // Desbloquear contexto de voz y evitar que permanezca silenciado accidentalmente
    try {
      localStorage.removeItem('lengua_viva_voz_silenciada');
    } catch (e) {}

    this.initVoices();
    this.setupUserGestureUnlock();
  }

  setupUserGestureUnlock() {
    if (typeof window === 'undefined') return;
    const unlock = () => {
      if (this.synth) {
        if (this.synth.paused) {
          try { this.synth.resume(); } catch (e) {}
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

        // Filtrar voces en español EXCLUYENDO las voces virtuales 'Online' que fallan sin internet en Edge/Windows
        const espaniol = voices.filter((v) => {
          const l = (v.lang || '').toLowerCase();
          const n = (v.name || '').toLowerCase();
          const isSpanish = l.startsWith('es') || l.includes('es-') || l.includes('spanish') || n.includes('spanish');
          const isVirtualOnline = n.includes('online') || n.includes('network');
          return isSpanish && !isVirtualOnline;
        });

        const pool = espaniol.length > 0 ? espaniol : voices.filter((v) => (v.lang || '').toLowerCase().startsWith('es'));

        // Seleccionar la mejor voz local sin distorsión
        this.spanishVoice =
          pool.find((v) => {
            const n = v.name.toLowerCase();
            return n.includes('helena') || n.includes('paulina') || n.includes('sabina') || n.includes('laura');
          }) ||
          pool.find((v) => v.name.toLowerCase().includes('google') && v.lang.startsWith('es')) ||
          pool.find((v) => v.lang === 'es-MX' || v.lang === 'es-CO' || v.lang === 'es-419') ||
          pool.find((v) => v.lang.startsWith('es')) ||
          pool[0] ||
          null;
      } catch (e) {}
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
    } catch (e) {}
    return this.muted;
  }

  isMuted() {
    return this.muted;
  }

  // Tono cálido, natural (pitch fijado en 1.0, rate = 0.88 pausado y amable)
  speak(text, onEnd = () => {}, rate = 0.88, pitch = 1.0) {
    if (!this.synth || this.muted) {
      onEnd();
      return;
    }

    if (!text || String(text).trim() === '') {
      onEnd();
      return;
    }

    try {
      // Reanudar sintetizador si Chromium lo pausó
      if (this.synth.paused) {
        this.synth.resume();
      }

      // Si ya estaba hablando o pendiente, limpiar
      if (this.synth.speaking || this.synth.pending) {
        this.synth.cancel();
      }

      if (!this.spanishVoice) {
        this.initVoices();
      }

      const cleanText = String(text).trim();
      const utter = new SpeechSynthesisUtterance(cleanText);

      // Idioma seguro: si hay voz usar la de la voz, sino español genérico
      utter.lang = this.spanishVoice ? this.spanishVoice.lang : 'es-ES';
      if (this.spanishVoice) {
        utter.voice = this.spanishVoice;
      }

      // Calibración pedagógica: nunca chillón (> 1.0) ni inaudible
      utter.rate = Math.min(1.0, Math.max(0.82, Number(rate) || 0.88));
      utter.pitch = Math.min(1.0, Math.max(0.9, Number(pitch) || 1.0));

      utter.onend = () => {
        this.isSpeaking = false;
        onEnd();
      };

      utter.onerror = (e) => {
        this.isSpeaking = false;
        // Fallback si la voz elegida fue rechazada por el sistema
        if (utter.voice && e.error !== 'canceled' && e.error !== 'interrupted') {
          try {
            const fallbackUtter = new SpeechSynthesisUtterance(cleanText);
            fallbackUtter.lang = 'es';
            fallbackUtter.rate = 0.88;
            fallbackUtter.pitch = 1.0;
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

      // Un tick de 20ms evita el bug de Chromium donde cancel() cancela el speak() que le sigue
      setTimeout(() => {
        try {
          if (this.synth) {
            this.synth.speak(utter);
          }
        } catch (err) {
          this.isSpeaking = false;
          onEnd();
        }
      }, 25);
    } catch (err) {
      this.isSpeaking = false;
      onEnd();
    }
  }

  // Pronunciar letra de forma natural y dulce
  speakLetter(letter, exampleWord = '') {
    if (!letter) return;
    const cleanLetter = String(letter).trim().toUpperCase();
    let textToSpeak = cleanLetter;

    if (['A', 'E', 'I', 'O', 'U'].includes(cleanLetter)) {
      textToSpeak = exampleWord
        ? `Vocal ${cleanLetter}, como en ${exampleWord}.`
        : `${cleanLetter}`;
    } else {
      const nombresLetras = {
        B: 'Be', C: 'Ce', D: 'De', F: 'Efe', G: 'Ge', H: 'Hache', J: 'Jota',
        K: 'Ka', L: 'Ele', M: 'Eme', N: 'Ene', Ñ: 'Eñe', P: 'Pe', Q: 'Cu',
        R: 'Erre', S: 'Ese', T: 'Te', V: 'Uve', W: 'Doble ve', X: 'Equis',
        Y: 'Ye', Z: 'Zeta'
      };
      const nombre = nombresLetras[cleanLetter] || cleanLetter;
      textToSpeak = exampleWord
        ? `Letra ${nombre}, como en ${exampleWord}.`
        : `${nombre}`;
    }

    this.speak(textToSpeak, () => {}, 0.88, 1.0);
  }

  // Pronunciar sílaba de forma clara y tranquila
  speakSyllable(syllable) {
    if (!syllable) return;
    const clean = String(syllable).trim().toUpperCase();
    this.speak(clean, () => {}, 0.88, 1.0);
  }

  // Pronunciar palabra
  speakWord(word) {
    if (!word) return;
    this.speak(String(word), () => {}, 0.88, 1.0);
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
      this.isSpeaking = false;
    }
  }
}

export const voiceReader = new VoiceReader();
