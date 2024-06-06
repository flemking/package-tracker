// src/app/services/websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DeliveryStatus } from '../types/delivery';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socketUrl = 'http://localhost:3000';
  private socket: Socket;

  constructor() {
    this.socket = io(this.socketUrl);
  }

  joinDelivery(deliveryId: string): void {
    this.socket.emit('join', deliveryId);
  }

  onLocationChanged(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('location_changed', (data: any) => {
        observer.next(data);
      });
    });
  }

  onStatusChanged(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('status_changed', (data: any) => {
        observer.next(data);
      });
    });
  }

  onDeliveryUpdated(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('delivery_updated', (data: any) => {
        observer.next(data);
      });
    });
  }

  changeLocation(event: string, deliveryId: string, location: any): void {
    this.socket.emit('location_changed', {
      event,
      delivery_id: deliveryId,
      location,
    });
  }

  changeStatus(
    event: string,
    deliveryId: string,
    status: DeliveryStatus
  ): void {
    this.socket.emit('status_changed', {
      event,
      delivery_id: deliveryId,
      status,
    });
  }

  updateDelivery(event: string, deliveryObject: any): void {
    this.socket.emit('delivery_updated', {
      event,
      delivery_object: deliveryObject,
    });
  }
}
