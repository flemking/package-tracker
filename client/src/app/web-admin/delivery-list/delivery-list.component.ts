import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Delivery } from '../../types/delivery';
import { DeliveryService } from '../../apis/delivery.service';
import { MatButtonModule } from '@angular/material/button';
import { CreateDeliveryComponent } from '../create-delivery/create-delivery.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'app-delivery-list',
  templateUrl: './delivery-list.component.html',
  styleUrls: ['./delivery-list.component.css'],
  imports: [CommonModule, MatCardModule, MatToolbarModule, MatButtonModule],
})
export class DeliveryListComponent implements OnInit {
  deliveries: Delivery[] = [];

  constructor(
    private deliveryService: DeliveryService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.deliveryService.getDeliveries().subscribe((data) => {
      this.deliveries = data;
    });
  }

  openDeliveryCreationDialog(): void {
    const dialogRef = this.dialog.open(CreateDeliveryComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
      // detect changes
      this.cdr.detectChanges();
    });
  }
}
