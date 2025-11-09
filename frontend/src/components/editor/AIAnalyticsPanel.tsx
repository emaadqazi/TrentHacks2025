import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, TrendingUp, Lightbulb } from "lucide-react"
import type { ExperienceEntry } from "@/types/resume"

interface AIAnalyticsPanelProps {
  experience: ExperienceEntry | null
}

export default function AIAnalyticsPanel({ experience }: AIAnalyticsPanelProps) {
  if (!experience) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Analytics
          </CardTitle>
          <CardDescription>
            Select an experience entry to see AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <TrendingUp className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No experience selected</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const aiScore = experience.aiScore

  if (!aiScore) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Analytics
          </CardTitle>
          <CardDescription>
            Click "Analyze with AI" to get insights for {experience.company}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <Lightbulb className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No analysis available yet</p>
            <p className="text-xs mt-2">Click the "Analyze with AI" button to generate insights</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getScoreBadgeClass = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400"
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          AI Analytics
        </CardTitle>
        <CardDescription>
          Analysis for {experience.company}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <div className={`text-5xl font-bold mb-2 ${getScoreColor(aiScore.overall)}`}>
            {aiScore.overall}%
          </div>
          <p className="text-sm text-muted-foreground">Overall ATS Score</p>
          <Progress value={aiScore.overall} className="mt-3" />
        </div>

        {/* Keyword Match */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-sm">Keyword Match</h4>
            <Badge variant="outline" className={getScoreBadgeClass(aiScore.keywordMatch)}>
              {aiScore.keywordMatch}%
            </Badge>
          </div>
          <Progress value={aiScore.keywordMatch} className="mb-2" />
          <p className="text-xs text-muted-foreground">
            How well your experience matches job requirements
          </p>
        </div>

        {/* Bullet Strength Scores */}
        {aiScore.bulletStrengths && aiScore.bulletStrengths.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3">Bullet Point Strengths</h4>
            <div className="space-y-2">
              {aiScore.bulletStrengths.map((score, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-16">Bullet {index + 1}</span>
                  <Progress value={score} className="flex-1" />
                  <Badge variant="outline" className={`text-xs ${getScoreBadgeClass(score)}`}>
                    {score}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {aiScore.missingKeywords && aiScore.missingKeywords.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Missing Keywords
            </h4>
            <div className="flex flex-wrap gap-2">
              {aiScore.missingKeywords.map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Consider incorporating these keywords from the job description
            </p>
          </div>
        )}

        {/* AI Suggestions */}
        {aiScore.suggestions && aiScore.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              AI Suggestions
            </h4>
            <ul className="space-y-3">
              {aiScore.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

