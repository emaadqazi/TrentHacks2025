import { useState } from 'react';
import { ResumeBuilder, type ResumeBlock } from './components/ResumeBuilder';
import { BlockAlternatives } from './components/BlockAlternatives';

function App() {
  const [blocks, setBlocks] = useState<ResumeBlock[]>([
    {
      id: '1',
      type: 'experience',
      content: 'Developed and maintained web applications using React and TypeScript',
    },
    {
      id: '2',
      type: 'education',
      content: 'Bachelor of Science in Computer Science, University Name',
    },
    {
      id: '3',
      type: 'skill',
      content: 'Proficient in JavaScript, TypeScript, React, Node.js, and Python',
    },
  ]);

  const [alternatives] = useState([
    {
      id: 'alt-1',
      content: 'Built scalable web applications with React, improving user engagement by 40%',
      score: 95,
    },
    {
      id: 'alt-2',
      content: 'Developed full-stack applications using React and Node.js, serving 10,000+ users',
      score: 88,
    },
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ResuBlocks
          </h1>
          <p className="text-gray-600">
            Resume building app with drag-and-drop blocks
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Resume Blocks
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Drag and drop to reorder your resume sections
            </p>
            <ResumeBuilder blocks={blocks} onBlocksChange={setBlocks} />
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Alternative Suggestions
            </h2>
            <BlockAlternatives
              alternatives={alternatives}
              onSelect={(alt) => {
                console.log('Selected alternative:', alt);
                // TODO: Implement selection logic
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
