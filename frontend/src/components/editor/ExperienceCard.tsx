import { useState } from "react"
import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, Plus, Trash2, Sparkles } from "lucide-react"
import type { ExperienceEntry } from "@/types/resume"

interface ExperienceCardProps {
  experience: ExperienceEntry
  onUpdate: (updates: Partial<ExperienceEntry>) => void
  onDelete: () => void
  onAnalyze: () => void
  isSelected: boolean
  onClick: () => void
}

export default function ExperienceCard({
  experience,
  onUpdate,
  onDelete,
  onAnalyze,
  isSelected,
  onClick
}: ExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [localData, setLocalData] = useState(experience)

  // Auto-expand when selected
  React.useEffect(() => {
    if (isSelected) {
      setIsExpanded(true)
    }
  }, [isSelected])

  const handleSave = () => {
    onUpdate(localData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalData(experience)
    setIsEditing(false)
  }

  const handleAddBullet = () => {
    const newBullets = [...localData.bullets, ""]
    setLocalData({ ...localData, bullets: newBullets })
  }

  const handleDeleteBullet = (index: number) => {
    const newBullets = localData.bullets.filter((_, i) => i !== index)
    setLocalData({ ...localData, bullets: newBullets })
  }

  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...localData.bullets]
    newBullets[index] = value
    setLocalData({ ...localData, bullets: newBullets })
  }

  const getScoreColor = (score?: number) => {
    if (!score) return "bg-gray-100 text-gray-800"
    if (score >= 80) return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    if (score >= 60) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
  }

  return (
    <Card 
      className={`mb-4 transition-all cursor-pointer hover:shadow-lg ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
      }`}
      onClick={onClick}
      title="Click to view AI analytics for this experience"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{experience.company}</h3>
            <p className="text-sm text-muted-foreground">{experience.role}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {experience.startDate} - {experience.endDate} • {experience.location}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {experience.aiScore && (
              <Badge variant="outline" className={getScoreColor(experience.aiScore.overall)}>
                {experience.aiScore.overall}%
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {!isEditing ? (
            <div className="space-y-3">
              {/* View Mode */}
              <ul className="list-disc pl-5 space-y-2">
                {experience.bullets.map((bullet, index) => (
                  <li key={index} className="text-sm">
                    {bullet}
                    {experience.aiScore?.bulletStrengths && (
                      <Badge 
                        variant="outline" 
                        className={`ml-2 text-xs ${getScoreColor(experience.aiScore.bulletStrengths[index])}`}
                      >
                        {experience.aiScore.bulletStrengths[index]}%
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(true)
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    onAnalyze()
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Analyze with AI
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm('Delete this experience entry?')) {
                      onDelete()
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Edit Mode */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Company</label>
                  <Input
                    value={localData.company}
                    onChange={(e) => setLocalData({ ...localData, company: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <Input
                    value={localData.role}
                    onChange={(e) => setLocalData({ ...localData, role: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    value={localData.startDate}
                    onChange={(e) => setLocalData({ ...localData, startDate: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    value={localData.endDate}
                    onChange={(e) => setLocalData({ ...localData, endDate: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={localData.location}
                    onChange={(e) => setLocalData({ ...localData, location: e.target.value })}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Bullet Points</label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddBullet()
                    }}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Bullet
                  </Button>
                </div>
                <div className="space-y-2">
                  {localData.bullets.map((bullet, index) => (
                    <div key={index} className="flex gap-2">
                      <Textarea
                        value={bullet}
                        onChange={(e) => handleBulletChange(index, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 min-h-[60px]"
                        placeholder="Enter bullet point..."
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteBullet(index)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSave()
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCancel()
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}

