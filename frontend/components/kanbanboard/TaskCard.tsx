import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import clsx from 'clsx';
import { TaskInterface } from '../../types/types';
import { CalendarDate } from '@nextui-org/react';

interface TaskCardProps {
    task: TaskInterface;
    index: number;
}

const priorityColors = {
    low: 'bg-green-200',
    medium: 'bg-yellow-200',
    high: 'bg-orange-200',
    urgent: 'bg-red-200',
};

const formatCalendarDate = (date: CalendarDate): string => {
    const { year, month, day } = date;
    const formattedMonth = month.toString().padStart(2, '0');
    const formattedDay = day.toString().padStart(2, '0');
    return `${year}-${formattedMonth}-${formattedDay}`;
};

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    className={clsx(
                        "border",
                        "p-4 rounded shadow mb-2",
                        priorityColors[task.priority],
                        snapshot.isDragging ? "bg-gray-300" : ""
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >
                    <h3 className="font-bold text-lg">{task.title}</h3>
                    <p className="text-sm mt-1">{task.description}</p>
                    {task.deadlineDate && (
                        <p className="text-xs text-gray-600 mt-2">
                            Deadline: {formatCalendarDate(task.deadlineDate)}
                        </p>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default TaskCard;
