// use rest api
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Package } from '../types/package';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PackageService {
  constructor(private apiService: ApiService) {}

  getPackages(): Observable<Package[]> {
    return this.apiService.get('package');
  }

  getPackageById(id: string): Observable<Package> {
    return this.apiService.get(`package/${id}`);
  }

  createPackage(body: any): Observable<Package> {
    return this.apiService.post('package', body);
  }

  deletePackage(id: string): Observable<Package> {
    return this.apiService.delete(`package/${id}`);
  }
}
