import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import clsx from 'clsx';

const DeleteArea: React.FC = () => {
    return (
        <Droppable droppableId="delete">
            {(provided, snapshot) => (
                <div
                    className={clsx(
                        "fixed bottom-0 left-0 right-0 h-16 flex items-center justify-center transition-colors",
                        snapshot.isDraggingOver ? "bg-red-600" : "bg-gray-800"
                    )}
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    <p className="text-white text-lg">Drag here to delete</p>
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
};

export default DeleteArea;
