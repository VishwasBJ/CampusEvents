import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface User {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        // Load user from localStorage if token exists
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                this.currentUserSubject.next(user);
            } catch (e) {
                // Invalid user data, clear storage
                this.clearAuth();
            }
        }
    }

    register(data: RegisterData): Observable<AuthResponse> {
        console.log('Auth service: Registering user', data);
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data)
            .pipe(
                tap(response => {
                    console.log('Auth service: Registration response', response);
                    this.setAuth(response.token, response.user);
                })
            );
    }

    login(credentials: LoginData): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
            .pipe(
                tap(response => {
                    this.setAuth(response.token, response.user);
                })
            );
    }

    logout(): void {
        this.clearAuth();
        this.router.navigate(['/login']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    updateProfile(data: Partial<User>): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/profile`, data)
            .pipe(
                tap(user => {
                    // Update stored user data
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                })
            );
    }

    getProfile(): Observable<User> {
        return this.http.get<User>(`${this.apiUrl}/profile`)
            .pipe(
                tap(user => {
                    // Update stored user data
                    localStorage.setItem('user', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                })
            );
    }

    private setAuth(token: string, user: User): void {
        console.log('Auth service: Setting auth', { token: token.substring(0, 20) + '...', user });
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        console.log('Auth service: Auth set successfully');
    }

    private clearAuth(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUserSubject.next(null);
    }
}
