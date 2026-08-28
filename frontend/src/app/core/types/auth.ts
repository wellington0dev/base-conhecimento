export interface Login {
    username: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    user: User;
}

export interface User {
    id: string;
    username: string;
    name: string;
    role: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}