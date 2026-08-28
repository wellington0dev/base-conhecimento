import { User } from './auth';

export interface Article {
    id: string;
    title: string;
    category: string;
    excerpt: string;
    body: string;
    author: User;
    lastEditor: User;
    createdAt: string;
    updatedAt: string;
}

export interface CreateArticle {
    title: string;
    category: string;
    excerpt?: string;
    body: string;
}

export interface UpdateArticle {
    title?: string;
    category?: string;
    excerpt?: string;
    body?: string;
}
