import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {User} from '../models/user';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActiveUserService {
  private activeUserSubject: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor(private userService: UserService) {}

  getActiveUser(): Observable<User | null> {
    return this.activeUserSubject.asObservable();
  }

  setActiveUser(userId: string | number | null): void {
    if (userId === null) {
      this.activeUserSubject.next(null);
    } else {
      this.userService.getUserById(userId).subscribe(user => {
        this.activeUserSubject.next(user);
      });
    }
  }
}
