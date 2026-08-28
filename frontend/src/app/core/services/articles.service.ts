import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment.development';
import { Article, CreateArticle, UpdateArticle } from '../types/article';
import { AuthService } from './auth.service';

@Service()
export class ArticlesService {

    api: string = environment.apiUrl;

    private http = inject(HttpClient);
    private auth = inject(AuthService);

    getHeaders() {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', `Bearer ${this.auth.getAccessToken()}`);
        return headers;
    }

    createArticle(article: CreateArticle): Observable<Article> {
        return this.http.post<Article>(`${this.api}/articles`, article, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    findAll(): Observable<Article[]> {
        return this.http.get<Article[]>(`${this.api}/articles`, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    findOne(id: string): Observable<Article> {
        return this.http.get<Article>(`${this.api}/articles/${id}`, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    updateArticle(id: string, changes: UpdateArticle): Observable<Article> {
        return this.http.patch<Article>(`${this.api}/articles/${id}`, changes, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    deleteArticle(id: string): Observable<void> {
        return this.http.delete<void>(`${this.api}/articles/${id}`, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }
}
