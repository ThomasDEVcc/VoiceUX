# VoiceUX

> Leveraging AI as the ultimate user experience

An embeddable voice-controlled AI chat widget that can be added to any website. Talk to an AI assistant using your voice, get spoken responses, and interact naturally with websites.

## Features

- **🎤 Voice Input** - Use Web Speech API for natural voice commands
- **🔊 Voice Output** - AI responses are read aloud using text-to-speech
- **💬 Chat Interface** - Beautiful, responsive chat UI
- **🤖 AI Powered** - Intelligent conversations using OpenAI GPT
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

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=your_key_here

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
# Required
OPENAI_API_KEY=your_openai_api_key

# Optional
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

### OpenAI API errors
- Verify your API key is correct in .env
- Check you have credits in your OpenAI account
- Review API usage limits

## Support

For issues and questions, please open an issue on GitHub.
