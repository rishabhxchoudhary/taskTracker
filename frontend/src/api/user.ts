// src/api/users.ts
import client from './client';
import { User } from '../../types/types'

export const getUsers = async (): Promise<User[]> => {
  const response = await client.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await client.get<User>(`/users/${id}`);
  return response.data;
};

export const getUser = async (): Promise<User[]> => {
    const response = await client.post<User[]>('/user');
    return response.data;
};
  