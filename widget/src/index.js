/**
 * VoiceUX - Voice-controlled AI chat widget
 * Main entry point
 */

import { ChatBubble } from './ui/ChatBubble.js';
import { ChatPanel } from './ui/ChatPanel.js';
import { SpeechRecognition } from './voice/SpeechRecognition.js';
import { TextToSpeech } from './voice/TextToSpeech.js';
import { AIClient } from './api/AIClient.js';
import styles from './ui/styles.css';

class VoiceUX {
  constructor() {
    this.config = null;
    this.container = null;
    this.chatBubble = null;
    this.chatPanel = null;
    this.speechRecognition = null;
    this.textToSpeech = null;
    this.aiClient = null;
    this.voiceButton = null;
    this.voiceStatus = null;
  }

  init(config = {}) {
    this.config = {
      apiUrl: config.apiUrl || 'http://localhost:3000/api',
      apiKey: config.apiKey || null,
      position: config.position || 'bottom-right',
      theme: config.theme || 'light',
      autoSpeak: config.autoSpeak !== false, // Speak AI responses by default
      debug: config.debug || false
    };

    this.log('Initializing VoiceUX widget...');

    // Create container with Shadow DOM for style isolation
    this.createContainer();

    // Initialize components
    this.aiClient = new AIClient({
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey
    });

    this.speechRecognition = new SpeechRecognition();
    this.textToSpeech = new TextToSpeech();

    // Create UI components
    this.chatBubble = new ChatBubble(() => this.togglePanel());
    this.chatPanel = new ChatPanel(
      (message) => this.handleSendMessage(message),
      () => this.closePanel()
    );

    // Mount components
    this.chatBubble.mount(this.container);
    this.chatPanel.mount(this.container);

    // Add voice button to panel
    this.addVoiceButton();

    // Create voice status indicator
    this.createVoiceStatus();

    // Setup voice recognition handlers
    this.setupVoiceHandlers();

    // Show welcome message
    this.showWelcomeMessage();

    this.log('VoiceUX widget initialized successfully');
  }

  createContainer() {
    // Check if already exists
    if (document.getElementById('voiceUX-root')) {
      console.warn('VoiceUX widget already initialized');
      return;
    }

    // Create shadow host
    const host = document.createElement('div');
    host.id = 'voiceUX-root';
    document.body.appendChild(host);

    // Try to use Shadow DOM, fallback to regular DOM
    try {
      const shadow = host.attachShadow({ mode: 'open' });

      // Add styles to shadow DOM
      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      shadow.appendChild(styleElement);

      // Create container
      this.container = document.createElement('div');
      this.container.className = 'voiceUX-container';
      shadow.appendChild(this.container);
    } catch (error) {
      // Fallback: use regular DOM
      this.log('Shadow DOM not supported, using regular DOM');

      const styleElement = document.createElement('style');
      styleElement.textContent = styles;
      document.head.appendChild(styleElement);

      this.container = host;
      this.container.className = 'voiceUX-container';
    }
  }

  addVoiceButton() {
    const inputArea = this.chatPanel.element.querySelector('.voiceUX-input-area');
    const sendButton = inputArea.querySelector('.voiceUX-btn-send');

    this.voiceButton = document.createElement('button');
    this.voiceButton.className = 'voiceUX-btn voiceUX-btn-voice';
    this.voiceButton.setAttribute('aria-label', 'Voice input');
    this.voiceButton.innerHTML = `
      <svg class="voiceUX-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
      </svg>
    `;

    this.voiceButton.addEventListener('click', () => this.toggleVoiceRecognition());

    // Insert before send button
    inputArea.insertBefore(this.voiceButton, sendButton);

    // Disable if not supported
    if (!this.speechRecognition.isSupported()) {
      this.voiceButton.disabled = true;
      this.voiceButton.style.opacity = '0.5';
      this.voiceButton.title = 'Voice input not supported in this browser';
    }
  }

  createVoiceStatus() {
    this.voiceStatus = document.createElement('div');
    this.voiceStatus.className = 'voiceUX-voice-status';
    this.container.appendChild(this.voiceStatus);
  }

  setupVoiceHandlers() {
    this.speechRecognition.onStart(() => {
      this.log('Voice recognition started');
      this.voiceButton.classList.add('listening');
      this.chatBubble.setListening(true);
      this.showVoiceStatus('Listening...');
    });

    this.speechRecognition.onEnd(() => {
      this.log('Voice recognition ended');
      this.voiceButton.classList.remove('listening');
      this.chatBubble.setListening(false);
      this.hideVoiceStatus();
    });

    this.speechRecognition.onResult((transcript) => {
      this.log('Voice input received:', transcript);
      this.chatPanel.input.value = transcript;
      this.handleSendMessage(transcript);
    });

    this.speechRecognition.onError((error) => {
      this.log('Voice recognition error:', error);
      this.showVoiceStatus(`Error: ${error}`, 2000);
    });
  }

  toggleVoiceRecognition() {
    if (this.speechRecognition.isListening) {
      this.speechRecognition.stop();
    } else {
      const started = this.speechRecognition.start();
      if (!started) {
        this.showVoiceStatus('Could not start voice recognition', 2000);
      }
    }
  }

  showVoiceStatus(text, duration = null) {
    this.voiceStatus.textContent = text;
    this.voiceStatus.classList.add('active');

    if (duration) {
      setTimeout(() => this.hideVoiceStatus(), duration);
    }
  }

  hideVoiceStatus() {
    this.voiceStatus.classList.remove('active');
  }

  async handleSendMessage(message) {
    if (!message.trim()) return;

    this.log('Sending message:', message);

    // Add user message to chat
    this.chatPanel.addMessage(message, 'user');

    // Disable input while processing
    this.chatPanel.setInputDisabled(true);
    this.chatPanel.showTypingIndicator();

    try {
      // Send to AI backend
      const response = await this.aiClient.sendMessage(message);

      this.chatPanel.hideTypingIndicator();
      this.chatPanel.addMessage(response, 'assistant');

      // Speak response if enabled
      if (this.config.autoSpeak && this.textToSpeech.isSupported()) {
        this.textToSpeech.speak(response);
      }

      this.log('Received response:', response);
    } catch (error) {
      this.chatPanel.hideTypingIndicator();
      this.chatPanel.addMessage(
        'Sorry, I encountered an error. Please try again.',
        'system'
      );
      console.error('Error sending message:', error);
    } finally {
      this.chatPanel.setInputDisabled(false);
    }
  }

  showWelcomeMessage() {
    this.chatPanel.addMessage(
      "Hi! I'm your voice AI assistant. Click the microphone to talk to me, or type your message.",
      'assistant'
    );
  }

  togglePanel() {
    this.chatPanel.toggle();
  }

  closePanel() {
    this.chatPanel.close();
  }

  log(...args) {
    if (this.config.debug) {
      console.log('[VoiceUX]', ...args);
    }
  }

  // Public API
  destroy() {
    const host = document.getElementById('voiceUX-root');
    if (host) {
      host.remove();
    }
    this.speechRecognition.stop();
    this.textToSpeech.cancel();
  }

  open() {
    this.chatPanel.open();
  }

  close() {
    this.chatPanel.close();
  }

  sendMessage(message) {
    return this.handleSendMessage(message);
  }
}

// Export for usage
const instance = new VoiceUX();

// Global API
window.VoiceUX = {
  init: (config) => instance.init(config),
  destroy: () => instance.destroy(),
  open: () => instance.open(),
  close: () => instance.close(),
  sendMessage: (message) => instance.sendMessage(message)
};

export default VoiceUX;
