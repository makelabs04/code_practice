// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { testConnection } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// Route imports
const codeRoutes = require('./routes/codeRoutes');
const snippetRoutes = require('./routes/snippetRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').concat([
  'http://localhost:3000',
  'http://127.0.0.1:5500',
  'http://localhost:5500',
  'null', // file:// protocol
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in dev — restrict in production
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests. Please slow down.' },
});

const codeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // max 20 runs per minute
  message: { success: false, message: 'Too many code executions. Please wait.' },
});

app.use('/api/', limiter);
app.use('/api/code/run', codeLimiter);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logger ───────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Static Files (Frontend) ──────────────────────────────────────────────────
app.use(express.static(__dirname));
// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CodeCraft API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});
// ── AI Chat Assistant Route ──
app.post('/api/ai/chat', async (req, res) => {
  const { chatHistory } = req.body;
  
  if (!chatHistory || chatHistory.length === 0) {
    return res.status(400).json({ success: false, message: "No conversation history provided" });
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: chatHistory, // Passes the entire back-and-forth conversation
      model: "llama-3.1-8b-instant", 
      temperature: 0.5,
    });

    res.json({ 
      success: true, 
      reply: chatCompletion.choices[0].message // Returns the AI's specific reply message
    });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ success: false, message: "AI Assistant is currently unavailable." });
  }
});
// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/code', codeRoutes);
app.use('/api/snippets', snippetRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const startServer = async () => {
  await testConnection();
  app.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║         CodeCraft API Server              ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Server:  http://localhost:${PORT}           ║`);
    console.log(`║  Mode:    ${process.env.NODE_ENV || 'development'}                   ║`);
    console.log('╚══════════════════════════════════════════╝\n');
  });
};

startServer();

module.exports = app;