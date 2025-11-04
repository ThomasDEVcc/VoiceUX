/**
 * AIClient - Handle communication with backend API
 */
export class AIClient {
  constructor(config) {
    this.apiUrl = config.apiUrl || 'http://localhost:3000/api';
    this.apiKey = config.apiKey;
    this.conversationHistory = [];
  }

  async sendMessage(message) {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'X-API-Key': this.apiKey })
        },
        body: JSON.stringify({
          message,
          history: this.conversationHistory
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update conversation history
      this.conversationHistory.push(
        { role: 'user', content: message },
        { role: 'assistant', content: data.response }
      );

      // Keep history manageable (last 10 messages)
      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  clearHistory() {
    this.conversationHistory = [];
  }
}
