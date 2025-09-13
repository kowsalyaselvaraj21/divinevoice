import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CampaignsListComponent } from './campaigns-list.component';
import { CampaignFormComponent } from './campaign-form.component';
import { CampaignDetailComponent } from './campaign-detail.component';

const routes: Routes = [
  { path: '', component: CampaignsListComponent },
  { path: 'add', component: CampaignFormComponent },
  { path: 'edit/:id', component: CampaignFormComponent },
  { path: ':id', component: CampaignDetailComponent }
];

@NgModule({
  declarations: [
    CampaignsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    CampaignFormComponent,
    CampaignDetailComponent
  ]
})
export class CampaignsModule { }

