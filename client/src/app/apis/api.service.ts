// use rest api
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from '../core/constants/settings';
import { Options } from '../types/services';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = API_URL;

  constructor(private http: HttpClient) {}
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${path}`) as Observable<T>;
  }

  post<T>(path: string, options: Options): Observable<T> {
    return this.http.post<T>(
      `${this.apiUrl}/${path}`,
      options
    ) as Observable<T>;
  }

  put<T>(path: string, options: Options): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${path}`, options) as Observable<T>;
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}/${path}`) as Observable<T>;
  }
}
