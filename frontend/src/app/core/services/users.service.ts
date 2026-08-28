import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment.development';
import { User } from '../types/auth';
import { CreateUser, UpdateSelf, UpdateUser } from '../types/user';
import { AuthService } from './auth.service';

@Service()
export class UsersService {

    api: string = environment.apiUrl;

    private http = inject(HttpClient);
    private auth = inject(AuthService);

    getHeaders() {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        headers.append('Authorization', `Bearer ${this.auth.getAccessToken()}`);
        return headers;
    }

    createUser(user: CreateUser): Observable<User> {
        return this.http.post<User>(`${this.api}/users`, user, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    findAll(): Observable<User[]> {
        return this.http.get<User[]>(`${this.api}/users`, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    updateSelf(changes: UpdateSelf): Observable<User> {
        return this.http.patch<User>(`${this.api}/users/me`, changes, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }

    updateUser(id: string, changes: UpdateUser): Observable<User> {
        return this.http.patch<User>(`${this.api}/users/${id}`, changes, { headers: this.getHeaders() })
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e);
                })
            );
    }
}
