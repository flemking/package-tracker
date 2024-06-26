import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PackageListComponent } from '../package-list/package-list.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DeliveryListComponent } from '../delivery-list/delivery-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    PackageListComponent,
    DeliveryListComponent,
    MatTabsModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  navigateTo(path: string) {
    this.router.navigate([`/web-admin/${path}`]);
  }
}
