# VoiceUX

> Leveraging AI as the ultimate user experience

An embeddable voice-controlled AI chat widget that can be added to any website. Talk to an AI assistant using your voice, get spoken responses, and interact naturally with websites.

## Features

- **🎤 Voice Input** - Use Web Speech API for natural voice commands
- **🔊 Voice Output** - AI responses are read aloud using text-to-speech
- **💬 Chat Interface** - Beautiful, responsive chat UI
- **🤖 AI Powered** - Intelligent conversations using OpenAI GPT or Anthropic Claude
- **🎨 Customizable** - Easy to style and configure
- **🚀 Easy Integration** - Just add one script tag to your website
- **📱 Responsive** - Works on desktop and mobile browsers

## Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and configure your AI provider
# For Anthropic (recommended):
#   AI_PROVIDER=anthropic
#   ANTHROPIC_API_KEY=your_anthropic_key_here
#
# For OpenAI:
#   AI_PROVIDER=openai
#   OPENAI_API_KEY=your_openai_key_here

# Start the server
npm start
```

The backend server will start on `http://localhost:3000`

### 2. Widget Build

```bash
# Navigate to widget directory
cd widget

# Install dependencies
npm install

# Build the widget
npm run build

# Or run in watch mode for development
npm run watch
```

This creates `widget/dist/voiceUX.js`

### 3. Add to Your Website

```html
<!-- Include the widget script -->
<script src="path/to/voiceUX.js"></script>

<!-- Initialize the widget -->
<script>
  VoiceUX.init({
    apiUrl: 'http://localhost:3000/api',
    autoSpeak: true,
    debug: false
  });
</script>
```

### 4. Try the Demo

```bash
# Open the demo page in your browser
# Make sure backend is running first!
open examples/demo.html
```

## AI Provider Options

VoiceUX supports both **Anthropic Claude** and **OpenAI GPT** models:

### Anthropic Claude (Recommended)
- **Models:** Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku
- **Best for:** Conversational quality, following instructions, natural responses
- **Setup:** Get API key from [console.anthropic.com](https://console.anthropic.com/)
- **Config:** Set `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` in `.env`

### OpenAI GPT
- **Models:** GPT-3.5 Turbo, GPT-4, GPT-4 Turbo
- **Best for:** General-purpose tasks, wide adoption
- **Setup:** Get API key from [platform.openai.com](https://platform.openai.com/)
- **Config:** Set `AI_PROVIDER=openai` and `OPENAI_API_KEY` in `.env`

You can switch between providers by simply changing the `AI_PROVIDER` variable in your `.env` file and restarting the server.

## Configuration Options

```javascript
VoiceUX.init({
  // Backend API URL (required)
  apiUrl: 'http://localhost:3000/api',

  // API key for authentication (optional)
  apiKey: null,

  // Widget position: 'bottom-right', 'bottom-left', etc.
  position: 'bottom-right',

  // Theme: 'light' or 'dark'
  theme: 'light',

  // Auto-speak AI responses
  autoSpeak: true,

  // Enable debug logging
  debug: false
});
```

## API Reference

### Methods

```javascript
// Open the chat panel
VoiceUX.open();

// Close the chat panel
VoiceUX.close();

// Send a message programmatically
VoiceUX.sendMessage('Hello!');

// Destroy the widget
VoiceUX.destroy();
```

## Project Structure

```
VoiceUX/
├── widget/                 # Frontend widget
│   ├── src/
│   │   ├── index.js       # Main entry point
│   │   ├── ui/            # UI components
│   │   ├── voice/         # Voice recognition & TTS
│   │   └── api/           # API client
│   ├── dist/              # Built files
│   └── build.js           # Build script
├── backend/               # Backend API server
│   ├── server.js          # Express server
│   ├── routes/            # API routes
│   └── services/          # AI service
└── examples/              # Demo pages
    └── demo.html
```

## Browser Support

### Voice Recognition
- Chrome/Edge (full support)
- Safari 14.1+ (limited support)
- Firefox (not supported - falls back to text input)

### Text-to-Speech
- All modern browsers

## Development

### Widget Development

```bash
cd widget
npm run watch  # Auto-rebuild on changes
```

### Backend Development

```bash
cd backend
npm run dev    # Auto-restart with nodemon
```

## Environment Variables

### Backend (.env)

```bash
# AI Provider (choose one)
AI_PROVIDER=anthropic  # or 'openai'

# Anthropic Configuration (if using Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
# Other models: claude-3-opus-20240229, claude-3-haiku-20240307

# OpenAI Configuration (if using GPT)
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
# Other models: gpt-4, gpt-4-turbo-preview

# Server Configuration (optional)
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
```

## Roadmap

### Phase 1: Basic Chat Widget ✅
- [x] Floating chat bubble UI
- [x] Voice input/output
- [x] Basic AI conversation
- [x] Backend API
- [x] Support for both OpenAI and Anthropic AI providers

### Phase 2: Page Reading (Coming Soon)
- [ ] DOM analysis and summarization
- [ ] "Read this to me" functionality
- [ ] Element identification

### Phase 3: Page Control (Future)
- [ ] Click, scroll, navigation actions
- [ ] Form filling capabilities
- [ ] Smart element finding

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Troubleshooting

### Voice recognition not working
- Make sure you're using Chrome/Edge browser
- Check that you've granted microphone permissions
- Ensure you're using HTTPS (or localhost)

### Backend connection errors
- Verify backend server is running on correct port
- Check CORS settings in backend/server.js
- Ensure API URL in widget config matches backend

### AI API errors
- Verify your API key is correct in .env
- Check that AI_PROVIDER matches your chosen provider
- For OpenAI: Ensure you have credits in your account
- For Anthropic: Verify your API key has the correct permissions
- Review API usage limits and rate limits

## Support

For issues and questions, please open an issue on GitHub.
