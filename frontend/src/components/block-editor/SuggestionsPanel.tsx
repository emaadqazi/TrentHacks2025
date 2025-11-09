import type { SuggestionBlock } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Lightbulb } from "lucide-react"

interface SuggestionsPanelProps {
  suggestions: SuggestionBlock[]
  selectedBlockId: string | null
  onReplace: (originalBlockId: string, suggestionId: string) => void
}

export default function SuggestionsPanel({ suggestions, selectedBlockId, onReplace }: SuggestionsPanelProps) {
  const relevantSuggestions = suggestions.filter((s) => s.forBlockId === selectedBlockId)

  if (!selectedBlockId) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3a5f24]/20">
          <Lightbulb className="h-8 w-8 text-[#3a5f24]" />
        </div>
        <p className="text-sm text-[#C9B896] max-w-[200px]">
          Select a bullet point to see AI-generated alternatives
        </p>
      </div>
    )
  }

  if (relevantSuggestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-[#C9B896] max-w-[200px]">
          No suggestions available for this block
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-[#C9B896]">
        {relevantSuggestions.length} alternative{relevantSuggestions.length !== 1 ? "s" : ""} available
      </div>

      {relevantSuggestions
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .map((suggestion) => (
          <Card key={suggestion.id} className="border-2 border-[#8B6F47]/30 bg-[#18100a]/60 hover:border-[#3a5f24] transition-colors">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm leading-relaxed flex-1 text-[#F5F1E8]">{suggestion.text}</p>
                {suggestion.score && (
                  <Badge
                    className={`shrink-0 ${suggestion.score >= 80 ? "bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white" : "bg-[#8B6F47]/20 text-[#C9B896] border-[#8B6F47]/30"}`}
                  >
                    {suggestion.score}
                  </Badge>
                )}
              </div>

              {suggestion.reason && (
                <div className="text-xs text-[#C9B896] italic">
                  💡 {suggestion.reason}
                </div>
              )}

              {suggestion.tags && suggestion.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {suggestion.tags.map((tag, idx) => (
                    <Badge key={idx} className="text-xs bg-[#8B6F47]/20 text-[#C9B896] border border-[#8B6F47]/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <Button
                size="sm"
                className="w-full bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]"
                onClick={() => onReplace(suggestion.forBlockId, suggestion.id)}
              >
                Replace
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </CardContent>
          </Card>
        ))}
    </div>
  )
}

