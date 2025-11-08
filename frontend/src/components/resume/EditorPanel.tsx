import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ResumeComponent } from '@/types/resume';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Briefcase, 
  ListChecks, 
  ChevronRight,
  Edit2,
  Save,
  X
} from 'lucide-react';

interface EditorPanelProps {
  component: ResumeComponent;
  onZoomIn: (componentId: string) => void;
  onUpdateContent: (componentId: string, newContent: string) => void;
  selectedId: string | null;
}

export function EditorPanel({
  component,
  onZoomIn,
  onUpdateContent,
  selectedId,
}: EditorPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'resume':
        return <FileText className="h-5 w-5" />;
      case 'section':
        return <ListChecks className="h-5 w-5" />;
      case 'job':
        return <Briefcase className="h-5 w-5" />;
      case 'bullet':
        return <ChevronRight className="h-4 w-4" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'resume':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'section':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      case 'job':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'bullet':
        return 'bg-muted/50 text-foreground border-border';
      default:
        return 'bg-card text-foreground border-border';
    }
  };

  const startEditing = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditValue(currentContent);
  };

  const saveEditing = () => {
    if (editingId && editValue.trim()) {
      onUpdateContent(editingId, editValue);
      setEditingId(null);
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditValue('');
  };

  const renderComponent = (comp: ResumeComponent, depth: number = 0) => {
    const isEditing = editingId === comp.id;
    const isSelected = selectedId === comp.id;
    const hasChildren = comp.children && comp.children.length > 0;
    const isBullet = comp.type === 'bullet';

    return (
      <motion.div
        key={comp.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: depth * 0.05 }}
        className={`ml-${depth * 4}`}
      >
        <Card
          className={`mb-3 cursor-pointer transition-all hover:shadow-lg ${
            getComponentColor(comp.type)
          } ${
            isSelected ? 'ring-2 ring-primary shadow-lg' : ''
          }`}
          onClick={() => !isEditing && hasChildren && onZoomIn(comp.id)}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{getComponentIcon(comp.type)}</div>
              
              <div className="flex-1">
                {/* Component Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{comp.title}</h4>
                    {comp.metadata && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {comp.metadata.company && comp.metadata.dates && (
                          <>{comp.metadata.dates}</>
                        )}
                      </p>
                    )}
                  </div>
                  
                  {!isEditing && isBullet && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(comp.id, comp.content);
                      }}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>

                {/* Component Content */}
                {isEditing ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          saveEditing();
                        } else if (e.key === 'Escape') {
                          cancelEditing();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveEditing}>
                        <Save className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEditing}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {isBullet ? (
                      <p className="text-sm text-foreground">{comp.content}</p>
                    ) : (
                      <p className="text-xs text-muted-foreground">{comp.content}</p>
                    )}
                  </>
                )}

                {/* Children indicator */}
                {hasChildren && !isEditing && (
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                    <span>{comp.children?.length} items</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Render children if not zoomable */}
        {!hasChildren && comp.children && comp.children.map((child) => (
          renderComponent(child, depth + 1)
        ))}
      </motion.div>
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-background p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">{component.title}</h2>
        <p className="text-sm text-muted-foreground">
          {component.type === 'resume' && 'Full resume view'}
          {component.type === 'section' && 'Section overview'}
          {component.type === 'job' && 'Experience details'}
          {component.type === 'bullet' && 'Individual bullet point'}
        </p>
      </div>

      <div className="space-y-3">
        {component.children && component.children.length > 0 ? (
          component.children.map((child) => renderComponent(child, 0))
        ) : (
          renderComponent(component, 0)
        )}
      </div>
    </div>
  );
}

