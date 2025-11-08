import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

export interface ResumeBlock {
  id: string;
  content: string;
  type: 'experience' | 'education' | 'skill' | 'project';
}

interface ResumeBuilderProps {
  blocks: ResumeBlock[];
  onBlocksChange: (blocks: ResumeBlock[]) => void;
}

export const ResumeBuilder = ({ blocks, onBlocksChange }: ResumeBuilderProps) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onBlocksChange(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="resume-blocks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4 p-4"
          >
            {blocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 bg-white rounded-lg shadow-md border-2 ${
                      snapshot.isDragging
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-500 uppercase">
                        {block.type}
                      </span>
                      <div className="text-gray-400">⋮⋮</div>
                    </div>
                    <p className="mt-2 text-gray-800">{block.content}</p>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

