import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PackageService } from '../../apis/package.service';
import { Package } from '../../types/package';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DeliveryStatus } from '../../types/delivery';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DeliveryService } from '../../apis/delivery.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-create-delivery',
  templateUrl: './create-delivery.component.html',
  styleUrls: ['./create-delivery.component.css'],
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
  ],
})
export class CreateDeliveryComponent implements OnInit {
  deliveryForm: FormGroup;
  packages: Package[] = [];
  deliveryStatus = Object.values(DeliveryStatus);

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private deliveryService: DeliveryService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.deliveryForm = this.fb.group({
      package_id: ['', Validators.required],
      location: this.fb.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required],
      }),
      status: ['OPEN', Validators.required],
    });
  }

  ngOnInit(): void {
    this.packageService.getPackages().subscribe((packages) => {
      this.packages = packages;
    });
  }

  onSubmit(): void {
    if (this.deliveryForm.valid) {
      // Reformat the data by comverting all dates to timestamps
      let newData = {
        ...this.deliveryForm.value,
        pickup_time: new Date(this.deliveryForm.value.pickup_time).getTime(),
        start_time: new Date(this.deliveryForm.value.start_time).getTime(),
        end_time: new Date(this.deliveryForm.value.end_time).getTime(),
      };
      // Create delivery
      this.deliveryService.createDelivery(newData).subscribe((delivery) => {
        console.log(delivery);

        // go back to home page //TODO: Just find a way to close the modal
        window.location.reload();

        this._snackBar.open('Delivery created successfully', 'Close', {
          duration: 3000,
        });
      });

      this.cdr.detectChanges();
    }
  }
}
