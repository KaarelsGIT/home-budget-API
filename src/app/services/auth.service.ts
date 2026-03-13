import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { ActiveUserService } from './active-user.service';

export interface AuthResponse {
  token: string;
  role: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = `${environment.apiURL}/auth`;
  private usersUrl = `${environment.apiURL}/users`;
  private tokenKey = 'auth_token';
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(
    private http: HttpClient,
    private activeUserService: ActiveUserService
  ) {
    this.loadCurrentUser();
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      const savedUserId = localStorage.getItem('active_user_id');
      if (savedUserId) {
        // Initial load of the authenticated user
        this.activeUserService.getUserById(savedUserId).subscribe(user => {
          this.currentUserSubject.next(user);
          // Also set it as the active filter initially
          this.activeUserService.setActiveUser(user.id);
        });
      }
    }
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.url}/login`, { username, password }).pipe(
      switchMap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          // Fetch all users and find the one with this username
          return this.http.get<User[]>(`${this.usersUrl}/all`).pipe(
            map(users => {
              const user = users.find(u => u.username === username);
              if (user) {
                localStorage.setItem('active_user_id', user.id.toString());
                this.activeUserService.setActiveUser(user.id);
                this.currentUserSubject.next(user);
              }
              return res;
            })
          );
        }
        return of(res);
      })
    );
  }

  register(username: string, password: string, role: string = 'ROLE_PARENT'): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/add`, { username, password, role });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('active_user_id');
    this.activeUserService.setActiveUser(null);
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }
}
