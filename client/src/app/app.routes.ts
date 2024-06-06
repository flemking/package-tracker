import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './web-admin/home/home.component';
import { CreatePackageComponent } from './web-admin/create-package/create-package.component';
import { CreateDeliveryComponent } from './web-admin/create-delivery/create-delivery.component';

import { WebDriverComponent } from './web-driver/home/home.component';
import { WebTrackerComponent } from './web-tracker/home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'web-admin', pathMatch: 'full' },
  { path: 'web-admin', component: HomeComponent },
  { path: 'web-admin/create-package', component: CreatePackageComponent },
  { path: 'web-admin/create-delivery', component: CreateDeliveryComponent },
  { path: 'web-driver', component: WebDriverComponent },
  { path: 'web-tracker', component: WebTrackerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
