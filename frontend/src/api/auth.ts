import { GoogleJWT, User } from '../../types/types'
import client from './client';

export interface AuthResponse {
  token: string;
  user: User;
}

export const googleLogin = async (payload: GoogleJWT) : Promise<AuthResponse> => {
  const response = await client.post<AuthResponse>('/user/googleLogin', payload);
  console.log("response", response);
  return response.data;
}