import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private url: string = environment.apiURL + '/users';

  constructor(private http: HttpClient) {
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/all`);
  }

  getUserById(id: string | number | null): Observable<User> {
    return this.http.get<User>(`${this.url}/${id}`);
  }
}
