import { TaskInterface } from '../../types/types';
import client from './client';
import { CalendarDate } from '@internationalized/date';
import { ExcalidrawElement } from '@excalidraw/excalidraw/types/element/types';

interface TaskResponse extends TaskInterface {
    deadline_date: number
}

export const getTasks = async (projectId: string): Promise<TaskResponse[]>  => {
    const response = await client.post('/task',{
        projectId
    });
    response.data?.forEach((task: TaskResponse) => {
        if (!task.deadline_date) return;
        const utcDate = new Date(task.deadline_date * 1000);
        const year = utcDate.getFullYear();
        const month = utcDate.getMonth();
        const day = utcDate.getDate();
        task.deadlineDate = new CalendarDate(year, month, day);

    })
    return response.data || [];
}

export const createTask = async (title: string, description: string, projectId: string, priority: string, deadlineDate: number): Promise<TaskInterface>  => {
    const res = await client.post('/task/create', {
        title,
        description,
        priority,
        deadlineDate,
        projectId,
        status: "to_do"
    });
    return res.data
}

export const deleteTask = async (taskId: string, projectId: string): Promise<null>  => {
    await client.post(`/task/delete`,{
        taskId,
        projectId
    });
    return;
}

export const updateStatus = async (taskId: string, projectId: string, status: string): Promise<null>  => {
    await client.post(`/task/update_status`,{
        taskId,
        projectId,
        status
    });
    return;
}

export const getBoardData = async (taskId: string): Promise<string | null> => {
    const data = await client.get(`/task/board/${taskId}`);
    return data.data;
}

export const setBoardData = async (taskId: string, elements: ExcalidrawElement[]): Promise<null> => {
    await client.post(`/task/board/${taskId}`, {
        board_data: JSON.stringify(elements)
    });
    return;
}