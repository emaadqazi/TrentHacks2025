import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import routes from './routes';

// Load environment variables from .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

// Log if OpenAI key is configured (without exposing the key)
const apiKey = process.env.OPENAI_API_KEY || process.env.OPEN_AI_KEY;
if (apiKey) {
  console.log('✅ OpenAI API key found');
  console.log(`   Key starts with: ${apiKey.substring(0, 10)}...`);
} else {
  console.log('⚠️ OpenAI API key not found - AI analysis will not work');
  console.log('   Please add OPENAI_API_KEY or OPEN_AI_KEY to backend/.env.local');
  console.log(`   Current working directory: ${process.cwd()}`);
  console.log(`   Looking for .env.local at: ${path.resolve(process.cwd(), '.env.local')}`);
}

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5001; // Railway provides PORT as string

// CORS configuration - allow all origins in production (Railway handles HTTPS)
// In production, Railway provides the PORT env variable automatically
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? true // Allow all origins in production (Railway handles security)
    : true, // Allow all in development too
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', routes);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
});
