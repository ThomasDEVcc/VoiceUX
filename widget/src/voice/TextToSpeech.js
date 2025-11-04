/**
 * TextToSpeech - Handle voice output using Web Speech API
 */
export class TextToSpeech {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.isSpeaking = false;
    this.voice = null;
    this.init();
  }

  init() {
    if (!this.isSupported()) {
      console.warn('Speech Synthesis not supported in this browser');
      return;
    }

    // Wait for voices to load
    if (this.synthesis.getVoices().length === 0) {
      this.synthesis.addEventListener('voiceschanged', () => {
        this.selectVoice();
      });
    } else {
      this.selectVoice();
    }
  }

  selectVoice() {
    const voices = this.synthesis.getVoices();
    // Prefer English voices
    this.voice = voices.find(voice => voice.lang.startsWith('en')) || voices[0];
  }

  isSupported() {
    return 'speechSynthesis' in window;
  }

  speak(text, options = {}) {
    if (!this.isSupported()) {
      console.error('Speech Synthesis not available');
      return false;
    }

    // Cancel any ongoing speech
    this.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set voice
    if (this.voice) {
      utterance.voice = this.voice;
    }

    // Set options
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.volume = options.volume || 1.0;

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
      if (options.onError) options.onError(event);
    };

    this.synthesis.speak(utterance);
    return true;
  }

  cancel() {
    if (this.isSupported()) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  pause() {
    if (this.isSupported() && this.isSpeaking) {
      this.synthesis.pause();
    }
  }

  resume() {
    if (this.isSupported()) {
      this.synthesis.resume();
    }
  }
}
