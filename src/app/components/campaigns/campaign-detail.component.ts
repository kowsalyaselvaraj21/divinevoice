import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationCampaign } from '../../services/devotee.service';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'app-campaign-detail',
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class CampaignDetailComponent implements OnInit {
  campaign?: NotificationCampaign;
  loading = false;
  executing = false;
  cancelling = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.loadCampaign();
  }

  private loadCampaign(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/campaigns']);
      return;
    }

    this.loading = true;
    this.campaignService.getCampaign(+id).subscribe({
      next: (campaign) => {
        this.campaign = campaign;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading campaign:', error);
        this.loading = false;
        this.router.navigate(['/campaigns']);
      }
    });
  }

  executeCampaign(): void {
    if (!this.campaign?.id) return;

    this.executing = true;
    this.campaignService.executeCampaign(this.campaign.id).subscribe({
      next: () => {
        this.executing = false;
        this.loadCampaign(); // Reload to get updated status
      },
      error: (error) => {
        console.error('Error executing campaign:', error);
        this.executing = false;
      }
    });
  }

  scheduleCampaign(): void {
    if (!this.campaign?.id) return;

    this.executing = true;
    this.campaignService.scheduleCampaign(this.campaign.id).subscribe({
      next: () => {
        this.executing = false;
        this.loadCampaign(); // Reload to get updated status
      },
      error: (error) => {
        console.error('Error scheduling campaign:', error);
        this.executing = false;
      }
    });
  }

  cancelCampaign(): void {
    if (!this.campaign?.id) return;

    this.cancelling = true;
    this.campaignService.cancelCampaign(this.campaign.id).subscribe({
      next: () => {
        this.cancelling = false;
        this.loadCampaign(); // Reload to get updated status
      },
      error: (error) => {
        console.error('Error cancelling campaign:', error);
        this.cancelling = false;
      }
    });
  }

  deleteCampaign(): void {
    if (!this.campaign?.id) return;

    if (confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      this.campaignService.deleteCampaign(this.campaign.id).subscribe({
        next: () => {
          this.router.navigate(['/campaigns']);
        },
        error: (error) => {
          console.error('Error deleting campaign:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'RUNNING': return 'primary';
      case 'SCHEDULED': return 'info';
      case 'DRAFT': return 'secondary';
      case 'FAILED': return 'danger';
      case 'CANCELLED': return 'warning';
      default: return 'secondary';
    }
  }

  getNotificationTypeIcon(type: string): string {
    switch (type) {
      case 'VOICE_CALL': return '📞';
      case 'SMS': return '💬';
      case 'WHATSAPP': return '📱';
      case 'EMAIL': return '📧';
      case 'MULTI_CHANNEL': return '📢';
      default: return '📢';
    }
  }

  getMessagePreview(): string {
    if (!this.campaign) return '';

    switch (this.campaign.notificationType) {
      case 'VOICE_CALL':
        return this.campaign.voiceMessageUrl || this.campaign.messageContent;
      case 'SMS':
        return this.campaign.smsMessage || this.campaign.messageContent;
      case 'WHATSAPP':
        return this.campaign.whatsappMessage || this.campaign.messageContent;
      case 'EMAIL':
        return this.campaign.emailSubject || this.campaign.messageContent;
      default:
        return this.campaign.messageContent;
    }
  }

  canExecute(): boolean {
    return this.campaign?.status === 'DRAFT';
  }

  canSchedule(): boolean {
    return this.campaign?.status === 'DRAFT';
  }

  canCancel(): boolean {
    return this.campaign?.status === 'SCHEDULED' || this.campaign?.status === 'RUNNING';
  }

  canDelete(): boolean {
    return this.campaign?.status === 'DRAFT' || this.campaign?.status === 'COMPLETED' || this.campaign?.status === 'FAILED';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  }

  onEdit(): void {
    if (this.campaign?.id) {
      this.router.navigate(['/campaigns', 'edit', this.campaign.id]);
    }
  }

  onBack(): void {
    this.router.navigate(['/campaigns']);
  }
}
