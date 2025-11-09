import { useState } from "react"
import type { Resume, Section, Block } from "@/types/resume"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Plus, Trash2, X } from "lucide-react"

interface LivePreviewProps {
  resume: Resume | null
  setResume: (resume: Resume) => void
  onBlockUpdate?: (sectionId: string, blockId: string, text: string) => void
  onDragItem?: (type: 'skill' | 'summary' | 'bullet', text: string, sectionId?: string) => void
}

function getScoreColor(score?: number): string {
  if (!score) return "border-gray-300 bg-transparent"
  if (score >= 80) return "border-green-500 bg-green-50/50 dark:bg-green-900/20"
  if (score >= 60) return "border-yellow-500 bg-yellow-50/50 dark:bg-yellow-900/20"
  return "border-red-500 bg-red-50/50 dark:bg-red-900/20"
}

function getScoreBadgeClass(score?: number): string {
  if (!score) return "bg-gray-100 text-gray-800 border-gray-300"
  if (score >= 80) return "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400"
  if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400"
  return "bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400"
}

function getScoreIndicator(score?: number): string {
  if (!score) return "⚪"
  if (score >= 80) return "🟢"
  if (score >= 60) return "🟡"
  return "🔴"
}

export default function LivePreview({ resume, setResume, onBlockUpdate, onDragItem }: LivePreviewProps) {
  const [editingBlock, setEditingBlock] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [dragOverSection, setDragOverSection] = useState<string | null>(null)
  const [dragOverType, setDragOverType] = useState<'skill' | 'summary' | 'bullet' | null>(null)

  const handleBlockEdit = (sectionId: string, block: Block) => {
    setEditingBlock(block.id)
    setEditingText(block.text)
  }

  const handleBlockSave = (sectionId: string, blockId: string) => {
    if (!resume) return

    const updatedResume = {
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              blocks: section.blocks.map((block) =>
                block.id === blockId ? { ...block, text: editingText } : block
              ),
              subsections: section.subsections?.map((subsection) => ({
                ...subsection,
                blocks: subsection.blocks.map((block) =>
                  block.id === blockId ? { ...block, text: editingText } : block
                ),
              })),
            }
          : section
      ),
    }

    setResume(updatedResume)
    setEditingBlock(null)
    setEditingText("")

    if (onBlockUpdate) {
      onBlockUpdate(sectionId, blockId, editingText)
    }
  }

  const handleBlockDelete = (sectionId: string, blockId: string) => {
    if (!resume) return

    const updatedResume = {
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              blocks: section.blocks.filter((block) => block.id !== blockId),
              subsections: section.subsections?.map((subsection) => ({
                ...subsection,
                blocks: subsection.blocks.filter((block) => block.id !== blockId),
              })),
            }
          : section
      ),
    }

    setResume(updatedResume)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent, sectionId: string, sectionType?: Section['type']) => {
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    
    // Check for application/* data types (available during dragover)
    let dragType: 'skill' | 'summary' | 'bullet' | null = null
    
    if (e.dataTransfer.types.includes('application/skill')) {
      dragType = 'skill'
    } else if (e.dataTransfer.types.includes('application/summary')) {
      dragType = 'summary'
    } else if (e.dataTransfer.types.includes('application/bullet')) {
      dragType = 'bullet'
    }
    
    if (dragType) {
      setDragOverSection(sectionId)
      setDragOverType(dragType)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only clear if we're actually leaving the drop zone (not entering a child)
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDragOverSection(null)
      setDragOverType(null)
    }
  }

  const handleDrop = (e: React.DragEvent, sectionId: string, sectionType?: Section['type']) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Get the dragged item data
      const dragData = e.dataTransfer.getData('text/plain')
      if (dragData) {
        const data = JSON.parse(dragData)
        const { type, text } = data

        // Handle based on type
        if (type === 'skill') {
          // Skills should go to skills section
          addSkillToResume(text)
        } else if (type === 'summary') {
          // Summary should go to summary section
          addSummaryToResume(text)
        } else if (type === 'bullet') {
          // Bullets can go to any section
          addBlockToSection(sectionId, text, 'bullet')
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error)
    }
    
    setDragOverSection(null)
    setDragOverType(null)
  }

  // Add block to section
  const addBlockToSection = (sectionId: string, text: string, blockType: Block['type'] = 'bullet') => {
    if (!resume) return

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type: blockType,
      text: text,
    }

    const updatedResume = {
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              blocks: [...section.blocks, newBlock],
            }
          : section
      ),
    }

    setResume(updatedResume)
  }

  // Add skill to skills section
  const addSkillToResume = (skill: string) => {
    if (!resume) return

    // Find or create skills section
    let skillsSection = resume.sections.find(s => s.type === 'skills')
    
    if (!skillsSection) {
      // Create skills section
      skillsSection = {
        id: `section-${Date.now()}`,
        type: 'skills',
        label: 'Skills',
        blocks: [],
        order: resume.sections.length,
      }
      resume.sections.push(skillsSection)
    }

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type: 'skill-item',
      text: skill,
    }

    const updatedResume = {
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === skillsSection!.id
          ? {
              ...section,
              blocks: [...section.blocks, newBlock],
            }
          : section
      ),
    }

    setResume(updatedResume)
  }

  // Add summary to summary section
  const addSummaryToResume = (summary: string) => {
    if (!resume) return

    // Find or create summary section
    let summarySection = resume.sections.find(s => s.type === 'summary')
    
    if (!summarySection) {
      // Create summary section
      summarySection = {
        id: `section-${Date.now()}`,
        type: 'summary',
        label: 'Professional Summary',
        blocks: [],
        order: 0, // Summary usually goes first
      }
      resume.sections.unshift(summarySection)
      // Update order of other sections
      resume.sections.forEach((s, idx) => {
        if (s.id !== summarySection!.id) {
          s.order = idx
        }
      })
    }

    const newBlock: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      type: 'bullet',
      text: summary,
    }

    const updatedResume = {
      ...resume,
      sections: resume.sections.map((section) =>
        section.id === summarySection!.id
          ? {
              ...section,
              blocks: [...section.blocks, newBlock],
            }
          : section
      ),
    }

    setResume(updatedResume)
  }

  const renderBlock = (block: Block, sectionId: string, isEditable: boolean = true) => {
    const isEditing = editingBlock === block.id

    if (block.type === "header" || block.type === "meta") {
      return (
        <div key={block.id} className="resume-entry relative group">
          {isEditing && isEditable ? (
            <div className="flex items-center gap-2">
              <Input
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="flex-1 text-base font-bold border-0 bg-transparent p-0 h-auto focus-visible:ring-1"
                onBlur={() => handleBlockSave(sectionId, block.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleBlockSave(sectionId, block.id)
                  }
                  if (e.key === "Escape") {
                    setEditingBlock(null)
                    setEditingText("")
                  }
                }}
                autoFocus
              />
            </div>
          ) : (
            <div
              className="flex items-start justify-between gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded -m-2 transition-colors"
              onClick={() => isEditable && handleBlockEdit(sectionId, block)}
            >
                <h3 className="text-base font-bold text-[#2a1b12]">{block.text}</h3>
              {isEditable && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {block.score !== undefined && (
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(block.score)}`}>
                      {getScoreIndicator(block.score)} {block.score}
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBlockDelete(sectionId, block.id)
                    }}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    if (block.type === "bullet") {
      return (
        <div
          key={block.id}
          className={`resume-entry relative group pl-4 border-l-2 ${getScoreColor(block.score)} mb-2`}
        >
          {isEditing && isEditable ? (
            <div className="space-y-2">
              <Textarea
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                className="min-h-[60px] text-sm leading-relaxed border border-input focus-visible:ring-1"
                onBlur={() => handleBlockSave(sectionId, block.id)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setEditingBlock(null)
                    setEditingText("")
                  }
                }}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleBlockSave(sectionId, block.id)}
                  className="h-7"
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingBlock(null)
                    setEditingText("")
                  }}
                  className="h-7"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div
              className="flex items-start justify-between gap-2 cursor-pointer hover:bg-muted/30 p-2 rounded -m-2 transition-colors"
              onClick={() => isEditable && handleBlockEdit(sectionId, block)}
            >
                <p className="text-sm leading-relaxed text-[#2a1b12] flex-1">{block.text}</p>
              {isEditable && (
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {block.tags && block.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {block.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {block.score !== undefined && (
                    <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(block.score)}`}>
                      {getScoreIndicator(block.score)} {block.score}
                    </Badge>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleBlockDelete(sectionId, block.id)
                    }}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )
    }

    if (block.type === "skill-item") {
      return (
        <div key={block.id} className="resume-entry relative group">
          <div
            className="flex items-center justify-between gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded -m-2 transition-colors"
            onClick={() => isEditable && handleBlockEdit(sectionId, block)}
          >
            <span className="text-sm text-[#2a1b12]">{block.text}</span>
            {isEditable && (
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {block.score !== undefined && (
                  <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getScoreBadgeClass(block.score)}`}>
                    {getScoreIndicator(block.score)} {block.score}
                  </Badge>
                )}
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBlockDelete(sectionId, block.id)
                  }}
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )
    }

    return null
  }

  if (!resume) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Live Resume Preview
          </CardTitle>
          <CardDescription className="text-sm">
            Upload a resume to see the live preview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-4 opacity-50" />
            <p className="text-sm">No resume loaded</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="space-y-1 pb-4 bg-gradient-to-br from-accent/30 to-accent/10">
        <CardTitle className="text-xl flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Live Resume Preview
        </CardTitle>
        <CardDescription className="text-sm">
          Real-time preview matching your final PDF export
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
          {/* PDF-Style Resume Document */}
            <div className="pdf-preview-container rounded-lg border border-[#d3c4a6]/40 bg-[#f5f1e8] p-8 text-[#1f140d] shadow-[0_25px_80px_-40px_rgba(15,11,8,0.6)] space-y-6">
            {/* Resume Title */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-[#1f140d]">{resume.title}</h1>
            </div>

            {/* Render Sections */}
            {resume.sections.map((section) => {
              const isDragOver = dragOverSection === section.id
              const canAcceptSkill = section.type === 'skills' && dragOverType === 'skill'
              const canAcceptSummary = section.type === 'summary' && dragOverType === 'summary'
              const canAcceptBullet = dragOverType === 'bullet'
              const isValidDropZone = isDragOver && (canAcceptSkill || canAcceptSummary || canAcceptBullet)

              return (
                <div
                  key={section.id}
                  className={`resume-section space-y-3 transition-all ${
                    isValidDropZone ? 'ring-2 ring-primary bg-primary/5 rounded-lg p-2' : ''
                  }`}
                  onDragOver={(e) => handleDragOver(e, section.id, section.type)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, section.id, section.type)}
                >
                  <div className="flex items-center justify-between border-b-2 border-primary pb-2">
                    <h2 className="text-lg font-bold text-primary uppercase tracking-wide">
                      {section.label}
                    </h2>
                  </div>

                  {/* Render Subsections if they exist */}
                  {section.subsections && section.subsections.length > 0 ? (
                    <div className="space-y-4">
                      {section.subsections.map((subsection) => (
                        <div key={subsection.id} className="space-y-2">
                            <h3 className="font-semibold text-base text-[#2a1b12]">
                            {subsection.title}
                          </h3>
                          <div className="space-y-2 pl-4">
                            {subsection.blocks.map((block) => renderBlock(block, section.id))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Render blocks directly if no subsections */
                      <div className="space-y-2">
                        {section.blocks.map((block) => renderBlock(block, section.id))}
                      </div>
                  )}

                  {/* Empty state for section with drop zone */}
                  {section.blocks.length === 0 &&
                    (!section.subsections || section.subsections.length === 0 || 
                     section.subsections.every(sub => sub.blocks.length === 0)) && (
                      <div
                        className={`text-center py-4 text-sm border-2 border-dashed rounded-md transition-all ${
                          isValidDropZone
                            ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border/50 bg-muted/20 text-muted-foreground'
                        }`}
                      >
                        {isValidDropZone
                          ? `Drop ${dragOverType} here`
                          : 'No content in this section. Drag items here to add.'}
                      </div>
                    )}

                  {/* Drop zone indicator when dragging over non-empty section */}
                  {isValidDropZone && section.blocks.length > 0 && (
                    <div className="border-2 border-dashed border-primary bg-primary/10 rounded-md p-2 text-center text-sm text-primary">
                      Drop {dragOverType} here to add
                    </div>
                  )}
                </div>
              )
            })}

            {/* Empty state for resume */}
            {resume.sections.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Start adding content to see your resume preview</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

