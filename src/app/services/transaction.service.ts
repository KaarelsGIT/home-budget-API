import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private url = environment.apiURL;

  constructor(private http: HttpClient) {}

  addTransaction(type: 'income' | 'expense', transaction: any): Observable<any> {
    return this.http.post<any>(`${this.url}/${type}s/add`, transaction);
  }

  getTransactions(type: 'income' | 'expense', filters: any): Observable<any> {
    let params = new HttpParams();

    params = params.set('page', String(filters.page ?? 0));
    params = params.set('size', String(filters.size ?? 20));
    if (filters.userId !== null && filters.userId !== undefined) params = params.set('userId', filters.userId);
    if (filters.categoryId !== null && filters.categoryId !== undefined) params = params.set('categoryId', filters.categoryId);
    if (filters.date) params = params.set('date', filters.date);
    if (filters.year !== null && filters.year !== undefined) params = params.set('year', filters.year);
    if (filters.month !== null && filters.month !== undefined) params = params.set('month', filters.month);
    if (filters.sortBy) params = params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params = params.set('sortOrder', filters.sortOrder);

    const apiUrl = `${this.url}/${type}s/all`;
    return this.http.get<any>(apiUrl, { params });
  }

  deleteTransaction(type: 'income' | 'expense', id: number): Observable<any> {
    return this.http.delete<any>(`${this.url}/${type}s/delete/${id}`).pipe(
      map((response: any) => {
        if (response === null || response === undefined) {
          return { success: true };
        }
        return response;
      })
    );
  }

  getYears(type: 'income' | 'expense'): Observable<any[]> {
    return this.http.get<any>(`${this.url}/${type}s/years`);
  }

  updateTransaction(type: 'income' | 'expense', id: number, transaction: any) {
    return this.http.put<any>(`${this.url}/${type}s/update/${id}`, transaction);
  }
}
