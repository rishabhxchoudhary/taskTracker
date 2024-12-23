// KanbanBoard.tsx

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult, Droppable } from '@hello-pangea/dnd';
import { TaskInterface } from '../../types/types';
import Column from './Column';
import DeleteArea from './DeleteArea';
import { updateStatus } from '../../src/api/task';
import { useProjectStore } from '../../store/projectStore';

interface Columns {
    [key: string]: TaskInterface[];
}

interface KanbanBoardProps {
    tasks: TaskInterface[];
    setTasks: React.Dispatch<React.SetStateAction<TaskInterface[]>>;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, setTasks }) => {
    const project = useProjectStore((state) => state.currentProject);
    const [columns, setColumns] = useState<Columns>({
        to_do: [],
        in_progress: [],
        done: [],
    });
    useEffect(() => {
        const initialColumns: Columns = {
            to_do: [],
            in_progress: [],
            done: [],
        };

        tasks.forEach(task => {
            if (initialColumns[task.status]) {
                initialColumns[task.status].push(task);
            } else {
                initialColumns[task.status] = [task];
            }
        });

        setColumns(initialColumns);
    }, [tasks]);

    const onDragEnd = async (result: DropResult) => {
        const { destination, source, draggableId } = result;
        if (!destination) return;

        const sourceColumnId = source.droppableId;
        const destColumnId = destination.droppableId;
        if (destColumnId === 'delete') {
            setColumns(prevColumns => {
                const newColumns: Columns = { ...prevColumns };
                Object.keys(newColumns).forEach(columnId => {
                    newColumns[columnId] = newColumns[columnId].filter(task => task.id !== draggableId);
                });
                return newColumns;
            });
            setTasks(prevTasks => prevTasks.filter(task => task.id !== draggableId));

            return;
        }
        if (
            sourceColumnId === destColumnId &&
            destination.index === source.index
        ) {
            return;
        }
        if (sourceColumnId === destColumnId) {
            setColumns(prevColumns => {
                const newColumns: Columns = { ...prevColumns };
                const columnTasks = Array.from(newColumns[sourceColumnId]);
                const [movedTask] = columnTasks.splice(source.index, 1);
                columnTasks.splice(destination.index, 0, movedTask);
                newColumns[sourceColumnId] = columnTasks;
                return newColumns;
            });
            return;
        }
        setColumns(prevColumns => {
            const newColumns: Columns = { ...prevColumns };
            const sourceTasks = Array.from(newColumns[sourceColumnId]);
            const [movedTask] = sourceTasks.splice(source.index, 1);
            if (sourceColumnId !== destColumnId) {
                movedTask.status = destColumnId as TaskInterface['status'];
            }
            const destTasks = Array.from(newColumns[destColumnId]);
            destTasks.splice(destination.index, 0, movedTask);
            newColumns[destColumnId] = destTasks;
            newColumns[sourceColumnId] = sourceTasks;
            return newColumns;
        });
        if (sourceColumnId !== destColumnId) {
            await updateStatus(draggableId, project.id, destColumnId);
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === draggableId ? { ...task, status: destColumnId as TaskInterface['status'] } : task
                )
            );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex flex-1 space-x-4 p-4 overflow-auto">
                    {Object.entries(columns).map(([columnId, tasks]) => (
                        <Droppable droppableId={columnId} key={columnId}>
                            {(provided, snapshot) => (
                                <Column
                                    columnId={columnId}
                                    title={getColumnTitle(columnId)}
                                    tasks={tasks}
                                    provided={provided}
                                    isDraggingOver={snapshot.isDraggingOver}
                                />
                            )}
                        </Droppable>
                    ))}
                </div>
                <DeleteArea />
            </DragDropContext>
        </div>
    );
};

const getColumnTitle = (columnId: string): string => {
    switch (columnId) {
        case 'to_do':
            return 'To Do';
        case 'in_progress':
            return 'In Progress';
        case 'done':
            return 'Done';
        default:
            return 'Unknown';
    }
};

export default KanbanBoard;
