// KanbanBoard.tsx
import React, { useState, useEffect } from "react";
import { DragDropContext, DropResult, Droppable } from "@hello-pangea/dnd";
import { TaskInterface } from "../../types/types";
import Column from "./Column";
import { updateStatus, bulkUpdate } from "../../src/api/task";
import { useProjectStore } from "../../store/projectStore";

const POSITION_THRESHOLD = 1;

function needsRebalance(tasksInColumn: TaskInterface[]): boolean {
  if (tasksInColumn.length < 2) return false;
  const sorted = [...tasksInColumn].sort((a, b) => a.position - b.position);
  for (let i = 0; i < sorted.length - 1; i++) {
    const currentPos = sorted[i].position;
    const nextPos = sorted[i + 1].position;
    if (nextPos - currentPos < POSITION_THRESHOLD) {
      return true;
    }
  }
  return false;
}

function rebalancePositions(tasksInColumn: TaskInterface[]): TaskInterface[] {
  const sorted = [...tasksInColumn].sort((a, b) => a.position - b.position);
  return sorted.map((task, index) => ({
    ...task,
    position: (index + 1) * 1000,
  }));
}

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

    tasks.forEach((task) => {
      if (initialColumns[task.status]) {
        initialColumns[task.status].push(task);
      } else {
        initialColumns[task.status] = [task];
      }
    });
    for (const key in initialColumns) {
      initialColumns[key] = initialColumns[key].sort(
        (a, b) => a.position - b.position
      );
    }
    setColumns(initialColumns);
  }, [tasks]);

  useEffect(() => {
    const updatedColumns = async () => {
      for (const key in columns) {
        if (needsRebalance(columns[key])) {
          const newColumns: Columns = { ...columns };
          newColumns[key] = rebalancePositions(columns[key]);
          await bulkUpdate(newColumns[key]);
          setColumns(newColumns);
        }
      }
    };
    updatedColumns();
  }, [columns]);
  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    const sourceColumnId = source.droppableId;
    const destColumnId = destination.droppableId;
    if (destColumnId === "delete") {
      setColumns((prevColumns) => {
        const newColumns: Columns = { ...prevColumns };
        Object.keys(newColumns).forEach((columnId) => {
          newColumns[columnId] = newColumns[columnId].filter(
            (task) => task.id !== draggableId
          );
        });
        return newColumns;
      });
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.id !== draggableId)
      );

      return;
    }
    if (sourceColumnId === destColumnId && destination.index === source.index) {
      return;
    }
    if (sourceColumnId === destColumnId) {
      setColumns((prevColumns) => {
        const newColumns: Columns = { ...prevColumns };
        const columnTasks = Array.from(newColumns[sourceColumnId]);
        const [movedTask] = columnTasks.splice(source.index, 1);
        columnTasks.splice(destination.index, 0, movedTask);
        newColumns[sourceColumnId] = columnTasks;
        let newPos: number;
        if (destination.index === 0) {
          const nextTask = columnTasks[1]; // The task that used to be at the top
          newPos = nextTask ? nextTask.position / 2 : 1000;
        } else if (destination.index === columnTasks.length - 1) {
          const prevTask = columnTasks[columnTasks.length - 2];
          newPos = prevTask ? prevTask.position + 1000 : 1000;
        } else {
          const prevTask = columnTasks[destination.index - 1];
          const nextTask = columnTasks[destination.index + 1];
          newPos = (prevTask.position + nextTask.position) / 2;
        }

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === draggableId
              ? {
                  ...task,
                  status: destColumnId as TaskInterface["status"],
                  position: newPos,
                }
              : task
          )
        );
        updateStatus(draggableId, project.id, destColumnId, newPos);
        newColumns[destColumnId][destination.index].position = newPos;
        return newColumns;
      });
      return;
    }
    setColumns((prevColumns) => {
      const newColumns: Columns = { ...prevColumns };
      const sourceTasks = Array.from(newColumns[sourceColumnId]);
      const [movedTask] = sourceTasks.splice(source.index, 1);
      movedTask.status = destColumnId as TaskInterface["status"];
      const destTasks = Array.from(newColumns[destColumnId]);
      destTasks.splice(destination.index, 0, movedTask);
      newColumns[destColumnId] = destTasks;
      newColumns[sourceColumnId] = sourceTasks;
      let newPos: number;

      if (destination.index === 0) {
        const nextTask = destTasks[1]; // The task that used to be at the top
        newPos = nextTask ? nextTask.position / 2 : 1000;
      } else if (destination.index === destTasks.length - 1) {
        const prevTask = destTasks[destTasks.length - 2];
        newPos = prevTask ? prevTask.position + 1000 : 1000;
      } else {
        const prevTask = destTasks[destination.index - 1];
        const nextTask = destTasks[destination.index + 1];
        newPos = (prevTask.position + nextTask.position) / 2;
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === draggableId
            ? {
                ...task,
                status: destColumnId as TaskInterface["status"],
                position: newPos,
              }
            : task
        )
      );
      newColumns[destColumnId][destination.index].position = newPos;
      updateStatus(draggableId, project.id, destColumnId, newPos);
      return newColumns;
    });
  };
  return (
    <div id="kanbanboard" className="flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col lg:flex-row lg:items-start items-center justify-center flex-1 space-x-4 p-4 overflow-auto">
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
      </DragDropContext>
    </div>
  );
};

const getColumnTitle = (columnId: string): string => {
  switch (columnId) {
    case "to_do":
      return "To Do";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return "Unknown";
  }
};

export default KanbanBoard;
