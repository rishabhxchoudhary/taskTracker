export interface User {
    id: string;
    username: string;
    email: string;
    avatar: string;
    name: string;
    created_at: Date;
}

export interface GoogleJWT {
    email: string;
    name: string;
    avatar: string;
}
  