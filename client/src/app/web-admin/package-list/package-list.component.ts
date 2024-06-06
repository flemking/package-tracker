import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PackageService } from '../../apis/package.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Package } from '../../types/package';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { CreatePackageComponent } from '../create-package/create-package.component';

@Component({
  standalone: true,
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
  ],
})
export class PackageListComponent implements OnInit {
  packages: Package[] = [];

  constructor(
    private packageService: PackageService,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.packageService.getPackages().subscribe((data) => {
      this.packages = data;
    });
  }

  openPackageCreationDialog(): void {
    const dialogRef = this.dialog.open(CreatePackageComponent);

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
      // detect changes
      this.cdr.detectChanges();
    });
  }
}
