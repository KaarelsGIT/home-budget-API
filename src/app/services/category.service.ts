import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiURL + '/categories';

  constructor(private http: HttpClient) {}

  addCategory(categoryData: { name: string; type: string; description: string }): Observable<Category> {
    console.log('Sending to backend:', categoryData); // Debug log
    return this.http.post<Category>(`${this.url}/add`, categoryData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategoriesByType(type: 'income' | 'expense', asList: boolean = false): Observable<Category[]> {
    const upperType = type.toUpperCase();
    return this.http.get<any>(`${this.url}/all?type=${upperType}&asList=${asList}`).pipe(
      map(response => {
        if (asList) {
          return response as Category[];
        }
        return response.content as Category[];
      }),
      catchError(this.handleError)
    );
  }

  getCategoryById(id: string | number): Observable<Category> {
    return this.http.get<Category>(`${this.url}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.error?.message || error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

}
