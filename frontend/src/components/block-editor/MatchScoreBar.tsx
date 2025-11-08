import type { MatchAnalysis } from "@/types/resume"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, AlertCircle } from "lucide-react"

interface MatchScoreBarProps {
  analysis: MatchAnalysis
}

export default function MatchScoreBar({ analysis }: MatchScoreBarProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent match!"
    if (score >= 60) return "Good, but can improve"
    return "Needs improvement"
  }

  return (
    <div className="border-b bg-muted/30 py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Match Score:</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative h-2 w-48 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-500 ${getScoreColor(analysis.overallScore)}`}
                  style={{ width: `${analysis.overallScore}%` }}
                />
              </div>
              <span className="text-2xl font-bold">{analysis.overallScore}/100</span>
            </div>
            <Badge variant={analysis.overallScore >= 80 ? "default" : "secondary"}>
              {getScoreLabel(analysis.overallScore)}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-600">
              <span className="font-medium">{analysis.matchedKeywords.length}</span>
              <span className="text-muted-foreground">matched</span>
            </div>
            {analysis.missingKeywords.length > 0 && (
              <div className="flex items-center gap-1 text-orange-600">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">{analysis.missingKeywords.length}</span>
                <span className="text-muted-foreground">missing</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

