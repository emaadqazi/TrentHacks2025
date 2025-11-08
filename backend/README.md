# ResuBlocks Backend

Backend API for ResuBlocks - Resume building application.

## Features

- 📄 Resume upload and processing
- 🔍 Resume critique against job descriptions
- 🕷️ Web scraping for job postings
- 💾 Job posting data storage
- 🤖 AI-powered recommendations

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **Axios** - HTTP client
- **Cheerio** - Web scraping
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The server will be available at `http://localhost:5000`

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=your_database_url_here
OPENAI_API_KEY=your_openai_api_key_here
```

## Project Structure

```
src/
  ├── controllers/     # Request handlers
  ├── services/        # Business logic
  ├── routes/          # API routes
  └── index.ts         # Entry point
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/resume/upload` - Upload resume
- `POST /api/resume/critique` - Critique resume against job description
- `POST /api/resume/blocks/alternatives` - Get alternative bullet points
- `POST /api/jobs/scrape` - Scrape job posting

## Database

Database setup will be added based on requirements (MongoDB, PostgreSQL, etc.)

