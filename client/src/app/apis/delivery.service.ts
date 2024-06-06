// use rest api
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';
import { Delivery, DeliveryStatus } from '../types/delivery';

@Injectable({
  providedIn: 'root',
})
export class DeliveryService {
  constructor(private apiService: ApiService) {}

  getDeliveries(): Observable<Delivery[]> {
    return this.apiService.get('delivery');
  }

  getDeliveryById(id: string): Observable<Delivery> {
    return this.apiService.get(`delivery/${id}`);
  }

  updateDelivery(id: string, body: any): Observable<Delivery> {
    return this.apiService.put(`delivery/${id}`, body);
  }

  createDelivery(body: any): Observable<Delivery> {
    return this.apiService.post('delivery', body);
  }

  deleteDelivery(id: string): Observable<Delivery> {
    return this.apiService.delete(`delivery/${id}`);
  }

  changeStatus(deliveryId: string, status: DeliveryStatus): void {
    this.apiService
      .post(`delivery/${deliveryId}/update-status/${status}`, {})
      .subscribe((response) => {
        console.log('Delivery status updated:', response);
      });
  }

  changeLocation(deliveryId: string, location: any): void {
    this.apiService
      .post(`delivery/${deliveryId}/update-location`, location)
      .subscribe((response) => {
        console.log('Delivery location updated:', response);
      });
  }
}
