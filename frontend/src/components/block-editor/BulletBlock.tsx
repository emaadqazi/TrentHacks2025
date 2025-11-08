import type { Block, BlockStrength } from "@/types/resume"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GripVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Draggable } from "@hello-pangea/dnd"

interface BulletBlockProps {
  block: Block
  index: number
  isSelected: boolean
  onSelect: (blockId: string) => void
  onDelete: (blockId: string) => void
}

const getStrengthColor = (strength?: BlockStrength) => {
  switch (strength) {
    case "good":
      return "border-l-4 border-l-green-500 bg-green-50/50"
    case "ok":
      return "border-l-4 border-l-yellow-500 bg-yellow-50/50"
    case "weak":
      return "border-l-4 border-l-red-500 bg-red-50/50"
    default:
      return "border-l-4 border-l-gray-300"
  }
}

const getStrengthDot = (strength?: BlockStrength) => {
  switch (strength) {
    case "good":
      return "bg-green-500"
    case "ok":
      return "bg-yellow-500"
    case "weak":
      return "bg-red-500"
    default:
      return "bg-gray-300"
  }
}

export default function BulletBlock({ block, index, isSelected, onSelect, onDelete }: BulletBlockProps) {
  return (
    <Draggable draggableId={block.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="group"
        >
          <Card
            className={`
              mb-2 cursor-pointer transition-all
              ${getStrengthColor(block.strength)}
              ${isSelected ? "ring-2 ring-primary" : ""}
              ${snapshot.isDragging ? "shadow-lg rotate-1" : "hover:shadow-md"}
            `}
            onClick={() => onSelect(block.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                {/* Drag Handle */}
                <div
                  {...provided.dragHandleProps}
                  className="mt-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                {/* Strength Indicator */}
                <div className="mt-1.5">
                  <div className={`h-2 w-2 rounded-full ${getStrengthDot(block.strength)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-relaxed">{block.text}</p>

                  {/* Tags */}
                  {block.tags && block.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {block.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Score */}
                  {block.score !== undefined && (
                    <div className="mt-2">
                      <Badge variant={block.score >= 80 ? "default" : "secondary"} className="text-xs">
                        Match: {block.score}%
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDelete(block.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Draggable>
  )
}

