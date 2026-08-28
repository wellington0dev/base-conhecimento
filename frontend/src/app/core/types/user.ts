export type UserRole = 'intern' | 'admin' | 'employee';

export interface CreateUser {
    name: string;
    username: string;
    password: string;
    role?: UserRole;
}

export interface UpdateSelf {
    name?: string;
    password?: string;
}

export interface UpdateUser {
    name?: string;
    password?: string;
    role?: UserRole;
    active?: boolean;
}
