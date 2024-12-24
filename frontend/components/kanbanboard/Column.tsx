// Column.tsx

import React from 'react';
import { DroppableProvided } from '@hello-pangea/dnd';
import clsx from 'clsx';
import TaskCard from './TaskCard';
import { TaskInterface } from '../../types/types';

interface ColumnProps {
    columnId: string;
    title: string;
    tasks: TaskInterface[];
    provided: DroppableProvided;
    isDraggingOver: boolean;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, provided, isDraggingOver }) => {
    return (
        <div
            className="flex flex-col flex-1 min-w-[300px]"
            ref={provided.innerRef}
            {...provided.droppableProps}
        >
            <h2 className="text-2xl font-semibold mb-4 text-center">{title}</h2>
            <div
                className={clsx(
                    "flex-1 p-2 rounded-md",
                    isDraggingOver ? "bg-blue-100" : ""
                )}
            >
                {tasks.map((task, index) => (
                    <TaskCard key={task.id} task={task} index={index} />
                ))}
                {provided.placeholder}
            </div>
        </div>
    );
};

export default Column;
