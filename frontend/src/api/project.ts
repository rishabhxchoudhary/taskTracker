import { Project } from '../../types/types';
import client from './client';

export const getProjects = async (): Promise<Project[]>  => {
    const response = await client.get('/project');
    return response.data;
}

export const createProject = async (name: string, description: string): Promise<Project[]>  => {
    const response = await client.post('/project', {
        name,
        description
    });
    return response.data;
}

export const deleteProject = async (id: string): Promise<Project[]>  => {
    const response = await client.post(`/project/delete`,{
        id
    });
    return response.data;
}