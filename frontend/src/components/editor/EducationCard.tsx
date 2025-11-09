import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import type { EducationEntry } from "@/types/resume"

interface EducationCardProps {
  education: EducationEntry
  onUpdate: (updates: Partial<EducationEntry>) => void
  onDelete: () => void
}

export default function EducationCard({
  education,
  onUpdate,
  onDelete
}: EducationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [localData, setLocalData] = useState(education)

  const handleSave = () => {
    onUpdate(localData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setLocalData(education)
    setIsEditing(false)
  }

  return (
    <Card className="mb-4 transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{education.school}</h3>
            <p className="text-sm text-muted-foreground">{education.degree}</p>
            {education.field && (
              <p className="text-sm text-muted-foreground">{education.field}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {education.graduationDate} • {education.location}
              {education.gpa && ` • GPA: ${education.gpa}`}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          {!isEditing ? (
            <div className="flex gap-2 pt-3 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (confirm('Delete this education entry?')) {
                    onDelete()
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-sm font-medium">School</label>
                  <Input
                    value={localData.school}
                    onChange={(e) => setLocalData({ ...localData, school: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Degree</label>
                  <Input
                    value={localData.degree}
                    onChange={(e) => setLocalData({ ...localData, degree: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">Field of Study (Optional)</label>
                  <Input
                    value={localData.field || ""}
                    onChange={(e) => setLocalData({ ...localData, field: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Graduation Date</label>
                  <Input
                    value={localData.graduationDate}
                    onChange={(e) => setLocalData({ ...localData, graduationDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Location</label>
                  <Input
                    value={localData.location}
                    onChange={(e) => setLocalData({ ...localData, location: e.target.value })}
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium">GPA (Optional)</label>
                  <Input
                    value={localData.gpa || ""}
                    onChange={(e) => setLocalData({ ...localData, gpa: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <Button size="sm" onClick={handleSave}>
                  Save Changes
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
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

