import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X, Edit2, Check } from "lucide-react"
import type { SkillCategory } from "@/types/resume"

interface SkillsEditorProps {
  skills: SkillCategory[]
  onUpdate: (skills: SkillCategory[]) => void
}

export default function SkillsEditor({ skills, onUpdate }: SkillsEditorProps) {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [editingCategoryName, setEditingCategoryName] = useState("")
  const [newSkill, setNewSkill] = useState<{ [key: string]: string }>({})

  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: `skill-cat-${Date.now()}`,
      category: "New Category",
      skills: [],
      order: skills.length
    }
    onUpdate([...skills, newCategory])
    setEditingCategoryId(newCategory.id)
    setEditingCategoryName(newCategory.category)
  }

  const handleDeleteCategory = (id: string) => {
    if (confirm('Delete this skill category?')) {
      onUpdate(skills.filter(cat => cat.id !== id))
    }
  }

  const handleRenameCategoryStart = (category: SkillCategory) => {
    setEditingCategoryId(category.id)
    setEditingCategoryName(category.category)
  }

  const handleRenameCategorySave = (id: string) => {
    onUpdate(skills.map(cat => 
      cat.id === id ? { ...cat, category: editingCategoryName } : cat
    ))
    setEditingCategoryId(null)
    setEditingCategoryName("")
  }

  const handleAddSkill = (categoryId: string) => {
    const skillText = newSkill[categoryId]?.trim()
    if (!skillText) return

    onUpdate(skills.map(cat => 
      cat.id === categoryId 
        ? { ...cat, skills: [...cat.skills, skillText] }
        : cat
    ))
    setNewSkill({ ...newSkill, [categoryId]: "" })
  }

  const handleDeleteSkill = (categoryId: string, skillIndex: number) => {
    onUpdate(skills.map(cat => 
      cat.id === categoryId 
        ? { ...cat, skills: cat.skills.filter((_, i) => i !== skillIndex) }
        : cat
    ))
  }

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Technical Skills</CardTitle>
          <Button size="sm" variant="outline" onClick={handleAddCategory}>
            <Plus className="h-4 w-4 mr-1" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No skills added yet. Click "Add Category" to start.</p>
          </div>
        ) : (
          skills.map((category) => (
            <div key={category.id} className="space-y-2 p-3 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {editingCategoryId === category.id ? (
                  <>
                    <Input
                      value={editingCategoryName}
                      onChange={(e) => setEditingCategoryName(e.target.value)}
                      className="flex-1 h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleRenameCategorySave(category.id)
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRenameCategorySave(category.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold flex-1">{category.category}</h4>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRenameCategoryStart(category)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {skill}
                    <button
                      onClick={() => handleDeleteSkill(category.id, index)}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Input
                  placeholder="Add a skill..."
                  value={newSkill[category.id] || ""}
                  onChange={(e) => setNewSkill({ ...newSkill, [category.id]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSkill(category.id)
                    }
                  }}
                  className="flex-1 h-8"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddSkill(category.id)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

