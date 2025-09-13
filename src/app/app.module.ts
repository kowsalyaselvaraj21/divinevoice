import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CampaignDetailComponent } from './components/campaigns/campaign-detail.component';
import { CampaignFormComponent } from './components/campaigns/campaign-form.component';
import { CampaignsListComponent } from './components/campaigns/campaigns-list.component';
import { DevoteesListComponent } from './components/devotees/devotees-list.component';
import { LogsListComponent } from './components/logs/logs-list.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
