import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private url = environment.apiURL + '/categories';
  categoryRefreshSubject = new BehaviorSubject<boolean>(false);
  categoryRefresh$ = this.categoryRefreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  refreshCategories() {
    this.categoryRefreshSubject.next(true);
  }


  addCategory(categoryData: { name: string; type: string; description: string }): Observable<Category> {
    console.log('Sending to backend:', categoryData); // Debug log
    return this.http.post<Category>(`${this.url}/add`, categoryData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCategory(id: number, categoryData: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.url}/update/${id}`, categoryData)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCategory(id: number): Observable<string> {
    return this.http.delete(`${this.url}/delete/${id}`, { responseType: 'text' })
      .pipe(
        catchError(this.handleError)
      );
  }

  getCategoriesByType(type: 'income' | 'expense', asList: boolean = false): Observable<Category[]> {
    const upperType = type.toUpperCase();
    return this.http.get<any>(`${this.url}/all?type=${upperType}&asList=${asList}`).pipe(
      map(response => {
        // Handle both direct array and paginated/wrapped responses
        if (Array.isArray(response)) {
          return response;
        } else if (response && Array.isArray(response.content)) {
          return response.content;
        } else if (response && response.categories && Array.isArray(response.categories)) {
          return response.categories;
        }
        return [];
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
