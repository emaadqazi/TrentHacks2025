import { motion } from 'framer-motion';

interface Alternative {
  id: string;
  content: string;
  score?: number;
}

interface BlockAlternativesProps {
  alternatives: Alternative[];
  onSelect: (alternative: Alternative) => void;
}

export const BlockAlternatives = ({ alternatives, onSelect }: BlockAlternativesProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Alternative Bullet Points
      </h3>
      {alternatives.map((alt, index) => (
        <motion.div
          key={alt.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(alt)}
        >
          <div className="flex items-start justify-between">
            <p className="text-gray-800 flex-1">{alt.content}</p>
            {alt.score && (
              <span className="ml-4 px-2 py-1 bg-blue-500 text-white text-xs font-semibold rounded">
                {alt.score}%
              </span>
            )}
          </div>
          <button
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(alt);
            }}
          >
            Use this →
          </button>
        </motion.div>
      ))}
    </div>
  );
};

