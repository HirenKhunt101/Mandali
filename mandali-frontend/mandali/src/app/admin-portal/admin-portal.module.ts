import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-portal-routing.module'
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstallmentComponent } from './installment/installment.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AdminRoutingModule,
    DashboardComponent,
    InstallmentComponent
  ]
})
export class AdminPortalModule { }
