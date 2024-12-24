// DeleteArea.tsx

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import clsx from 'clsx';

const DeleteArea: React.FC = () => {
    return (
        <Droppable droppableId="delete">
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx(
                        "flex items-center justify-center py-4 mx-2 rounded-lg",
                        "h-20",
                        "border-2 border-dashed border-white-500",
                        // snapshot.isDraggingOver ? "text-black" : ""
                    )}
                >
                    <span className="font-semibold">Drag here to delete</span>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default DeleteArea;
