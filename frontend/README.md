# ResuBlocks Frontend

Resume building app with drag-and-drop blocks built with React, Vite, and Tailwind CSS.

## Features

- 🎯 Drag-and-drop resume building
- 📝 Alternative bullet point generation
- 🔄 Real-time resume critique
- 📄 Job description upload and analysis

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **@hello-pangea/dnd** - Drag and drop functionality
- **Framer Motion** - Animations
- **React Hot Toast** - Notifications
- **Axios** - API client
- **Lucide React** - Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
  ├── components/      # React components
  ├── services/        # API services
  ├── App.tsx          # Main app component
  ├── main.tsx         # Entry point
  └── index.css        # Global styles with Tailwind
```

## API Integration

The frontend is configured to proxy API requests to the backend at `http://localhost:5000`. Make sure the backend is running for full functionality.
