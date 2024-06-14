import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DeliveryService } from '../../apis/delivery.service';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Delivery } from '../../types/delivery';
import { MatSelectModule } from '@angular/material/select';
import { PackageService } from '../../apis/package.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  selector: 'app-create-package',
  templateUrl: './create-package.component.html',
  styleUrls: ['./create-package.component.css'],
  imports: [
    ReactiveFormsModule,
    MatLabel,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class CreatePackageComponent implements OnInit {
  packageForm: FormGroup;
  deliveries: Delivery[] = [];

  constructor(
    private fb: FormBuilder,
    private deliveryService: DeliveryService,
    private packageService: PackageService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.packageForm = this.fb.group({
      active_delivery_id: [''],
      description: [''],
      weight: [0, [Validators.min(0)]],
      height: [0, [Validators.min(0)]],
      width: [0, [Validators.min(0)]],
      depth: [0, [Validators.min(0)]],
      from_name: [''],
      from_address: ['', Validators.required],
      from_location: this.fb.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required],
      }),
      to_name: [''],
      to_address: ['', Validators.required],
      to_location: this.fb.group({
        lat: [0, Validators.required],
        lng: [0, Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.deliveryService.getDeliveries().subscribe((data) => {
      this.deliveries = data;
      console.log(data);
    });
  }

  onSubmit(): void {
    if (this.packageForm.valid) {
      console.log(this.packageForm.value);
      // set active delivery to null if no delivery is selected
      if (!this.packageForm.value.active_delivery_id) {
        this.packageForm.value.active_delivery_id = null;
      }
      // create a package
      this.packageService
        .createPackage(this.packageForm.value)
        .subscribe((data) => {
          console.log(data);

          // go back to home page //TODO: Just find a way to close the modal
          window.location.reload();

          this._snackBar.open('Package successfully created!', 'OK', {
            duration: 3000,
          });
        });
      this.cdr.detectChanges();
    }
  }
}
