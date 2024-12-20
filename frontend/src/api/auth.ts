import { toast } from 'sonner';
import { GoogleJWT, User } from '../../types/types'
import client from './client';

export const googleLogin = async (payload: GoogleJWT) : Promise<User> => {
  const response = await client.post<User>('/user/googleLogin', payload);
  return response.data;
}

export const getCurrentUser = async (): Promise<User> => {
  const response = await client.get<User>('/user/current_user');
  toast.success("User Data Fetched Successfully");
  return response.data;
}

export const logoutUser = async () => {
  const response = await client.get('/user/logout');
  return response.data;
}