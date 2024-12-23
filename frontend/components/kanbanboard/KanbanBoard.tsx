import React from 'react';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { TaskInterface } from '../../types/types';
import Column from './Column';
// import DeleteArea from './DeleteArea';
import { updateStatus } from '../../src/api/task';
import { useProjectStore } from '../../store/projectStore';

interface KanbanBoardProps {
    tasks: TaskInterface[];
    setTasks: React.Dispatch<React.SetStateAction<TaskInterface[]>>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, setTasks }) => {
    const project = useProjectStore((state) => state.currentProject);
    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === 'delete') {
            setTasks(prevTasks => prevTasks.filter(task => task.id !== draggableId));
            return;
          }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        setTasks(prevTasks => {
            const task = prevTasks.find(t => t.id === draggableId);
            if (!task) return prevTasks;

            const updatedTask = { ...task, status: destination.droppableId as TaskInterface['status'] };
            const filteredTasks = prevTasks.filter(t => t.id !== draggableId);
            filteredTasks.splice(destination.index, 0, updatedTask);
            return filteredTasks;
        });
        await updateStatus(draggableId, project.id, destination.droppableId);
    };

    const columns = {
        to_do: {
            title: 'To Do',
            tasks: tasks.filter(task => task.status === 'to_do'),
        },
        in_progress: {
            title: 'In Progress',
            tasks: tasks.filter(task => task.status === 'in_progress'),
        },
        done: {
            title: 'Done',
            tasks: tasks.filter(task => task.status === 'done'),
        },
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-1 space-x-4 p-4 overflow-auto">
                    {Object.entries(columns).map(([columnId, column]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided, snapshot) => (
                                <Column
                                    columnId={columnId}
                                    title={column.title}
                                    tasks={column.tasks}
                                    provided={provided}
                                    isDraggingOver={snapshot.isDraggingOver}
                                />
                            )}
                        </Droppable>
                    ))}
                </div>
                {/* <DeleteArea /> */}
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
