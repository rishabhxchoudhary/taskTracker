import { User } from '../../types/User'
import client from './client';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/auth/login', payload);
  return response.data;
};
