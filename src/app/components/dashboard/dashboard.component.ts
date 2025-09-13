import { Component, OnInit } from '@angular/core';
import { DevoteeService, Devotee, NotificationCampaign } from '../../services/devotee.service';
import { CampaignService } from '../../services/campaign.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  activeDevoteesCount$: Observable<number>;
  activeCampaigns$: Observable<NotificationCampaign[]>;
  recentDevotees$: Observable<any>;
  recentCampaigns$: Observable<any>;
  totalNotifications$: Observable<number>;
  deliveredNotifications$: Observable<number>;

  constructor(
    private devoteeService: DevoteeService,
    private campaignService: CampaignService
  ) {
    this.activeDevoteesCount$ = this.devoteeService.getActiveDevoteesCount();
    this.activeCampaigns$ = this.campaignService.getActiveCampaigns();
    this.recentDevotees$ = this.devoteeService.getDevotees(0, 5);
    this.recentCampaigns$ = this.campaignService.getCampaigns(0, 5);
    // Mock observables for now - these would need to be implemented in the service
    this.totalNotifications$ = new Observable(observer => observer.next(1250));
    this.deliveredNotifications$ = new Observable(observer => observer.next(1180));
  }

  ngOnInit(): void {}

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'RUNNING':
        return 'primary';
      case 'SCHEDULED':
        return 'info';
      case 'FAILED':
        return 'danger';
      case 'CANCELLED':
        return 'warning';
      default:
        return 'secondary';
    }
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'VOICE_CALL':
        return '📞';
      case 'SMS':
        return '💬';
      case 'WHATSAPP':
        return '📱';
      case 'EMAIL':
        return '📧';
      case 'MULTI_CHANNEL':
        return '📢';
      default:
        return '📋';
    }
  }
}
