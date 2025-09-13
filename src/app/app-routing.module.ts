import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'devotees', loadChildren: () => import('./components/devotees/devotees.module').then(m => m.DevoteesModule) },
  { path: 'campaigns', loadChildren: () => import('./components/campaigns/campaigns.module').then(m => m.CampaignsModule) },
  { path: 'logs', loadChildren: () => import('./components/logs/logs.module').then(m => m.LogsModule) },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
