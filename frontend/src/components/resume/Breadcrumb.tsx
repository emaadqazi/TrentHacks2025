import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home, ArrowLeft } from 'lucide-react';

interface BreadcrumbItem {
  id: string;
  title: string;
  level: number;
}

interface BreadcrumbProps {
  path: BreadcrumbItem[];
  onNavigate: (componentId: string) => void;
  onBack: () => void;
  canGoBack: boolean;
}

export function Breadcrumb({ path, onNavigate, onBack, canGoBack }: BreadcrumbProps) {
  return (
    <div className="flex items-center gap-3 border-b bg-card px-6 py-4">
      {/* Back Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        disabled={!canGoBack}
        className="mr-2"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      {/* Breadcrumb Trail */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {path.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-2"
          >
            {index === 0 && <Home className="h-4 w-4 text-muted-foreground" />}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate(item.id)}
              className={`text-sm ${
                index === path.length - 1
                  ? 'font-semibold text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item.title}
            </Button>

            {index < path.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Level indicator */}
      <div className="ml-auto flex items-center gap-2">
        <span className="text-xs text-muted-foreground">
          Level {path.length}
        </span>
      </div>
    </div>
  );
}

