import { Project } from '../../types/types';
import client from './client';

export const getProjects = async (): Promise<Project[]>  => {
    const response = await client.get('/project');
    return response.data;
}

