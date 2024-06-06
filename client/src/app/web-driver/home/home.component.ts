import { Component, OnInit } from '@angular/core';
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
  ],
})
export class WebDriverComponent implements OnInit {
  trackerForm: FormGroup;
  packageDetails: any;
  deliveryDetails: any;
  DeliveryStatus = DeliveryStatus;

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private webSocketService: WebSocketService
  ) {
    this.trackerForm = this.fb.group({
      deliveryId: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.trackerForm.valid) {
      const deliveryId = this.trackerForm.get('deliveryId')?.value;
      this.deliveryService.getDeliveryById(deliveryId).subscribe((delivery) => {
        this.deliveryDetails = delivery;
        if (delivery.package_id) {
          this.packageService
            .getPackageById(delivery.package_id)
            .subscribe((packageDetails) => {
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
}
