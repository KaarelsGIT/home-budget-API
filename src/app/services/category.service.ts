import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiURL + '/categories';

  constructor(private http: HttpClient) {}

  getCategoriesByType(type: 'income' | 'expense'): Observable<any[]> {
    return this.http.get<any>(`${this.url}/all?type=${type}`).pipe(
      map(response => response.content)
    );
  }
}
