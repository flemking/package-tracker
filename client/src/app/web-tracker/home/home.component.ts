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
import { Delivery, DeliveryStatus } from '../../types/delivery';
import { MapComponent } from '../../core/components/map/map.component';
import { Package } from '../../types/package';

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
    MapComponent,
  ],
})
export class WebTrackerComponent implements OnInit {
  trackerForm: FormGroup;
  packageDetails!: Package;
  deliveryDetails!: Delivery;

  source = { lat: 6.379448, lng: 2.451324 }; // source coordinates
  destination = { lat: 6.379448, lng: 2.451324 }; // destination coordinates
  currentLocation = { lat: 6.379448, lng: 2.451324 }; // current location coordinates

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
      this.currentLocation = data.location;
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

          this.source = this.packageDetails?.from_location;
          this.destination = this.packageDetails?.to_location;
          if (
            this.deliveryDetails?.status === DeliveryStatus.IN_TRANSIT &&
            this.deliveryDetails?.location
          ) {
            this.currentLocation = this.deliveryDetails.location;
          }
        }
      });
    }
  }
}
