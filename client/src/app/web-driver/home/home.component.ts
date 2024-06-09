import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeliveryStatus } from '../../types/delivery';
import { DeliveryService } from '../../apis/delivery.service';
import { WebSocketService } from '../../apis/websocket.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PackageService } from '../../apis/package.service';
import { MapComponent } from '../../core/components/map/map.component';
import { Package } from '../../types/package';

@Component({
  standalone: true,
  selector: 'app-web-driver',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MapComponent,
  ],
})
export class WebDriverComponent implements OnInit, OnChanges {
  trackerForm: FormGroup;
  packageDetails: any;
  deliveryDetails: any;
  DeliveryStatus = DeliveryStatus;

  // map coordonates
  source = { lat: 6.379448, lng: 2.451324 }; // source coordinates
  destination = { lat: 6.379448, lng: 2.451324 }; // destination coordinates
  currentLocation = { lat: 6.379448, lng: 2.451324 }; // current location coordinates

  position: any;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private webSocketService: WebSocketService
  ) {
    this.trackerForm = this.fb.group({
      deliveryId: ['', Validators.required],
    });
    this.getLocation();
  }

  ngOnInit(): void {
    // ask user for permission to get location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['position'] && changes['position'].currentValue) {
      this.trackDelivery();
    }
  }

  // tracking the delivery
  trackDelivery() {
    setInterval(() => {
      if (this.packageDetails?.status === DeliveryStatus.IN_TRANSIT) {
        this.getLocation();
        if (
          this.position.latitude !== this.currentLocation.lat ||
          this.position.longitude !== this.currentLocation.lng
        ) {
          this.updateLocation(this.position);
          this.currentLocation = this.position;
        }
      }
    }, 5000);
  }

  onSubmit(): void {
    if (this.trackerForm.valid) {
      const deliveryId = this.trackerForm.get('deliveryId')?.value;
      this.deliveryService.getDeliveryById(deliveryId).subscribe((delivery) => {
        this.deliveryDetails = delivery;
        if (delivery.package_id) {
          this.packageService
            .getPackageById(delivery.package_id)
            .subscribe((packageDetails) => {
              this.source = packageDetails?.from_location;
              this.destination = packageDetails?.to_location;
              this.packageDetails = packageDetails;
            });
        }
        this.webSocketService.joinDelivery(deliveryId);
      });
    }
  }

  updateStatus(status: DeliveryStatus): void {
    this.deliveryService.changeStatus(this.deliveryDetails._id, status);
    this.webSocketService.changeStatus(
      'status_changed',
      this.deliveryDetails._id,
      status
    );
    this.packageDetails.status = status;
  }

  updateLocation(location: any): void {
    this.deliveryService.changeLocation(this.deliveryDetails._id, location);
    this.webSocketService.changeLocation(
      'location_changed',
      this.deliveryDetails._id,
      location
    );
    this.packageDetails.location = location;
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.position = {
            lng: position.coords.longitude,
            lat: position.coords.latitude,
          };
          console.log('Latitude:', this.position);
        },
        (error) => {
          console.error('Error getting location:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              console.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              console.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              console.error('The request to get user location timed out.');
              break;
            default:
              console.error('An unknown error occurred.');
              break;
          }
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
