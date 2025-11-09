import type { DragEvent } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { GripVertical, Sparkles } from "lucide-react"
import type { Resume, SectionType } from "@/types/resume"

interface AISuggestionsPanelProps {
  suggestions?: {
    skills?: string[]
    summary?: string[]
    bullets?: Array<{ text: string; sectionType?: SectionType }>
  }
  resume: Resume | null
  onAddSkill?: (skill: string) => void
  onAddSummary?: (summary: string) => void
  onAddBullet?: (bullet: string, sectionId: string) => void
}

export default function AISuggestionsPanel({
  suggestions,
  resume,
  onAddSkill,
  onAddSummary,
  onAddBullet,
}: AISuggestionsPanelProps) {
  const handleDragStart = (e: DragEvent, type: 'skill' | 'summary' | 'bullet', text: string, sectionId?: string) => {
    // Store data in dataTransfer for HTML5 drag and drop
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', JSON.stringify({ type, text, sectionId }))
    // Add a custom data type for easier identification
    e.dataTransfer.setData(`application/${type}`, text)
  }

  const handleDragEnd = () => {
    // Cleanup if needed
  }

  // Filter out items that are already in the resume
  const getAvailableSkills = () => {
    if (!suggestions?.skills) return []
    if (!resume) return suggestions.skills

    const existingSkills = new Set(
      resume.sections
        .flatMap(section => section.blocks)
        .filter(block => block.type === 'skill-item')
        .map(block => block.text.toLowerCase())
    )

    return suggestions.skills.filter(
      skill => !existingSkills.has(skill.toLowerCase())
    )
  }

  const getAvailableSummaries = () => {
    if (!suggestions?.summary) return []
    if (!resume) return suggestions.summary

    const existingSummaries = new Set(
      resume.sections
        .filter(section => section.type === 'summary')
        .flatMap(section => section.blocks)
        .filter(block => block.type === 'bullet')
        .map(block => block.text.toLowerCase())
    )

    return suggestions.summary.filter(
      summary => !existingSummaries.has(summary.toLowerCase())
    )
  }

  const availableSkills = getAvailableSkills()
  const availableSummaries = getAvailableSummaries()
  const availableBullets = suggestions?.bullets || []

  if (!suggestions || (availableSkills.length === 0 && availableSummaries.length === 0 && availableBullets.length === 0)) {
    return (
      <Card className="h-full border-border/50 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1 pb-4 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardTitle className="text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <CardDescription className="text-sm">
            No suggestions available yet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">Analyze a job description to get AI suggestions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full border-border/50 shadow-xl shadow-primary/5 flex flex-col max-h-[calc(100vh-8rem)]">
      <CardHeader className="space-y-1 pb-3 bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription className="text-xs">
          Drag items to the resume preview or click to add them
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-3">
          <div className="space-y-4">
                {/* AI Suggested Summary Points */}
                {availableSummaries.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h3 className="text-xs font-semibold text-foreground">Professional Summary</h3>
                      </div>
                      <div className="space-y-1.5 pl-3">
                        {availableSummaries.map((suggestion, index) => (
                          <div
                            key={index}
                            className="group cursor-move p-2 border-2 border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'summary', suggestion)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onAddSummary?.(suggestion)}
                          >
                            <div className="flex items-start gap-1.5">
                              <GripVertical className="h-3 w-3 text-primary/60 mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-foreground/90 leading-relaxed">{suggestion}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* AI Suggested Skills */}
                {availableSkills.length > 0 && (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-primary rounded-full" />
                        <h3 className="text-xs font-semibold text-foreground">Skills</h3>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-3">
                        {availableSkills.map((suggestion, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-move px-2 py-1 text-xs border-primary/40 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'skill', suggestion)}
                            onDragEnd={handleDragEnd}
                            onClick={() => onAddSkill?.(suggestion)}
                          >
                            <GripVertical className="h-2.5 w-2.5 mr-1 text-primary/60" />
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {availableBullets.length > 0 && <Separator />}
                  </>
                )}

            {/* AI Suggested Bullet Points */}
            {availableBullets.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-1 bg-primary rounded-full" />
                  <h3 className="text-xs font-semibold text-foreground">Bullet Points</h3>
                </div>
                <div className="space-y-1.5 pl-3">
                  {availableBullets.map((suggestion, index) => (
                    <div
                      key={index}
                      className="group cursor-move p-2 border-2 border-primary/30 rounded-lg bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all"
                      draggable
                      onDragStart={(e) => handleDragStart(e, 'bullet', suggestion.text, suggestion.sectionType as any)}
                      onDragEnd={handleDragEnd}
                      onClick={() => {
                        // Find appropriate section
                        if (resume && suggestion.sectionType) {
                          const section = resume.sections.find(s => s.type === suggestion.sectionType)
                          if (section) {
                            onAddBullet?.(suggestion.text, section.id)
                          }
                        }
                      }}
                    >
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="h-3 w-3 text-primary/60 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-foreground/90 leading-relaxed">{suggestion.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

