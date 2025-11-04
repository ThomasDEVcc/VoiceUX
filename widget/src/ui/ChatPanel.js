/**
 * ChatPanel - Main chat interface
 */
export class ChatPanel {
  constructor(onSendMessage, onClose) {
    this.onSendMessage = onSendMessage;
    this.onClose = onClose;
    this.element = this.create();
    this.messagesContainer = this.element.querySelector('.voiceUX-messages');
    this.input = this.element.querySelector('.voiceUX-input');
    this.sendButton = this.element.querySelector('.voiceUX-btn-send');
    this.setupEventListeners();
  }

  create() {
    const panel = document.createElement('div');
    panel.className = 'voiceUX-panel';
    panel.innerHTML = `
      <div class="voiceUX-header">
        <h3>Voice AI Assistant</h3>
        <button class="voiceUX-close" aria-label="Close">&times;</button>
      </div>
      <div class="voiceUX-messages"></div>
      <div class="voiceUX-input-area">
        <input
          type="text"
          class="voiceUX-input"
          placeholder="Type or use voice..."
          aria-label="Message input"
        />
        <button class="voiceUX-btn voiceUX-btn-send" aria-label="Send message">
          <svg class="voiceUX-btn-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;
    return panel;
  }

  setupEventListeners() {
    // Close button
    this.element.querySelector('.voiceUX-close').addEventListener('click', this.onClose);

    // Send button
    this.sendButton.addEventListener('click', () => this.handleSend());

    // Enter key to send
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.handleSend();
      }
    });
  }

  handleSend() {
    const message = this.input.value.trim();
    if (message) {
      this.onSendMessage(message);
      this.input.value = '';
    }
  }

  open() {
    this.element.classList.add('open');
    this.input.focus();
  }

  close() {
    this.element.classList.remove('open');
  }

  toggle() {
    if (this.element.classList.contains('open')) {
      this.close();
    } else {
      this.open();
    }
  }

  addMessage(content, role = 'assistant') {
    const message = document.createElement('div');
    message.className = `voiceUX-message ${role}`;
    message.textContent = content;
    this.messagesContainer.appendChild(message);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typing = document.createElement('div');
    typing.className = 'voiceUX-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    typing.setAttribute('data-typing', 'true');
    this.messagesContainer.appendChild(typing);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typing = this.messagesContainer.querySelector('[data-typing="true"]');
    if (typing) {
      typing.remove();
    }
  }

  scrollToBottom() {
    this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
  }

  setInputDisabled(disabled) {
    this.input.disabled = disabled;
    this.sendButton.disabled = disabled;
  }

  mount(container) {
    container.appendChild(this.element);
  }
}
