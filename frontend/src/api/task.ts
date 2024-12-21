import { toast } from 'sonner';
import { TaskInterface } from '../../types/types';
import client from './client';
import { CalendarDate } from '@internationalized/date';

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

export const createTask = async (title: string, description: string, projectId: string, priority: string, deadlineDate: number): Promise<null>  => {
    await client.post('/task/create', {
        title,
        description,
        priority,
        deadlineDate,
        projectId
    });
    toast.success("Task has been created");
    return 
}

export const deleteProject = async (taskId: string, projectId: string): Promise<null>  => {
    await client.post(`/task/delete`,{
        taskId,
        projectId
    });
    toast.success("Task has been deleted");
    return;
}