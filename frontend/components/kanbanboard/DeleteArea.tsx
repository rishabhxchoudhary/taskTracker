// DeleteArea.tsx

import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import clsx from 'clsx';

const DeleteArea: React.FC = () => {
    return (
        <Droppable droppableId="delete">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx(
                        "flex items-center justify-center",
                        "h-20",
                        "border-2 border-dashed border-red-500",
                        snapshot.isDraggingOver ? "bg-red-100" : "bg-white"
                    )}
                >
                    <span className="text-red-500 font-semibold">Drag here to delete</span>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default DeleteArea;
