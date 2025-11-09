import { useState, useEffect } from "react"
import type { Resume, Section, Block } from "@/types/resume"
import { Button } from "@/components/ui/button"
import { Plus, FileUp } from "lucide-react"
import SectionBlock from "./SectionBlock"
import { DragDropContext, Droppable } from "@hello-pangea/dnd"
import type { DropResult } from "@hello-pangea/dnd"

interface ResumeCanvasProps {
  resume: Resume | null
  setResume: (resume: Resume) => void
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
}

// Helper function to generate sample resume
const generateSampleResume = (): Resume => {
  return {
    id: "sample-1",
    title: "My Resume",
    sections: [
      {
        id: "summary-1",
        type: "summary",
        label: "Professional Summary",
        order: 0,
        blocks: [
          {
            id: "block-1",
            type: "bullet",
            text: "Passionate software engineer with 3+ years of experience building web applications.",
            strength: "ok",
            score: 65,
            tags: ["Software Engineer", "Web"],
          },
        ],
      },
      {
        id: "experience-1",
        type: "experience",
        label: "Work Experience",
        order: 1,
        blocks: [
          {
            id: "block-2",
            type: "header",
            text: "Software Engineer Intern @ Tech Company",
          },
          {
            id: "block-3",
            type: "bullet",
            text: "Worked on front-end development tasks",
            strength: "weak",
            score: 42,
            tags: ["Frontend"],
          },
          {
            id: "block-4",
            type: "bullet",
            text: "Collaborated with team members on various projects",
            strength: "weak",
            score: 38,
            tags: ["Teamwork"],
          },
        ],
      },
      {
        id: "education-1",
        type: "education",
        label: "Education",
        order: 2,
        blocks: [
          {
            id: "block-5",
            type: "header",
            text: "B.S. Computer Science @ University Name",
          },
          {
            id: "block-6",
            type: "bullet",
            text: "GPA: 3.8/4.0, Dean's List",
            strength: "good",
            score: 85,
          },
        ],
      },
      {
        id: "skills-1",
        type: "skills",
        label: "Skills",
        order: 3,
        blocks: [
          {
            id: "block-7",
            type: "skill-item",
            text: "Languages: JavaScript, Python, Java",
            strength: "good",
            score: 88,
            tags: ["JavaScript", "Python", "Java"],
          },
          {
            id: "block-8",
            type: "skill-item",
            text: "Frameworks: React, Node.js, Express",
            strength: "good",
            score: 92,
            tags: ["React", "Node.js", "Express"],
          },
        ],
      },
    ],
  }
}

export default function ResumeCanvas({ resume, setResume, selectedBlockId, onBlockSelect }: ResumeCanvasProps) {
  const [localResume, setLocalResume] = useState<Resume | null>(resume)

  useEffect(() => {
    setLocalResume(resume)
  }, [resume])

  const handleLoadSample = () => {
    const sample = generateSampleResume()
    setLocalResume(sample)
    setResume(sample)
  }

  const handleAddSection = () => {
    if (!localResume) return

    const newSection: Section = {
      id: `section-${Date.now()}`,
      type: "custom",
      label: "New Section",
      order: localResume.sections.length,
      blocks: [],
    }

    const updatedResume = {
      ...localResume,
      sections: [...localResume.sections, newSection],
    }

    setLocalResume(updatedResume)
    setResume(updatedResume)
  }

  const handleAddBullet = (sectionId: string) => {
    if (!localResume) return

    const newBlock: Block = {
      id: `block-${Date.now()}`,
      type: "bullet",
      text: "New bullet point - click to edit",
    }

    const updatedResume = {
      ...localResume,
      sections: localResume.sections.map((section) =>
        section.id === sectionId
          ? { ...section, blocks: [...section.blocks, newBlock] }
          : section
      ),
    }

    setLocalResume(updatedResume)
    setResume(updatedResume)
  }

  const handleBlockDelete = (sectionId: string, blockId: string) => {
    if (!localResume) return

    const updatedResume = {
      ...localResume,
      sections: localResume.sections.map((section) =>
        section.id === sectionId
          ? { ...section, blocks: section.blocks.filter((block) => block.id !== blockId) }
          : section
      ),
    }

    setLocalResume(updatedResume)
    setResume(updatedResume)
  }

  const handleDragEnd = (result: DropResult) => {
    if (!localResume) return

    const { source, destination, type } = result

    // Dropped outside the list
    if (!destination) return

    // No change
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Reorder sections
    if (type === "SECTION") {
      const newSections = Array.from(localResume.sections)
      const [removed] = newSections.splice(source.index, 1)
      newSections.splice(destination.index, 0, removed)

      const updatedResume = {
        ...localResume,
        sections: newSections.map((section, index) => ({ ...section, order: index })),
      }

      setLocalResume(updatedResume)
      setResume(updatedResume)
      return
    }

    // Reorder blocks within same section
    if (source.droppableId === destination.droppableId) {
      const sectionIndex = localResume.sections.findIndex((s) => s.id === source.droppableId)
      if (sectionIndex === -1) return

      const section = localResume.sections[sectionIndex]
      const newBlocks = Array.from(section.blocks)
      const [removed] = newBlocks.splice(source.index, 1)
      newBlocks.splice(destination.index, 0, removed)

      const updatedSections = [...localResume.sections]
      updatedSections[sectionIndex] = { ...section, blocks: newBlocks }

      const updatedResume = {
        ...localResume,
        sections: updatedSections,
      }

      setLocalResume(updatedResume)
      setResume(updatedResume)
    } else {
      // Move block between sections
      const sourceSectionIndex = localResume.sections.findIndex((s) => s.id === source.droppableId)
      const destSectionIndex = localResume.sections.findIndex((s) => s.id === destination.droppableId)

      if (sourceSectionIndex === -1 || destSectionIndex === -1) return

      const sourceSection = localResume.sections[sourceSectionIndex]
      const destSection = localResume.sections[destSectionIndex]

      const sourceBlocks = Array.from(sourceSection.blocks)
      const destBlocks = Array.from(destSection.blocks)

      const [removed] = sourceBlocks.splice(source.index, 1)
      destBlocks.splice(destination.index, 0, removed)

      const updatedSections = [...localResume.sections]
      updatedSections[sourceSectionIndex] = { ...sourceSection, blocks: sourceBlocks }
      updatedSections[destSectionIndex] = { ...destSection, blocks: destBlocks }

      const updatedResume = {
        ...localResume,
        sections: updatedSections,
      }

      setLocalResume(updatedResume)
      setResume(updatedResume)
    }
  }

  if (!localResume) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#3a5f24]/20">
          <FileUp className="h-10 w-10 text-[#3a5f24]" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-[#F5F1E8]">No Resume Loaded</h3>
        <p className="mb-6 text-sm text-[#C9B896] max-w-sm">
          Start by loading a sample resume or uploading your own
        </p>
        <div className="flex gap-3">
          <Button onClick={handleLoadSample} className="bg-gradient-to-r from-[#3a5f24] to-[#253f12] text-white hover:from-[#4a7534] hover:to-[#355222]">
            Load Sample Resume
          </Button>
          <Button variant="outline" className="border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:text-[#F5F1E8] hover:border-[#3a5f24]/50">
            <FileUp className="mr-2 h-4 w-4" />
            Upload Resume
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-sections" type="SECTION">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {localResume.sections.map((section, index) => (
                <SectionBlock
                  key={section.id}
                  section={section}
                  index={index}
                  selectedBlockId={selectedBlockId}
                  onBlockSelect={onBlockSelect}
                  onBlockDelete={handleBlockDelete}
                  onAddBullet={handleAddBullet}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Button variant="outline" className="w-full border-[#8B6F47]/30 text-[#C9B896] hover:bg-[#3a5f24]/20 hover:text-[#F5F1E8] hover:border-[#3a5f24]/50" onClick={handleAddSection}>
        <Plus className="mr-2 h-4 w-4" />
        Add Section
      </Button>
    </div>
  )
}

