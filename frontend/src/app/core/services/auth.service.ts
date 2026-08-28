import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Login, LoginResponse } from '../types/auth';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environment/environment.development';

@Service()
export class AuthService {

    api: string = environment.apiUrl;

    private http = inject(HttpClient);

    login(login: Login): Observable<LoginResponse> {
        console.log(login)
        return this.http.post<LoginResponse>(`${this.api}/auth/login`, login)
            .pipe(
                catchError((e: any) => {
                    return throwError(() => e)
                })
            )
    }

    clearStorage() {
        localStorage.clear();
    }

    setLoginData(data: LoginResponse) {
        const accessToken = data.accessToken;
        const user = data.user;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", accessToken);
    }

    getAccessToken(){
        const token = localStorage.getItem("accessToken");
        if (token){
            return token;
        }
        else{
            throw new Error('Nenhum token encontrado')
        }
    }

    getUserData(){
        const userData = localStorage.getItem("user");
        if (userData){
            const user = JSON.parse(userData);
            return user;
        }
        else{
            throw new Error('Nenhum user encontrado')
        }
    }

    logout(){
        this.clearStorage();
        window.location.reload();
    }
}
