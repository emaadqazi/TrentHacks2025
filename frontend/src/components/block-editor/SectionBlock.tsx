import type { Section } from "@/types/resume"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"
import BulletBlock from "./BulletBlock"
import { Droppable, Draggable } from "@hello-pangea/dnd"

interface SectionBlockProps {
  section: Section
  index: number
  selectedBlockId: string | null
  onBlockSelect: (blockId: string) => void
  onBlockDelete: (sectionId: string, blockId: string) => void
  onAddBullet: (sectionId: string) => void
}

export default function SectionBlock({
  section,
  index,
  selectedBlockId,
  onBlockSelect,
  onBlockDelete,
  onAddBullet,
}: SectionBlockProps) {
  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`mb-6 transition-all ${snapshot.isDragging ? "dragging" : ""}`}
        >
          <Card className="border-2 draggable-element">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    {...provided.dragHandleProps}
                    className="cursor-grab active:cursor-grabbing drag-handle p-1 rounded hover:bg-primary/10 transition-colors"
                  >
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{section.label}</CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddBullet(section.id)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Droppable droppableId={section.id} type="BLOCK">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-[50px] rounded-md transition-all ${
                      snapshot.isDraggingOver ? "drop-zone-active" : ""
                    }`}
                  >
                    {section.blocks.length === 0 ? (
                      <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-md">
                        No bullets yet. Click "Add" to create one.
                      </div>
                    ) : (
                      section.blocks.map((block, blockIndex) => (
                        <BulletBlock
                          key={block.id}
                          block={block}
                          index={blockIndex}
                          isSelected={selectedBlockId === block.id}
                          onSelect={onBlockSelect}
                          onDelete={(blockId) => onBlockDelete(section.id, blockId)}
                        />
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

