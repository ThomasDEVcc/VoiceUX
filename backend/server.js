/**
 * VoiceUX Backend Server
 * Handles AI processing for the widget
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');
const aiService = require('./services/aiService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://127.0.0.1:8080'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // For development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true
}));

// Initialize AI service
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('WARNING: OPENAI_API_KEY not set in environment variables');
    console.warn('Please create a .env file with your OpenAI API key');
  } else {
    aiService.initialize(apiKey);
  }
} catch (error) {
  console.error('Failed to initialize AI service:', error);
}

// Routes
app.use('/api', chatRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'VoiceUX API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 VoiceUX Backend Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health\n`);

  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  To use AI features, set OPENAI_API_KEY in .env file\n');
  }
});

module.exports = app;
