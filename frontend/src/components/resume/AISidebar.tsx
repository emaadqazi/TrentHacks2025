import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AIAnalysis } from '@/types/resume';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';

interface AISidebarProps {
  analysis: AIAnalysis | null;
  loading: boolean;
  onApplySuggestion: (suggestionId: string) => void;
  onImproveWithAI: () => void;
}

export function AISidebar({ analysis, loading, onApplySuggestion, onImproveWithAI }: AISidebarProps) {
  const [expandedSuggestion, setExpandedSuggestion] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center bg-card p-6">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Analyzing with AI...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex h-full items-center justify-center bg-card p-6">
        <div className="text-center">
          <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            Select a component to see AI analysis
          </p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuggestionIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      clarity: '🎯',
      impact: '💪',
      ats: '🤖',
      grammar: '✍️',
      format: '📝',
    };
    return icons[type] || '💡';
  };

  return (
    <div className="h-full overflow-y-auto bg-card p-6">
      <div className="space-y-6">
        {/* Overall Score */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">AI Analysis</h3>
              <div className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                {analysis.score}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Clarity</span>
                <span className={getScoreColor(analysis.clarity)}>{analysis.clarity}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Impact</span>
                <span className={getScoreColor(analysis.impact)}>{analysis.impact}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">ATS Score</span>
                <span className={getScoreColor(analysis.atsScore)}>{analysis.atsScore}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Suggestions</h4>
            <AnimatePresence>
              {analysis.suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      expandedSuggestion === suggestion.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() =>
                      setExpandedSuggestion(
                        expandedSuggestion === suggestion.id ? null : suggestion.id
                      )
                    }
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{getSuggestionIcon(suggestion.type)}</span>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm">{suggestion.title}</p>
                              <Badge variant="secondary" className="mt-1">
                                {suggestion.type}
                              </Badge>
                            </div>
                            {suggestion.applied && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                          </div>

                          {expandedSuggestion === suggestion.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-3"
                            >
                              <p className="text-xs text-muted-foreground">
                                {suggestion.description}
                              </p>
                              
                              <div className="space-y-2 rounded-lg bg-muted/50 p-3">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground">Before:</p>
                                  <p className="text-sm">{suggestion.original}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-green-600">After:</p>
                                  <p className="text-sm font-medium">{suggestion.improved}</p>
                                </div>
                              </div>

                              {!suggestion.applied && (
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onApplySuggestion(suggestion.id);
                                  }}
                                >
                                  Apply This Change
                                </Button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Improve with AI Button */}
        <Button
          className="w-full"
          size="lg"
          onClick={onImproveWithAI}
          disabled={analysis.suggestions.length === 0}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Apply All Suggestions
        </Button>

        {/* AI Rewritten Version */}
        {analysis.rewrittenVersion && (
          <Card>
            <CardHeader>
              <h4 className="font-semibold">AI Rewrite</h4>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground">{analysis.rewrittenVersion}</p>
              <Button size="sm" className="mt-3 w-full" variant="outline">
                Use This Version
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

