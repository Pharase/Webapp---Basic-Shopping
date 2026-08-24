import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface RegisterRequest {
    username: string;
    fullName: string;
    email: string;
    password: string;
}

export interface RegisteredUser {
    userId: number;
    username: string;
    fullName: string;
    email: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
    private readonly http = inject(HttpClient);
    private readonly apiUrl = 'http://localhost:8080/api/users';

    register(request: RegisterRequest): Observable<RegisteredUser> {
        return this.http.post<RegisteredUser>(`${this.apiUrl}/register`, request, { withCredentials: true });
    }

    login(request: LoginRequest): Observable<RegisteredUser> {
        return this.http.post<RegisteredUser>(`${this.apiUrl}/login`, request, { withCredentials: true });
    }

    logout(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true });
    }
}
