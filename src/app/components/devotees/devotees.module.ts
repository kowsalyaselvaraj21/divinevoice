import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { DevoteesListComponent } from './devotees-list.component';
import { DevoteeFormComponent } from './devotee-form.component';
import { DevoteeDetailComponent } from './devotee-detail.component';

const routes: Routes = [
  { path: '', component: DevoteesListComponent },
  { path: 'list', component: DevoteesListComponent },
  { path: 'add', component: DevoteeFormComponent },
  { path: 'edit/:id', component: DevoteeFormComponent },
  { path: 'view/:id', component: DevoteeDetailComponent }
];

@NgModule({
  declarations: [
    DevoteesListComponent,
    DevoteeFormComponent,
    DevoteeDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class DevoteesModule { }
