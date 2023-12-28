import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InstallmentComponent } from './installment/installment.component';
import { HoldingComponent } from './holding/holding.component';
import { RealizedComponent } from './realized/realized.component';
import { SuggestionComponent } from './suggestion/suggestion.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'installment', component: InstallmentComponent },
  { path: 'holding', component: HoldingComponent },
  { path: 'realized', component: RealizedComponent },
  { path: 'suggestion', component: SuggestionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
