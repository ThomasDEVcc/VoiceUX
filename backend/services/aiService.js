/**
 * AI Service - Handle AI provider communication (OpenAI or Anthropic)
 */
const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    this.provider = null;
    this.client = null;
    this.model = null;
    this.systemPrompt = `You are a helpful voice AI assistant embedded in a website.
You help users with questions and tasks. Keep your responses concise and conversational,
as they will be read aloud. Avoid using markdown formatting or special characters.
Be friendly, helpful, and natural in your responses.`;
  }

  initialize(config) {
    const provider = (config.provider || 'openai').toLowerCase();

    if (provider === 'anthropic') {
      return this.initializeAnthropic(config.apiKey, config.model);
    } else if (provider === 'openai') {
      return this.initializeOpenAI(config.apiKey, config.model);
    } else {
      throw new Error(`Unsupported AI provider: ${provider}`);
    }
  }

  initializeOpenAI(apiKey, model) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }

    this.provider = 'openai';
    this.client = new OpenAI({ apiKey });
    this.model = model || 'gpt-3.5-turbo';

    console.log(`✅ AI Service initialized with OpenAI (${this.model})`);
  }

  initializeAnthropic(apiKey, model) {
    if (!apiKey) {
      throw new Error('Anthropic API key is required');
    }

    this.provider = 'anthropic';
    this.client = new Anthropic({ apiKey });
    this.model = model || 'claude-3-5-sonnet-20241022';

    console.log(`✅ AI Service initialized with Anthropic (${this.model})`);
  }

  async chat(message, history = []) {
    if (!this.client) {
      throw new Error('AI Service not initialized');
    }

    try {
      if (this.provider === 'anthropic') {
        return await this.chatAnthropic(message, history);
      } else {
        return await this.chatOpenAI(message, history);
      }
    } catch (error) {
      console.error(`Error calling ${this.provider} API:`, error);
      throw error;
    }
  }

  async chatOpenAI(message, history = []) {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  }

  async chatAnthropic(message, history = []) {
    // Anthropic uses system parameter separately
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 500,
      temperature: 0.7,
      system: this.systemPrompt,
      messages: messages
    });

    return response.content[0].text;
  }
}

module.exports = new AIService();
