/**
 * AI Service - Handle AI provider communication (OpenAI)
 */
const OpenAI = require('openai');

class AIService {
  constructor() {
    this.client = null;
    this.model = 'gpt-3.5-turbo';
    this.systemPrompt = `You are a helpful voice AI assistant embedded in a website.
You help users with questions and tasks. Keep your responses concise and conversational,
as they will be read aloud. Avoid using markdown formatting or special characters.
Be friendly, helpful, and natural in your responses.`;
  }

  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.client = new OpenAI({
      apiKey: apiKey
    });

    console.log('AI Service initialized with OpenAI');
  }

  async chat(message, history = []) {
    if (!this.client) {
      throw new Error('AI Service not initialized');
    }

    try {
      // Build messages array
      const messages = [
        { role: 'system', content: this.systemPrompt },
        ...history,
        { role: 'user', content: message }
      ];

      // Call OpenAI API
      const completion = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0].message.content;
      return response;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      throw error;
    }
  }
}

module.exports = new AIService();
