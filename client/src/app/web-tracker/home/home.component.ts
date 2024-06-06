import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PackageService } from '../../apis/package.service';
import { DeliveryService } from '../../apis/delivery.service';
import { WebSocketService } from '../../apis/websocket.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Package } from '../../types/package';
import { DeliveryStatus } from '../../types/delivery';

@Component({
  standalone: true,
  selector: 'app-web-tracker',
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
export class WebTrackerComponent implements OnInit {
  trackerForm: FormGroup;
  packageDetails: any;
  deliveryDetails: any;

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private webSocketService: WebSocketService
  ) {
    this.trackerForm = this.fb.group({
      packageId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.webSocketService.onLocationChanged().subscribe((data) => {
      console.log('Location Changed:', data);
      // Update location details
      this.deliveryDetails.location = data.location;
    });
  }

  onSubmit(): void {
    if (this.trackerForm.valid) {
      const packageId = this.trackerForm.get('packageId')?.value;
      this.packageService.getPackageById(packageId).subscribe((pkg) => {
        this.packageDetails = pkg;
        console.log(pkg);

        if (pkg.active_delivery_id) {
          this.deliveryService
            .getDeliveryById(pkg.active_delivery_id)
            .subscribe((delivery) => {
              this.deliveryDetails = delivery;
              this.webSocketService.joinDelivery(this.deliveryDetails._id);
            });
        }
      });
    }
  }

  updateStatus(status: DeliveryStatus): void {
    this.webSocketService.changeStatus(
      'status_changed',
      this.deliveryDetails._id,
      status
    );
  }

  updateLocation(location: any): void {
    this.webSocketService.changeLocation(
      'location_changed',
      this.deliveryDetails._id,
      location
    );
  }
}
