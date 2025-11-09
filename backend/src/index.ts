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
const PORT = process.env.PORT || 5001; // Changed from 5000 (AirPlay uses 5000)

// Simple CORS - allow everything in development
app.use(cors({
  origin: true,
  credentials: true
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
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
